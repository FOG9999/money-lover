let Schema = require('mongoose').Schema,
ObjectId = Schema.ObjectId,
systemDb = require(__db_path + '/system-db'),
crypto = require('crypto'),
consts = require(__config_path + '/consts'),
utils = require(__libs_path + '/utils');

let WalletSchema = new Schema({
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
    amount: {
        type: Number,
        required: 'ERROR_WALLET_AMOUNT_MISSING'
    },
    walletType: {
        type: ObjectId,
        ref: "WalletType",
        required: 'ERROR_WALLET_WALLETTYPE_MISSING'
    },
    includeInTotal: {
        type: Number,
        default: 1
    },
    user: {
        type: ObjectId,
        ref: "User"        
    }
});

WalletSchema.pre('save', function(next) {
    this.dateUpdated = Date.now();
    next();
})

module.exports = systemDb.model('Wallet', WalletSchema);