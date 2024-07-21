'use strict';

const consts = require(__config_path + '/consts');

module.exports = function() {
    // Root routing
    const controller = require('../controllers/system.user.controller.js');
    const userSettingCtl = require('../controllers/user-setting.controller.js');

    consts.registerApi('api.v1.systemuser.deactivate', controller.deactivateUsers, { systemApi: true });
    consts.registerApi('api.v1.systemuser.unlock', controller.unlockUsers, { systemApi: true });
    consts.registerApi('api.v1.systemuser.list', controller.list, { systemApi: true });
    consts.registerApi('api.v1.systemuser.checkemailexist', controller.checkEmailExist, { systemApi: true });
    consts.registerApi('api.v1.systemuser.login', controller.login, { notAuth: true });
    consts.registerApi('api.v1.systemuser.get', controller.getUser, { systemApi: true });
    consts.registerApi('api.v1.systemuser.resetpassword', controller.resetPassword, { systemApi: true });
    consts.registerApi('api.v1.systemuser.signup', controller.signUp, { notAuth: true });
    consts.registerApi('api.v1.systemuser.signupwithoauth', controller.createUserOAuth, { notAuth: true });
    consts.registerApi('api.v1.systemuser.delete', controller.deleteUsers, { systemApi: true });
    consts.registerApi('api.v1.systemuser.deletesingle', controller.deleteSingleUser, { systemApi: true });
    consts.registerApi('api.v1.systemuser.restoreuser', controller.restoreUsers, { systemApi: true });
    consts.registerApi('api.v1.systemuser.deletepermanently', controller.deletePermanently, { systemApi: true });
    consts.registerApi('api.v1.systemuser.update', controller.updateUser, { anyAuth: true });
    consts.registerApi('api.v1.systemuser.getkey', controller.encryptSessionAndUrl, { anyAuth: true });
    consts.registerApi('api.v1.systemuser.authkey', controller.authenticateKeyUrl, { anyAuth: true });
    consts.registerApi('api.v1.systemuser.checktfa', controller.checkUserTFA, { notAuth: true });
    consts.registerApi('api.v1.systemuser.generateotp', controller.generateOTP, { notAuth: true });
    consts.registerApi('api.v1.systemuser.updateuserrole', controller.updateUserRole, { systemApi: true });
    consts.registerApi('api.v1.systemuser.posttoconnection', controller.postToConnectionLambda, { notAuth: true });
    consts.registerApi('api.v1.systemuser.sendemailchangepassword', controller.sendEmailToChangePass, { anyAuth: true });
    consts.registerApi('api.v1.systemuser.changepassword', controller.handleChangePassToken, { anyAuth: true });
    consts.registerApi('api.v1.systemuser.checkchangepasswordurl', controller.checkChangepasswordUrl, { anyAuth: true });
    consts.registerApi('api.v1.systemuser.usersetting.get', userSettingCtl.getUsetSetting, { anyAuth: true });
    consts.registerApi('api.v1.systemuser.usersetting.set', userSettingCtl.updateSetting, { anyAuth: true });
    consts.registerApi('api.v1.systemuser.sendforgotpasswordrequest', controller.sentForgotPasswordRequest, { notAuth: true });
    consts.registerApi('api.v1.systemuser.handleforgotpasswordrequest', controller.handleForgotPasswordRequest, { notAuth: true });
};
