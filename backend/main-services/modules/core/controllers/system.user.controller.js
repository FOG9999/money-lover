let mongoose = require('mongoose'),
    dataDb = require(__db_path + '/system-db'),
    ObjectId = mongoose.Types.ObjectId,
    User = require('../models/user'),
    utils = require(__libs_path + '/utils'),
    _ = require('lodash'),
    async = require('async'),
    restify = require('restify'),
    moment = require('moment'),
    validator = require('validator'),
    consts = require(__config_path + '/consts');
const redis = require('../../../../libs/redis');

const list = (req, returnData, callback) => {

}

const login = (req, returnData, callback) => {
    let { username, password } = req.params;

    // validate input
    if (validator.isNull(username))
        return callback('ERROR_USERNAME_MISSING');
    if (validator.isNull(password))
        return callback('ERROR_PASSWORD_MISSING');

    let userQuery = {
        username
    }

    User
        .findOne()
        .where(userQuery)
        .populate('role')
        .exec((err, user) => {
            if (err) {
                return callback(err);
            }
            if (!user) {
                return callback('ERROR_USERNAME_PASSWORD_INCORRECT');
            }
            else {
                if (user.status === 0) {
                    return callback('ERROR_USER_LOCK');
                }
                else if (!user.authenticate(password)) {
                    return callback('ERROR_PASSWORD_INCORRECT')
                }
                else {
                    if (validator.isNull(user.token)) {
                        user.token = utils.randomstring(50) + ObjectId().toString().replace('-', '');
                    }
                    user.save((err, result) => {
                        if (err) {
                            return callback(err);
                        }
                        // set model để module khác dùng lại
                        returnData.model = result;

                        // convert từ model sang object
                        var jsonData = result.toObject();

                        // xóa đi trường hashed_password
                        delete jsonData.hashed_password;
                        delete jsonData.salt;

                        var cacheUser = {
                            _id: jsonData._id,
                            token: jsonData.token,
                            fullname: jsonData.firstname + ' ' + jsonData.lastname,
                            username: jsonData.username,
                            avatar: jsonData.avatar,
                            level: jsonData.level,
                            // role: jsonData.role.title
                        };

                        // lưu memcache
                        redis.HSET(consts.redis_key.user, cacheUser.token, JSON.stringify(cacheUser), function (err) {
                            if (err) {
                                return callback(err);
                            }
                            // set data api trả về
                            returnData.data = jsonData;
                            // callback kết thúc api
                            callback();
                        });
                    })
                }
            }
        })
}

const checkEmailExist = (req, returnData, callback) => {
    let email = req.params.email;

    if (validator.isNull(email))
        return callback('ERROR_EMAIL_MISSING');

    User.findOne()
        .where({
            email: email
        })
        .exec((err, data) => {
            if (err) return callback(err);
            // trả về lỗi nếu mã cửa hàng không tồn tại
            if (data)
                return callback('ERROR_EMAIL_EXISTS');
            callback();
        });
}

const getUser = (req, returnData, callback) => {
    var user = req.user;
    User.findOne()
        .where({
            _id: user._id
        })
        .select('-hashed_password -salt')
        .exec(function (err, data) {
            if (err) return callback(err);
            if (!data) {
                return callback('ERROR_USER_NOT_EXISTS');
            } else {
                returnData.set(data);
                return callback();
            }
        });
};

const changePassword = (req, returnData, callback) => {
    var user = req.user;
    var old_pass = req.params.old_pass;
    var new_pass = req.params.new_pass;

    if (validator.isNull(old_pass))
        return callback('ERROR_OLD_PASS_MISSING');
    if (validator.isNull(new_pass))
        return callback('ERROR_NEW_PASS_MISSING');

    User.findOne()
        .where({
            _id: user._id
        })
        .exec(function (err, user) {
            if (err) return callback(err);
            if (user) {
                if (!user.authenticate(old_pass)) { // check password is correct?
                    return callback('ERROR_PASSWORD_NOT_CORRECT');
                } else {
                    // change password
                    user.password = new_pass;
                    user.save(function (err) {
                        if (err) return callback(err);
                        callback();
                    });
                }
            } else {
                return callback('ERROR_USER_NOT_EXISTS');
            }
        });
};

// const resetPassword = (req, returnData, callback) => {
//     var email = req.params.email;

//     if (validator.isNull(email))
//         return callback('ERROR_EMAIL_MISSING');
//     if (validator.isNull(store_code))
//         return callback('ERROR_STORE_CODE_MISSING');

//     User
//         .findOne()
//         .where({
//             email: email.toLowerCase(),
//             store: store_code,
//             level: consts.user_level.shopkeeper
//         })
//         .populate('store', 'name')
//         .exec(function (err, user) {
//             if (err) return callback(err);
//             if (user && user.store) {
//                 var password = utils.randomstring(8);
//                 user.password = password;
//                 user.save(function (err) {
//                     if (err) return callback(err);

//                     // Gửi email và cập nhập lại trạng thái gửi email nếu thành công
//                     OtherList
//                         .findOne({
//                             type: 'mail_template',
//                             code: 'reset_password_cms'
//                         })
//                         .exec(function (err, temp) {
//                             var mail_info = {
//                                 email: email,
//                                 fullname: user.fullname,
//                                 store_code: store_code,
//                                 store_link: utils.getBackendDomain(store_code),
//                                 store_name: user.store.name,
//                                 username: user.username,
//                                 password: password
//                             };
//                             if (temp) {
//                                 var mailOptions = JSON.parse(temp.extra_value);
//                                 mailOptions.mail_info = mail_info;
//                                 mailOptions.to = email;
//                                 utils.sendMail2(mailOptions);
//                             }
//                         });
//                     callback();
//                 });
//             } else {
//                 return callback('ERROR_USER_NOT_EXISTS');
//             }
//         });
// };

const deactivateUser = (req, returnData, callback) => {
    let { id } = req.params;

    if (validator.isNull(id)) {
        return callback('ERROR_ID_MISSING');
    }

    User
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

const createUser = (req, returnData, callback) => {
    let {
        username,
        firstname,
        lastname,
        email,
        password
    } = req.params;

    if(validator.isNull(username)){
        return callback('ERROR_USERNAME_MISSING');
    }
    if(validator.isNull(password)){
        return callback('ERROR_PASSWORD_MISSING');
    }
    if(validator.isNull(email)){
        return callback('ERROR_EMAIL_MISSING');
    }
    if(validator.isNull(firstname)){
        return callback('ERROR_FIRSTNAME_MISSING');
    }
    if(validator.isNull(lastname)){
        return callback('ERROR_LASTNAME_MISSING');
    }

    let query = {
        "$or": [
            {
                username: username
            },
            {
                email: email
            }
        ]
    }

    User
    .findOne()
    .where(query)
    .exec((err, data) => {
        if(err){
            return callback(err);
        }
        if(data){
            return callback('ERROR_USER_EXIST');
        }

        let newUser = new User();
        utils.merge(newUser, {username, firstname, lastname, email, password});
        newUser.token = utils.randomstring(50) + ObjectId().toString().replace('-', '');
        newUser.level = consts.user_roles.SYSTEM_USER;
        newUser.save((err1, result) => {
            if(err1){
                return callback(err1);
            }
            returnData.set(result);
            callback();
        })
    })
}

exports.deactivateUser = deactivateUser;
// exports.list = list;
exports.checkEmailExist = checkEmailExist;
exports.login = login;
exports.getUser = getUser;
exports.changePassword = changePassword;
exports.createUser = createUser;
