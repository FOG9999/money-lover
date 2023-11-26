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
        .skip(page * size)
        .limit(size)
        .exec((err, results) => {
            if (err) {
                winstonLogger.error(`Error searching notification: ${JSON.stringify(err)}`)
                return callback(err);
            }
            // calculate count
            Notification.aggregate([{
                $match: {...query, isRead: false}
            }, {
                $count: "totalUnread"
            }])
                .exec((errCount, result) => {
                    if (errCount) {
                        winstonLogger.error(`Error searching notification with total: ${JSON.stringify(errCount)}`)
                        return callback(errCount);
                    }
                    returnData.set({ results, total: result[0] ? result[0].totalUnread: 0 });
                    callback();
                })
        })
}

const markNoRepeat = (req, returnData, callback) => {
    const { id } = req.params;
    const user = req.user._id;
    Notification.findOneAndUpdate({
        _id: id,
        user
    }, {
        $set: { repeat: false }
    }, (err, data) => {
        if (err) return callback(err);
        returnData.set({ ...data._doc });
        callback();
    })
}

const markReadList = (req, returnData, callback) => {
    const { ids } = req.params;
    const user = req.user._id;
    
    if (validator.isNull(ids) || !Array.isArray(ids)) {
        return callback('ERROR_IDs_MISSING');
    }

    Notification.updateMany({
        _id: {
            $in: ids.map(i => ObjectId(i))
        },
        user
    }, { $set: { isRead: true } }, (err, data) => {
        if (err) return callback(err);
        returnData.set({ ...data });
        callback();
    })
}

module.exports = {
    list,
    markNoRepeat,
    markReadList
}