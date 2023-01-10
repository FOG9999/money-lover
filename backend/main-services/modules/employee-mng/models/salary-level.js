'use strict';

let Schema = require('mongoose').Schema,
ObjectId = Schema.ObjectId,
businessDb = require(__db_path + '/business-db'),
crypto = require('crypto'),
consts = require(__config_path + '/consts'),
utils = require(__libs_path + '/utils');

let SalaryLevel = new Schema({
    title: {
        type: String,
        trim: true,
        required: 'ERROR_ROLE_TITLE_MISSING'
    },
    description: {
        type: String,
        max: 2000,
        required: 'ERROR_ROLE_DESCRIPTION_MISSING'
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
    dateUpdated: {
        type: Date,
        default: Date.now
    },
    userCreated: {
        type: ObjectId,
        ref: 'User'
    },
    is_delete: {
        type: Boolean,
        default: false
    }
});

SalaryLevel.pre('save', function(next) {
    this.dateUpdated = Date.now();
    next();
});

module.exports = systemDb.model('SalaryLevel', SalaryLevel);