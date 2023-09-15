'use strict';

const redis = require('redis');
const config = require('../config/config');
const client = redis.createClient({
    port: config.redis.port,
    host: config.redis.host,
    password: config.redis.password
});

client.debug_mode = true;
client.on('ready', function () {
    console.log('Redis ready.');
});

module.exports = client;
