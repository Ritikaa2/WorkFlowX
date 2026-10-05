import { 
  FiUsers, 
  FiCheckSquare, 
  FiLock, 
  FiBarChart2, 
  FiZap, 
  FiShield,
  FiMail,
  FiClock
} from "react-icons/fi";

const features = [
  {
    icon: <FiShield className="text-2xl text-blue-600" />,
    bg: "bg-blue-50",
    border: "border-blue-100",
    title: "Role-Based Access",
    desc: "Granular permissions for Admins, Project Managers, and Team Members to keep your workspace structured."
  },
  {
    icon: <FiCheckSquare className="text-2xl text-indigo-600" />,
    bg: "bg-indigo-50",
    border: "border-indigo-100",
    title: "Intuitive Task Management",
    desc: "Create, assign, categorize, and track progress effortlessly with clean Kanban-style or list workflows."
  },
  {
    icon: <FiMail className="text-2xl text-emerald-600" />,
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    title: "Secure OTP Authentication",
    desc: "Industry-standard password recovery with 6-digit email OTPs to protect your account and data integrity."
  },
  {
    icon: <FiBarChart2 className="text-2xl text-violet-600" />,
    bg: "bg-violet-50",
    border: "border-violet-100",
    title: "Real-Time Tracking & Stats",
    desc: "Gain instant visibility into sprint velocity, individual task loads, and project completion milestones."
  },
  {
    icon: <FiZap className="text-2xl text-amber-600" />,
    bg: "bg-amber-50",
    border: "border-amber-100",
    title: "Fast & User Friendly",
    desc: "Engineered for speed with a frictionless interface, zero clutter, and lightning-fast responsiveness."
  },
  {
    icon: <FiClock className="text-2xl text-rose-600" />,
    bg: "bg-rose-50",
    border: "border-rose-100",
    title: "Deadlines & Reminders",
    desc: "Never miss a critical client delivery with automated deadlines, notifications, and priority badges."
  }
];

const Features = () => {
  return (
    <section id="features" className="py-20 bg-white border-t border-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 inline-block px-3 py-1 rounded-full">
            Powerful Features
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Everything you need to manage your team's work
          </h2>
          <p className="mt-4 text-base text-slate-600">
            WorkFlowX gives teams the right balance of simplicity and capability to accomplish more together every day.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className="group relative rounded-2xl border border-slate-200/80 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5"
            >
              <div className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl ${feat.bg} ${feat.border} border group-hover:scale-110 transition-transform`}>
                {feat.icon}
              </div>

              <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                {feat.title}
              </h3>

              <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Features;