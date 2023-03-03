'use strict';

var consts = require(__config_path + '/consts');

module.exports = function () {
    // Root routing
    var controller = require('../controllers/wallet.controller.js');

    consts.registerApi('api.v1.wallet.add', controller.addWallet, { systemApi: true });
    consts.registerApi('api.v1.wallet.delete', controller.deleteWallet, { systemApi: true });
    consts.registerApi('api.v1.wallet.get', controller.getWallet, { systemApi: true });
    consts.registerApi('api.v1.wallet.list', controller.listWallets, { anyAuthApi: true });
    consts.registerApi('api.v1.wallet.update', controller.updateWallet, { systemApi: true });
};
