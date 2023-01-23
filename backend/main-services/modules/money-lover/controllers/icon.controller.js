const Icon = require('../models/icon');
const validator = require('validator');
const async = require('async');
const fs = require('fs');

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

    Icon
        .find()
        .where(query)
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

const addIcon = (req, returnData, callback) => {
    const { code, path } = req.params;
    const creator = req.user;

    if (validator.isNull(code)) {
        return callback('ERROR_CODE_MISSING');
    }
    if (validator.isNull(path)) {
        return callback('ERROR_PATH_MISSING');
    }

    async.series([
        function (cb) {
            Icon
                .findOne()
                .where({ code: code, path: path })
                .exec((err, data) => {
                    if (err) {
                        cb(err);
                    }
                    if (data) {
                        cb('ERROR_ICON_EXIST');
                    }
                    else cb();
                })
        },
        function (cb) {
            let newIcon = new Icon({
                code,
                path,
                creator: creator._id,
                dateCreated: new Date()
            })
            newIcon.save((err, result) => {
                if (err) cb(err);
                else {
                    cb(null, result);
                }
            })
        }
    ], (err, data) => {
        if (err) return callback(err);
        returnData.set(data);
        callback();
    })

}

const updateIcon = (req, returnData, callback) => {
    let { code, path, id } = req.params;

    if (validator.isNull(code)) {
        return callback('ERROR_CODE_MISSING');
    }
    if (validator.isNull(path)) {
        return callback('ERROR_PATH_MISSING');
    }
    if (!validator.isMongoId(id)) {
        return callback('ERROR_ID_MISSING');
    }

    Icon
        .findOne()
        .where({ _id: id })
        .exec((err, result) => {
            if (err) {
                return callback(err);
            }
            if (!result) {
                return callback('ERROR_ICON_NOT_FOUND');
            }
            else {
                utils.merge(result, { code, path });
                result.save(function (error, data) {
                    if (error) return callback(error);
                    returnData.set(data);
                    callback();
                });
            }
        })
}

const deleteIcon = (req, returnData, callback) => {
    let { id } = req.params;

    if (validator.isNull(id)) {
        return callback('ERROR_ID_MISSING');
    }

    Icon
        .update({
            _id: id
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

exports.deleteIcon = deleteIcon;
exports.listIcons = listIcons;
exports.addIcon = addIcon;
exports.getIcon = getIcon;
exports.updateIcon = updateIcon;
exports.insertAllIcons = insertAllIcons;
exports.getIconByPath = getIconByPath;