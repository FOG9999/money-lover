let Schema = require('mongoose').Schema,
ObjectId = Schema.ObjectId,
systemDb = require(__db_path + '/system-db'),
crypto = require('crypto'),
consts = require(__config_path + '/consts'),
utils = require(__libs_path + '/utils');

let CategorySchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: 'ERROR_CATEGORY_NAME_MISSING'
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
        required: 'ERROR_CATEGORY_USER_MISSING'
    },
    icon: {
        type: ObjectId,
        ref: "Icon",
        required: 'ERROR_CATEGORY_ICON_MISSING'
    },
    transactionType: {
        type: Number, // 0 - outcome, 1 - income
        required: 'ERROR_TYPE_MISSING'
    }
});

CategorySchema.pre('save', function(next) {
    this.dateUpdated = Date.now();
    next();
})

module.exports = systemDb.model('Category', CategorySchema);