let Schema = require('mongoose').Schema,
ObjectId = Schema.ObjectId,
systemDb = require(__db_path + '/system-db'),
consts = require(__config_path + '/consts'),
utils = require(__libs_path + '/utils');

let ModuleActionSchema = new Schema({
    module: {
        type: ObjectId,
        ref: "Module"
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
    userCreated: {
        type: ObjectId,
        ref: 'User'
    },
    action: {
        type: ObjectId,
        ref: "Action"
    }
})

ModuleActionSchema.pre('save', function(next) {
    this.dateUpdated = Date.now();
    next();
})

module.exports = systemDb.model('ModuleAction', ModuleActionSchema);