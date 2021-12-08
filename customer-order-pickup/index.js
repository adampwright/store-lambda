require('dotenv').config();
const axios = require('axios');

const getOrders = async (storeCode, customerEmail) => {
  const config = {
    method: 'get',
    url: `https://api.wrightwaystore.com/rest/V1/orders?searchCriteria[filter_groups][0][filters][0][field]=pickup_location_code&searchCriteria[filter_groups][0][filters][0][value]=${storeCode}&searchCriteria[filter_groups][0][filters][0][field]=customer_email&searchCriteria[filter_groups][0][filters][0][value]=${customerEmail}&searchCriteria[filter_groups][0][filters][0][field]=status&searchCriteria[filter_groups][0][filters][0][value]=awaiting_collection&fields=items[increment_id,created_at,total_due,total_item_count]`,
    headers: { Authorization: `Bearer ${process.env.BACKEND_JWT}` },
  };

  try {
    let res = await axios(config);
    console.log(res.data.items);
    return res.data.items;
  } catch (err) {
    console.log(err);
  }
};

const sendRes = (status, body, filename) => {
  var response = {
    statusCode: status,
    // headers: {
    //   // 'Content-Type': 'application/json',
    //   'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
    //   'Access-Control-Allow-Methods': 'OPTIONS,POST,PUT',
    //   'Access-Control-Allow-Credentials': true,
    //   'Access-Control-Allow-Origin': '*',
    //   'X-Requested-With': '*',
    // },
    body: body,
  };
  return response;
};

exports.handler = async (event, context, callback) => {
  const orders = await getOrders(event.store_code, event.customer_email);
  return sendRes(200, orders);
};
