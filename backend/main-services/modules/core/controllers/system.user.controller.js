let mongoose = require('mongoose'),
    ObjectId = mongoose.Types.ObjectId,
    User = require('../models/user'),
    utils = require(__libs_path + '/utils'),
    validator = require('validator'),
    consts = require(__config_path + '/consts');
const { sendMailPromise } = require(__libs_path + '/aws-ses');
const redis = require(__libs_path + '/redis');
const bcrypt = require('bcrypt');
const UserSecurityQuestion = require('../models/user-security-question');
const winstonLogger = require(__libs_path + '/winston');
const speakesay = require('speakeasy');
const mailTransporter = require(__libs_path + '/mailer');

const list = (req, returnData, callback) => {
    let { search, status, isDelete, page, size } = req.params;
    let query = {};
    if (!validator.isNull(status)) {
        query['status'] = status;
    }
    if (!validator.isNull(isDelete)) {
        query['status'] = isDelete;
    }
    else {
        query['is_delete'] = false;
    }
    if (validator.isNull(page)) {
        page = 0;
    }
    if (validator.isNull(size)) {
        size = consts.page_size;
    }

    query = {
        ...query,
        $and: [
            {
                $or: [
                    {
                        username: new RegExp(search, 'i')
                    },
                    {
                        firstname: new RegExp(search, 'i')
                    },
                    {
                        lastname: new RegExp(search, 'i')
                    },
                    {
                        address: new RegExp(search, 'i')
                    },
                    {
                        email: new RegExp(search, 'i')
                    },
                ]
            }
        ]
    }

    User
        .find()
        .where(query)
        .sort({ dateCreated: -1 })
        .skip(page*size)
        .limit(size)
        .exec((err, results) => {
            if (err) return callback(err);
            // calculate count
            User.aggregate([{
                $match: query
            }, {
                $count: "total"
            }])
            .exec((errCount, result) => {
                if(errCount || !result[0]){
                    return callback(errCount);
                }
                returnData.set({results, total: result[0].total});
                callback();
            })
        })
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
                    const randomKey = utils.randomstring(50) + ObjectId().toString().replace('-', '');
                    switch (user.tfaMethod) {
                        case 'email':
                            redis.SET(randomKey, user.email, errSaveRedis => {
                                if(errSaveRedis){
                                    winstonLogger.error(`Error when saving random key when login with otp by email ${user.email}:` + JSON.stringify(errSaveRedis));
                                    return callback('ERROR_SAVE_REDIS_RANDOM_KEY')
                                }
                                redis.EXPIRE(randomKey, consts.otpExpiredTime);
                                returnData.set({email: user.email, rd: randomKey});
                                callback();
                            });
                            break;                    
                        default:
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
                                setUserCache(jsonData, (err) => {
                                    if(err){
                                        return callback(err);
                                    }
                                    returnData.data = jsonData;
                                    callback();
                                })
                            })                    
                            break;
                    }
                }
            }
        })
}

/**
 * generate otp
 */
