const SecurityQuestion = require('../models/security-question');
const validator = require('validator');
const async = require('async');
const bcrypt = require('bcrypt');
const consts = require('../../../../config/consts');
const UserSecurityQuestion = require('../models/user-security-question');

const listSecurityQuestions = (req, returnData, callback) => {
    const { search, isDelete } = req.params;

    const query = {
        question: new RegExp(search, 'i')
    };
    if (!validator.isNull(isDelete)) {
        query['isDelete'] = isDelete;
    }

    SecurityQuestion
        .find()
        .where(query)
        .exec((err, results) => {
            if (err) return callback(err);
            returnData.set(results);
            callback();
        })
}

const getSecurityQuestion = (req, returnData, callback) => {
    let id = req.params._id;

    SecurityQuestion
        .findOne({ _id: id })
        .exec((err, data) => {
            if (err) return callback(err);
            if (!data) return callback('ERROR_QUESTION_NOT_FOUND');
            returnData.set(data);
            callback();
        })
}

const addSecurityQuestion = (req, returnData, callback) => {
    const { question } = req.params;
    const creator = req.user;

    if (validator.isNull(question)) {
        return callback('ERROR_QUESTION_CONTENT_MISSING');
    }

    async.series([
        function (cb) {
            SecurityQuestion
                .findOne()
                .where({ question: question })
                .exec((err, data) => {
                    if (err) {
                        cb(err);
                    }
                    if (data) {
                        cb('ERROR_QUESTION_EXIST');
                    }
                    else cb();
                })
        },
        function (cb) {
            let newSecurityQuestion = new SecurityQuestion({
                question,
                creator: creator._id
            })
            newSecurityQuestion.save((err, result) => {
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

const updateSecurityQuestion = (req, returnData, callback) => {
    let { _id, question } = req.params;

    if (validator.isNull(question)) {
        return callback('ERROR_QUESTION_CONTENT_MISSING');
    }
    if (!validator.isMongoId(_id)) {
        return callback('ERROR_ID_MISSING');
    }

    checkIfQuestionCanBeModified(_id, canBeModified => {
        if (canBeModified) {
            SecurityQuestion
                .findOne()
                .where({ _id })
                .exec((err, result) => {
                    if (err) {
                        return callback(err);
                    }
                    if (!result) {
                        return callback('ERROR_QUESTION_NOT_FOUND');
                    }
                    else {
                        utils.merge(result, { question });
                        result.save(function (error, data) {
                            if (error) return callback(error);
                            returnData.set(data);
                            callback();
                        });
                    }
                })
        }
        else {
            return callback("ERROR_QUESTION_CANNOT_BE_MODIFIED");
        }
    })
}

const checkIfQuestionCanBeModified = (id, callback) => {
    UserSecurityQuestion.findOne({
        question: id
    }, (err, result) => {
        if (err) {
            callback(true);
        }
        else {
            callback(false);
        }
    })
}

const deleteSecurityQuestion = (req, returnData, callback) => {
    let id = req.params._id;

    if (validator.isNull(id)) {
        return callback('ERROR_ID_MISSING');
    }
    checkIfQuestionCanBeModified(id, canBeModified => {
        if (canBeModified) {
            SecurityQuestion
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
        else {
            return callback("ERROR_QUESTION_CANNOT_BE_MODIFIED");
        }
    })
}

const cleanOldUserQues = (userId, callback) => {
    UserSecurityQuestion.deleteMany({ user: userId }, (err, result) => {
        callback(err, result);
    });
}

const handleUserAnswerQuestion = (req, returnData, callback) => {
    let { questions, answers } = req.params;
    const user = req.user;
    cleanOldUserQues(user._id, (err, delRes) => {
        if (err) {
            return callback("ERROR_DELETE_OLD_USER_QUESTION")
        }
        let answerHashes = answers.map(ans => {
            return bcrypt.hashSync(ans, consts.saltRounds);
        });
        const models = answerHashes.map((hash, ind) => {
            let newUserQuesAns = new UserSecurityQuestion({
                question: questions[ind],
                user: user._id,
                answer: hash
            });
            return newUserQuesAns;
        });
        UserSecurityQuestion.insertMany(models, (err, result) => {
            if (err) {
                // delete whatever were inserted
                cleanOldUserQues(user._id, (err, delRes2) => {
                    if (err) {
                        return callback("ERROR_DEL_WHEN_INSERT_USER_QUESTION");
                    }
                    return callback("ERROR_INSERT_USER_QUESTION")
                })
                return;
            }
            returnData.set(result);
            callback();
        })
    })
}

exports.deleteSecurityQuestion = deleteSecurityQuestion;
exports.listSecurityQuestions = listSecurityQuestions;
exports.addSecurityQuestion = addSecurityQuestion;
exports.getSecurityQuestion = getSecurityQuestion;
exports.updateSecurityQuestion = updateSecurityQuestion;
exports.handleUserAnswerQuestion = handleUserAnswerQuestion;