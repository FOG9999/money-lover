const Role = require('../models/role');
const validator = require('validator');
const async = require('async');
const consts = require('../../../../config/consts');

const listRoles = (req, returnData, callback) => {
    const { search, status, page, size } = req.params;

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
    if (validator.isNull(page)) {
        page = 0;
    }
    if (validator.isNull(size)) {
        size = consts.page_size;
    }

    Role
        .find()
        .where(query)
        .sort({dateCreated: -1})
        .skip(page*size)
        .limit(size)
        .exec((err, results) => {
            if (err) return callback(err);
            // calculate count
            Role.aggregate([{
                $match: query
            }, {
                $count: "total"
            }])
            .exec((errCount, result) => {
                if(errCount){
                    return callback(errCount);
                }
                returnData.set({results, total: result[0] ? result[0].total: 0});
                callback();
            })
        })
}

const getRole = (req, returnData, callback) => {
    let id = req.params.id;

    Role
        .findOne({ _id: id })
        .exec((err, data) => {
            if (err) return callback(err);
            if (!data) return callback(consts.ERRORS.ERROR_ROLE_NOT_FOUND);
            returnData.set(data);
            callback();
        })
}

const addRole = (req, returnData, callback) => {
    const { title, description, code } = req.params;
    const creator = req.user;

    if (validator.isNull(title)) {
        return callback(consts.ERRORS.ERROR_TITLE_MISSING);
    }
    if (validator.isNull(code)) {
        return callback(consts.ERRORS.ERROR_CODE_MISSING);
    }
    if (validator.isNull(description)) {
        return callback(consts.ERRORS.ERROR_DESCRIPTION_MISSING);
    }

    async.series([
        function (cb) {
            Role
                .findOne()
                .where({ code: code })
                .exec((err, data) => {
                    if (err) {
                        cb(err);
                    }
                    if (data) {
                        cb(consts.ERRORS.ERROR_ROLE_EXIST);
                    }
                    else cb();
                })
        },
        function (cb) {
            let newRole = new Role({
                title,
                code,
                description,
                userCreated: creator._id
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
    let { title, description, id, status, code } = req.params;

    if (validator.isNull(title)) {
        return callback(consts.ERRORS.ERROR_TITLE_MISSING);
    }
    if (validator.isNull(code)) {
        return callback(consts.ERRORS.ERROR_CODE_MISSING);
    }
    if (validator.isNull(description)) {
        return callback(consts.ERRORS.ERROR_DESCRIPTION_MISSING);
    }
    if (!validator.isMongoId(id)) {
        return callback(consts.ERRORS.ERROR_ID_MISSING);
    }

    Role
        .findOne()
        .where({ _id: id })
        .exec((err, result) => {
            if (err) {
                return callback(err);
            }
            if (!result) {
                return callback(consts.ERRORS.ERROR_ROLE_NOT_FOUND);
            }
            else {
                utils.merge(result, { title, description, code, status: status ? 1: 0 });
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
        return callback(consts.ERRORS.ERROR_ID_MISSING);
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