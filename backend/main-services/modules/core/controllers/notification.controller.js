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
        return winstonLogger.error('Notification creation failed: ERROR_MISSING_USER');
    }
    if(!type){
        return winstonLogger.error('Notification creation failed: ERROR_MISSING_TYPE');
    }
    if(!priority && typeof priority != 'number'){
        return winstonLogger.error('Notification creation failed: ERROR_MISSING_PRIORITY');
    }
    if(!title){
        return winstonLogger.error('Notification creation failed: ERROR_MISSING_TITLE');
    }
    if(!link){
        return winstonLogger.error('Notification creation failed: ERROR_MISSING_LINK');
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
        return callback(null, res);
    })
}

const list = (req, returnData, callback) => {
    let { search, isRead, type, page, size } = req.params;
    let user = req.user._id;
    let query = {};
    if (!validator.isNull(isRead)) {
        query['isRead'] = isRead;
    }
    if (!validator.isNull(type)) {
        query['type'] = type;
    }
    if (validator.isNull(page)) {
        page = 0;
    }
    if (validator.isNull(size)) {
        size = consts.page_size;
    }

    query = {
        ...query,
        user: ObjectId(user),
        $and: [
            {
                $or: [
                    {
                        description: new RegExp(search, 'i')
                    },
                    {
                        link: new RegExp(search, 'i')
                    }
                ]
            }
        ]
    }

    Notification
    .find()
    .where(query)
    .sort({ dateCreated: -1 })
    .skip(page*size)
    .limit(size)
    .exec((err, results) => {
        if (err) {
            winstonLogger.error(`Error searching notification: ${JSON.stringify(err)}`)
            return callback(err);
        }
        // calculate count
        Notification.aggregate([{
            $match: query
        }, {
            $count: "total"
        }])
        .exec((errCount, result) => {
            if(errCount || !result[0]){
                winstonLogger.error(`Error searching notification with total: ${errCount ? JSON.stringify(errCount) : 'result with total empty'}`)
                return callback(errCount);
            }
            returnData.set({results, total: result[0].total});
            callback();
        })
    })
}

module.exports = {
    createNotification: create,
    list
}