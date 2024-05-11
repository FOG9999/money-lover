'use strict';

var consts = require(__config_path + '/consts');

module.exports = function() {
    // Root routing
    var controller = require('../controllers/action.controller.js');

    consts.registerApi('api.v1.action.delete', controller.deleteAction, { systemApi: true });
    consts.registerApi('api.v1.action.list', controller.listActions, { systemApi: true });
    consts.registerApi('api.v1.action.add', controller.addAction, { systemApi: true });
    consts.registerApi('api.v1.action.get', controller.getAction, { systemApi: true });
    consts.registerApi('api.v1.action.update', controller.updateAction, { systemApi: true });
    consts.registerApi('api.v1.action.changestatus', controller.changeStatusAction, { systemApi: true });
};
