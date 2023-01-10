'use strict';

let Schema = require('mongoose').Schema,
ObjectId = Schema.ObjectId,
businessDb = require(__db_path + '/business-db'),
crypto = require('crypto'),
consts = require(__config_path + '/consts'),
utils = require(__libs_path + '/utils');

let SalaryStep = new Schema({
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
    },
    income: {
        type: Number,
        required: "ERROR_INCOME_MISSING"
    },
    salary_level: {
        type: ObjectId,
        ref: "SalaryLevel"
    }
});

SalaryStep.pre('save', function(next) {
    this.dateUpdated = Date.now();
    next();
});

module.exports = systemDb.model('SalaryStep', SalaryStep);