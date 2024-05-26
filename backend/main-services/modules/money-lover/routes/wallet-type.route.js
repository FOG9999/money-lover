'use strict';

var consts = require(__config_path + '/consts');

module.exports = function () {
    // Root routing
    var controller = require('../controllers/wallet-type.controller.js');

    consts.registerApi('api.v1.wallet-type.add', controller.addWalletType, { systemApi: true });
    consts.registerApi('api.v1.wallet-type.delete', controller.deleteWalletType, { systemApi: true });
    consts.registerApi('api.v1.wallet-type.get', controller.getWalletType, { systemApi: true });
    consts.registerApi('api.v1.wallet-type.getbyids', controller.getWalletTypesByIds, { systemApi: true });
    consts.registerApi('api.v1.wallet-type.list', controller.listWalletTypes, { anyAuthApi: true });
    consts.registerApi('api.v1.wallet-type.update', controller.updateWalletType, { systemApi: true });
};
