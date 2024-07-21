const UserSetting = require('../models/user-setting');
const validator = require('validator');
const async = require('async');
const consts = require('../../../../config/consts');
const { merge } = require('../../../../libs/utils');
const User = require('../models/user');
const Permission = require('../models/permission');

const getUsetSetting = (req, returnData, callback) => {
    const { id: userId } = req.user;
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

const createDefaultUserSetting = (userId) => {
    const newSetting = new UserSetting({
        user: userId
    })
}

module.exports = {
    getUsetSetting
}