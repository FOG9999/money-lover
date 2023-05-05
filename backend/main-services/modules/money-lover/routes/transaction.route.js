'use strict';

var consts = require(__config_path + '/consts');

module.exports = function () {
    // Root routing
    var controller = require('../controllers/transaction.controller.js');

    consts.registerApi('api.v1.transaction.add', controller.addTransaction, { anyAuthApi: true });
    consts.registerApi('api.v1.transaction.delete', controller.deleteTransaction, { anyAuthApi: true });
    consts.registerApi('api.v1.transaction.get', controller.getTransaction, { anyAuthApi: true });
    consts.registerApi('api.v1.transaction.list', controller.listTransactions, { anyAuthApi: true });
    consts.registerApi('api.v1.transaction.update', controller.updateTransaction, { anyAuthApi: true });
};
