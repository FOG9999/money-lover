let Schema = require('mongoose').Schema,
ObjectId = Schema.ObjectId,
systemDb = require(__db_path + '/system-db'),
crypto = require('crypto'),
consts = require(__config_path + '/consts'),
utils = require(__libs_path + '/utils');

let ActionSchema = new Schema({
    title: {
        type: String,
        trim: true,
        required: 'ERROR_ACTION_TITLE_MISSING'
    },
    description: {
        type: String,
        max: 2000,
        required: 'ERROR_ACTION_DESCRIPTION_MISSING'
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
    dateUpdated: {
        type: Date,
        default: Date.now
    },
    moduleId: {
        type: ObjectId,
        ref: 'Module',
        default: null
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

ActionSchema.pre('save', function(next) {
    this.dateUpdated = Date.now();
    next();
})

module.exports = systemDb.model('Action', ActionSchema);