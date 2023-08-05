require('dotenv').config();
const AWS = require('aws-sdk');

// Thông tin SES_AWS_ACCESS_KEY_ID, SES_AWS_SECRET_ACCESS_KEY nằm trong file credentials bạn đã download về ở trên nhé
const sesConfig = {
    accessKeyId: process.env.SES_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.SES_AWS_SECRET_ACCESS_KEY,
    region: process.env.SES_REGION, // đây là region của server nó là vùng bạn đã chọn khi tạo ses nếu Mumbai là ap-south-1
    apiVersion: '2010-12-01', // version của api
}

const sesAws = new AWS.SES(sesConfig);

const sendMailPromise = (receivers, ccAdresses, subject, body, callback) => {
    sesAws.sendEmail({
        Destination: {
            BccAddresses: [
            ], 
            CcAddresses: [
               ...ccAdresses
            ], 
            ToAddresses: [
               ...receivers
            ]
           }, 
           Message: {
            Body: {
             Html: {
              Charset: "UTF-8", 
              Data: body
             }, 
             Text: {
              Charset: "UTF-8", 
              Data: body
             }
            }, 
            Subject: {
             Charset: "UTF-8", 
             Data: subject
            }
           }, 
        //    these 4 params cannot be empty
        //    ReplyToAddresses: [
        //    ], 
        //    ReturnPath: "", 
        //    ReturnPathArn: "", 
        //    SourceArn: "",
           Source: process.env.SES_AWS_SMTP_SENDER, 
    }, (err, resData) => {
        callback(err, resData);
    })
}

module.exports = {
    sendMailPromise
}