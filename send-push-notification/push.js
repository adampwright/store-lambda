const { initializeApp } = require('firebase-admin/app');
var admin = require('firebase-admin');

var serviceAccount = require('./firebase-credentials.json');

initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const registrationTokens = ['dRWo13u-RAyhT-inW31H8A:APA91bF4VTXMvtw9iNz2Yt7RMwbRehRDI7blEQQ4TAYxaRjsE5Fzu4pa7Ep19iyeGrg4AYifmAQhZdfXCxwvS8C0p4zOI_dizN5pqUJ2pKjpdbvDj54gl10YWQBIgX7QhxF-_ojkPTVv'];

const sendPushNotifications = async (deviceTokens) => {
  const message = {
    notification: {
      title: 'My Title',
      body: 'TEST',
    },
  };

  admin
    .messaging()
    .sendToDevice(deviceTokens, message)
    .then((response) => {
      console.log('Sent successfully.\n');
      console.log(response);
    })
    .catch((error) => {
      console.log('Sent failed.\n');
      console.log(error);
    });
};

sendPushNotifications(registrationTokens);
