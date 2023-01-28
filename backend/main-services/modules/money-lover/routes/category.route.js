'use strict';

var consts = require(__config_path + '/consts');

module.exports = function () {
    // Root routing
    var controller = require('../controllers/category.controller.js');

    consts.registerApi('api.v1.category.add', controller.addCategory, { anyAuthApi: true });
    consts.registerApi('api.v1.category.delete', controller.deleteCategory, { anyAuthApi: true });
    consts.registerApi('api.v1.category.get', controller.getCategory, { anyAuthApi: true });
    consts.registerApi('api.v1.category.list', controller.listCategorys, { anyAuthApi: true });
    consts.registerApi('api.v1.category.update', controller.updateCategory, { anyAuthApi: true });
};
