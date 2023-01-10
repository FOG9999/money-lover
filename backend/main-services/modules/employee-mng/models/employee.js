'use strict';

var Schema = require('mongoose').Schema,
    ObjectId = Schema.ObjectId,
    businessDb = require(__db_path + '/business-db'),
    crypto = require('crypto'),
    consts = require(__config_path + '/consts'),
    utils = require(__libs_path + '/utils');

let Employee = new Schema({
    user_id: {
        type: ObjectId,
        ref: "User"
    },
    employee_id: {
        type: String,
        trim: true,
        required: "ERROR_EMPLOYEE_ID_MISSING"
    },
    tax_identity_number: {
        type: String,
        trim: true,
        required: "ERROR_TAX_ID_NUMBER_MISSING"
    },
    first_working_date: {
        type: Date,
        default: Date.now
    },
    last_working_date: {
        type: Date,
        default: Date.now
    },
    work_title: {
        type: ObjectId,
        ref: "WorkTitle"
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
    department_id: {
        type: ObjectId,
        ref: "Department"
    }
});

Employee.pre('save', function(next) {
    this.dateUpdated = Date.now();
    next();
});

module.exports = systemDb.model('Employee', Employee);
