'use strict';

var consts = require(__config_path + '/consts');

module.exports = function() {
    // Root routing
    var controller = require('../controllers/module.controller.js');

    consts.registerApi('api.v1.systemuser.module.delete', controller.deleteModule, { systemApi: true });
    consts.registerApi('api.v1.systemuser.module.list', controller.listModules, { systemApi: true });
    consts.registerApi('api.v1.systemuser.module.add', controller.addModule, { systemApi: true });
    consts.registerApi('api.v1.systemuser.module.get', controller.getModule, { systemApi: true });
    consts.registerApi('api.v1.systemuser.module.update', controller.updateModule, { systemApi: true });
};