const generateOTP = (req, returnData, callback) => {
    const { email, rd } = req.params;
    redis.GET(rd, (errorGetRandom, resultEmail) => {
        if(errorGetRandom){
            winstonLogger.error(`Error while getting random key from redis: ${JSON.stringify(errorGetRandom)}`);
            return callback('ERROR_GET_RANDOM_KEY');
        }
        if(resultEmail != email){
            return callback('ERROR_EMAIL_RD_NOT_PAIRED');
        }
        User.findOne().where({email: email}).exec((errFindUser, user) => {
            if(errFindUser){
                winstonLogger.error('Error find user with email: ' + JSON.stringify(errFindUser));
                return callback('ERROR_FIND_USER_WITH_EMAIL');
            }
            if(!user){
                winstonLogger.error('Error find user with email: User not found');
                return callback('ERROR_USER_NOT_FOUND');
            }
            const secret = speakesay.generateSecret().base32;
            winstonLogger.info('test secret: ' + secret);
            redis.DEL(rd);
            const token = speakesay.totp({secret, encoding: 'base32', window: 10}); // otp is valid within +-10*30secs from now
            // save user with key = secret
            redis.SET(secret, JSON.stringify(user), (err) => {
                if (err) {
                    winstonLogger.error('Redis saved tfa key failed: '+JSON.stringify(err));
                    return callback(err);
                }
                redis.EXPIRE(secret, consts.otpExpiredTime); // expire after 5min
                // encrypt secret with token and save to redis
                const salt = Number(process.env.SALT_ENCRYPT_SECRET_OTP);
                const r = bcrypt.hashSync(secret, salt);
                redis.SET(r, JSON.stringify({secret, count: consts.maxCountOTP}));
                redis.EXPIRE(r, consts.otpExpiredTime); // expire after 5min
                returnData.set({redirect: r});
                // send token via email to user
                mailTransporter.sendMail({
                    from: process.env.MAIL_USERNAME,
                    to: user.email,
                    text: `Mã xác thực tài khoản ${user.username} của bạn là: ${token}. Xin lưu ý: Mã sẽ hết hạn trong vòng 5 phút kể từ khi được gửi đi. Cảm ơn bạn đã sử dụng hệ thống của chúng tôi.`,
                    subject: '[My ML] - Xác thực 2 lớp đăng nhập'
                }).then(() => {
                    winstonLogger.info(`TFA token sent to email: ${user.email}`);
                })
                .catch(errEmail => {
                    winstonLogger.error(`Sent tfa token failed: ${errEmail}`);
                    redis.DEL(consts.redis_key.tfa, secret);
                })
                callback();
            })
        })
    })
}

/**
 * if user use two factor authentication, use this function to check otp sent from client
 */
const checkUserTFA = (req, returnData, callback) => {
    const hashedSecret = req.params.r;
    const token = req.params.t;
    redis.GET(hashedSecret, (err, secretData) => {
        if(err){
            winstonLogger.error(`Redis error get key ${hashedSecret}: ${JSON.stringify(err)}`);
            callback('ERROR_REDIS_GET_KEY');
        }
        else {
            if(!secretData){
                callback("ERROR_REDIS_KEY_NOT_EXIST");
            }
            else {
                const {secret, count} = JSON.parse(secretData);
                const hashedCheck = bcrypt.compareSync(secret, hashedSecret);
                if(!hashedCheck){
                    return callback("ERROR_OTP_INVALID");
                }
                const isValid = speakesay.totp.verify({
                    secret, token, encoding: 'base32', window: 10
                });
                if(isValid){
                    redis.GET(secret, (errUser, userStr) => {
                        if(errUser){
                            winstonLogger.error(`Redis error get key for user ${secret}: ${JSON.stringify(errUser)}`);
                            callback('ERROR_REDIS_GET_KEY_USER');
                        }
                        else {
                            const userId = JSON.parse(userStr)._id;
                            User.findOne().where({_id: userId})
                            .exec((errGetUser, dataUser) => {
                                if (errGetUser) {
                                    winstonLogger.error('Error get user: ' + JSON.stringify(errGetUser));
                                    return callback(errGetUser);
                                }
                                if (validator.isNull(dataUser.token)) {
                                    dataUser.token = utils.randomstring(50) + ObjectId().toString().replace('-', '');
                                }
                                dataUser.save((errSave, result) => {
                                    if (errSave) {
                                        winstonLogger.error('Error save user: ' + JSON.stringify(errSave));
                                        return callback(errSave);
                                    }
                                    // set model để module khác dùng lại
                                    returnData.model = result;
                                    // convert từ model sang object
                                    var jsonData = result.toObject();
                                    redis.DEL(secret);
                                    redis.DEL(hashedSecret);
                                    setUserCache(jsonData, (err) => {
                                        if(err){
                                            return callback(err);
                                        }
                                        returnData.data = jsonData;
                                        callback();
                                    })
                                })         
                            })
                        }
                    })
                }
                else {
                    winstonLogger.error(`Wrong OTP for user ${JSON.stringify({hashedSecret, token})}`);
                    if(count == 0){
                        redis.DEL(hashedSecret);
                        redis.DEL(secret);
                        winstonLogger.error(`Max count invalid OTP for user ${JSON.stringify({hashedSecret, token})}`);
                        callback("ERROR_MAX_COUNT_INVALID_OTP");
                    }
                    else {
                        redis.SET(hashedSecret, JSON.stringify({secret, count: count - 1}));
                        callback("ERROR_OTP_INCORRECT");
                    }
                }
            }
        }
    })
}

