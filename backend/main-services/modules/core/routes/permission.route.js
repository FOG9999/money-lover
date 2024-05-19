'use strict';

var consts = require(__config_path + '/consts');

module.exports = function() {
    // Root routing
    var controller = require('../controllers/permission.controller.js');

    consts.registerApi('api.v1.permission.delete', controller.deletePermission, { systemApi: true });
    consts.registerApi('api.v1.permission.list', controller.listPermissions, { systemApi: true });
    consts.registerApi('api.v1.permission.add', controller.addPermission, { systemApi: true });
    consts.registerApi('api.v1.permission.get', controller.getPermission, { systemApi: true });
    consts.registerApi('api.v1.permission.update', controller.updatePermission, { systemApi: true });
    consts.registerApi('api.v1.permission.changestatus', controller.changeStatusPermission, { systemApi: true });
};
