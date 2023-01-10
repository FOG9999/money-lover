'use strict';

/**
 * Module dependencies.
 */
var glob = require('glob'),
    chalk = require('chalk');

/**
 * Module init function.
 */
module.exports = function() {
    /**
     * Before we begin, lets set the environment variable
     * We'll Look for a valid NODE_ENV variable and if one cannot be found load the production NODE_ENV
     */
    var mode = 'prod';
    if (process.argv.length > 2) {
        mode = process.argv[2];
    }
    var mode = process.env.NODE_ENV || mode;
    var environmentFiles = glob.sync('./config/env/' + mode + '.js');
    if (environmentFiles && !environmentFiles.length) {
        if (process.env.NODE_ENV) {
            console.error(chalk.red('No configuration file found for "' + mode + '" environment using production instead'));
        } else {
            console.error(chalk.red('NODE_ENV is not defined! Using default production environment'));
        }
    } else {
        console.log(chalk.black.bgWhite('Application loaded using the "' + mode + '" environment configuration'));
    }
    process.env.NODE_ENV = mode;
};
