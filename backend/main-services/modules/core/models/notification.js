const mongoose = require("mongoose");
const systemDb = require(__db_path + '/system-db');

const NotificationSchema = new mongoose.Schema({
    dateCreated: {
        type: Date,
        required: true,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    // 'user' | 'system'
    type: {
        type: String,
        required: true
    },
    repeat: {
        type: Boolean,
        default: false
    },
    priority: {
        type: Number,
        default: 0,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
    description: {
        type: String,        
    },
    link: {
        type: String,
    }
})

module.exports = systemDb.model('Notification', NotificationSchema);