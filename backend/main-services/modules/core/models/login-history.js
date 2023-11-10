const mongoose = require("mongoose");
const systemDb = require(__db_path + '/system-db');

const LoginHistorySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    platform: {
        type: Object
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
})

module.exports = systemDb.model("LoginHistory", LoginHistorySchema);