require('dotenv').config();
const axios = require('axios');

const getPhoneNumber = async (storeCode) => {
  const body = {
    query: `
        {
          pickupLocations(filters: {pickup_location_code: {eq: "${storeCode}"}}) {
            items {
              phone
            }
          }
        }
            `,
  };

  try {
    const resp = await axios.post('https://api.wrightwaystore.com/graphql', body);
    return resp.data.data.pickupLocations.items[0].phone;
  } catch (err) {
    // Handle Error Here
    console.error(err);
  }
};

const sendSMS = async (phone, event) => {
  const eventData = event;

  toUrlEncoded = (obj) =>
    Object.keys(obj)
      .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(obj[k]))
      .join('&');

  // authString = btoa(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`);
  authString = Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString('base64');

  const options = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${authString}`,
    },
  };

  const requestBody = {
    Body: `
      New Wrightway Store order received: ${eventData.orderId}, ${eventData.customerFirstName} ${eventData.customerLastName}
      `,
    From: process.env.TWILIO_NUMBER,
    To: phone,
    // To: "+19095529662",
  };

  return axios
    .post(`https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`, toUrlEncoded(requestBody), options)
    .then((resp) => {
      return resp.data;
    })
    .catch((error) => {
      console.log(error);
      // return sendRes(400, error);
    });
};

const getOrder = async (increment_id) => {
  const config = {
    method: 'get',
    url: `https://api.wrightwaystore.com/rest/V1/orders?searchCriteria[filter_groups][0][filters][0][field]=increment_id&searchCriteria[filter_groups][0][filters][0][value]=${increment_id}`,
    headers: { Authorization: `Bearer ${process.env.BACKEND_JWT}` },
  };

  try {
    let res = await axios(config);
    return res.data.items[0];
  } catch (err) {
    console.log(err);
  }
};

const getStores = async () => {
  const config = {
    method: 'get',
    url: `https://api.wrightwaystore.com/index.php/rest/V1/store/storeGroups`,
    headers: { Authorization: `Bearer ${process.env.BACKEND_JWT}` },
  };

  try {
    let res = await axios(config);
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

// send lambda response
const sendRes = (status, resp) => {
  var response = {
    statusCode: status,
    headers: {
      // 'Content-Type': 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
      'Access-Control-Allow-Methods': 'OPTIONS,POST,PUT',
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Origin': '*',
      'X-Requested-With': '*',
    },
    body: resp,
  };
  return response;
};

exports.handler = async (event) => {
  const stores = await getStores();
  const storeCode = stores.filter((item) => item.id == event.storeId)[0].code;
  const phone = await getPhoneNumber(storeCode);
  const sms = await sendSMS(phone, event);
  return sendRes(200, storeCode + phone + sms);
};
