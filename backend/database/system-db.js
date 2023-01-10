/**
 * Created by thanhle on 4/16/2015.
 */
 const mongoose = require('mongoose');
 const config = require(__config_path + '/config');
 
 // setup Data Database
 let connectStr;
 if (config.db.system) {
     connectStr = config.db.system.db_prefix + '://' + config.db.system.db_user + ':' + config.db.system.db_pass + '@' + config.db.system.db_host + ':' + config.db.system.db_port + '/' + config.db.system.db_database;
 } else {
     connectStr = config.db.system.db_prefix + '://' + config.db.system.db_host + ':' + config.db.system.db_port + '/' + config.db.system.db_database;
 }
 
 var db = mongoose.createConnection(connectStr, {
     useMongoClient: true,
     autoReconnect: true,
     keepAlive: 120,
     config: {
         autoIndex: false
     }
 });
 
 function reconnect() {
     setTimeout(function() {
         console.log('System DB: reconnecting');
         db.open(connectStr);
     }, 5000);
 }
 
 // log event for database
 db.on('opening', function() {
     console.log('System DB: reconnecting... %d', mongoose.connection.readyState);
 });
 db.once('open', function() {
     console.log('System DB: connection opened.');
 });
 db.on('error', function(err) {
     console.log('System DB: connection error %s', err);
     if (err && err.message && err.message.match(/ECONNRESET|ECONNREFUSED|ECONNABORTED/)) {
         reconnect();
     }
 });
 db.on('disconnected', function() {
     console.log('System DB: disconnected');
     reconnect();
 });
 
 exports = module.exports = db;
 