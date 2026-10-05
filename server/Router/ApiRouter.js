const express = require("express");
const { verifyToken, adminOnly, managerOrAdmin } = require("../Middlewares/authMiddleware");

const {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
    getDashboardStats
} = require("../Controllers/UserController");

const {
    getTasks,
    getTaskById,
    createTask,
    updateTaskStatus,
    updateTask,
    deleteTask,
    addComment
} = require("../Controllers/TaskController");

const {
    getNotifications,
    markAllAsRead,
    clearNotifications
} = require("../Controllers/NotificationController");

const {
    getRolesAndPermissions,
    updateRolePermissions
} = require("../Controllers/RoleController");

const router = express.Router();

/* =========================================================
   1. DASHBOARD & STATS
   ========================================================= */
router.get("/stats", verifyToken, getDashboardStats);

/* =========================================================
   2. USERS MANAGEMENT
   ========================================================= */
router.get("/users", verifyToken, getAllUsers);
router.post("/users", verifyToken, adminOnly, createUser);
router.put("/users/:id", verifyToken, adminOnly, updateUser);
router.delete("/users/:id", verifyToken, adminOnly, deleteUser);

/* =========================================================
   3. TASKS MANAGEMENT
   ========================================================= */
router.get("/tasks", verifyToken, getTasks);
router.get("/tasks/:id", verifyToken, getTaskById);
router.post("/tasks", verifyToken, managerOrAdmin, createTask);
router.patch("/tasks/:id/status", verifyToken, updateTaskStatus);
router.put("/tasks/:id", verifyToken, managerOrAdmin, updateTask);
router.delete("/tasks/:id", verifyToken, managerOrAdmin, deleteTask);
router.post("/tasks/:id/comments", verifyToken, addComment);

/* =========================================================
   4. NOTIFICATIONS
   ========================================================= */
router.get("/notifications", verifyToken, getNotifications);
router.put("/notifications/read-all", verifyToken, markAllAsRead);
router.delete("/notifications", verifyToken, clearNotifications);

/* =========================================================
   5. ROLES & PERMISSIONS
   ========================================================= */
router.get("/roles", verifyToken, getRolesAndPermissions);
router.post("/roles/permissions", verifyToken, adminOnly, updateRolePermissions);

module.exports = router;
