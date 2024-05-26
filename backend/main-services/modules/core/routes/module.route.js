'use strict';

var consts = require(__config_path + '/consts');

module.exports = function() {
    // Root routing
    var controller = require('../controllers/module.controller.js');

    consts.registerApi('api.v1.module.delete', controller.deleteModule, { systemApi: true });
    consts.registerApi('api.v1.module.list', controller.listModules, { systemApi: true });
    consts.registerApi('api.v1.module.add', controller.addModule, { systemApi: true });
    consts.registerApi('api.v1.module.get', controller.getModule, { systemApi: true });
    consts.registerApi('api.v1.module.update', controller.updateModule, { systemApi: true });
    consts.registerApi('api.v1.module.getbyids', controller.getModulesByIds, { systemApi: true });
    consts.registerApi('api.v1.module.changestatus', controller.changeStatusModule, { systemApi: true });
};
