let Schema = require('mongoose').Schema,
ObjectId = Schema.ObjectId,
systemDb = require(__db_path + '/system-db'),
crypto = require('crypto'),
consts = require(__config_path + '/consts'),
utils = require(__libs_path + '/utils');

let WalletTypeSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: 'ERROR_WALLETTYPE_NAME_MISSING'
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
    isDefault: {
        type: Number,        
        default: 1,
    },
    creator: {
        type: ObjectId,
        ref: "User",
        required: 'ERROR_WALLETTYPE_USER_MISSING'
    },
    icon: {
        type: ObjectId,
        ref: "Icon",
        required: 'ERROR_WALLETTYPE_ICON_MISSING'
    }
});

WalletTypeSchema.pre('save', function(next) {
    this.dateUpdated = Date.now();
    next();
})

module.exports = systemDb.model('WalletType', WalletTypeSchema);