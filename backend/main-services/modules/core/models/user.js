'use strict';

var Schema = require('mongoose').Schema,
    ObjectId = Schema.ObjectId,
    systemDb = require(__db_path + '/system-db'),
    crypto = require('crypto'),
    consts = require(__config_path + '/consts'),
    utils = require(__libs_path + '/utils');

/**
 * User Schema
 */
var UserSchema = new Schema({
    username: {
        type: String,
        trim: true,
        required: consts.ERRORS.ERROR_USERNAME_MISSING,
        lowercase: true
    },
    avatar: {
        type: String,
        trim: true,
        default: null
    },
    firstname: {
        type: String,
        trim: true,
        default: null,
        required: consts.ERRORS.ERROR_FIRSTNAME_MISSING
    },
    lastname: {
        type: String,
        trim: true,
        default: null,
        required: consts.ERRORS.ERROR_LASTNAME_MISSING
    },
    address: {
        type: String,
        trim: true,
        default: null
    },
    email: {
        type: String,
        trim: true,
        default: null,
        lowercase: true
    },
    mobile: {
        type: String,
        trim: true,
        default: null
    },
    status: {
        type: Number,
        default: 1
    },
    level: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        default: null
    },
    hashed_password: {
        type: String,
        trim: true
    },
    token: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
    dateUpdated: {
        type: Date,
        default: Date.now
    },
    role: {
        type: ObjectId,
        ref: 'Role',
        default: null
    },
    is_delete: {
        type: Boolean,
        default: false
    },
    authId: {
        type: String,
        default: null
    },
    /**
     * two factor authentication method - email/sms/gg-authen
     */
    tfaMethod: {
        type: String,
        default: null
    },
    /**
     * check if user having default passwords, generated when forgot password
     */
    defaultPassword: {
        type: Boolean,
        default: false
    },
    dateDeleted: {
        type: Date,
        default: null
    }
}, consts.schemaOptions);

/**
 * Index
 */
UserSchema.index({
    username: 1,
    store: 1
}, {
    unique: true
});

/**
 * Virtuals
 */
UserSchema
    .virtual('password')
    .set(function(password) {
        this.salt = utils.randomstring(20);
        this.hashed_password = this.encryptPassword(password);
    });

/**
 * Pre-save hook
 */
UserSchema.pre('save', function(next) {
    this.dateUpdated = Date.now();
    next();
});

/**
 * Methods
 */

UserSchema.methods = {

    /**
     * Authenticate - check if the passwords are the same
     *
     * @param {String} plainText
     * @param {String} salt
     * @return {Boolean}
     */
    authenticate: function(password) {
        return this.encryptPassword(password) === this.hashed_password;
    },

    /**
     * Encrypt password
     *
     * @param {String} password
     * @return {String}
     */
    encryptPassword: function(password) {
        if (!password || !this.salt) return ''
        return crypto.createHmac(consts.hash_method, this.salt).update(password).digest('hex');
    }
};

exports = module.exports = systemDb.model('User', UserSchema);
