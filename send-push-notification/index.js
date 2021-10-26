const axios = require('axios');
require('dotenv').config();

//dynamo
const { GetItemCommand } = require('@aws-sdk/client-dynamodb');
const { QueryCommand } = require('@aws-sdk/client-dynamodb');
const { ScanCommand } = require('@aws-sdk/client-dynamodb');
const { ddbClient } = require('./libs/ddbClient.js');

const sendPushNotification = async (deviceToken) => {
  const options = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.CLOUD_MESSAGING_SERVER_KEY}`,
    },
  };

  const body = {
    notification: {
      title: 'New Order Received!',
      body: '',
      image: '',
    },
    token: deviceToken,
  };

  return axios
    .post(`https://fcm.googleapis.com/v1/projects/wrightway-store/messages:send`, JSON.stringify(body), options)
    .then((resp) => {
      return resp.data;
    })
    .catch((error) => {
      console.log(error);
      // return sendRes(400, error);
    });
};

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

exports.handler = async (event) => {
  const stores = await getStores();
  const storeCode = stores.filter((item) => item.id == event.storeId)[0].code;
  const tokens = await getDeviceTokensByStore(storeCode);
  tokens.forEach((item) => {
    sendPushNotification(item);
  });

  // TODO implement
  const response = {
    statusCode: 200,
    body: JSON.stringify(event),
  };
  return tokens;
};
