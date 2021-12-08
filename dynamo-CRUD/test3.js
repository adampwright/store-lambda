// Import required AWS SDK clients and commands for Node.js
import { PutItemCommand } from '@aws-sdk/client-dynamodb';
import { GetItemCommand } from '@aws-sdk/client-dynamodb';

import { ddbClient } from './libs/ddbClient.js';

// Set the parameters
const writeParams = {
  TableName: 'store-scanner',
  Item: {
    DeviceToken: { S: 'jnajsd65362d1a3sda' },
    StoreCode: { S: 'irvine-1-ca' },
    Notes: { S: 'tons and tons of poo and wee' },
  },
};

const readParams = {
  TableName: 'store-scanner', //TABLE_NAME
  Key: {
    DeviceToken: { S: 'jnajsd65362d1a3sda' },
  },
};

const writeData = async (params) => {
  try {
    const data = await ddbClient.send(new PutItemCommand(params));
    console.log(data);
    return data;
  } catch (err) {
    console.error(err);
  }
};

const readData = async (params) => {
  try {
    const data = await ddbClient.send(new GetItemCommand(params));
    console.log('Success', data.Item);
    return data;
  } catch (err) {
    console.err(err);
  }
};

const executeTasks = async () => {
  1;
  // await writeData(writeParams);
  await readData(readParams);
};

executeTasks();
