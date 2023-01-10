'use strict';

var Schema = require('mongoose').Schema,
    ObjectId = Schema.ObjectId,
    businessDb = require(__db_path + '/business-db'),
    crypto = require('crypto'),
    consts = require(__config_path + '/consts'),
    utils = require(__libs_path + '/utils');

let EmployeeGrade = new Schema({
    employee: {
        type: ObjectId,
        ref: "Employee"
    },
    grade: {
        type: String,
        max: 2,
        required: "ERROR_GRADE_MISSING"
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
})

EmployeeGrade.pre('save', function(next) {
    this.dateUpdated = Date.now();
    next();
})

module.exports = systemDb.model('EmployeeGrade', EmployeeGrade);