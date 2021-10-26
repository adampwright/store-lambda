const axios = require('axios');
require('dotenv').config();

const sendPushNotification = async (deviceToken) => {
  const options = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.CLOUD_MESSAGING_SERVER_KEY}`,
    },
  };

  const body = {
    notification: {
      title: 'New Order Received!',
      body: 'Hellop this is the body of the push notification',
    },
    token: deviceToken,
  };

  return axios
    .post(`https://fcm.googleapis.com/v1/projects/wrightway-store/messages:send`, JSON.stringify(body), options)
    .then((resp) => {
      console.log(resp.data);
      return resp.data;
    })
    .catch((error) => {
      console.log(error);
      // return sendRes(400, error);
    });
};

sendPushNotification('dRWo13u-RAyhT-inW31H8A:APA91bF4VTXMvtw9iNz2Yt7RMwbRehRDI7blEQQ4TAYxaRjsE5Fzu4pa7Ep19iyeGrg4AYifmAQhZdfXCxwvS8C0p4zOI_dizN5pqUJ2pKjpdbvDj54gl10YWQBIgX7QhxF-_ojkPTVv');
