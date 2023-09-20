const nodemailer = require('nodemailer');

const mailTransporter = nodemailer.createTransport({
    host: process.env.MAIL_SERVER,
    port: 465,
    secure: true, // use TLS
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
    },
    // THIS IS REQUIRED NOT TO BE MARKED AS SPAM
    dkim: {
        domainName: "my-ml.net",
        keySelector: "default",
        privateKey: process.env.DKIM_PRIVATE
    }
})

module.exports = mailTransporter;