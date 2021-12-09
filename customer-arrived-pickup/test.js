require('dotenv').config();
const axios = require('axios');

const changeOrderStatus = async (requestBody) => {
  const reqBody = JSON.parse(requestBody)

    const config = {
      method: 'post',
      url: `https://api.wrightwaystore.com/index.php/rest/V1/orders/`,
      headers: { Authorization: `Bearer ${process.env.BACKEND_JWT}` },
      data: {
          entity = reqBody
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
  const changeStatus = await changeOrderStatus();
  console.log(changeStatus);
};

startFunct();
