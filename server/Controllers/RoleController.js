const RolePermissionModel = require("../Models/RolePermission");
const { getCache, setCache, delCache } = require("../Utils/redisClient");

// Seed standard initial roles and permissions
const seedRoles = async () => {
    try {
        const count = await RolePermissionModel.countDocuments();
        if (count === 0) {
            const initialRoles = [
                {
                    role: "admin",
                    permissions: [
                        "User Management",
                        "Task Management",
                        "Role Management",
                        "View Reports",
                        "Manage Permissions",
                        "Activity Logs"
                    ]
                },
                {
                    role: "manager",
                    permissions: [
                        "Task Management",
                        "View Reports",
                        "Team Overview",
                        "Assign Tasks"
                    ]
                },
                {
                    role: "employee",
                    permissions: [
                        "Task Management",
                        "View Assigned Tasks",
                        "Post Comments"
                    ]
                }
            ];
            await RolePermissionModel.insertMany(initialRoles);
        }
    } catch (err) {
        console.warn("Role seed notice:", err.message);
    }
};

seedRoles();

// 1. Get all roles & permissions (Redis Cached)
const getRolesAndPermissions = async (req, res) => {
    try {
        const cacheKey = "roles:permissions";

        const cached = await getCache(cacheKey);
        if (cached) {
            return res.status(200).json({
                ...cached,
                fromCache: true
            });
        }

        const rolesData = await RolePermissionModel.find();
        
        // Structured format
        const permissionsMap = {
            admin: ["User Management", "Task Management", "Role Management", "View Reports", "Manage Permissions", "Activity Logs"],
            manager: ["Task Management", "View Reports", "Team Overview", "Assign Tasks"],
            employee: ["Task Management", "View Assigned Tasks", "Post Comments"]
        };

        rolesData.forEach(r => {
            permissionsMap[r.role] = r.permissions;
        });

        const responseData = {
            success: true,
            roles: ["Admin", "Manager", "Employee"],
            allAvailablePermissions: [
                "User Management",
                "Task Management",
                "Role Management",
                "View Reports",
                "Manage Permissions",
                "Activity Logs",
                "Export Data"
            ],
            permissionsMap
        };

        // Cache in Redis (TTL: 600s / 10 min)
        await setCache(cacheKey, responseData, 600);

        res.status(200).json(responseData);
    } catch (err) {
        res.status(500).json({ success: false, message: "Error fetching roles & permissions" });
    }
};

// 2. Save permissions for a role (Invalidates Redis Cache)
const updateRolePermissions = async (req, res) => {
    try {
        const { role, permissions } = req.body;
        const normalizedRole = role.toLowerCase();

        const updated = await RolePermissionModel.findOneAndUpdate(
            { role: normalizedRole },
            { permissions, updatedAt: new Date() },
            { upsert: true, new: true }
        );

        // Invalidate Redis cache
        await delCache("roles:permissions");

        res.status(200).json({
            success: true,
            message: `Permissions updated for ${role}`,
            role: updated
        });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error saving permissions" });
    }
};

module.exports = {
    getRolesAndPermissions,
    updateRolePermissions
};
