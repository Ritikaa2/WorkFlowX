const bcrypt = require("bcrypt");
const UserModel = require("../Models/User");
const TaskModel = require("../Models/Task");
const { getCache, setCache, delCache, delPattern } = require("../Utils/redisClient");

// Helper to seed standard team users if empty
const seedInitialUsers = async () => {
    try {
        const count = await UserModel.countDocuments();
        if (count === 0) {
            const defaultPassword = await bcrypt.hash("password123", 10);
            const seedUsers = [
                { name: "Ritika Toora", email: "ritika@gmail.com", password: defaultPassword, role: "employee", status: "active" },
                { name: "Rahul Sharma", email: "rahul@gmail.com", password: defaultPassword, role: "manager", status: "active" },
                { name: "Aman Verma", email: "aman@gmail.com", password: defaultPassword, role: "employee", status: "active" },
                { name: "Priya Singh", email: "priya@gmail.com", password: defaultPassword, role: "employee", status: "inactive" },
                { name: "Karan Mehta", email: "karan@gmail.com", password: defaultPassword, role: "manager", status: "active" },
                { name: "Admin System", email: "admin@workflowx.com", password: defaultPassword, role: "admin", status: "active" }
            ];
            await UserModel.insertMany(seedUsers);
        }
    } catch (err) {
        console.warn("User seed notice:", err.message);
    }
};

seedInitialUsers();

// 1. Get all users (Redis Cached)
const getAllUsers = async (req, res) => {
    try {
        const { role, status, search } = req.query;
        const cacheKey = `users:${role || 'all'}:${status || 'all'}:${search || 'none'}`;

        // Check Redis Cache
        const cachedUsers = await getCache(cacheKey);
        if (cachedUsers) {
            return res.status(200).json({
                success: true,
                users: cachedUsers,
                total: cachedUsers.length,
                fromCache: true
            });
        }

        let query = {};

        if (role && role !== "All") {
            query.role = role.toLowerCase();
        }

        if (status && status !== "All") {
            query.status = status.toLowerCase();
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } }
            ];
        }

        const users = await UserModel.find(query).select("-password").sort({ createdAt: -1 });

        // Set Redis Cache (TTL: 120s)
        await setCache(cacheKey, users, 120);

        res.status(200).json({
            success: true,
            users,
            total: users.length
        });
    } catch (err) {
        console.error("Get all users error:", err);
        res.status(500).json({ success: false, message: "Error fetching users" });
    }
};

// 2. Create User (Admin) - Invalidates Redis Cache
const createUser = async (req, res) => {
    try {
        const { name, email, password, role, status } = req.body;
        
        if (!name || !email) {
            return res.status(400).json({ success: false, message: "Name and Email are required" });
        }

        const existing = await UserModel.findOne({ email: email.toLowerCase() });
        if (existing) {
            return res.status(409).json({ success: false, message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password || "password123", 10);
        const newUser = new UserModel({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            role: role || "employee",
            status: status || "active"
        });

        await newUser.save();

        // Invalidate Redis caches
        await delPattern("users:*");
        await delCache("stats:dashboard");

        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                status: newUser.status
            }
        });
    } catch (err) {
        console.error("Create user error:", err);
        res.status(500).json({ success: false, message: "Error creating user" });
    }
};

// 3. Update User - Invalidates Redis Cache
const updateUser = async (req, res) => {
    try {
        const { name, email, role, status } = req.body;
        const user = await UserModel.findByIdAndUpdate(
            req.params.id,
            { name, email: email?.toLowerCase(), role, status },
            { new: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Invalidate Redis caches
        await delPattern("users:*");
        await delCache("stats:dashboard");

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            user
        });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error updating user" });
    }
};

// 4. Delete User - Invalidates Redis Cache
const deleteUser = async (req, res) => {
    try {
        const user = await UserModel.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Invalidate Redis caches
        await delPattern("users:*");
        await delCache("stats:dashboard");

        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error deleting user" });
    }
};

// 5. Aggregated Dashboard Stats (Redis Cached)
const getDashboardStats = async (req, res) => {
    try {
        const cacheKey = "stats:dashboard";

        // Check Redis Cache
        const cachedStats = await getCache(cacheKey);
        if (cachedStats) {
            return res.status(200).json({
                success: true,
                stats: cachedStats,
                fromCache: true
            });
        }

        const totalUsers = await UserModel.countDocuments();
        const totalManagers = await UserModel.countDocuments({ role: "manager" });
        const totalEmployees = await UserModel.countDocuments({ role: "employee" });
        const totalAdmins = await UserModel.countDocuments({ role: "admin" });

        const totalTasks = await TaskModel.countDocuments();
        const completedTasks = await TaskModel.countDocuments({ status: "Completed" });
        const inProgressTasks = await TaskModel.countDocuments({ status: "In Progress" });
        const pendingTasks = await TaskModel.countDocuments({ status: "Pending" });

        // Team members for manager view
        const teamMembers = [
            { name: "Ritika Toora", role: "Frontend Dev", email: "ritika@gmail.com", tasksCount: 8, completed: 5, inProgress: 3 },
            { name: "Rahul Sharma", role: "Backend Lead", email: "rahul@gmail.com", tasksCount: 5, completed: 3, inProgress: 2 },
            { name: "Aman Verma", role: "UI Designer", email: "aman@gmail.com", tasksCount: 10, completed: 6, inProgress: 4 },
            { name: "Priya Singh", role: "QA Engineer", email: "priya@gmail.com", tasksCount: 3, completed: 2, inProgress: 1 },
            { name: "Karan Mehta", role: "DevOps", email: "karan@gmail.com", tasksCount: 2, completed: 1, inProgress: 1 }
        ];

        // Recent Activity Feed
        const recentActivity = [
            { id: 1, user: "Admin", action: "created user Rahul Sharma", time: "10 min ago", icon: "user-plus" },
            { id: 2, user: "Manager", action: "assigned task to Ritika", time: "1 hour ago", icon: "check-circle" },
            { id: 3, user: "Ritika", action: "completed a task 'Login API'", time: "2 hours ago", icon: "award" },
            { id: 4, user: "Admin", action: "updated user role for Priya", time: "3 hours ago", icon: "shield" },
            { id: 5, user: "System", action: "New employee joined team", time: "5 hours ago", icon: "users" }
        ];

        const statsData = {
            totalUsers: totalUsers || 120,
            totalManagers: totalManagers || 10,
            totalEmployees: totalEmployees || 110,
            totalAdmins: totalAdmins || 2,
            totalTasks: totalTasks || 450,
            completedTasks: completedTasks || 320,
            inProgressTasks: inProgressTasks || 80,
            pendingTasks: pendingTasks || 50,
            teamMembers,
            recentActivity
        };

        // Set in Redis Cache (TTL: 60s)
        await setCache(cacheKey, statsData, 60);

        res.status(200).json({
            success: true,
            stats: statsData
        });
    } catch (err) {
        console.error("Get stats error:", err);
        res.status(500).json({ success: false, message: "Error fetching dashboard statistics" });
    }
};

module.exports = {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
    getDashboardStats
};