/**
 * set User to Cache for authorization
 * @param {*} jsonData User data
 * @param {*} callback callback when finish
 */
const setUserCache = (jsonData, callback) => {
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
    };

    // lưu memcache
    redis.HSET(consts.redis_key.user, cacheUser.token, JSON.stringify(cacheUser), function (err) {
        if (err) {
            return callback(err);
        }
        callback();
    });
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

const deactivateUsers = (req, returnData, callback) => {
    let { ids } = req.params;

    if (validator.isNull(ids)) {
        return callback('ERROR_IDS_MISSING');
    }
    if(!Array.isArray(ids)){
        return callback('ERROR_IDS_NOT_ARRAY')
    }

    User
        .updateMany({
            _id: {
                $in: ids
            }
        }, {
            $set: {
                status: 0
            }
        }, (err, data) => {
            if (err) return callback(err);
            returnData.set({data})
            callback();
        })
}

const deleteUsers = (req, returnData, callback) => {
    let { ids } = req.params;

    if (validator.isNull(ids)) {
        return callback('ERROR_IDS_MISSING');
    }
    if(!Array.isArray(ids)){
        return callback('ERROR_IDS_NOT_ARRAY')
    }

    User
        .updateMany({
            _id: {
                $in: ids
            }
        }, {
            $set: {
                is_delete: true
            }
        }, (err, data) => {
            if (err) return callback(err);
            returnData.set({...data})
            callback();
        })
}

const signUp = (req, returnData, callback) => {
    let {
        username,
        firstname,
        lastname,
        email,
        password,
        level,
        questions,
        answers
    } = req.params;

    if (validator.isNull(username)) {
        return callback('ERROR_USERNAME_MISSING');
    }
    if (validator.isNull(password)) {
        return callback('ERROR_PASSWORD_MISSING');
    }
    if (validator.isNull(email)) {
        return callback('ERROR_EMAIL_MISSING');
    }
    if (validator.isNull(firstname)) {
        return callback('ERROR_FIRSTNAME_MISSING');
    }
    if (validator.isNull(lastname)) {
        return callback('ERROR_LASTNAME_MISSING');
    }
    if (validator.isNull(level)) {
        return callback('ERROR_LEVEL_MISSING');
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
            if (err) {
                return callback(err);
            }
            if (data) {
                return callback('ERROR_USER_EXIST');
            }

            let newUser = new User();
            utils.merge(newUser, { username, firstname, lastname, email, password, level });
            newUser.token = utils.randomstring(50) + ObjectId().toString().replace('-', '');
            newUser.save((err1, result) => {
                if (err1) {
                    return callback(err1);
                }
                // create questions security
                let answerHashes = answers.map(ans => {
                    return bcrypt.hashSync(ans, consts.saltRounds);
                });
                const models = answerHashes.map((hash, ind) => {
                    let newUserQuesAns = new UserSecurityQuestion({
                        question: questions[ind],
                        user: result._id,
                        answer: hash
                    });
                    return newUserQuesAns;
                });
                UserSecurityQuestion.insertMany(models, (errQuestion, resultQuestion) => {
                    let error = null;
                    if (err) {
                        error = "ERROR_INSERT_USER_QUESTION";
                    }
                    returnData.set({result, error});
                    callback();
                })
            })
        })
}

const unlockUsers = (req, returnData, callback) => {
    let { ids } = req.params;

    if (validator.isNull(ids)) {
        return callback('ERROR_IDS_MISSING');
    }
    if(!Array.isArray(ids)){
        return callback('ERROR_IDS_NOT_ARRAY')
    }

    User
        .updateMany({
            _id: {
                $in: ids
            }
        }, {
            $set: {
                status: 1
            }
        }, (err, data) => {
            if (err) return callback(err);
            returnData.set({data})
            callback();
        })
}

