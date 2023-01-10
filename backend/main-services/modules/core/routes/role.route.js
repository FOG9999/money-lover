'use strict';

var consts = require(__config_path + '/consts');

module.exports = function() {
    // Root routing
    var controller = require('../controllers/role.controller.js');

    consts.registerApi('api.v1.systemuser.role.delete', controller.deleteRole, { systemApi: true });
    consts.registerApi('api.v1.systemuser.role.list', controller.listRoles, { systemApi: true });
    consts.registerApi('api.v1.systemuser.role.add', controller.addRole, { systemApi: true });
    consts.registerApi('api.v1.systemuser.role.get', controller.getRole, { systemApi: true });
    consts.registerApi('api.v1.systemuser.role.update', controller.updateRole, { systemApi: true });
};
