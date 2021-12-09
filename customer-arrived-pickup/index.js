require('dotenv').config();
const axios = require('axios');

const changeOrderStatus = async (requestBody) => {
  const config = {
    method: 'post',
    url: `https://api.wrightwaystore.com/index.php/rest/V1/orders/`,
    headers: { Authorization: `Bearer ${process.env.BACKEND_JWT}` },
    data: requestBody,
  };

  try {
    let res = await axios(config);
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

const sendRes = (status, body, filename) => {
  var response = {
    statusCode: status,
    body: body,
  };
  return response;
};

exports.handler = async (event, context, callback) => {
  const orders = await changeOrderStatus(event);
  return sendRes(200, orders);
};
