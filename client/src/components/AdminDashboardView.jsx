import { useState, useEffect } from "react";
import { 
  FiUsers, 
  FiUserCheck, 
  FiCheckCircle, 
  FiClock, 
  FiLayers, 
  FiTrendingUp, 
  FiActivity, 
  FiShield, 
  FiArrowUpRight,
  FiUserPlus
} from "react-icons/fi";
import { apiClient } from "../api";

export default function AdminDashboardView({ onNavigateTab }) {
  const [stats, setStats] = useState({
    totalUsers: 120,
    totalManagers: 10,
    totalEmployees: 110,
    totalTasks: 450,
    completedTasks: 320,
    inProgressTasks: 80,
    pendingTasks: 50,
    recentActivity: [
      { id: 1, user: "Admin", action: "created user Rahul", time: "10 min ago" },
      { id: 2, user: "Manager", action: "assigned task to Ritika", time: "1 hour ago" },
      { id: 3, user: "Ritika", action: "completed a task", time: "2 hours ago" },
      { id: 4, user: "Admin", action: "User role updated", time: "3 hours ago" },
      { id: 5, user: "System", action: "New employee joined", time: "5 hours ago" },
    ]
  });

  useEffect(() => {
    apiClient.get("/stats")
      .then((res) => {
        if (res.data.stats) {
          setStats(res.data.stats);
        }
      })
      .catch(() => {});
  }, []);

  const total = stats.totalTasks || 450;
  const completedPct = Math.round(((stats.completedTasks || 320) / total) * 100);
  const inProgressPct = Math.round(((stats.inProgressTasks || 80) / total) * 100);
  const pendingPct = Math.round(((stats.pendingTasks || 50) / total) * 100);

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner (Matching Wireframe 5) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Welcome, Admin!
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Here's an overview of your organization.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab("users")}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            Manage Users
          </button>
          <button
            onClick={() => onNavigateTab("tasks")}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            View Tasks
          </button>
        </div>
      </div>

      {/* 4 Metric Cards (Matching Wireframe 5: 120 Total Users | 10 Managers | 110 Employees | 450 Total Tasks) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Users */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase text-slate-400">Total Users</span>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <FiUsers size={18} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {stats.totalUsers || 120}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
            <FiTrendingUp /> +12% this month
          </span>
        </div>

        {/* Card 2: Managers */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase text-slate-400">Managers</span>
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
              <FiShield size={18} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {stats.totalManagers || 10}
          </div>
          <span className="text-[11px] text-slate-400 font-semibold block mt-1">
            Department leads
          </span>
        </div>

        {/* Card 3: Employees */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase text-slate-400">Employees</span>
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
              <FiUserCheck size={18} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {stats.totalEmployees || 110}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
            <FiTrendingUp /> Active members
          </span>
        </div>

        {/* Card 4: Total Tasks */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase text-slate-400">Total Tasks</span>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
              <FiLayers size={18} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {stats.totalTasks || 450}
          </div>
          <span className="text-[11px] text-blue-600 font-semibold block mt-1">
            Across 8 projects
          </span>
        </div>

      </div>

      {/* Two Column Layout: Task Status Donut & Recent Activity (Matching Wireframe 5) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Task Status Donut Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
            <h3 className="text-base font-bold text-slate-900">Task Status</h3>
            <span className="text-xs text-slate-400 font-medium">Real-time breakdown</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
            
            {/* Visual Donut Ring SVG */}
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle cx="50" cy="50" r="38" stroke="#f1f5f9" strokeWidth="10" fill="transparent" />
                {/* Completed (Emerald) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="#10b981"
                  strokeWidth="10"
                  strokeDasharray="238.76"
                  strokeDashoffset={238.76 - (238.76 * completedPct) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                />
                {/* In Progress (Blue) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="#2563eb"
                  strokeWidth="10"
                  strokeDasharray="238.76"
                  strokeDashoffset={238.76 - (238.76 * inProgressPct) / 100}
                  strokeDashoffset-style={{}}
                  fill="transparent"
                  className="opacity-70"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-black text-slate-900">{stats.totalTasks || 450}</span>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Tasks</span>
              </div>
            </div>

            {/* Status Legend List */}
            <div className="space-y-3 w-full sm:w-auto">
              <div className="flex items-center justify-between gap-6 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="font-semibold text-slate-700">Completed</span>
                </div>
                <span className="font-black text-slate-900">{stats.completedTasks || 320}</span>
              </div>

              <div className="flex items-center justify-between gap-6 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-600" />
                  <span className="font-semibold text-slate-700">In Progress</span>
                </div>
                <span className="font-black text-slate-900">{stats.inProgressTasks || 80}</span>
              </div>

              <div className="flex items-center justify-between gap-6 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="font-semibold text-slate-700">Pending</span>
                </div>
                <span className="font-black text-slate-900">{stats.pendingTasks || 50}</span>
              </div>
            </div>

          </div>
        </div>

        {/* Recent Activity Feed (Matching Wireframe 5) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
            <h3 className="text-base font-bold text-slate-900">Recent Activity</h3>
            <span className="text-xs text-blue-600 font-semibold cursor-pointer hover:underline">
              Live Feed
            </span>
          </div>

          <div className="space-y-4">
            {(stats.recentActivity || []).map((act, index) => (
              <div key={act.id || index} className="flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                    {act.user ? act.user.charAt(0) : "U"}
                  </div>
                  <div>
                    <span className="font-bold text-slate-900">{act.user} </span>
                    <span className="text-slate-600">{act.action}</span>
                  </div>
                </div>
                <span className="text-[11px] text-slate-400 font-medium shrink-0">
                  {act.time}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
