const AWS = require('aws-sdk');
const needle = require('needle');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_ACCESS_SECRET
});

module.exports = {};

/**
 * Uploads a file to the CDN
 * @arg {Object} file Form file object
 * @arg {Function} callback function to call when ready
 */
module.exports.uploadFile = (file, callback) => {
  let signatureParams = {
    Bucket: process.env.S3_BUCKET,
    Key: file.name,
    Expires: 60,
    ContentType: file.type,
    ACL: `public-read`
  };

  s3.getSignedUrl('putObject', signatureParams, (err, signedRequest) => {
    if (err) {
      callback(err);
      return;
    }

    let url = `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${file.name}`;
    needle.put(signedRequest, file, (err, res) => {
      if (err) {
        callback(err);
        return;
      }
      if (res.statusCode === 200) {
        callback(null, url);
      } else callback(new Error('Could not upload file. HTTP error ' + res.statusCode));
    });
  });
}
