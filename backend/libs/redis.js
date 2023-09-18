'use strict';

const redis = require('redis');
const config = require('../config/config');
const winstonLogger = require('./winston');
const client = redis.createClient({
    port: config.redis.port,
    host: config.redis.host,
    password: config.redis.password
});

client.debug_mode = true;
client.on('ready', function () {
    winstonLogger.info('Redis ready');
    console.log('Redis ready.');
});

client.on('error', err => {
    winstonLogger.error('Redis errors: ' + JSON.stringify(err));
    console.log('Redis Client Error', err)
});

module.exports = client;
