let mongoose = require('mongoose'),
    ObjectId = mongoose.Types.ObjectId,
    User = require('../models/user'),
    utils = require(__libs_path + '/utils'),
    validator = require('validator'),
    consts = require(__config_path + '/consts');
const redis = require(__libs_path + '/redis');
const Notification = require('../models/notification');
const winstonLogger = require(__libs_path + '/winston');
const mailTransporter = require(__libs_path + '/mailer');

const create = (data, callback) => {
    const { user, type, repeat, priority, title, description, link } = data;
    if(!user){
        return callback('ERROR_MISSING_USER');
    }
    if(!type){
        return callback('ERROR_MISSING_TYPE');
    }
    if(!priority){
        return callback('ERROR_MISSING_PRIORITY');
    }
    if(!title){
        return callback('ERROR_MISSING_TITLE');
    }
    if(!link){
        return callback('ERROR_MISSING_LINK');
    }
    let notification = new Notification({
        user, type, priority, title, link
    });
    if(repeat){
        notification.repeat = repeat;
    }
    if(description){
        notification.description = description;
    }
    notification.save((err, res) => {
        if(err){
            winstonLogger.error(`Save notification failed: ${JSON.stringify(err)}`);
            return callback(err);
        }
        return callback(null);
    })
}

module.exports = {
    create
}