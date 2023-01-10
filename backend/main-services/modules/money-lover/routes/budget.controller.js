'use strict';

var consts = require(__config_path + '/consts');

module.exports = function () {
    // Root routing
    var controller = require('../controllers/budget.controller.js');

    consts.registerApi('api.v1.budget.add', controller.addBudget, { systemApi: true });
    consts.registerApi('api.v1.budget.delete', controller.deleteBudget, { systemApi: true });
    consts.registerApi('api.v1.budget.get', controller.getBudget, { systemApi: true });
    consts.registerApi('api.v1.budget.list', controller.listBudgets, { systemApi: true });
    consts.registerApi('api.v1.budget.update', controller.updateBudget, { systemApi: true });
};
