'use strict';

var consts = require(__config_path + '/consts');

module.exports = function () {
    // Root routing
    var controller = require('../controllers/file.controller.js');

    consts.registerApi('api.v1.file.import_moneylover', controller.importFromMoneyLover, { anyAuthApi: true });
};
