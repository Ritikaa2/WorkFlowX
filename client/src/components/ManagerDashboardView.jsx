import { useState } from "react";
import { 
  FiUsers, 
  FiCheckCircle, 
  FiClock, 
  FiLayers, 
  FiPlus, 
  FiTrendingUp, 
  FiUserCheck,
  FiChevronRight
} from "react-icons/fi";
import CreateTaskModal from "./CreateTaskModal";

export default function ManagerDashboardView({ onNavigateTab }) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Manager stats matching Wireframe 6
  const metrics = {
    teamMembers: 12,
    totalTasks: 28,
    inProgress: 16,
    completed: 12,
  };

  // Team members with task count
  const teamList = [
    { name: "Ritika Toora", role: "Frontend Dev", tasks: 8, completed: 5, inProgress: 3 },
    { name: "Rahul Sharma", role: "Backend Lead", tasks: 5, completed: 3, inProgress: 2 },
    { name: "Aman Verma", role: "UI Designer", tasks: 10, completed: 6, inProgress: 4 },
    { name: "Priya Singh", role: "QA Engineer", tasks: 3, completed: 2, inProgress: 1 },
    { name: "Karan Mehta", role: "DevOps", tasks: 2, completed: 1, inProgress: 1 },
  ];

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner (Matching Wireframe 6) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Welcome, Manager!
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Here's your team's progress and active deliverables.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <FiPlus />
            <span>Create Task</span>
          </button>
          <button
            onClick={() => onNavigateTab("tasks")}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            View All Tasks
          </button>
        </div>
      </div>

      {/* 4 Metric Cards (Matching Wireframe 6: 12 My Team Members | 28 Total Tasks | 16 In Progress | 12 Completed) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase text-slate-400">My Team Members</span>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <FiUsers size={18} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {metrics.teamMembers}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
            <FiTrendingUp /> Active contributors
          </span>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase text-slate-400">Total Tasks</span>
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
              <FiLayers size={18} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {metrics.totalTasks}
          </div>
          <span className="text-[11px] text-slate-400 font-semibold block mt-1">
            Assigned this sprint
          </span>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase text-slate-400">In Progress</span>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
              <FiClock size={18} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {metrics.inProgress}
          </div>
          <span className="text-[11px] text-amber-600 font-semibold block mt-1">
            Currently working
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
            {metrics.completed}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold block mt-1">
            Done this sprint
          </span>
        </div>

      </div>

      {/* Two Columns: Team Task Overview Bar Chart & My Team List (Matching Wireframe 6) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Bar Chart: Team Task Overview */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Team Task Overview</h3>
              <p className="text-xs text-slate-500">Distribution of completed vs in-progress tasks</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-emerald-500" />
                <span className="text-slate-600 font-medium">Completed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-blue-600" />
                <span className="text-slate-600 font-medium">In Progress</span>
              </div>
            </div>
          </div>

          {/* Interactive CSS / SVG Bar Chart */}
          <div className="h-56 flex items-end justify-around gap-4 pt-4 px-2">
            {teamList.map((member, i) => {
              const maxVal = 10;
              const compHeight = (member.completed / maxVal) * 100;
              const progHeight = (member.inProgress / maxVal) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="w-full max-w-[42px] h-40 flex items-end justify-center gap-1.5 bg-slate-50 p-1 rounded-xl">
                    {/* Completed bar */}
                    <div 
                      style={{ height: `${compHeight}%` }}
                      className="w-1/2 bg-emerald-500 rounded-t-md transition-all duration-500 group-hover:brightness-110"
                      title={`${member.name}: ${member.completed} Completed`}
                    />
                    {/* In Progress bar */}
                    <div 
                      style={{ height: `${progHeight}%` }}
                      className="w-1/2 bg-blue-600 rounded-t-md transition-all duration-500 group-hover:brightness-110"
                      title={`${member.name}: ${member.inProgress} In Progress`}
                    />
                  </div>
                  <span className="text-[11px] font-bold text-slate-700 truncate max-w-[65px]">
                    {member.name.split(" ")[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* My Team Widget (Matching Wireframe 6) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
            <h3 className="text-base font-bold text-slate-900">My Team</h3>
            <span className="text-xs text-blue-600 font-semibold cursor-pointer" onClick={() => onNavigateTab("users")}>
              View All
            </span>
          </div>

          <div className="space-y-3.5">
            {teamList.map((tm, idx) => (
              <div key={idx} className="flex items-center justify-between gap-3 text-xs p-2 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    {tm.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{tm.name}</h4>
                    <span className="text-[11px] text-slate-400">{tm.role}</span>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
                  {tm.tasks} Tasks
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      <CreateTaskModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onTaskCreated={() => onNavigateTab("tasks")}
      />

    </div>
  );
}
