'use strict';

var consts = require(__config_path + '/consts');

module.exports = function() {
    // Root routing
    var controller = require('../controllers/role.controller.js');

    consts.registerApi('api.v1.role.delete', controller.deleteRole, { systemApi: true });
    consts.registerApi('api.v1.role.changestatus', controller.changeStatusRole, { systemApi: true });
    consts.registerApi('api.v1.role.list', controller.listRoles, { systemApi: true });
    consts.registerApi('api.v1.role.add', controller.addRole, { systemApi: true });
    consts.registerApi('api.v1.role.get', controller.getRole, { systemApi: true });
    consts.registerApi('api.v1.role.update', controller.updateRole, { systemApi: true });
};
