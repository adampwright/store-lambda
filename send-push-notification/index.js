const axios = require('axios');
require('dotenv').config();

//dynamo
const { GetItemCommand } = require('@aws-sdk/client-dynamodb');
const { QueryCommand } = require('@aws-sdk/client-dynamodb');
const { ScanCommand } = require('@aws-sdk/client-dynamodb');
const { ddbClient } = require('./libs/ddbClient.js');

//firebase
const { initializeApp } = require('firebase-admin/app');
var admin = require('firebase-admin');

var serviceAccount = require('./firebase-credentials.json');

initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

//get list of stores to compare with sent order data
const getStores = async () => {
  const config = {
    method: 'get',
    url: `https://api.wrightwaystore.com/index.php/rest/V1/store/storeGroups`,
    headers: { Authorization: `Bearer ${process.env.BACKEND_JWT}` },
  };

  try {
    let res = await axios(config);
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

const getDeviceTokensByStore = async (storeCode) => {
  let tokens = [];
  // Set the parameters.
  const params = {
    // Specify which items in the results are returned.
    FilterExpression: 'StoreCode = :code',
    // Define the expression attribute value, which are substitutes for the values you want to compare.
    ExpressionAttributeValues: {
      ':code': { S: storeCode },
    },
    // Set the projection expression, which the the attributes that you want.
    ProjectionExpression: 'DeviceToken',
    TableName: 'store-scanner',
  };
  try {
    const data = await ddbClient.send(new ScanCommand(params));
    data.Items.forEach((element, index, array) => {
      tokens.push(element.DeviceToken.S);

      // console.log(element.DeviceToken.S);
      //   return data;
    });
    return tokens;
  } catch (err) {
    console.log('Error', err);
    return err;
  }
};

const sendPushNotifications = async (event, deviceTokens) => {
  let message = {};

  switch (event.notificationCode) {
    case 'new-order':
      message = {
        notification: {
          title: 'New Order Received!',
          body: `You have a new order from ${event.firstName} ${event.lastName}`,
        },
        data: {
          orderId: event.orderId,
          notificationCode: 'new-order',
          storeId: event.storeId,
          storeName: event.storeCode.replace('<br />', '/').replace('<br />', '/').split('/')[1],
          firstName: event.customerFirstName,
          lastName: event.customerLastName,
        },
      };
      break;
    case 'customer-arrived':
      message = {
        notification: {
          title: 'Customer Has Arrived!',
          body: `Your customer ${event.firstName} ${event.lastName} has arrived to pick up order #${event.orderId}`,
        },
        data: {
          orderId: event.orderId,
          notificationCode: 'customer-arrived',
          storeId: event.storeId,
          storeName: event.storeCode.replace('<br />', '/').replace('<br />', '/').split('/')[1],
          firstName: event.customerFirstName,
          lastName: event.customerLastName,
        },
      };
      break;
  }

  return admin
    .messaging()
    .sendToDevice(deviceTokens, message)
    .then((response) => {
      console.log('Sent successfully.\n');
      console.log(response);
      return response;
    })
    .catch((error) => {
      console.log('Sent failed.\n');
      console.log(error);
      return error;
    });
};

exports.handler = async (event) => {
  const stores = await getStores();
  const storeCode = stores.filter((item) => item.id == event.storeId)[0].code;
  const tokens = await getDeviceTokensByStore(storeCode);

  const push = await sendPushNotifications(event, tokens);

  // TODO implement
  const response = {
    statusCode: 200,
    body: JSON.stringify(event),
  };
  return push;
};
