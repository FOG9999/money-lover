'use strict';

var consts = require(__config_path + '/consts');

module.exports = function () {
    // Root routing
    var controller = require('../controllers/transaction.controller.js');

    consts.registerApi('api.v1.transaction.add', controller.addTransaction, { systemApi: true });
    consts.registerApi('api.v1.transaction.delete', controller.deleteTransaction, { systemApi: true });
    consts.registerApi('api.v1.transaction.get', controller.getTransaction, { systemApi: true });
    consts.registerApi('api.v1.transaction.list', controller.listTransactions, { systemApi: true });
    consts.registerApi('api.v1.transaction.update', controller.updateTransaction, { systemApi: true });
};
