import { Link } from "react-router-dom";
import { FiArrowRight, FiCheck } from "react-icons/fi";

const CTA = () => {
  return (
    <section className="py-16 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 px-6 py-14 sm:px-12 sm:py-16 text-center text-white shadow-2xl shadow-blue-500/20">
          
          {/* Subtle background glow effect */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto">
            
            <p className="text-xs font-bold tracking-widest uppercase text-blue-200">
              Ready to manage your work?
            </p>

            <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl text-white tracking-tight">
              Join WorkFlowX Today
            </h2>

            <p className="mt-4 text-base sm:text-lg text-blue-100/90 leading-relaxed">
              Start organizing projects, collaborating with your team members, and hitting your goals with zero friction.
            </p>

            {/* Action buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/signup"
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-bold text-blue-700 hover:bg-blue-50 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                <span>Get Started Free</span>
                <FiArrowRight />
              </Link>

              <Link
                to="/login"
                className="w-full sm:w-auto rounded-xl border border-white/30 bg-white/10 hover:bg-white/20 px-8 py-3.5 text-base font-semibold text-white transition-all backdrop-blur-sm"
              >
                Sign In to Account
              </Link>
            </div>

            {/* Guarantees */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-blue-100">
              <span className="flex items-center gap-1.5">
                <FiCheck className="text-emerald-300" /> Free to get started
              </span>
              <span className="flex items-center gap-1.5">
                <FiCheck className="text-emerald-300" /> No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <FiCheck className="text-emerald-300" /> Instant setup
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default CTA;