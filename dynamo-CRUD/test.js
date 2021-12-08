const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-west-1' });

// Create the DynamoDB service object
const ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

const getParams = {
  TableName: 'store-scanner',
  Key: {
    DeviceToken: { S: 'jnajsd65362d1a3sda' },
  },
  //   ProjectionExpression: 'ATTRIBUTE_NAME',
};

const putParams = {
  TableName: 'store-scanner',
  Item: {
    CUSTOMER_ID: { N: '001' },
    CUSTOMER_NAME: { S: 'Richard Roe' },
  },
};

const readData = async (params) => {
  // Call DynamoDB to read the item from the table
  ddb.getItem(params, function (err, data) {
    if (err) {
      console.log('Error', err);
    } else {
      console.log('Success', data.Item.StoreCode.S);
    }
  });
};

const writeData = async (params) => {
  // Call DynamoDB to add the item to the table
  return ddb.putItem(params, function (err, data) {
    if (err) {
      console.log('Error', err);
    } else {
      console.log('Success', data);
    }
  });
};

// await client.putItem(params);

const event = {
  DeviceToken: 'jnajsd65362d1a3sda',
  storeCode: 'irvine-1-ca',
  timestamp: new Date(),
};

const startFunct = async () => {
  await readData(getParams);
  //   await writeData(putParams);
};

startFunct();
