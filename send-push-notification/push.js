const { initializeApp } = require('firebase-admin/app');
var admin = require('firebase-admin');

var serviceAccount = require('./firebase-credentials.json');

initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// This registration token comes from the client FCM SDKs.
const registrationToken = 'dRWo13u-RAyhT-inW31H8A:APA91bF4VTXMvtw9iNz2Yt7RMwbRehRDI7blEQQ4TAYxaRjsE5Fzu4pa7Ep19iyeGrg4AYifmAQhZdfXCxwvS8C0p4zOI_dizN5pqUJ2pKjpdbvDj54gl10YWQBIgX7QhxF-_ojkPTVv';

const message = {
  data: {
    score: '850',
    time: '2:45',
  },
  token: registrationToken,
};

// Send a message to the device corresponding to the provided
// registration token.
getMessaging()
  .send(message)
  .then((response) => {
    // Response is a message ID string.
    console.log('Successfully sent message:', response);
  })
  .catch((error) => {
    console.log('Error sending message:', error);
  });
