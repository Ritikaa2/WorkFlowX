const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    userName: {
        type: String,
        required: true,
        default: 'User'
    },
    userRole: {
        type: String,
        default: 'employee'
    },
    text: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const ActivityLogSchema = new Schema({
    action: {
        type: String,
        required: true
    },
    user: {
        type: String,
        default: 'System'
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const TaskSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    assignedTo: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    assignedToName: {
        type: String,
        default: 'Unassigned'
    },
    assignedToEmail: {
        type: String,
        default: ''
    },
    assignedBy: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    assignedByName: {
        type: String,
        default: 'Manager'
    },
    priority: {
        type: String,
        enum: ['High', 'Medium', 'Low'],
        default: 'Medium'
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Completed'],
        default: 'Pending'
    },
    dueDate: {
        type: String,
        default: ''
    },
    comments: [CommentSchema],
    activityLogs: [ActivityLogSchema],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const TaskModel = mongoose.model('tasks', TaskSchema);
module.exports = TaskModel;
