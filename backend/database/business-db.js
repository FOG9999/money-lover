/**
 * Created by thanhle on 4/16/2015.
 */
 const mongoose = require('mongoose');
 const config = require(__config_path + '/config');
 
 // setup Data Database
 let connectStr;
 if (config.db.data.db_user) {
     connectStr = config.db.data.db_prefix + '://' + config.db.data.db_user + ':' + config.db.data.db_pass + '@' + config.db.data.db_host + ':' + config.db.data.db_port + '/' + config.db.data.db_database;
 } else {
     connectStr = config.db.data.db_prefix + '://' + config.db.data.db_host + ':' + config.db.data.db_port + '/' + config.db.data.db_database;
 }
 
 var db = mongoose.createConnection(connectStr, {
     useNewUrlParser: true,
     autoReconnect: true,
     keepAlive: 120,
     config: {
         autoIndex: false
     }
 });
 
 function reconnect() {
     setTimeout(function() {
         console.log('Data DB: reconnecting');
         db.open(connectStr);
     }, 5000);
 }
 
 // log event for database
 db.on('opening', function() {
     console.log('Data DB: reconnecting... %d', mongoose.connection.readyState);
 });
 db.once('open', function() {
     console.log('Data DB: connection opened.');
 });
 db.on('error', function(err) {
     console.log('Data DB: connection error %s', err);
     if (err && err.message && err.message.match(/ECONNRESET|ECONNREFUSED|ECONNABORTED/)) {
         reconnect();
     }
 });
 db.on('disconnected', function() {
     console.log('Data DB: disconnected');
     reconnect();
 });
 
 exports = module.exports = db;
 