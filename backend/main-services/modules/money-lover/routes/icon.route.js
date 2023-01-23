'use strict';

var consts = require(__config_path + '/consts');

module.exports = function () {
    // Root routing
    var controller = require('../controllers/icon.controller.js');

    consts.registerApi('api.v1.icon.insert_all', controller.insertAllIcons);
    consts.registerApi('api.v1.icon.add', controller.addIcon);
    consts.registerApi('api.v1.icon.delete', controller.deleteIcon);
    consts.registerApi('api.v1.icon.get', controller.getIcon);
    consts.registerApi('api.v1.icon.get_by_path', controller.getIconByPath);
    consts.registerApi('api.v1.icon.list', controller.listIcons);
    consts.registerApi('api.v1.icon.update', controller.updateIcon);
};
