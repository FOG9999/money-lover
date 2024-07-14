/**
 * Created by thanhle on 4/16/2015.
 */
const mongoose = require('mongoose');
const winstonLogger = require('../libs/winston');
const config = require(__config_path + '/config');

const getReplicaSetConnectionString = () => {
    if (config.db.system && config.db.system.replica) {
        let connStr = '';
        Object.keys(config.db.system.replica).forEach((node, ind) => {
            if (ind) connStr += ',';
            else connStr += config.db.system.replica[node].db_user + ':' + config.db.system.replica[node].db_pass + '@';
            connStr += config.db.system.replica[node].db_host + ':' + config.db.system.replica[node].db_port;
        })
        return connStr;
    } else {
        winstonLogger.error(`Configuration for system database does not exist`);
        return '';
    }
}

// setup Data Database
let connectStr;
if (config.db.system && config.db.system.replica) {
    const connStr = getReplicaSetConnectionString();
    if(!connStr) throw new Error(`Cannot read DB configuration`);
    connectStr = config.db.system.db_prefix + '://' + connStr + '/' + config.db.system.db_database + '?replicaSet=' + config.db.system.db_replica_name + `&authSource=${config.db.system.db_auth_src}`;
    winstonLogger.info(`Connection string: '${connectStr}'`);
} else {
    connectStr = config.db.system.db_prefix + '://' + config.db.system.db_host + ':' + config.db.system.db_port + '/' + config.db.system.db_database;
}

var db = mongoose.createConnection(connectStr, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
});

function reconnect() {
    setTimeout(function () {
        winstonLogger.info('System DB: reconnecting');
        // db.open(connectStr); // auto reconnect is already handled by default
    }, 1000);
}

// log event for database
db.on('opening', function () {
    winstonLogger.info('System DB: reconnecting... %d', mongoose.connection.readyState);
});
db.once('open', function () {
    winstonLogger.info('System DB: connection opened.');
});
db.on('error', function (err) {
    winstonLogger.error('System DB: connection error: ' + JSON.stringify(err));
    if (err && err.message && err.message.match(/ECONNRESET|ECONNREFUSED|ECONNABORTED/)) {
        reconnect();
    }
});
db.on('disconnected', function () {
    winstonLogger.error('System DB: disconnected');
    reconnect();
});

exports = module.exports = db;
