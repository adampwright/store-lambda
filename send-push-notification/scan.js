// Import required AWS SDK clients and commands for Node.js
const { ScanCommand } = require('@aws-sdk/client-dynamodb');
const { ddbClient } = require('./libs/ddbClient.js');

const storeCode = 'irvine-1-ca';

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
    data.Items.forEach(function (element, index, array) {
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

const trigger = async () => {
  const tokens = await getDeviceTokensByStore(storeCode);
  console.log(tokens);
};

trigger();
