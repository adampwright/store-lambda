const QRCode = require('qrcode');
const AWS = require('aws-sdk');
require('dotenv').config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});
exports.handler = async (event, context, callback) => {
  const qrOption = { width: 300, quality: 1 };

  const qrData = await QRCode.toDataURL(event.increment_id, qrOption);

  const s3Bucket = 'wrightway-magento-prod/media/order-qr';
  const objectName = `${event.increment_id}`;

  const base64Data = new Buffer.from(qrData.replace(/^data:image\/\w+;base64,/, ''), 'base64');

  try {
    const params = {
      Bucket: s3Bucket,
      Key: objectName,
      Body: base64Data,
      ContentEncoding: 'base64',
      ContentType: `image/png`,
    };
    const result = await s3.putObject(params).promise();
    return sendRes(200, `File uploaded successfully at https:/` + s3Bucket + `.s3.amazonaws.com/` + objectName, objectName);
  } catch (error) {
    return sendRes(404, error, 'no-file-uploaded');
  }
};
const sendRes = (status, body, filename) => {
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
    body: body,
    url: `https://media.wrightwaystore.com/order-qr/${filename}`,
  };
  return response;
};
