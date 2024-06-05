// Inside Notification.js

const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['unread', 'read'],
        default: 'unread'
    }
}, { timestamps: true });

module.exports = mongoose.model('Notification', NotificationSchema);

