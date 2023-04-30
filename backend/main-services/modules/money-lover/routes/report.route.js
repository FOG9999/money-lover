'use strict';

var consts = require(__config_path + '/consts');

module.exports = function () {
    // Root routing
    var controller = require('../controllers/report.controller.js');

    consts.registerApi('api.v1.report.averagemonth', controller.getAveragePerMonth, { anyAuth: true });
    consts.registerApi('api.v1.report.overall', controller.getOverallEveryMonth, { anyAuth: true });
};
