const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: false
    },
    userEmail: {
        type: String,
        default: ''
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['task_assigned', 'status_updated', 'new_comment', 'due_soon', 'task_completed', 'system'],
        default: 'task_assigned'
    },
    isRead: {
        type: Boolean,
        default: false
    },
    timeAgo: {
        type: String,
        default: 'Just now'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const NotificationModel = mongoose.model('notifications', NotificationSchema);
module.exports = NotificationModel;
