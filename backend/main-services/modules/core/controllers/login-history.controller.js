const winstonLogger = require('../../../../libs/winston');

let mongoose = require('mongoose'),
    ObjectId = mongoose.Types.ObjectId,
    LoginHistory = require('../models/login-history'),
    utils = require(__libs_path + '/utils'),
    validator = require('validator'),
    consts = require(__config_path + '/consts');

const saveLoginHistory = (userId, platform, callback = undefined) => {
    let newLogin = new LoginHistory({
        user: userId,
        platform
    });
    newLogin.save((err) => {
        if(err){
            winstonLogger.error(JSON.stringify(err));
            if(callback){
                callback(false);
            }
        }
        else {
            if(callback){
                callback(true);
            }
        }
    })
}

module.exports = {
    saveLoginHistory
}