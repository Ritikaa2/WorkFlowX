import { useState, useEffect } from "react";
import { 
  FiSearch, 
  FiPlus, 
  FiCheckCircle, 
  FiClock, 
  FiTrash2, 
  FiEye, 
  FiCalendar, 
  FiCheck,
  FiFilter
} from "react-icons/fi";
import { toast } from "react-toastify";
import { apiClient } from "../api";
import TaskDetailModal from "./TaskDetailModal";
import CreateTaskModal from "./CreateTaskModal";

export default function MyTasksView({ currentRole, currentUserName }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStatusTab, setActiveStatusTab] = useState("All"); // 'All' | 'Pending' | 'In Progress' | 'Completed'
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modals
  const [selectedTask, setSelectedTask] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("/tasks");
      if (res.data.tasks) {
        setTasks(res.data.tasks);
      }
    } catch (err) {
      // Fallback sample tasks matching wireframe
      setTasks([
        { _id: "t1", title: "Build Login API", priority: "High", status: "In Progress", dueDate: "2026-04-25", description: "Implement login API with JWT authentication and role-based access." },
        { _id: "t2", title: "Create Dashboard UI", priority: "Medium", status: "Pending", dueDate: "2026-04-28", description: "Design and implement modern responsive dashboard views." },
        { _id: "t3", title: "Fix Bugs", priority: "High", status: "Pending", dueDate: "2026-05-02", description: "Investigate and patch edge cases in user roles and permissions." },
        { _id: "t4", title: "Write Documentation", priority: "Low", status: "Completed", dueDate: "2026-05-05", description: "Complete API endpoints documentation." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleOpenDetail = (task) => {
    setSelectedTask(task);
    setIsDetailModalOpen(true);
  };

  const handleQuickStatusChange = async (task, newStatus, e) => {
    e.stopPropagation();
    try {
      if (task._id) {
        await apiClient.patch(`/tasks/${task._id}/status`, { status: newStatus });
      }
      setTasks(tasks.map(t => t._id === task._id ? { ...t, status: newStatus } : t));
      toast.success(`Status changed to ${newStatus}`);
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleDeleteTask = async (taskId, title, e) => {
    e.stopPropagation();
    if (!window.confirm(`Delete task "${title}"?`)) return;

    try {
      if (taskId) {
        await apiClient.delete(`/tasks/${taskId}`);
      }
      setTasks(tasks.filter(t => t._id !== taskId));
      toast.info("Task deleted");
    } catch (err) {
      toast.error("Failed to delete task");
    }
  };

  // Filtering
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = activeStatusTab === "All" || task.status.toLowerCase() === activeStatusTab.toLowerCase();
    return matchesSearch && matchesStatus;
  });

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
    <div className="space-y-6">
      
      {/* Header (Matching Wireframe 10) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">My Tasks</h1>
          <p className="text-xs text-slate-500 mt-0.5">View and manage your assigned tasks and sprint deliverables.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-60">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          {(currentRole === "admin" || currentRole === "manager") && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer shrink-0"
            >
              <FiPlus />
              <span>Create Task</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs (Matching Wireframe 10: All | Pending | In Progress | Completed) */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        {["All", "Pending", "In Progress", "Completed"].map((tab) => {
          const count = tab === "All" ? tasks.length : tasks.filter(t => t.status.toLowerCase() === tab.toLowerCase()).length;
          return (
            <button
              key={tab}
              onClick={() => setActiveStatusTab(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeStatusTab === tab
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <span>{tab}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeStatusTab === tab ? "bg-blue-700 text-white" : "bg-slate-100 text-slate-500"
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tasks Table (Matching Wireframe 10) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-6">Task</th>
                <th className="py-3.5 px-6">Priority</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6">Due Date</th>
                <th className="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    No tasks found in this section.
                  </td>
                </tr>
              ) : (
                filteredTasks.map((t) => (
                  <tr 
                    key={t._id || t.title} 
                    onClick={() => handleOpenDetail(t)}
                    className="hover:bg-blue-50/30 transition-colors cursor-pointer group"
                  >
                    {/* Task Title */}
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-2.5">
                        <span className="w-2 h-2 rounded-full bg-blue-600 group-hover:scale-125 transition-transform" />
                        <div>
                          <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {t.title}
                          </p>
                          {t.assignedToName && (
                            <p className="text-[11px] text-slate-400">
                              Assigned to: {t.assignedToName}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Priority */}
                    <td className="py-3.5 px-6">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getPriorityBadge(t.priority)}`}>
                        {t.priority || "Medium"}
                      </span>
                    </td>

                    {/* Status Dropdown / Badge */}
                    <td className="py-3.5 px-6" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={t.status}
                        onChange={(e) => handleQuickStatusChange(t, e.target.value, e)}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none transition-all ${getStatusBadge(t.status)}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>

                    {/* Due Date */}
                    <td className="py-3.5 px-6 text-slate-600 font-medium">
                      {t.dueDate || "Apr 25"}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-6 text-right space-x-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleOpenDetail(t)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        title="View Details & Comments"
                      >
                        <FiEye size={15} />
                      </button>
                      {(currentRole === "admin" || currentRole === "manager") && (
                        <button
                          onClick={(e) => handleDeleteTask(t._id, t.title, e)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Task"
                        >
                          <FiTrash2 size={15} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Task Details Modal (Wireframe 11) */}
      <TaskDetailModal
        task={selectedTask}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onTaskUpdated={fetchTasks}
        currentRole={currentRole}
        currentUserName={currentUserName}
      />

      {/* Create Task Modal (Wireframe 9) */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onTaskCreated={fetchTasks}
      />

    </div>
  );
}
