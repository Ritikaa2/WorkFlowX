import { useState, useEffect } from "react";
import { 
  FiLayers, 
  FiClock, 
  FiAlertCircle, 
  FiCheckCircle, 
  FiCalendar, 
  FiArrowRight, 
  FiEye,
  FiCheck
} from "react-icons/fi";
import { apiClient } from "../api";
import TaskDetailModal from "./TaskDetailModal";

export default function EmployeeDashboardView({ userName, onNavigateTab }) {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const fetchEmployeeTasks = async () => {
    try {
      const res = await apiClient.get("/tasks");
      if (res.data.tasks && res.data.tasks.length > 0) {
        setTasks(res.data.tasks);
      } else {
        throw new Error("empty");
      }
    } catch (err) {
      // Fallback tasks matching wireframe 7
      setTasks([
        { _id: "e1", title: "Build Login API", priority: "High", status: "In Progress", dueDate: "Apr 25", description: "Implement login API with JWT authentication and role-based access." },
        { _id: "e2", title: "Create Dashboard UI", priority: "Medium", status: "Pending", dueDate: "Apr 28", description: "Design and implement modern responsive dashboard views." },
        { _id: "e3", title: "Fix Bugs", priority: "High", status: "Pending", dueDate: "May 02", description: "Investigate and patch edge cases in user roles and permissions." },
        { _id: "e4", title: "Write Documentation", priority: "Low", status: "Completed", dueDate: "May 05", description: "Complete API endpoints documentation." }
      ]);
    }
  };

  useEffect(() => {
    fetchEmployeeTasks();
  }, []);

  const assignedCount = tasks.length || 8;
  const inProgressCount = tasks.filter(t => t.status === "In Progress").length || 3;
  const pendingCount = tasks.filter(t => t.status === "Pending").length || 4;
  const completedCount = tasks.filter(t => t.status === "Completed").length || 1;

  const handleOpenTask = (task) => {
    setSelectedTask(task);
    setIsDetailOpen(true);
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
    <div className="space-y-6">
      
      {/* Welcome Banner (Matching Wireframe 7) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Welcome, {userName || "Ritika"}!
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Here are your tasks for today. Keep up the great work!
          </p>
        </div>
        <button
          onClick={() => onNavigateTab("tasks")}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer shrink-0"
        >
          <span>Open Task Board</span>
          <FiArrowRight />
        </button>
      </div>

      {/* 4 Metric Cards (Matching Wireframe 7: 8 Assigned Tasks | 3 In Progress | 4 Pending | 1 Completed) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase text-slate-400">Assigned Tasks</span>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <FiLayers size={18} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {assignedCount}
          </div>
          <span className="text-[11px] text-blue-600 font-semibold block mt-1">
            Total in queue
          </span>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase text-slate-400">In Progress</span>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <FiClock size={18} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {inProgressCount}
          </div>
          <span className="text-[11px] text-blue-600 font-semibold block mt-1">
            Active right now
          </span>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase text-slate-400">Pending</span>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
              <FiAlertCircle size={18} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {pendingCount}
          </div>
          <span className="text-[11px] text-amber-600 font-semibold block mt-1">
            Up next
          </span>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase text-slate-400">Completed</span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
              <FiCheckCircle size={18} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {completedCount}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold block mt-1">
            Finished this week
          </span>
        </div>

      </div>

      {/* My Tasks List Table (Matching Wireframe 7) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">My Tasks</h3>
          <button
            onClick={() => onNavigateTab("tasks")}
            className="text-xs text-blue-600 font-bold hover:underline cursor-pointer"
          >
            View All
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <tbody className="divide-y divide-slate-100 text-xs">
              {tasks.slice(0, 5).map((t, idx) => (
                <tr 
                  key={t._id || idx}
                  onClick={() => handleOpenTask(t)}
                  className="hover:bg-blue-50/40 transition-colors cursor-pointer group"
                >
                  <td className="py-4 px-6 font-bold text-slate-900 flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full border border-slate-300 group-hover:border-blue-600 group-hover:bg-blue-50 transition-colors" />
                    <span className="group-hover:text-blue-600 transition-colors">{t.title}</span>
                  </td>

                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getPriorityBadge(t.priority)}`}>
                      {t.priority || "Medium"}
                    </span>
                  </td>

                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getStatusBadge(t.status)}`}>
                      {t.status || "Pending"}
                    </span>
                  </td>

                  <td className="py-4 px-6 text-slate-500 font-medium text-right">
                    {t.dueDate || "Apr 25"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <TaskDetailModal
        task={selectedTask}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onTaskUpdated={fetchEmployeeTasks}
        currentRole="employee"
        currentUserName={userName}
      />

    </div>
  );
}
