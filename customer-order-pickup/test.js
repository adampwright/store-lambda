require('dotenv').config();
const axios = require('axios');

const storeCode = 'irvine-1-ca';
const customerEmail = 'apwright000@gmail.com';

const getStores = async () => {
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

const startFunct = async () => {
  const orders = await getStores();
};

startFunct();
