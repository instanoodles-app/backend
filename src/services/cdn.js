const AWS = require('aws-sdk');
const needle = require('needle');

const AWSConfig = new AWS.Config({
  region: 'eu-central-1'
});

const s3 = new AWS.S3({
  region: 'eu-central-1'
});

module.exports = {};

/**
 * Uploads a file to the CDN
 * @arg {Object} file Form file object
 * @arg {Function} callback function to call when ready
 */
module.exports.uploadFile = (file, callback) => {
  let buf = new Buffer(file.data.replace(/^data:image\/\w+;base64,/, ""),'base64')
  let signatureParams = {
    Bucket: process.env.S3_BUCKET,
    Key: file.key,
    ContentType: file.type,
    Body: buf,
    ContentEncoding: 'base64',
    ACL: `public-read`
  };

  s3.putObject(signatureParams, (err, data) => {
    if (err) {
      callback(err);
      return;
    }
    callback(err, data);
  });
}
