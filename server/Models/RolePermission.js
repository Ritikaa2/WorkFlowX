const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RolePermissionSchema = new Schema({
    role: {
        type: String,
        required: true,
        unique: true,
        enum: ['admin', 'manager', 'employee']
    },
    permissions: {
        type: [String],
        default: []
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const RolePermissionModel = mongoose.model('role_permissions', RolePermissionSchema);
module.exports = RolePermissionModel;
