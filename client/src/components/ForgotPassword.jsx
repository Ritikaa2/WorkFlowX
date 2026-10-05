import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLayers, FiArrowLeft, FiSend, FiCheckCircle } from "react-icons/fi";
import axios from "axios";
import { toast } from "react-toastify";
import { AUTH_API_URL } from "../api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [demoOtp, setDemoOtp] = useState("");

  const navigate = useNavigate();

  const handleSendLink = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.warning("Please enter your email address");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${AUTH_API_URL}/forgot-password`, { email });
      setIsSent(true);
      if (response.data.otpDemo) {
        setDemoOtp(response.data.otpDemo);
      }
      toast.success(response.data.message || "Reset link/code sent successfully!");
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to send reset email.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 mb-4">
        <Link 
          to="/login" 
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
        >
          <FiArrowLeft />
          <span>Back to Login</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 text-2xl font-black text-slate-900 group mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
              <FiLayers className="text-xl" />
            </div>
            <span>WorkFlow<span className="text-blue-600">X</span></span>
          </Link>

          {!isSent ? (
            <>
              <div className="mx-auto w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 border border-blue-100">
                <FiMail className="text-xl" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Forgot Password
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Enter your email and we'll send you a reset link
              </p>
            </>
          ) : (
            <>
              <div className="mx-auto w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 border border-emerald-100">
                <FiCheckCircle className="text-xl" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Reset Link Sent!
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Check your email for further instructions.
              </p>
            </>
          )}
        </div>

        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/60 rounded-2xl border border-slate-200/80 sm:px-10">
          {!isSent ? (
            <form className="space-y-4" onSubmit={handleSendLink}>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <FiMail className="text-base" />
                  </div>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-300 bg-slate-50/50 pl-10 pr-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 py-3 px-4 text-sm font-bold text-white shadow-md shadow-blue-500/25 hover:shadow-lg transition-all disabled:opacity-60 cursor-pointer"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>

              <div className="text-center pt-2">
                <Link to="/login" className="text-xs font-semibold text-slate-500 hover:text-blue-600">
                  Back to Login
                </Link>
              </div>
            </form>
          ) : (
            <div className="space-y-4 text-center">
              <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-100 text-xs text-blue-800">
                We sent a reset verification code to <span className="font-bold">{email}</span>.
                {demoOtp && (
                  <div className="mt-2 pt-2 border-t border-blue-200">
                    Your OTP code: <span className="font-mono font-bold text-sm bg-blue-100 px-2 py-0.5 rounded">{demoOtp}</span>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => navigate("/reset-password", { state: { email, otp: demoOtp } })}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 py-3 px-4 text-sm font-bold text-white shadow-md transition-all cursor-pointer"
              >
                Set New Password
              </button>

              <button
                type="button"
                onClick={() => navigate("/login")}
                className="w-full py-2 text-xs font-semibold text-slate-600 hover:text-blue-600"
              >
                Back to Login
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default ForgotPassword;