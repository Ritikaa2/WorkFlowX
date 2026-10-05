import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  FiLayers, 
  FiLogOut, 
  FiUsers, 
  FiCheckCircle, 
  FiSearch, 
  FiUser, 
  FiShield, 
  FiBell,
  FiSettings,
  FiBarChart2,
  FiActivity,
  FiHome,
  FiMenu,
  FiX,
  FiChevronDown,
  FiAlertTriangle
} from "react-icons/fi";
import { toast } from "react-toastify";
import { getAuthUser, apiClient } from "../api";

// Sub-Views
import AdminDashboardView from "./AdminDashboardView";
import ManagerDashboardView from "./ManagerDashboardView";
import EmployeeDashboardView from "./EmployeeDashboardView";
import UserManagementView from "./UserManagementView";
import MyTasksView from "./MyTasksView";
import NotificationsView from "./NotificationsView";
import RolesPermissionsView from "./RolesPermissionsView";

export default function Dashboard() {
  const navigate = useNavigate();

  // User State derived strictly from authenticated JWT token
  const [userName, setUserName] = useState("User");
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("employee"); // 'admin' | 'manager' | 'employee'
  
  // Navigation State
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    const auth = getAuthUser();

    if (!auth.token) {
      toast.info("Please sign in to access your dashboard");
      navigate("/login");
      return;
    }

    setUserName(auth.name);
    setUserEmail(auth.email);
    setUserRole(auth.role);

    // Fetch unread notifications count for authenticated user
    apiClient.get("/notifications")
      .then((res) => {
        if (res.data && res.data.unreadCount !== undefined) {
          setUnreadNotifications(res.data.unreadCount);
        }
      })
      .catch(() => {});
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    toast.info("Logged out successfully");
    navigate("/login");
  };

  // Define allowed sidebar navigation strictly based on authenticated role
  const getNavItems = () => {
    const items = [
      { id: "dashboard", label: "Dashboard", icon: FiLayers }
    ];

    if (userRole === "admin") {
      items.push(
        { id: "users", label: "Users", icon: FiUsers },
        { id: "tasks", label: "Tasks", icon: FiCheckCircle },
        { id: "roles", label: "Roles & Permissions", icon: FiShield },
        { id: "notifications", label: "Notifications", icon: FiBell, badge: unreadNotifications },
        { id: "reports", label: "Reports", icon: FiBarChart2 },
        { id: "activity", label: "Activity Logs", icon: FiActivity },
        { id: "settings", label: "Settings", icon: FiSettings }
      );
    } else if (userRole === "manager") {
      items.push(
        { id: "users", label: "My Team", icon: FiUsers },
        { id: "tasks", label: "Tasks", icon: FiCheckCircle },
        { id: "notifications", label: "Notifications", icon: FiBell, badge: unreadNotifications },
        { id: "reports", label: "Reports", icon: FiBarChart2 },
        { id: "settings", label: "Settings", icon: FiSettings }
      );
    } else {
      // Employee only allowed these pages
      items.push(
        { id: "tasks", label: "My Tasks", icon: FiCheckCircle },
        { id: "notifications", label: "Notifications", icon: FiBell, badge: unreadNotifications },
        { id: "settings", label: "Profile & Settings", icon: FiUser }
      );
    }

    return items;
  };

  const navItems = getNavItems();
  const allowedTabIds = navItems.map((item) => item.id);

  // Guard: Check if the currently active tab is permitted for the user's role
  const isTabAllowed = allowedTabIds.includes(activeTab);

  const handleNavigate = (tabId) => {
    if (!allowedTabIds.includes(tabId)) {
      toast.error("Access Denied: You do not have permission to access this page.");
      setActiveTab("dashboard");
      return;
    }
    setActiveTab(tabId);
    setSidebarOpen(false);
  };

  const getRoleBadgeStyle = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "manager":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col justify-between
        transform transition-transform duration-200 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        <div>
          {/* Logo */}
          <div className="h-16 px-6 border-b border-slate-200 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5 text-lg font-black text-slate-900">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
                <FiLayers className="text-lg" />
              </div>
              <span>WorkFlow<span className="text-blue-600">X</span></span>
            </Link>
            <button 
              onClick={() => setSidebarOpen(false)} 
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* User Role Tag (Read-only from JWT) */}
          <div className="px-6 py-3 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Account Role:</span>
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full capitalize border ${getRoleBadgeStyle(userRole)}`}>
              {userRole}
            </span>
          </div>

          {/* Navigation Links (Filtered by Role) */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    active
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      active ? "bg-white text-blue-600" : "bg-blue-100 text-blue-700"
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-200 space-y-2">
          <Link
            to="/"
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <FiHome size={15} />
            <span>Landing Page</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <FiLogOut size={15} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              <FiMenu size={20} />
            </button>

            {/* Top Search bar */}
            <div className="relative w-48 sm:w-72">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input
                type="text"
                placeholder="Search here..."
                className="w-full pl-9 pr-3.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
          </div>

          {/* Right Header: Notification & Profile */}
          <div className="flex items-center gap-3">
            
            {/* Notification Bell */}
            <button
              onClick={() => handleNavigate("notifications")}
              className="relative p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              title="Notifications"
            >
              <FiBell size={18} />
              {unreadNotifications > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
              )}
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1 pl-2 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  {userName ? userName.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="hidden md:block text-left text-xs">
                  <p className="font-bold text-slate-900 leading-none capitalize">{userName}</p>
                  <p className="text-[10px] text-slate-400 font-semibold capitalize mt-0.5">{userRole}</p>
                </div>
                <FiChevronDown size={14} className="text-slate-400" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-fadeIn">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">{userName}</p>
                    <p className="text-[11px] text-slate-400 truncate">{userEmail}</p>
                    <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full capitalize border ${getRoleBadgeStyle(userRole)}`}>
                      {userRole}
                    </span>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => { handleNavigate("settings"); setProfileDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <FiSettings size={14} /> Profile & Settings
                    </button>
                    <button
                      onClick={() => { handleNavigate("notifications"); setProfileDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <FiBell size={14} /> Notifications
                    </button>
                  </div>

                  <div className="border-t border-slate-100 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                    >
                      <FiLogOut size={14} /> Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </header>

        {/* Page Content View Router with Role Guard */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          
          {/* Access Denied Guard if user navigates to unauthorized view */}
          {!isTabAllowed ? (
            <div className="bg-white p-8 rounded-2xl border border-rose-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                <FiAlertTriangle size={24} />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Access Denied</h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                You do not have permission to view this section with your current role (<span className="capitalize font-bold">{userRole}</span>).
              </p>
              <button
                onClick={() => setActiveTab("dashboard")}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700"
              >
                Back to Dashboard
              </button>
            </div>
          ) : (
            <>
              {/* 1. DASHBOARD VIEW (Strictly Role-Adaptive from JWT) */}
              {activeTab === "dashboard" && (
                <>
                  {userRole === "admin" && (
                    <AdminDashboardView onNavigateTab={handleNavigate} />
                  )}
                  {userRole === "manager" && (
                    <ManagerDashboardView onNavigateTab={handleNavigate} />
                  )}
                  {userRole === "employee" && (
                    <EmployeeDashboardView userName={userName} onNavigateTab={handleNavigate} />
                  )}
                </>
              )}

              {/* 2. USERS MANAGEMENT VIEW (Admin & Manager) */}
              {activeTab === "users" && (userRole === "admin" || userRole === "manager") && (
                <UserManagementView />
              )}

              {/* 3. TASKS VIEW */}
              {activeTab === "tasks" && (
                <MyTasksView currentRole={userRole} currentUserName={userName} />
              )}

              {/* 4. ROLES & PERMISSIONS VIEW (Admin only) */}
              {activeTab === "roles" && userRole === "admin" && (
                <RolesPermissionsView />
              )}

              {/* 5. NOTIFICATIONS VIEW */}
              {activeTab === "notifications" && (
                <NotificationsView />
              )}

              {/* 6. REPORTS VIEW (Admin & Manager) */}
              {activeTab === "reports" && (userRole === "admin" || userRole === "manager") && (
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
                    <h1 className="text-xl font-black text-slate-900 tracking-tight">Reports & Analytics</h1>
                    <p className="text-xs text-slate-500 mt-0.5">Overview of team throughput and sprint delivery metrics.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                      <h3 className="text-sm font-bold text-slate-900 mb-4">Sprint Completion Rate</h3>
                      <div className="h-4 bg-slate-100 rounded-full overflow-hidden mb-2">
                        <div className="h-full bg-blue-600 rounded-full" style={{ width: "78%" }} />
                      </div>
                      <span className="text-xs text-slate-500 font-semibold">78% of sprint goals achieved this cycle</span>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                      <h3 className="text-sm font-bold text-slate-900 mb-4">Avg. Turnaround Time</h3>
                      <p className="text-2xl font-black text-slate-900">2.4 Days</p>
                      <span className="text-xs text-emerald-600 font-semibold mt-1 block">⚡ 18% faster than previous cycle</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 7. ACTIVITY LOGS VIEW (Admin only) */}
              {activeTab === "activity" && userRole === "admin" && (
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
                    <h1 className="text-xl font-black text-slate-900 tracking-tight">System Activity Logs</h1>
                    <p className="text-xs text-slate-500 mt-0.5">Audit log of system events, role permissions and user assignments.</p>
                  </div>
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
                    {[
                      { user: "Admin", action: "Updated role permissions for Manager", time: "10 min ago" },
                      { user: "Manager", action: "Assigned task 'Build Login API' to Ritika", time: "1 hour ago" },
                      { user: "Ritika", action: "Changed task status to In Progress", time: "2 hours ago" },
                      { user: "Admin", action: "Created user account for Rahul Sharma", time: "3 hours ago" },
                      { user: "System", action: "Database backup completed successfully", time: "6 hours ago" }
                    ].map((act, i) => (
                      <div key={i} className="flex items-center justify-between text-xs py-2 border-b border-slate-100 last:border-0">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-blue-600" />
                          <span className="font-bold text-slate-900">{act.user}</span>
                          <span className="text-slate-600">{act.action}</span>
                        </div>
                        <span className="text-slate-400 font-medium">{act.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 8. SETTINGS VIEW (Standard User Profile Settings without role manipulation) */}
              {activeTab === "settings" && (
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
                    <h1 className="text-xl font-black text-slate-900 tracking-tight">Profile & Account Settings</h1>
                    <p className="text-xs text-slate-500 mt-0.5">Manage your personal profile and account credentials.</p>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5 max-w-xl">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        value={userEmail}
                        disabled
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 bg-slate-100 text-slate-500 cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Assigned Role</label>
                      <div className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 capitalize flex items-center justify-between">
                        <span>{userRole}</span>
                        <span className="text-[10px] text-slate-400 font-semibold">Verified by JWT token</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => {
                          localStorage.setItem("name", userName);
                          toast.success("Profile updated successfully!");
                        }}
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm cursor-pointer"
                      >
                        Save Profile
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

        </main>

      </div>

    </div>
  );
}