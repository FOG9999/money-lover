const Role = require('../models/role');
const validator = require('validator');
const async = require('async');

const listRoles = (req, returnData, callback) => {
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

    Role
        .find()
        .where(query)
        .exec((err, results) => {
            if (err) return callback(err);
            returnData.set(results);
            callback();
        })
}

const getRole = (req, returnData, callback) => {
    let id = req.params.id;

    Role
        .findOne({ _id: id })
        .exec((err, data) => {
            if (err) return callback(err);
            if (!data) return callback('ERROR_ROLE_NOT_FOUND');
            returnData.set(data);
            callback();
        })
}

const addRole = (req, returnData, callback) => {
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
            Role
                .findOne()
                .where({ title: title })
                .exec((err, data) => {
                    if (err) {
                        cb(err);
                    }
                    if (data) {
                        cb('ERROR_ROLE_EXIST');
                    }
                    else cb();
                })
        },
        function (cb) {
            let newRole = new Role({
                title,
                description,
                creator: creator._id
            })
            newRole.save((err, result) => {
                if (err) cb(err);
                else {
                    cb(null, result);
                }
            })
        }
    ], (err, data) => {
        if (err) return callback(err);
        returnData.set(data[1]);
        callback();
    })

}

const updateRole = (req, returnData, callback) => {
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

    Role
        .findOne()
        .where({ _id: id })
        .exec((err, result) => {
            if (err) {
                return callback(err);
            }
            if (!result) {
                return callback('ERROR_ROLE_NOT_FOUND');
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

const deleteRole = (req, returnData, callback) => {
    let { id } = req.params;

    if (validator.isNull(id)) {
        return callback('ERROR_ID_MISSING');
    }

    Role
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

exports.deleteRole = deleteRole;
exports.listRoles = listRoles;
exports.addRole = addRole;
exports.getRole = getRole;
exports.updateRole = updateRole;