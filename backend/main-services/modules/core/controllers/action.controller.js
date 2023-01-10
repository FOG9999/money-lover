const Action = require('../models/action');
const validator = require('validator');
const async = require('async');

const listActions = (req, returnData, callback) => {
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

    Action
        .find()
        .where(query)
        .exec((err, results) => {
            if (err) return callback(err);
            returnData.set(results);
            callback();
        })
}

const getAction = (req, returnData, callback) => {
    let id = req.params.id;

    Action
        .findOne({ _id: id })
        .exec((err, data) => {
            if (err) return callback(err);
            if (!data) return callback('ERROR_ACTION_NOT_FOUND');
            returnData.set(data);
            callback();
        })
}

const addAction = (req, returnData, callback) => {
    const { title, description, moduleId } = req.params;
    const creator = req.user;

    if (validator.isNull(title)) {
        return callback('ERROR_TITLE_MISSING');
    }
    if (validator.isNull(description)) {
        return callback('ERROR_DESCRIPTION_MISSING');
    }

    async.series([
        function (cb) {
            Action
                .findOne()
                .where({ title: title })
                .exec((err, data) => {
                    if (err) {
                        cb(err);
                    }
                    if (data) {
                        cb('ERROR_ACTION_EXIST');
                    }
                    else cb();
                })
        },
        function (cb) {
            let newAction = new Action({
                title,
                description,
                moduleId,
                creator: creator._id
            })
            newAction.save((err, result) => {
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

const updateAction = (req, returnData, callback) => {
    let { title, description, id, moduleId } = req.params;

    if (validator.isNull(title)) {
        return callback('ERROR_TITLE_MISSING');
    }
    if (validator.isNull(description)) {
        return callback('ERROR_DESCRIPTION_MISSING');
    }
    if (validator.isNull(moduleId)) {
        return callback('ERROR_MODULE_MISSING');
    }
    if (!validator.isMongoId(id)) {
        return callback('ERROR_ID_MISSING');
    }

    Action
        .findOne()
        .where({ _id: id })
        .exec((err, result) => {
            if (err) {
                return callback(err);
            }
            if (!result) {
                return callback('ERROR_ACTION_NOT_FOUND');
            }
            else {
                utils.merge(result, { title, description, moduleId });
                result.save(function (error, data) {
                    if (error) return callback(error);
                    returnData.set(data);
                    callback();
                });
            }
        })
}

const deleteAction = (req, returnData, callback) => {
    let { id } = req.params;

    if (validator.isNull(id)) {
        return callback('ERROR_ID_MISSING');
    }

    Action
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

exports.deleteAction = deleteAction;
exports.listActions = listActions;
exports.addAction = addAction;
exports.getAction = getAction;
exports.updateAction = updateAction;