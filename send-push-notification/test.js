const axios = require('axios');
require('dotenv').config();

const event = JSON.parse({
  orderId: '824354994798191',
  storeId: '1',
  storeCode: 'Wrightwaystore.com<br />Los Angeles #1, California<br />Los Angeles #1, California',
  customerFirstName: 'Adam',
  customerLastName: 'Wright',
});

runLambda = async (eventObj) => {
  const storeName = event.storeCode.replace('<br />', '/').replace('<br />', '/').split('/')[1];

  // TODO implement
  const response = {
    statusCode: 200,
    body: JSON.stringify(eventObj),
  };
  return storeName;
};

runLambda(event);
