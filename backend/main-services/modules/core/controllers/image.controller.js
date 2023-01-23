let mongoose = require('mongoose'),
    dataDb = require(__db_path + '/system-db'),
    ObjectId = mongoose.Types.ObjectId,
    User = require('../models/user'),
    utils = require(__libs_path + '/utils'),
    _ = require('lodash'),
    async = require('async'),
    restify = require('restify'),
    moment = require('moment'),
    validator = require('validator'),
    consts = require(__config_path + '/consts');
const redis = require('../../../../libs/redis');
const fs = require('fs');
const { v4: uuid } = require('uuid');

const getImageBase64 = (req, returnData, callback) => {
    try {
        let path = req.params.path;
        redis.HEXISTS(consts.redis_key.icon, path, (err, exists) => {
            if(err){
                callback(err);
            }
            if(exists == 1){
                redis.HGET(consts.redis_key.icon, path, (err, iconData) => {
                    if(err){
                        callback(err);
                    }
                    else {
                        returnData.set(iconData);
                        callback();
                    }
                })
            }
            else {
                let iconFile = fs.readFileSync(__icons_path + '/' + path);
                let base64String = consts.icon_prefix + iconFile.toString('base64');
                redis.HSET(consts.redis_key.icon, path, base64String, (err) => {
                    if(err){
                        callback(err);
                    }
                    else {
                        returnData.set(base64String);
                        callback();
                    }
                })                
            }
        })        
    } catch (error) {
        callback(error);
    }
}

const renameAllIconsName = (req, returnData, callback) => {
    try {
        let icons = fs.readdirSync(__icons_path);
        icons.forEach(file => {
            fs.renameSync(__icons_path + '/' + file, __icons_path + '/' + uuid() + '.png', (err) => {
                console.error(err);
            })
        });
        callback();
    } catch (error) {
        callback(error);
    }
}

module.exports = {
    getImageBase64,
    renameAllIconsName
}