const { PutItemCommand } = require('@aws-sdk/client-dynamodb');
const { ddbClient } = require('./libs/ddbClient.js');

const writeData = async (params) => {
  try {
    const data = await ddbClient.send(new PutItemCommand(params));
    console.log(data);
    return data;
  } catch (err) {
    console.error(err);
  }
};

exports.handler = async (event) => {
  const writeParams = {
    TableName: 'store-scanner',
    Item: {
      DeviceToken: { S: event.DeviceToken },
      StoreCode: { S: event.StoreCode },
      Timestamp: new Date(),
    },
  };

  const write = await writeData(writeParams);

  // TODO implement
  const response = {
    statusCode: 200,
    body: JSON.stringify(write),
  };
  return response;
};
