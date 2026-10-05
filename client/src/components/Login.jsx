import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FiMail, FiLock, FiEye, FiEyeOff, FiLayers, FiArrowLeft } from "react-icons/fi";
import axios from "axios";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";
import { toast } from "react-toastify";
import { AUTH_API_URL, decodeToken } from "../api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const navigate = useNavigate();

  // Standard Email + Password Login
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.warning("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${AUTH_API_URL}/login`, {
        email,
        password,
      });

      if (response.data.jwtToken) {
        const token = response.data.jwtToken;
        const decoded = decodeToken(token);
        
        // Extract verified user role and details from token / response
        const userRole = (decoded?.role || response.data.role || response.data.user?.role || "employee").toLowerCase();
        const userName = decoded?.name || response.data.name || response.data.user?.name || "User";
        const userEmail = decoded?.email || response.data.email || response.data.user?.email || email;

        localStorage.setItem("token", token);
        localStorage.setItem("role", userRole);
        localStorage.setItem("name", userName);
        localStorage.setItem("email", userEmail);

        toast.success(response.data.message || `Welcome back, ${userName}!`);
        navigate("/dashboard");
      } else {
        toast.error("Login failed. No token received.");
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Invalid email or password.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Google Login
  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check / sign in with backend to get real signed JWT token with role
      try {
        const backendRes = await axios.post(`${AUTH_API_URL}/signup`, {
          name: user.displayName || "Google User",
          email: user.email,
          password: "GoogleAuthUserPassword@123",
          role: "employee"
        });

        if (backendRes.data.jwtToken) {
          const token = backendRes.data.jwtToken;
          const decoded = decodeToken(token);
          const userRole = decoded?.role || "employee";

          localStorage.setItem("token", token);
          localStorage.setItem("name", user.displayName || "Google User");
          localStorage.setItem("email", user.email);
          localStorage.setItem("role", userRole);

          toast.success(`Signed in as ${user.displayName || user.email}`);
          navigate("/dashboard");
          return;
        }
      } catch (signupErr) {
        // If user already exists, login
        const loginRes = await axios.post(`${AUTH_API_URL}/login`, {
          email: user.email,
          password: "GoogleAuthUserPassword@123"
        });

        if (loginRes.data.jwtToken) {
          const token = loginRes.data.jwtToken;
          const decoded = decodeToken(token);
          const userRole = decoded?.role || loginRes.data.role || "employee";

          localStorage.setItem("token", token);
          localStorage.setItem("name", loginRes.data.name || user.displayName || "User");
          localStorage.setItem("email", user.email);
          localStorage.setItem("role", userRole);

          toast.success(`Signed in as ${user.displayName || user.email}`);
          navigate("/dashboard");
          return;
        }
      }
    } catch (error) {
      console.error("Google sign in error:", error);
      toast.error("Google sign-in was cancelled or failed.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/50 flex flex-col justify-center py-10 sm:px-6 lg:px-8">
      
      {/* Top back to home link */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 mb-4">
        <Link 
          to="/" 
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
        >
          <FiArrowLeft />
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        {/* Brand Card Header */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 text-2xl font-black text-slate-900 group mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <FiLayers className="text-xl" />
            </div>
            <span>WorkFlow<span className="text-blue-600">X</span></span>
          </Link>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Welcome Back
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Login to your account
          </p>
        </div>

        {/* Form Box */}
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/60 rounded-2xl border border-slate-200/80 sm:px-10">
          
          <form className="space-y-4" onSubmit={handleLogin}>
            
            {/* Email Field */}
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

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <FiLock className="text-base" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-300 bg-slate-50/50 pl-10 pr-10 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 py-3 px-4 text-sm font-bold text-white shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/35 transition-all disabled:opacity-60 cursor-pointer"
            >
              {loading ? "Signing In..." : "Login"}
            </button>

          </form>

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-slate-400 font-semibold">OR</span>
            </div>
          </div>

          {/* Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 py-2.5 px-4 text-sm font-semibold text-slate-700 shadow-xs transition-all cursor-pointer disabled:opacity-60"
          >
            <FcGoogle size={19} />
            <span>{googleLoading ? "Connecting..." : "Continue with Google"}</span>
          </button>

          {/* Bottom Link */}
          <p className="mt-5 text-center text-xs text-slate-500">
            Don't have an account?{" "}
            <Link to="/signup" className="font-bold text-blue-600 hover:text-blue-700 hover:underline">
              Sign up
            </Link>
          </p>

        </div>

      </div>
    </div>
  );
}

export default Login;