import { Link } from "react-router-dom";
import { 
  FiArrowRight, 
  FiCheckCircle, 
  FiShield, 
  FiZap, 
  FiClock, 
  FiLayers, 
  FiTrendingUp,
  FiLock,
  FiUsers
} from "react-icons/fi";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/80 via-white to-slate-50 pt-16 pb-24 lg:pt-24 lg:pb-32">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] bg-blue-400/15 blur-[140px] rounded-full pointer-events-none" />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/90 bg-blue-50/90 px-4 py-1.5 text-xs font-bold text-blue-700 shadow-xs mb-8 hover:bg-blue-100/80 transition-colors">
          <span>SMART TEAMS. BETTER WORK.</span>
        </div>

        {/* Main Headline (Full Width Expanded) */}
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl leading-tight sm:leading-tight lg:leading-[1.15]">
          Manage Work. <br className="hidden sm:inline" />
          Track Progress. <br />
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">
            Get Things Done.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-8 text-lg sm:text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto font-normal">
          A role-based task management platform built for modern teams to assign, track, and complete work efficiently with real-time status updates and security.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/signup"
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 px-8 py-4 text-base font-bold text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 hover:-translate-y-0.5 transition-all cursor-pointer"
          >
            <span>Get Started Free</span>
            <FiArrowRight />
          </Link>

          <Link
            to="/login"
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 px-8 py-4 text-base font-bold text-slate-700 transition-all shadow-xs cursor-pointer"
          >
            <span>Sign In</span>
          </Link>
        </div>

        {/* Trust Highlights Checklist */}
        <div className="mt-16 pt-8 border-t border-slate-200/80 max-w-2xl mx-auto flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-semibold text-slate-700">
          <div className="flex items-center gap-2">
            <FiCheckCircle className="text-emerald-500 text-base shrink-0" />
            <span>Role-Based Access</span>
          </div>
          <div className="flex items-center gap-2">
            <FiLayers className="text-blue-600 text-base shrink-0" />
            <span>Task Management</span>
          </div>
          <div className="flex items-center gap-2">
            <FiTrendingUp className="text-indigo-600 text-base shrink-0" />
            <span>Progress Tracking</span>
          </div>
          <div className="flex items-center gap-2">
            <FiZap className="text-amber-500 text-base shrink-0" />
            <span>High Performance</span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;