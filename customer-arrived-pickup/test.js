require('dotenv').config();
const axios = require('axios');

const changeOrderStatus = async () => {
  const config = {
    method: 'post',
    url: `https://api.wrightwaystore.com/index.php/rest/V1/orders/`,
    headers: { Authorization: `Bearer ${process.env.BACKEND_JWT}` },
    data: {
      entity: entity,
    },
  };

  try {
    let res = await axios(config);
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

const startFunct = async () => {
  const entity = { entity_id: 21, state: 'processing', status: 'customer_arrived' };
  const changeStatus = await changeOrderStatus();
  console.log(changeStatus);
};

startFunct();
