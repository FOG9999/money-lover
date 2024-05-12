const Role = require('../models/role');
const validator = require('validator');
const async = require('async');
const consts = require('../../../../config/consts');
const { merge } = require('../../../../libs/utils');

const listRoles = (req, returnData, callback) => {
    const { search, status, page, size, is_delete } = req.params;

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
    if (validator.isNull(is_delete)) {
        query['is_delete'] = false;
    } else {
        query['is_delete'] = is_delete;
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

    async.series([
        function (cb) {
            Role
                .findOne()
                .where({ code: code, is_delete: false })
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
                userCreated: creator._id,
                status: 1
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
    let { title, description, _id, status, code } = req.params;

    if (validator.isNull(title)) {
        return callback(consts.ERRORS.ERROR_TITLE_MISSING);
    }
    if (validator.isNull(code)) {
        return callback(consts.ERRORS.ERROR_CODE_MISSING);
    }
    if (!validator.isMongoId(_id)) {
        return callback(consts.ERRORS.ERROR_ID_MISSING);
    }

    Role
        .findOne()
        .where({ _id })
        .exec((err, result) => {
            if (err) {
                return callback(err);
            }
            if (!result) {
                return callback(consts.ERRORS.ERROR_ROLE_NOT_FOUND);
            }
            else {
                merge(result, { title, description, code, status: status ? 1: 0 });
                result.save(function (error, data) {
                    if (error) return callback(error);
                    returnData.set(data);
                    callback();
                });
            }
        })
}

const deleteRole = (req, returnData, callback) => {
    let { ids } = req.params;
    if (validator.isNull(ids)) {
        return callback(consts.ERRORS.ERROR_IDS_MISSING);
    }
    if(!Array.isArray(ids)){
        return callback(consts.ERRORS.ERROR_IDS_NOT_ARRAY)
    }

    Role
    .updateMany({
        _id: {
            $in: ids
        }
    }, {
        $set: {
            is_delete: true,
            dateDeleted: new Date(),
            status: 0
        }
    }, (err, data) => {
        if (err) return callback(err);
        returnData.set(data)
        callback();
    })
}

const changeStatusRole = (req, returnData, callback) => {
    let { ids, status } = req.params;
    if (validator.isNull(ids)) {
        return callback(consts.ERRORS.ERROR_IDS_MISSING);
    }
    if(!Array.isArray(ids)){
        return callback(consts.ERRORS.ERROR_IDS_NOT_ARRAY)
    }
    if(status !== 0 && status !== 1){
        return callback(consts.ERRORS.ERROR_STATUS_INVALID)
    }

    Role
    .updateMany({
        _id: {
            $in: ids
        }
    }, {
        $set: {
            status,
            dateUpdated: new Date()
        }
    }, (err, data) => {
        if (err) return callback(err);
        returnData.set({...data})
        callback();
    })
}

exports.deleteRole = deleteRole;
exports.listRoles = listRoles;
exports.addRole = addRole;
exports.getRole = getRole;
exports.updateRole = updateRole;
exports.changeStatusRole = changeStatusRole;