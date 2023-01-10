'use strict';

var consts = require(__config_path + '/consts');

module.exports = function() {
    // Root routing
    var controller = require('../controllers/action.controller.js');

    consts.registerApi('api.v1.systemuser.action.delete', controller.deleteAction, { systemApi: true });
    consts.registerApi('api.v1.systemuser.action.list', controller.listActions, { systemApi: true });
    consts.registerApi('api.v1.systemuser.action.add', controller.addAction, { systemApi: true });
    consts.registerApi('api.v1.systemuser.action.get', controller.getAction, { systemApi: true });
    consts.registerApi('api.v1.systemuser.action.update', controller.updateAction, { systemApi: true });
};
