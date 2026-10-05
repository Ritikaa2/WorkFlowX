import { useState, useEffect } from "react";
import { FiX, FiCheck, FiCalendar, FiAlertCircle, FiUser } from "react-icons/fi";
import { toast } from "react-toastify";
import { apiClient } from "../api";

export default function CreateTaskModal({ isOpen, onClose, onTaskCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [priority, setPriority] = useState("High");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (isOpen) {
      // Fetch users for assignment
      apiClient.get("/users")
        .then((res) => {
          if (res.data.users) {
            setUsers(res.data.users);
            if (res.data.users.length > 0 && !assignedTo) {
              setAssignedTo(res.data.users[0].name);
            }
          }
        })
        .catch(() => {
          // Default fallback team
          setUsers([
            { name: "Ritika Toora", email: "ritika@gmail.com", role: "employee" },
            { name: "Rahul Sharma", email: "rahul@gmail.com", role: "manager" },
            { name: "Aman Verma", email: "aman@gmail.com", role: "employee" },
            { name: "Priya Singh", email: "priya@gmail.com", role: "employee" },
            { name: "Karan Mehta", email: "karan@gmail.com", role: "manager" }
          ]);
          setAssignedTo("Ritika Toora");
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.warning("Please enter a task title");
      return;
    }

    setLoading(true);
    try {
      const selectedUserObj = users.find(u => u.name === assignedTo);
      const payload = {
        title: title.trim(),
        description: description.trim(),
        assignedToName: assignedTo || "Ritika Toora",
        assignedToEmail: selectedUserObj?.email || "ritika@gmail.com",
        priority,
        dueDate: dueDate || new Date().toISOString().split("T")[0]
      };

      const res = await apiClient.post("/tasks", payload);
      if (res.data.success) {
        toast.success("Task created and assigned successfully! 🚀");
        if (onTaskCreated) onTaskCreated(res.data.task);
        setTitle("");
        setDescription("");
        onClose();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header (Matching Wireframe 9) */}
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Create New Task
            </h2>
            <p className="text-xs text-slate-500">
              Assign and track tasks efficiently with your team
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Task Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Task Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Enter detailed description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all resize-none"
            />
          </div>

          {/* Assign To & Priority & Due Date Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            {/* Assign To */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Assign To
              </label>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3 py-2.5 text-xs font-semibold text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer"
              >
                {users.map((u, i) => (
                  <option key={i} value={u.name}>
                    {u.name} ({u.role || 'Member'})
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3 py-2.5 text-xs font-semibold text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer"
              >
                <option value="High">🔴 High</option>
                <option value="Medium">🟡 Medium</option>
                <option value="Low">🟢 Low</option>
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3 py-2 text-xs font-medium text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer"
              />
            </div>

          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition-all disabled:opacity-60 cursor-pointer"
            >
              {loading ? "Creating..." : "Create Task"}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
