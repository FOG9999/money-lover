'use strict';

var consts = require(__config_path + '/consts');

module.exports = function() {
    // Root routing
    var controller = require('../controllers/notification.controller.js');

    consts.registerApi('api.v1.notification.list', controller.list, { anyAuth: true });
    consts.registerApi('api.v1.notification.norepeat', controller.markNoRepeat, { anyAuth: true });
    consts.registerApi('api.v1.notification.markread', controller.markReadList, { anyAuth: true });
};
