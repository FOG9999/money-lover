const Module = require('../models/module');
const validator = require('validator');
const async = require('async');

const listModules = (req, returnData, callback) => {
    const { search, status } = req.params;

    const query = {
        $or: [{
            name: new RegExp(search, 'i')
        }, {
            code: new RegExp(search, 'i')
        }]
    };
    if (!validator.isNull(status)) {
        query['status'] = status;
    }

    Module
        .find()
        .where(query)
        .exec((err, results) => {
            if (err) return callback(err);
            returnData.set(results);
            callback();
        })
}

const getModule = (req, returnData, callback) => {
    let id = req.params.id;

    Module
        .findOne({ _id: id })
        .exec((err, data) => {
            if (err) return callback(err);
            if (!data) return callback('ERROR_MODULE_NOT_FOUND');
            returnData.set(data);
            callback();
        })
}

const addModule = (req, returnData, callback) => {
    const { title, description } = req.params;
    const creator = req.user;

    if (validator.isNull(title)) {
        return callback('ERROR_TITLE_MISSING');
    }
    if (validator.isNull(description)) {
        return callback('ERROR_DESCRIPTION_MISSING');
    }

    async.series([
        function (cb) {
            Module
                .findOne()
                .where({ title: title })
                .exec((err, data) => {
                    if (err) {
                        cb(err);
                    }
                    if (data) {
                        cb('ERROR_MODULE_EXIST');
                    }
                    else cb();
                })
        },
        function (cb) {
            let newModule = new Module({
                title,
                description,
                creator: creator._id
            })
            newModule.save((err, result) => {
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

const updateModule = (req, returnData, callback) => {
    let { title, description, id } = req.params;

    if (validator.isNull(title)) {
        return callback('ERROR_TITLE_MISSING');
    }
    if (validator.isNull(description)) {
        return callback('ERROR_DESCRIPTION_MISSING');
    }
    if (!validator.isMongoId(id)) {
        return callback('ERROR_ID_MISSING');
    }

    Module
        .findOne()
        .where({ _id: id })
        .exec((err, result) => {
            if (err) {
                return callback(err);
            }
            if (!result) {
                return callback('ERROR_MODULE_NOT_FOUND');
            }
            else {
                utils.merge(result, { title, description });
                result.save(function (error, data) {
                    if (error) return callback(error);
                    returnData.set(data);
                    callback();
                });
            }
        })
}

const deleteModule = (req, returnData, callback) => {
    let { id } = req.params;

    if (validator.isNull(id)) {
        return callback('ERROR_ID_MISSING');
    }

    Module
    .update({
        _id: id
    },{
        $set: {
            is_delete: true
        }
    }, (err, data) => {
        if(err) return callback(err);
        callback();
    })
}

exports.deleteModule = deleteModule;
exports.listModules = listModules;
exports.addModule = addModule;
exports.getModule = getModule;
exports.updateModule = updateModule;