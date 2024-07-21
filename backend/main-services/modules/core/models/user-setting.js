const winstonLogger = require('../../../../libs/winston');

let Schema = require('mongoose').Schema,
ObjectId = Schema.ObjectId,
systemDb = require(__db_path + '/system-db'),
consts = require(__config_path + '/consts');

let UserSettingSchema = new Schema({
    user: {
        type: ObjectId,
        ref: "User"
    },
    navPos: {
        type: String,
        default: 'side'
    },
    dir: {
        type: String,
        default: 'ltr'
    },
    theme: {
        type: String,
        default: 'light'
    },
    showHeader: {
        type: Boolean,
        default: true
    },
    headerPos: {
        type: String,
        default: 'fixed'
    },
    showUserPanel: {
        type: Boolean,
        default: true
    },
    sidenavOpened: {
        type: Boolean,
        default: true
    },
    sidenavCollapsed: {
        type: Boolean,
        default: false
    },
    language: {
        type: String,
        default: 'en-US'
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
    dateUpdated: {
        type: Date,
        default: Date.now
    },
})

UserSettingSchema.pre('save', function(next) {
    this.dateUpdated = Date.now();
    next();
})

UserSettingSchema.pre('findOneAndUpdate', function(next) {
    try {        
        this._update.$set.dateUpdated = Date.now();
    } catch (error) {
        winstonLogger.error('Pre hook findOneAndUpdate failed. ', error);
    }
    next();
})

module.exports = systemDb.model('UserSetting', UserSettingSchema);