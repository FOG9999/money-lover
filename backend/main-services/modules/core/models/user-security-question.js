'use strict';

var Schema = require('mongoose').Schema,
    ObjectId = Schema.ObjectId,
    systemDb = require(__db_path + '/system-db'),
    crypto = require('crypto'),
    consts = require(__config_path + '/consts'),
    utils = require(__libs_path + '/utils');

const UserSecurityQuestionSchema = new Schema({
    user: {
        type: ObjectId,
        ref: "User"
    },
    question: {
        type: ObjectId,
        ref: "SecurityQuestion"
    },
    answer: {
        type: String,
        required: "ERROR_ANSWER_REQUIRED"
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
    dateUpdated: {
        type: Date,
        default: Date.now
    },
    is_delete: {
        type: Boolean,
        default: false
    },
}, consts.schemaOptions)

/**
 * Pre-save hook
 */
UserSecurityQuestionSchema.pre('save', function(next) {
    this.dateUpdated = Date.now();
    next();
});

exports = module.exports = systemDb.model('UserSecurityQuestion', UserSecurityQuestionSchema);