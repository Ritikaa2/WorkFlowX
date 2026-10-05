import { useState } from "react";
import { 
  FiX, 
  FiClock, 
  FiUser, 
  FiCalendar, 
  FiSend, 
  FiCheckCircle, 
  FiMessageSquare, 
  FiActivity, 
  FiAlertCircle,
  FiFileText
} from "react-icons/fi";
import { toast } from "react-toastify";
import { apiClient } from "../api";

export default function TaskDetailModal({ task, isOpen, onClose, onTaskUpdated, currentRole, currentUserName }) {
  const [activeTab, setActiveTab] = useState("comments"); // 'details' | 'comments' | 'activity'
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [taskStatus, setTaskStatus] = useState(task?.status || "Pending");

  if (!isOpen || !task) return null;

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSubmittingComment(true);
    try {
      if (task._id) {
        const res = await apiClient.post(`/tasks/${task._id}/comments`, {
          text: commentText.trim()
        });
        if (res.data.success) {
          toast.success("Comment added!");
          if (onTaskUpdated) onTaskUpdated();
        }
      } else {
        // Mock fallback update
        if (!task.comments) task.comments = [];
        task.comments.push({
          userName: currentUserName || "You",
          userRole: currentRole || "employee",
          text: commentText.trim(),
          createdAt: new Date()
        });
        toast.success("Comment added!");
      }
      setCommentText("");
    } catch (err) {
      toast.error("Failed to add comment");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    setTaskStatus(newStatus);
    try {
      if (task._id) {
        await apiClient.patch(`/tasks/${task._id}/status`, { status: newStatus });
      }
      task.status = newStatus;
      toast.success(`Task status updated to ${newStatus}`);
      if (onTaskUpdated) onTaskUpdated();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const getPriorityBadge = (p) => {
    switch (p) {
      case "High":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "Medium":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Low":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getStatusBadge = (s) => {
    switch (s) {
      case "Completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "In Progress":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header (Matching Wireframe 11) */}
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/50 flex items-start justify-between">
          <div className="space-y-1.5 pr-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusBadge(taskStatus)}`}>
                {taskStatus}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getPriorityBadge(task.priority)}`}>
                {task.priority || "Medium"} Priority
              </span>
              {task.dueDate && (
                <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                  <FiCalendar className="text-slate-400" /> Due: {task.dueDate}
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              {task.title}
            </h2>
            <p className="text-xs text-slate-500 line-clamp-2">
              {task.description || "Implement login API with JWT authentication and role-based access."}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Status quick toggle bar */}
        <div className="px-6 py-2.5 bg-blue-50/40 border-b border-slate-200/80 flex items-center justify-between text-xs">
          <span className="text-slate-600 font-semibold">Change Status:</span>
          <div className="flex items-center gap-1.5">
            {["Pending", "In Progress", "Completed"].map((st) => (
              <button
                key={st}
                onClick={() => handleStatusChange(st)}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  taskStatus === st
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="flex border-b border-slate-200 px-6 gap-6 bg-white">
          {[
            { id: "comments", label: "Comments", icon: FiMessageSquare, count: task.comments?.length || 0 },
            { id: "details", label: "Details", icon: FiFileText },
            { id: "activity", label: "Activity Logs", icon: FiActivity, count: task.activityLogs?.length || 0 },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
                  active
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    active ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Modal Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {/* Details Tab */}
          {activeTab === "details" && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">Description</h4>
                <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {task.description || "No specific details provided."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block mb-1">Assigned To:</span>
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <FiUser className="text-blue-600" /> {task.assignedToName || "Ritika Toora"}
                  </span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block mb-1">Assigned By:</span>
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <FiUser className="text-indigo-600" /> {task.assignedByName || "Manager"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Comments Tab (Matching Wireframe 11) */}
          {activeTab === "comments" && (
            <div className="space-y-4">
              {(!task.comments || task.comments.length === 0) ? (
                <div className="text-center py-8 text-slate-400">
                  <FiMessageSquare className="mx-auto text-3xl mb-2 opacity-50" />
                  <p className="text-xs">No comments yet. Start the conversation!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {task.comments.map((comm, idx) => {
                    const isCurrentUser = comm.userName === currentUserName || comm.userName === "You";
                    return (
                      <div key={idx} className="flex gap-3 items-start">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                          {comm.userName ? comm.userName.charAt(0).toUpperCase() : "U"}
                        </div>
                        <div className="flex-1 bg-slate-50 rounded-xl p-3 border border-slate-200">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-900">
                                {comm.userName} {isCurrentUser && <span className="text-blue-600 font-normal">(You)</span>}
                              </span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-semibold uppercase">
                                {comm.userRole || "Member"}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400">
                              {comm.createdAt ? new Date(comm.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Recently"}
                            </span>
                          </div>
                          <p className="text-xs text-slate-700 leading-relaxed">
                            {comm.text}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Activity Logs Tab */}
          {activeTab === "activity" && (
            <div className="space-y-3">
              {(!task.activityLogs || task.activityLogs.length === 0) ? (
                <p className="text-xs text-slate-400 text-center py-6">No activity logs recorded yet.</p>
              ) : (
                <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {task.activityLogs.map((act, i) => (
                    <div key={i} className="relative flex items-start gap-2">
                      <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-white" />
                      <div>
                        <p className="text-xs font-medium text-slate-800">{act.action}</p>
                        <span className="text-[10px] text-slate-400">
                          by {act.user} • {act.timestamp ? new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Comment Input Footer (Matching Wireframe 11) */}
        {activeTab === "comments" && (
          <form onSubmit={handleAddComment} className="p-4 border-t border-slate-200 bg-slate-50 flex items-center gap-2">
            <input
              type="text"
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
            <button
              type="submit"
              disabled={submittingComment || !commentText.trim()}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
            >
              <FiSend />
              <span>Send</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
