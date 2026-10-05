import { useState } from "react";
import { Link } from "react-router-dom";
import { FiLayers, FiGithub, FiTwitter, FiLinkedin, FiMail, FiArrowRight } from "react-icons/fi";
import { toast } from "react-toastify";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter a valid email address");
      return;
    }
    toast.success("Thank you for subscribing to WorkFlowX updates!");
    setEmail("");
  };

  return (
    <footer id="about" className="bg-slate-900 text-slate-400 border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2 text-2xl font-black text-white">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
                <FiLayers className="text-lg" />
              </div>
              <span>WorkFlow<span className="text-blue-500">X</span></span>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              The modern task management & collaboration platform designed to bring clarity, velocity, and peace of mind to team workflows.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a href="#github" className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-300 transition-colors">
                <FiGithub />
              </a>
              <a href="#twitter" className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-300 transition-colors">
                <FiTwitter />
              </a>
              <a href="#linkedin" className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-300 transition-colors">
                <FiLinkedin />
              </a>
              <a href="#email" className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-300 transition-colors">
                <FiMail />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Product
            </h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a></li>
              <li><a href="#stats" className="hover:text-white transition-colors">Live Stats</a></li>
              <li><Link to="/signup" className="hover:text-white transition-colors">Create Account</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Account & Security
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/login" className="hover:text-white transition-colors">Sign In</Link></li>
              <li><Link to="/signup" className="hover:text-white transition-colors">Sign Up</Link></li>
              <li><Link to="/forgot-password" className="hover:text-white transition-colors">Reset Password</Link></li>
              <li><Link to="/dashboard" className="hover:text-white transition-colors">My Dashboard</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Stay Updated
            </h4>
            <p className="text-xs text-slate-400">
              Get the latest feature releases and productivity tips directly to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 py-2.5 text-xs font-bold text-white transition-colors cursor-pointer"
              >
                <span>Subscribe</span>
                <FiArrowRight />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} WorkFlowX. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#privacy" className="hover:text-slate-400">Privacy Policy</a>
            <a href="#terms" className="hover:text-slate-400">Terms of Service</a>
            <a href="#security" className="hover:text-slate-400">Security</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;