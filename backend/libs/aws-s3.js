const AWS = require('aws-sdk');
const winstonLogger = require('./winston');
const Transform = require('stream').Transform;

// Thông tin SES_AWS_ACCESS_KEY_ID, SES_AWS_SECRET_ACCESS_KEY nằm trong file credentials bạn đã download về ở trên nhé
const awsConfig = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.S3_ICONS_REGION, // đây là region của server nó là vùng bạn đã chọn khi tạo ses nếu Mumbai là ap-south-1
    apiVersion: '2010-12-01', // version của api
}

const clientS3 = new AWS.S3(awsConfig);

const putIconsToBucket = (key, base64Str, callback) => {
    clientS3.putObject({
        Bucket: process.env.S3_ICONS_BUCKET,
        Key: key,
        Body: Buffer.from(base64Str, 'base64'),
        ContentEncoding: 'base64',
        ContentType: 'image/png',
    }).send((err, output) => {
        if(err){
            winstonLogger.error(`Put object to myy-ml-icons bucket failed: ${JSON.stringify(err)}`);
            callback(err, null);
        }
        else {
            winstonLogger.info(`Put object to myy-ml-icons bucket successfully: ${JSON.stringify(output)}`);
            callback(null, output);
        }
    })
}

module.exports = {
    putIconsToBucket
}