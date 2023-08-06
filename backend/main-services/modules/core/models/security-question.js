'use strict';

var Schema = require('mongoose').Schema,
    ObjectId = Schema.ObjectId,
    systemDb = require(__db_path + '/system-db'),
    crypto = require('crypto'),
    consts = require(__config_path + '/consts'),
    utils = require(__libs_path + '/utils');

const SecurityQuestionSchema = new Schema({
    question: {
        type: String,
        required: 'ERROR_QUESTION_REQUIRED'
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
    dateUpdated: {
        type: Date,
        default: Date.now
    },
    isDelete: {
        type: Boolean,
        default: false
    },
    creator: {
        type: ObjectId,
        ref:     "User"
    }
}, consts.schemaOptions)

/**
 * Pre-save hook
 */
SecurityQuestionSchema.pre('save', function(next) {
    this.dateUpdated = Date.now();
    next();
});

exports = module.exports = systemDb.model('SecurityQuestion', SecurityQuestionSchema);