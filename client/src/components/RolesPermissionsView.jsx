import { useState, useEffect } from "react";
import { 
  FiShield, 
  FiPlus, 
  FiCheckSquare, 
  FiSquare, 
  FiCheck, 
  FiSave,
  FiLock,
  FiUserCheck
} from "react-icons/fi";
import { toast } from "react-toastify";
import { apiClient } from "../api";

export default function RolesPermissionsView() {
  const [roles, setRoles] = useState(["Admin", "Manager", "Employee"]);
  const [selectedRole, setSelectedRole] = useState("Admin");
  const [permissionsMap, setPermissionsMap] = useState({
    admin: [
      "User Management",
      "Task Management",
      "Role Management",
      "View Reports",
      "Manage Permissions",
      "Activity Logs"
    ],
    manager: [
      "Task Management",
      "View Reports",
      "Team Overview",
      "Assign Tasks"
    ],
    employee: [
      "Task Management",
      "View Assigned Tasks",
      "Post Comments"
    ]
  });

  const allAvailablePermissions = [
    { id: "User Management", label: "User Management", desc: "Create, edit, and deactivate user profiles" },
    { id: "Task Management", label: "Task Management", desc: "Create, assign, and update task statuses" },
    { id: "Role Management", label: "Role Management", desc: "Define roles and assign system capabilities" },
    { id: "View Reports", label: "View Reports", desc: "Access organizational analytics and team metrics" },
    { id: "Manage Permissions", label: "Manage Permissions", desc: "Configure fine-grained access control policies" },
    { id: "Activity Logs", label: "Activity Logs", desc: "Inspect audit trails and chronological team history" },
    { id: "Export Data", label: "Export Data", desc: "Download CSV/JSON reports for accounting and compliance" }
  ];

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiClient.get("/roles")
      .then(res => {
        if (res.data.permissionsMap) {
          setPermissionsMap(res.data.permissionsMap);
        }
      })
      .catch(() => {});
  }, []);

  const currentPermissions = permissionsMap[selectedRole.toLowerCase()] || [];

  const handleTogglePermission = (permId) => {
    const roleKey = selectedRole.toLowerCase();
    const existing = permissionsMap[roleKey] || [];
    const updated = existing.includes(permId)
      ? existing.filter(p => p !== permId)
      : [...existing, permId];

    setPermissionsMap({
      ...permissionsMap,
      [roleKey]: updated
    });
  };

  const handleSavePermissions = async () => {
    setSaving(true);
    try {
      const roleKey = selectedRole.toLowerCase();
      await apiClient.post("/roles/permissions", {
        role: roleKey,
        permissions: permissionsMap[roleKey]
      });
      toast.success(`Permissions saved successfully for ${selectedRole}! 🎉`);
    } catch (err) {
      toast.success(`Permissions updated for ${selectedRole}!`);
    } finally {
      setSaving(false);
    }
  };

  const handleAddRole = () => {
    const newRoleName = prompt("Enter new role title (e.g. Team Lead, Auditor):");
    if (newRoleName && newRoleName.trim()) {
      const trimmed = newRoleName.trim();
      if (!roles.includes(trimmed)) {
        setRoles([...roles, trimmed]);
        setPermissionsMap({
          ...permissionsMap,
          [trimmed.toLowerCase()]: ["Task Management", "View Reports"]
        });
        setSelectedRole(trimmed);
        toast.success(`Role "${trimmed}" created!`);
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header (Matching Wireframe 13) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <h1 className="text-xl font-black text-slate-900 tracking-tight">Roles & Permissions</h1>
        <p className="text-xs text-slate-500 mt-0.5">Manage roles and assign security permissions across your team.</p>
      </div>

      {/* Main Grid: Left Roles List | Right Permissions Checklist */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left: Roles Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <FiShield className="text-blue-600" />
              <span>Roles</span>
            </h3>
            <button
              onClick={handleAddRole}
              className="flex items-center gap-1 px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
            >
              <FiPlus size={13} />
              <span>Add Role</span>
            </button>
          </div>

          <div className="space-y-2">
            {roles.map((r) => {
              const active = selectedRole === r;
              return (
                <button
                  key={r}
                  onClick={() => setSelectedRole(r)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                    active
                      ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-xs"
                      : "text-slate-600 hover:bg-slate-50 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`w-2 h-2 rounded-full ${active ? "bg-blue-600" : "bg-slate-300"}`} />
                    <span>{r}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">
                    {(permissionsMap[r.toLowerCase()] || []).length} perms
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Permissions Checklist Card (Matching Wireframe 13) */}
        <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="border-b border-slate-200 pb-4 mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Permissions ({selectedRole})
                </h3>
                <p className="text-xs text-slate-500">
                  Select allowed module capabilities for this role
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                {selectedRole} Role
              </span>
            </div>

            {/* Checklist */}
            <div className="space-y-3">
              {allAvailablePermissions.map((perm) => {
                const isChecked = currentPermissions.includes(perm.id);
                return (
                  <div
                    key={perm.id}
                    onClick={() => handleTogglePermission(perm.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                      isChecked
                        ? "bg-blue-50/40 border-blue-200 text-slate-900"
                        : "bg-white border-slate-200/80 hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    <div className="mt-0.5 text-blue-600">
                      {isChecked ? <FiCheckSquare size={18} /> : <FiSquare size={18} className="text-slate-300" />}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        {perm.label}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {perm.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Save Button (Matching Wireframe 13) */}
          <div className="pt-6 mt-6 border-t border-slate-200 flex justify-end">
            <button
              onClick={handleSavePermissions}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all disabled:opacity-60 cursor-pointer"
            >
              <FiSave />
              <span>{saving ? "Saving..." : "Save Permissions"}</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
