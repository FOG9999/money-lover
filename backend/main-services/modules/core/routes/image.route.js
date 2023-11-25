'use strict';

var consts = require(__config_path + '/consts');

module.exports = function () {
    // Root routing
    var controller = require('../controllers/image.controller.js');

    // consts.registerApi('api.v1.image.get.base64', controller.getImageBase64, { notAuth: true });
    consts.registerApi('api.v1.image.rename', controller.renameAllIconsName, { notAuth: true });
};