const createUserOAuth = (req, returnData, callback) => {
    let {
        username,
        firstname,
        lastname,
        email,
        password,
        level,
        authId
    } = req.params;

    if (validator.isNull(username)) {
        return callback('ERROR_USERNAME_MISSING');
    }
    if (validator.isNull(password)) {
        return callback('ERROR_PASSWORD_MISSING');
    }
    if (validator.isNull(email)) {
        return callback('ERROR_EMAIL_MISSING');
    }
    if (validator.isNull(firstname)) {
        return callback('ERROR_FIRSTNAME_MISSING');
    }
    if (validator.isNull(lastname)) {
        return callback('ERROR_LASTNAME_MISSING');
    }
    if (validator.isNull(level)) {
        return callback('ERROR_LEVEL_MISSING');
    }
    if (validator.isNull(authId)) {
        return callback('ERROR_AUTHID_MISSING');
    }

    let query = {
            username: username.toLowerCase(),
            authId: authId.toString()
        }

    User
        .findOne()
        .where(query)
        .exec((err, data) => {
            if (err) {
                return callback(err);
            }
            if (data) {
                const jsonData = data.toObject();
                setUserCache(jsonData, err => {
                    if (err) {
                        return callback(err);
                    }
                    if(!jsonData.status){
                        return callback("ERROR_USER_LOCK");
                    }
                    sendMailPromise([
                        'andithang.work@gmail.com'
                    ], [], 'Test SES', 'Warning login from My Money Lover', (err, resData) => {
                        if(err){
                            winstonLogger.error(JSON.stringify({
                                code: err.code,
                                message: err.message,
                            }))
                        }
                        else {
                            console.log(resData);
                        }
                    })
                    returnData.set({...jsonData});
                    callback();
                })
                return;
            }

            let newUser = new User();
            utils.merge(newUser, { username, firstname, lastname, email, password, level, authId: authId.toString() });
            newUser.token = utils.randomstring(50) + ObjectId().toString().replace('-', '');
            newUser.save((err1, result) => {
                if (err1) {
                    return callback(err1);
                }
                const jsonData = result.toObject();
                setUserCache(jsonData, err => {
                    if (err) {
                        return callback(err);
                    }
                    returnData.set({...jsonData});
                    callback();
                })
            })
        })
}

const updateUser = (req, returnData, callback) => {
    const {username, email, firstname, lastname, mobile} = req.params;
    const userId = req.user._id;

    User.findOne({ _id: userId })
        .exec((err, data) => {
            if (err) {
                return callback("ERROR_CANNOT_FIND_USER");
            }
            if (!data) {
                return callback("ERROR_USER_NOT_EXIST");
            }
            User.findOneAndUpdate({ _id: userId }, {
                $set: {
                    username: username,
                    email: email,
                    firstname: firstname,
                    lastname: lastname,
                    mobile
                }
            })
                .exec((errSave, dataSave) => {
                    if (errSave) {
                        return callback("ERROR_CANNOT_UPDATE_USER");
                    }
                    returnData.set({...dataSave._doc})
                    callback();
                })
        })
}

const encryptSessionAndUrl = (req, returnData, callback) => {
    const {url} = req.params;
    if(url.startsWith('http')){
        return callback("ERROR_URL_INVALID");
    }
    const currTime = new Date().getTime();
    const userId = req.user._id;
    const salt = Number(process.env.SALT_ENCRYPT_SESSION_URL);
    const hashedKey = bcrypt.hashSync(JSON.stringify({userId, url}), salt); // this key can only be used in 5min
    returnData.set({k: hashedKey, endTime: currTime + consts.timeKeyExpired, url });
    callback();
}

const authenticateKeyUrl = (req, returnData, callback) => {
    const {k, endTime, url} = req.params;
    if(url.startsWith('http')){
        return callback("ERROR_URL_INVALID");
    }
    if(new Date().getTime() > endTime){
        return callback("ERROR_KEY_EXPIRED");
    }
    const userId = req.user._id;
    const isValid = bcrypt.compareSync(JSON.stringify({userId, url}), k);
    returnData.set({isValid});
    callback();
}

exports.deactivateUsers = deactivateUsers;
exports.list = list;
exports.checkEmailExist = checkEmailExist;
exports.login = login;
exports.getUser = getUser;
exports.changePassword = changePassword;
exports.signUp = signUp;
exports.deleteUsers = deleteUsers;
exports.unlockUsers = unlockUsers;
exports.createUserOAuth = createUserOAuth;
exports.updateUser = updateUser;
exports.encryptSessionAndUrl = encryptSessionAndUrl;
exports.authenticateKeyUrl = authenticateKeyUrl;
exports.checkUserTFA = checkUserTFA;
exports.generateOTP = generateOTP;