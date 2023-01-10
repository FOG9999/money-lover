'use strict';

var consts = require(__config_path + '/consts');

module.exports = function () {
    // Root routing
    var controller = require('../controllers/category.controller.js');

    consts.registerApi('api.v1.category.add', controller.addCategory, { systemApi: true });
    consts.registerApi('api.v1.category.delete', controller.deleteCategory, { systemApi: true });
    consts.registerApi('api.v1.category.get', controller.getCategory, { systemApi: true });
    consts.registerApi('api.v1.category.list', controller.listCategorys, { systemApi: true });
    consts.registerApi('api.v1.category.update', controller.updateCategory, { systemApi: true });
};
