import { FiUserPlus, FiCheckCircle, FiTrendingUp } from "react-icons/fi";

const steps = [
  {
    step: "01",
    icon: <FiUserPlus className="text-xl text-blue-600" />,
    title: "Create Account & Sign In",
    desc: "Register in seconds with email or Google, backed by secure encrypted password hashing and OTP recovery."
  },
  {
    step: "02",
    icon: <FiCheckCircle className="text-xl text-indigo-600" />,
    title: "Assign & Organize Tasks",
    desc: "Define tasks with clear milestones, assign them to team members, and prioritize urgent deliverables."
  },
  {
    step: "03",
    icon: <FiTrendingUp className="text-xl text-emerald-600" />,
    title: "Track Progress & Deliver",
    desc: "Update statuses in real-time, collaborate smoothly, and complete team sprints on time with zero friction."
  }
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 bg-slate-50 border-t border-slate-200/70">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 inline-block px-3 py-1 rounded-full">
            Simple Workflow
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Get started in just 3 easy steps
          </h2>
          <p className="mt-4 text-base text-slate-600">
            WorkFlowX is designed so your team can hit the ground running with no steep learning curve.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="mt-14 grid gap-8 md:grid-cols-3 relative">
          {steps.map((item, idx) => (
            <div
              key={idx}
              className="relative rounded-2xl bg-white p-8 border border-slate-200 shadow-sm hover:shadow-md transition-all text-center flex flex-col items-center"
            >
              {/* Step Badge */}
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white font-extrabold text-sm shadow-md shadow-blue-500/20">
                {item.step}
              </div>

              <h3 className="mt-2 text-lg font-bold text-slate-900">
                {item.title}
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;