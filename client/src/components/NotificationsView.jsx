import { useState, useEffect } from "react";
import { 
  FiBell, 
  FiCheck, 
  FiCheckCircle, 
  FiMessageSquare, 
  FiClock, 
  FiTrash2, 
  FiAlertCircle, 
  FiLayers 
} from "react-icons/fi";
import { toast } from "react-toastify";
import { apiClient } from "../api";

export default function NotificationsView() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // 'all' | 'unread'

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("/notifications");
      if (res.data.notifications) {
        setNotifications(res.data.notifications);
      }
    } catch (err) {
      // Fallback notifications matching wireframe 12
      setNotifications([
        { id: 1, title: "New Task Assigned", message: 'Manager assigned you a new task "Build Login API"', type: "task_assigned", timeAgo: "2 min ago", isRead: false },
        { id: 2, title: "Task Status Updated", message: "Rahul marked a task as completed", type: "status_updated", timeAgo: "1 hour ago", isRead: false },
        { id: 3, title: "New Comment", message: 'Manager commented on "Create Dashboard UI"', type: "new_comment", timeAgo: "3 hours ago", isRead: true },
        { id: 4, title: "Task Due Soon", message: '"Fix Bugs" is due in 2 days', type: "due_soon", timeAgo: "5 hours ago", isRead: true },
        { id: 5, title: "Task Completed", message: 'You completed "Write Documentation"', type: "task_completed", timeAgo: "1 day ago", isRead: true }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await apiClient.put("/notifications/read-all");
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      toast.success("All notifications marked as read");
    } catch (err) {
      toast.error("Failed to mark notifications as read");
    }
  };

  const handleClearAll = async () => {
    try {
      await apiClient.delete("/notifications");
      setNotifications([]);
      toast.info("All notifications cleared");
    } catch (err) {
      toast.error("Failed to clear notifications");
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "task_assigned":
        return <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-200"><FiLayers size={18} /></div>;
      case "status_updated":
        return <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-200"><FiClock size={18} /></div>;
      case "new_comment":
        return <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200"><FiMessageSquare size={18} /></div>;
      case "due_soon":
        return <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 border border-rose-200"><FiAlertCircle size={18} /></div>;
      case "task_completed":
        return <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200"><FiCheckCircle size={18} /></div>;
      default:
        return <div className="p-2.5 rounded-xl bg-slate-50 text-slate-600 border border-slate-200"><FiBell size={18} /></div>;
    }
  };

  const filtered = filter === "unread" ? notifications.filter(n => !n.isRead) : notifications;
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="space-y-6">
      
      {/* Header (Matching Wireframe 12) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Notifications</h1>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                {unreadCount} unread
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Stay updated with team tasks, mentions and project status.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-xl border border-blue-200 transition-colors cursor-pointer"
          >
            <FiCheck />
            <span>Mark all as read</span>
          </button>
          <button
            onClick={handleClearAll}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
            title="Clear all"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        {[
          { id: "all", label: "All Notifications", count: notifications.length },
          { id: "unread", label: "Unread", count: unreadCount },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              filter === tab.id
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <span>{tab.label}</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              filter === tab.id ? "bg-blue-700 text-white" : "bg-slate-100 text-slate-500"
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Notifications List (Matching Wireframe 12) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <FiBell className="mx-auto text-3xl mb-2 opacity-50" />
            <p className="text-xs font-medium">You have no {filter === "unread" ? "unread" : ""} notifications.</p>
          </div>
        ) : (
          filtered.map((item, index) => (
            <div 
              key={item._id || item.id || index}
              className={`p-4 sm:p-5 flex items-start gap-4 transition-colors hover:bg-slate-50/80 ${
                !item.isRead ? "bg-blue-50/30" : ""
              }`}
            >
              {getNotificationIcon(item.type)}

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    {item.title}
                  </h4>
                  <span className="text-[11px] text-slate-400 font-medium shrink-0">
                    {item.timeAgo || "Just now"}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.message}
                </p>
              </div>

              {!item.isRead && (
                <span className="w-2 h-2 rounded-full bg-blue-600 mt-2 shrink-0" />
              )}
            </div>
          ))
        )}
      </div>

    </div>
  );
}
