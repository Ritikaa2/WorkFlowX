const NotificationModel = require("../Models/Notification");
const { getCache, setCache, delCache } = require("../Utils/redisClient");

// Seed initial notifications if empty
const seedNotifications = async () => {
    try {
        const count = await NotificationModel.countDocuments();
        if (count === 0) {
            const seed = [
                {
                    title: "New Task Assigned",
                    message: 'Manager assigned you a new task "Build Login API"',
                    type: "task_assigned",
                    timeAgo: "2 min ago",
                    isRead: false
                },
                {
                    title: "Task Status Updated",
                    message: "Rahul marked a task as completed",
                    type: "status_updated",
                    timeAgo: "1 hour ago",
                    isRead: false
                },
                {
                    title: "New Comment",
                    message: 'Manager commented on "Create Dashboard UI"',
                    type: "new_comment",
                    timeAgo: "3 hours ago",
                    isRead: true
                },
                {
                    title: "Task Due Soon",
                    message: '"Fix Bugs" is due in 2 days',
                    type: "due_soon",
                    timeAgo: "5 hours ago",
                    isRead: true
                },
                {
                    title: "Task Completed",
                    message: 'You completed "Write Documentation"',
                    type: "task_completed",
                    timeAgo: "1 day ago",
                    isRead: true
                }
            ];
            await NotificationModel.insertMany(seed);
        }
    } catch (err) {
        console.warn("Notification seed notice:", err.message);
    }
};

seedNotifications();

// 1. Get notifications (Redis Cached)
const getNotifications = async (req, res) => {
    try {
        const cacheKey = "notifications:all";

        const cached = await getCache(cacheKey);
        if (cached) {
            return res.status(200).json({
                success: true,
                notifications: cached.notifications,
                unreadCount: cached.unreadCount,
                fromCache: true
            });
        }

        const notifications = await NotificationModel.find().sort({ createdAt: -1 });
        const unreadCount = notifications.filter(n => !n.isRead).length;

        const data = { notifications, unreadCount };
        await setCache(cacheKey, data, 60);

        res.status(200).json({
            success: true,
            notifications,
            unreadCount
        });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error fetching notifications" });
    }
};

// 2. Mark all as read (Invalidates Redis Cache)
const markAllAsRead = async (req, res) => {
    try {
        await NotificationModel.updateMany({}, { isRead: true });
        await delCache("notifications:all");

        res.status(200).json({
            success: true,
            message: "All notifications marked as read"
        });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error updating notifications" });
    }
};

// 3. Clear all notifications (Invalidates Redis Cache)
const clearNotifications = async (req, res) => {
    try {
        await NotificationModel.deleteMany({});
        await delCache("notifications:all");

        res.status(200).json({
            success: true,
            message: "All notifications cleared"
        });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error clearing notifications" });
    }
};

module.exports = {
    getNotifications,
    markAllAsRead,
    clearNotifications
};
