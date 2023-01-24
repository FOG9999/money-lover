const Category = require('../models/category');
const validator = require('validator');
const async = require('async');
const fs = require('fs');
const utils = require(__libs_path + '/utils');

const listCategorys = (req, returnData, callback) => {
    const { search, isDelete } = req.params;

    const query = {
        $or: [{
            name: new RegExp(search, 'i')
        }]
    };
    if (!validator.isNull(isDelete)) {
        query['isDelete'] = isDelete;
    }

    Category
        .find()
        .where(query)
        .populate('icon')
        .exec((err, results) => {
            if (err) return callback(err);
            returnData.set(results);
            callback();
        })
}

const getCategory = (req, returnData, callback) => {
    let id = req.params.id;

    Category
        .findOne({ _id: id })
        .exec((err, data) => {
            if (err) return callback(err);
            if (!data) return callback('ERROR_CATEGORY_NOT_FOUND');
            returnData.set(data);
            callback();
        })
}

const addCategory = (req, returnData, callback) => {
    const { name, icon } = req.params;
    const creator = req.user;

    if (validator.isNull(name)) {
        return callback('ERROR_CODE_MISSING');
    }
    if (validator.isNull(icon)) {
        return callback('ERROR_PATH_MISSING');
    }

    async.series([
        function (cb) {
            Category
                .findOne()
                .where({ name: name, icon: icon })
                .exec((err, data) => {
                    if (err) {
                        cb(err);
                    }
                    if (data) {
                        cb('ERROR_CATEGORY_EXIST');
                    }
                    else cb();
                })
        },
        function (cb) {
            let newCategory = new Category({
                name,
                icon,
                creator: creator._id,
                dateCreated: new Date()
            })
            newCategory.save((err, result) => {
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

const updateCategory = (req, returnData, callback) => {
    let { name, icon, id } = req.params;

    if (validator.isNull(name)) {
        return callback('ERROR_CODE_MISSING');
    }
    if (validator.isNull(icon)) {
        return callback('ERROR_PATH_MISSING');
    }
    if (!validator.isMongoId(id)) {
        return callback('ERROR_ID_MISSING');
    }

    Category
        .findOne()
        .where({ _id: id })
        .exec((err, result) => {
            if (err) {
                return callback(err);
            }
            if (!result) {
                return callback('ERROR_CATEGORY_NOT_FOUND');
            }
            else {
                utils.merge(result, { name, icon });
                result.save(function (error, data) {
                    if (error) return callback(error);
                    returnData.set(data);
                    callback();
                });
            }
        })
}

const deleteCategory = (req, returnData, callback) => {
    let { id } = req.params;

    if (validator.isNull(id)) {
        return callback('ERROR_ID_MISSING');
    }

    Category
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

exports.deleteCategory = deleteCategory;
exports.listCategorys = listCategorys;
exports.addCategory = addCategory;
exports.getCategory = getCategory;
exports.updateCategory = updateCategory;