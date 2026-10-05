import { FiCheckCircle, FiUsers, FiActivity, FiStar } from "react-icons/fi";

const stats = [
  {
    icon: <FiCheckCircle className="text-2xl text-blue-600" />,
    number: "10,000+",
    label: "Tasks Completed",
    desc: "Successfully delivered"
  },
  {
    icon: <FiUsers className="text-2xl text-indigo-600" />,
    number: "500+",
    label: "Active Teams",
    desc: "Collaborating daily"
  },
  {
    icon: <FiActivity className="text-2xl text-emerald-600" />,
    number: "99.9%",
    label: "Uptime Reliability",
    desc: "Enterprise cloud stability"
  },
  {
    icon: <FiStar className="text-2xl text-amber-500" />,
    number: "4.9 / 5.0",
    label: "User Satisfaction",
    desc: "Rated by productivity leaders"
  }
];

const Stats = () => {
  return (
    <section id="stats" className="py-16 bg-white border-t border-slate-200/70">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center sm:items-start p-6 rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-white hover:border-slate-200 hover:shadow-md transition-all text-center sm:text-left"
            >
              <div className="mb-3 p-2.5 rounded-xl bg-white shadow-xs border border-slate-200/60">
                {item.icon}
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {item.number}
              </p>
              <p className="mt-1 text-sm font-bold text-slate-700">
                {item.label}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Stats;