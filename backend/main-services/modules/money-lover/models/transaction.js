let Schema = require('mongoose').Schema,
ObjectId = Schema.ObjectId,
systemDb = require(__db_path + '/system-db'),
crypto = require('crypto'),
consts = require(__config_path + '/consts'),
utils = require(__libs_path + '/utils');

let TransactionSchema = new Schema({
    amount: {
        type: Number,
        required: 'ERROR_TRANSACTION_AMOUNT_MISSING'
    },
    budget: {
        type: ObjectId,
        ref: "Budget",
        default: null
    },
    category: {
        type: ObjectId,
        ref: "Category",
        required: 'ERROR_TRANSACTION_CATEGORY_MISSING'
    },
    wallet: {
        type: ObjectId,
        ref: "Wallet",
        required: 'ERROR_TRANSACTION_WALLET_MISSING'
    },
    dateCreated: {
        type: Date,
        default: Date.now()
    },
    dateUpdated: {
        type: Date,
        default: Date.now()
    },
    isDelete: {
        type: Boolean,
        default: false
    },
    note: {
        type: String,        
        default: "",
        trim: true
    },
    user: {
        type: ObjectId,
        ref: "User",
        required: 'ERROR_TRANSACTION_USER_MISSING'
    }
});

TransactionSchema.pre('save', function(next) {
    this.dateUpdated = Date.now();
    next();
})

module.exports = systemDb.model('Transaction', TransactionSchema);