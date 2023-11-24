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

// const update = (req, params, callback) => {
//     const { isRead, repeat } = params;
//     if(typeof isRead == "boolean"){
//         query.isRead = isRead;
//     }
// }

module.exports = {
    list
}