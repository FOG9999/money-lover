let Schema = require('mongoose').Schema,
ObjectId = Schema.ObjectId,
systemDb = require(__db_path + '/system-db'),
consts = require(__config_path + '/consts');

let RoleSchema = new Schema({
    title: {
        type: String,
        trim: true,
        required: consts.ERRORS.ERROR_ROLE_TITLE_MISSING
    },
    description: {
        type: String,
        max: 2000,
        required: consts.ERRORS.ERROR_ROLE_DESCRIPTION_MISSING
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
    }
});

RoleSchema.pre('save', function(next) {
    this.dateUpdated = Date.now();
    next();
})

module.exports = systemDb.model('Role', RoleSchema);