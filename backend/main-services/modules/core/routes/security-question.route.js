'use strict';

var consts = require(__config_path + '/consts');

module.exports = function() {
    // Root routing
    var controller = require('../controllers/security-question.controller.js');

    consts.registerApi('api.v1.securityquestion.delete', controller.deleteSecurityQuestion, { systemApi: true });
    consts.registerApi('api.v1.securityquestion.list', controller.listSecurityQuestions, { notAuth: true });
    consts.registerApi('api.v1.securityquestion.add', controller.addSecurityQuestion, { systemApi: true });
    consts.registerApi('api.v1.securityquestion.get', controller.getSecurityQuestion, { systemApi: true });
    consts.registerApi('api.v1.securityquestion.update', controller.updateSecurityQuestion, { systemApi: true });
    consts.registerApi('api.v1.securityquestion.useranswer', controller.handleUserAnswerQuestion, { anyAuth: true });
    consts.registerApi('api.v1.securityquestion.checkuser', controller.authUserByCheckSecurityQuestion, { anyAuth: true });
};
