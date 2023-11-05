'use strict';

require('./config/init')();
require('dotenv').config();
var config = require('./config/config');

// Paths global
global.__config_path = config.root + '/config';
global.__db_path = config.root + '/database';
global._modules_path = config.root + '/main-services/modules';
global.__libs_path = config.root + '/libs';
global.__icons_path = config.root + '/public/icons';

// Load các thư viện
var fs = require('fs');
var restify = require('restify');

// Setup some https server options
let ca = [];
// if (config.certs.ca && config.certs.ca.length > 0) {
//     for (let j = 0; j < config.certs.ca.length; j++) {
//         ca.push(fs.readFileSync(config.certs.ca[j]));
//     }
// }
// let https_options = {
//     name: config.app.name,
//     version: config.app.version,
//     // key: fs.readFileSync(config.certs.key),
//     // certificate: fs.readFileSync(config.certs.certificate)
// };
// if (ca.length > 0) {
//     https_options.ca = ca;
// }

// https_options.ca = require('ssl-root-cas/latest').inject();
// console.log(https_options.ca);

// khởi tạo Database MongoDB
var mongoose = require('mongoose');
const mailTransporter = require('./libs/mailer');
const winstonLogger = require('./libs/winston');
// require('./database/business-db');
require('./database/system-db');
require('./socket/ws-lambda-client');
// Use bluebird promises
mongoose.Promise = require("bluebird");

var app = restify.createServer({});
app.on('error', function (err) {
    if (err.errno === 'EADDRINUSE') {
        console.log('Port already in use.');
        process.exit(1);
    } else {
        console.log(err);
    }
});

mailTransporter.verify((err, success) => {
    if(err){
        winstonLogger.error('Nodemailer verify error: ' + JSON.stringify(err));
    }
    else {
        winstonLogger.info('Nodemailer verifies successfully');
    }
})

var port = config.port;
app.listen(port, function () {
    winstonLogger.info('App started on ' + config.host + ':' + port);
});

// config server, restify settings
require('./config/server-config')(app);

// bootstrap app
require('./bootstrap')(app);

exports = module.exports = app;
