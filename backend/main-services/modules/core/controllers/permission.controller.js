const Permission = require('../models/permission');
const ModuleAction = require('../models/module-action');
const validator = require('validator');
const async = require('async');
const consts = require('../../../../config/consts');
const { merge } = require('../../../../libs/utils');

const listPermissions = (req, returnData, callback) => {
    let { search, status, page, size, is_delete } = req.params;

    const query = {
        $or: [{
            title: new RegExp(search, 'i')
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

    Permission
        .find()
        .where(query)
        .sort({dateCreated: -1})
        .skip(page*size)
        .limit(size)
        .populate('role')
        .populate({
            path: 'moduleAction',
            populate: [
                {
                    path: "module"
                },
                {
                    path: "action"
                }
            ]
        })
        .exec((err, results) => {
            if (err) return callback(err);
            // calculate count
            Permission.aggregate([{
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

const getPermission = (req, returnData, callback) => {
    let id = req.params.id;

    Permission
        .findOne({ _id: id })
        .populate('role')
        .populate({
            path: 'moduleAction',
            populate: [
                {
                    path: "module"
                },
                {
                    path: "action"
                }
            ]
        })
        .exec((err, data) => {
            if (err) return callback(err);
            if (!data) return callback(consts.ERRORS.ERROR_PERMISSION_NOT_FOUND);
            returnData.set(data);
            callback();
        })
}

const addPermission = (req, returnData, callback) => {
    const { title, description, code, role, allow, moduleAction } = req.params;
    const creator = req.user;

    if (validator.isNull(title)) {
        return callback(consts.ERRORS.ERROR_TITLE_MISSING);
    }
    if (validator.isNull(code)) {
        return callback(consts.ERRORS.ERROR_CODE_MISSING);
    }
    if (!validator.isMongoId(role)) {
        return callback(consts.ERRORS.ERROR_PERMISSION_ROLE_MISSING);
    }
    if (!validator.isBoolean(allow)) {
        return callback(consts.ERRORS.ERROR_PERMISSION_ALLOW_MISSING);
    }
    if (validator.isNull(moduleAction) || !Array.isArray(moduleAction)) {
        return callback(consts.ERRORS.ERROR_PERMISSION_MODULE_ACTION_MISSING);
    }

    async.series([
        function (cb) {
            Permission
                .findOne()
                .where({ code, is_delete: false })
                .exec((err, data) => {
                    if (err) {
                        cb(err);
                    }
                    if (data) {
                        cb(consts.ERRORS.ERROR_PERMISSION_EXIST);
                    }
                    else cb();
                })
        },
        function (cb) {
            let newModuleActions = moduleAction.map(ma => {
                let newModuleAction = new ModuleAction({
                    module: ma.module,
                    action: ma.action,
                    dateCreated: new Date(),
                    userCreated: creator._id
                })
                return newModuleAction;
            })
            ModuleAction.insertMany(newModuleActions, (err, result) => {
                if (err) cb(err);
                else {
                    cb(null, result); // [{moduleAction}]
                }
            })
        }
    ], (err, data) => {
        if (err) return callback(err);
        let newPermission = new Permission({
            title,
            description,
            code,
            creator: creator._id,
            role,
            allow,
            status: 1,
            moduleAction: data[1].map(ma => ma._id)
        })
        newPermission.save((err, result) => {
            if (err) cb(err);
            else {
                returnData.set(result);
                callback();
            }
        })
        
    })

}

// const updatePermission = (req, returnData, callback) => {
//     let { title, description, _id, status, code } = req.params;

//     if (validator.isNull(title)) {
//         return callback(consts.ERRORS.ERROR_TITLE_MISSING);
//     }
//     if (validator.isNull(code)) {
//         return callback(consts.ERRORS.ERROR_CODE_MISSING);
//     }
//     if (!validator.isMongoId(_id)) {
//         return callback(consts.ERRORS.ERROR_ID_MISSING);
//     }

//     Permission
//         .findOne()
//         .where({ _id })
//         .exec((err, result) => {
//             if (err) {
//                 return callback(err);
//             }
//             if (!result) {
//                 return callback(consts.ERRORS.ERROR_permission_NOT_FOUND);
//             }
//             else {
//                 merge(result, { title, description, code, status: status ? 1: 0 });
//                 result.save(function (error, data) {
//                     if (error) return callback(error);
//                     returnData.set(data);
//                     callback();
//                 });
//             }
//         })
// }

// const deletePermission = (req, returnData, callback) => {
//     let { ids } = req.params;
//     if (validator.isNull(ids)) {
//         return callback(consts.ERRORS.ERROR_IDS_MISSING);
//     }
//     if(!Array.isArray(ids)){
//         return callback(consts.ERRORS.ERROR_IDS_NOT_ARRAY)
//     }

//     Permission
//     .updateMany({
//         _id: {
//             $in: ids
//         }
//     }, {
//         $set: {
//             is_delete: true,
//             dateDeleted: new Date(),
//             status: 0
//         }
//     }, (err, data) => {
//         if (err) return callback(err);
//         returnData.set(data)
//         callback();
//     })
// }

// const changeStatusPermission = (req, returnData, callback) => {
//     let { ids, status } = req.params;
//     if (validator.isNull(ids)) {
//         return callback(consts.ERRORS.ERROR_IDS_MISSING);
//     }
//     if(!Array.isArray(ids)){
//         return callback(consts.ERRORS.ERROR_IDS_NOT_ARRAY)
//     }
//     if(status !== 0 && status !== 1){
//         return callback(consts.ERRORS.ERROR_STATUS_INVALID)
//     }

//     Permission
//     .updateMany({
//         _id: {
//             $in: ids
//         }
//     }, {
//         $set: {
//             status,
//             dateUpdated: new Date()
//         }
//     }, (err, data) => {
//         if (err) return callback(err);
//         returnData.set({...data})
//         callback();
//     })
// }

// exports.deletePermission = deletePermission;
exports.listPermissions = listPermissions;
exports.addPermission = addPermission;
exports.getPermission = getPermission;
// exports.updatePermission = updatePermission;
// exports.changeStatusPermission = changeStatusPermission;