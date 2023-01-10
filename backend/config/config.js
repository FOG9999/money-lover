'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash');
var fs = require('fs');

/**
 * Load app configurations
 */
var localConf = {};
if (fs.existsSync('local-conf.js')) {
    localConf = require('../local-conf');
}
module.exports = _.extend(
    require('./env/all'),
    require('./env/' + process.env.NODE_ENV) || {},
    localConf
);
