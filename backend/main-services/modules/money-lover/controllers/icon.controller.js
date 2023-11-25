const Icon = require('../models/icon');
const validator = require('validator');
const async = require('async');
const fs = require('fs');
const { v4: uuid } = require('uuid');
const { putIconsToBucket } = require('../../../../libs/aws-s3');
const redis = require(__libs_path + '/redis');
const consts = require('../../../../config/consts'),
mongoose = require('mongoose'),
ObjectId = mongoose.Types.ObjectId;

const listIcons = (req, returnData, callback) => {
    const { search, isDelete } = req.params;

    const query = {
        $or: [{
            name: new RegExp(search, 'i')
        }, {
            code: new RegExp(search, 'i')
        }]
    };
    if (!validator.isNull(isDelete)) {
        query['isDelete'] = isDelete;
    }
    else {
        query['isDelete'] = false;
    }

    Icon
        .find()
        .where(query)
        .sort({dateCreated: -1})
        .exec((err, results) => {
            if (err) return callback(err);
            returnData.set(results);
            callback();
        })
}

const getIcon = (req, returnData, callback) => {
    let id = req.params.id;

    Icon
        .findOne({ _id: id })
        .exec((err, data) => {
            if (err) return callback(err);
            if (!data) return callback('ERROR_ICON_NOT_FOUND');
            returnData.set(data);
            callback();
        })
}

const getIconByPath = (req, returnData, callback) => {
    let path = req.params.path;

    Icon
        .findOne({ path: path })
        .exec((err, data) => {
            if (err) return callback(err);
            if (!data) return callback('ERROR_ICON_NOT_FOUND');
            returnData.set(data);
            callback();
        })
}

const deleteIcon = (req, returnData, callback) => {
    let { ids, paths } = req.params;

    if (validator.isNull(ids)) {
        return callback('ERROR_ID_MISSING');
    }
    if (validator.isNull(paths)) {
        return callback('ERROR_PATH_MISSING');
    }

    Icon
        .update({
            _id: {$in: ids.map(i => ObjectId(i))}
        }, {
            $set: {
                isDelete: true
            }
        }, (err, data) => {
            if (err) return callback(err);
            callback();            
        })
}

const insertAllIcons = (req, returnData, callback) => {
    try {
        const creator = req.user;
        let icons = fs.readdirSync(__icons_path);
        icons.forEach(file => {
            let newIcon = new Icon({
                code: file.split('.')[0],
                path: file,
                creator: creator._id,
                dateCreated: new Date()
            })
            newIcon.save();
        });
        callback();
    } catch (error) {
        callback(error);
    }
}

const uploadIcon = (req, returnData, callback) => {
    try {
        let { file } = req.body;
        file = file.replace(/^data:image\/png;base64,/, "");
        let code = uuid().toString(), path = code + consts.icon_type;
        let newIcon = new Icon({
            code,
            path,
            creator: creator._id,
            dateCreated: new Date()
        })
        newIcon.save((err, result) => {
            if (err) cb(err);
            else {
                putIconsToBucket(code + consts.icon_type, file, (errS3, outputS3) => {
                    if (errS3) return callback(errS3);
                    returnData.set(outputS3);
                    callback(null, result);
                })
            }
        })
    } catch (error) {
        callback(error);
    }
}

exports.deleteIcon = deleteIcon;
exports.listIcons = listIcons;
exports.getIcon = getIcon;
exports.insertAllIcons = insertAllIcons;
exports.getIconByPath = getIconByPath;
exports.uploadIcon = uploadIcon;