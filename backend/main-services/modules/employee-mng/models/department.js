'use strict';

var Schema = require('mongoose').Schema,
    ObjectId = Schema.ObjectId,
    businessDb = require(__db_path + '/business-db'),
    crypto = require('crypto'),
    consts = require(__config_path + '/consts'),
    utils = require(__libs_path + '/utils');

let Department = new Schema({
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
    leader: {
        type: ObjectId,
        ref: "Employee"
    },
    department_parent: {
        type: ObjectId,
        ref: "Department",
        default: null
    }
})

Department.pre('save', function(next) {
    this.dateUpdated = Date.now();
    next();
});

module.exports = systemDb.model('Department', Department);