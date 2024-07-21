const UserSetting = require('../models/user-setting');
const validator = require('validator');
const async = require('async');
const consts = require('../../../../config/consts');
const winstonLogger = require('../../../../libs/winston');

const getUsetSetting = (req, returnData, callback) => {
    const { _id: userId } = req.user;
    if(validator.isNull(userId)) {
        return callback(consts.ERRORS.ERROR_USER_NOT_FOUND);
    }
    UserSetting
        .findOne({ user: userId })
        .exec((err, data) => {
            if (err) return callback(err);
            if (!data) return callback(consts.ERRORS.ERROR_USER_NOT_FOUND);
            returnData.set(data);
            callback();
        })
}

const createDefaultUserSettingIfNeeded = (userId, callback) => {
    UserSetting
        .findOne({ user: userId })
        .exec((err, data) => {
            if (err) return callback(err);
            if (!data) {
                const newSetting = new UserSetting({
                    user: userId
                })
                newSetting.save((errSave, dataSetting) => {
                    if(errSave) {
                        winstonLogger.error(`Create default user setting failed. UserId: ${userId}: `, errSave);
                        return callback(errSave);
                    }
                    callback(dataSetting);
                })                
            }
            else {
                callback();
            }
        })
}

const updateSetting = (req, returnData, callback) => {
    const { _id: userId } = req.user;
    const { navPos, theme, showHeader, headerPos, showUserPanel, sidenavOpened, sidenavCollapsed, language } = req.params.setting;
    if(validator.isNull(userId)) {
        return callback(consts.ERRORS.ERROR_USER_NOT_FOUND);
    }
    UserSetting
        .findOneAndUpdate({ user: userId }, { $set: {
            navPos, theme, showHeader, headerPos, showUserPanel, sidenavOpened, sidenavCollapsed, language
        } }, { returnDocument: 'after' })
        .exec((err, data) => {
            if (err) return callback(err);
            returnData.set(data);
            callback();
        })
}

module.exports = {
    getUsetSetting,
    createDefaultUserSettingIfNeeded,
    updateSetting
}