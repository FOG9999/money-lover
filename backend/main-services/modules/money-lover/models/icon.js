let Schema = require('mongoose').Schema,
ObjectId = Schema.ObjectId,
systemDb = require(__db_path + '/system-db'),
crypto = require('crypto'),
consts = require(__config_path + '/consts'),
utils = require(__libs_path + '/utils');

let IconSchema = new Schema({
    code: {
        type: String,
        required: 'ERROR_ICON_CODE_MISSING'
    },
    path: {
        type: String,
        trim: true,
        required: 'ERROR_ICON_PATH_MISSING'
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
        ref: "User",
        required: 'ERROR_ICON_USER_MISSING'
    },
});

IconSchema.pre('save', function(next) {
    this.dateUpdated = Date.now();
    next();
})

module.exports = systemDb.model('Icon', IconSchema);