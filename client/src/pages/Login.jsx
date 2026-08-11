import { useState } from "react";
import { loginUser } from "../services/authService";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [data, setData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [unverified, setUnverified] = useState(false);
  const [otp, setOtp] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const email = data.email ? data.email.trim().toLowerCase() : "";
    const password = data.password;

    if (!email || !password) {
      toast.error("Please fill in all fields.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      const res = await loginUser({ email, password });
      localStorage.setItem("token", res.data.token);
      toast.success("Successfully logged in!");
      window.location.href = "/dashboard";
    } catch (err) {
      if (err.response?.status === 403 && err.response?.data?.unverified) {
        setUnverified(true);
        toast.error("Email not verified. OTP sent!");
      } else {
        toast.error(err.response?.data?.msg || "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await import("../services/authService").then(m => m.verifyOTP({ email: data.email, otp }));
      localStorage.setItem("token", res.data.token);
      toast.success("Email verified! Logging in...");
      window.location.href = "/dashboard";
    } catch (err) {
      toast.error(err.response?.data?.msg || "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await import("../services/authService").then(m => m.resendOTP({ email: data.email }));
      toast.success("New OTP sent!");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to resend OTP.");
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-dark-900 transition-colors duration-300">

      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-12 lg:p-24 relative z-10">
        <div className="w-full max-w-md fade-in">
          <Link to="/" className="text-2xl font-heading font-black tracking-tighter mb-12 block">
            AI<span className="text-primary">.</span>Portfolio
          </Link>

          <h2 className="text-3xl font-heading font-bold text-slate-900 dark:text-white mb-2">
            {unverified ? "Verify Email" : "Welcome Back"}
          </h2>
          <p className="text-slate-500 dark:text-textMuted mb-8">
            {unverified ? `Verification code sent to ${data.email}` : "Sign in to your AI Portfolio Builder"}
          </p>

          {!unverified ? (
            <form onSubmit={handleLogin} className="space-y-6">
              <Input
                label="Email Address"
                type="email"
                required
                placeholder="you@example.com"
                value={data.email}
                onChange={e => setData({ ...data, email: e.target.value })}
                className="bg-white dark:bg-dark-900 text-slate-900 dark:text-white"
              />
              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={data.password}
                  onChange={e => setData({ ...data, password: e.target.value })}
                  className="bg-white dark:bg-dark-900 text-slate-900 dark:text-white"
                />
                <button
                  type="button"
                  className="absolute right-3 top-[38px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <div className="flex items-center justify-between mt-2">
                <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 cursor-pointer">
                  <input type="checkbox" className="rounded border-slate-300 text-primary focus:ring-primary bg-transparent" />
                  Remember me
                </label>
                <Link to="/forgot-password" className="text-sm font-medium text-primary hover:underline">Forgot password?</Link>
              </div>

              <Button
                type="submit"
                isLoading={loading}
                className="w-full bg-primary hover:bg-primary/90 text-white dark:text-dark-900 shadow-md transition-all duration-200 block text-center mt-6"
                size="lg"
              >
                Sign In
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-6">
              <Input
                label="Verification Code"
                type="text"
                required
                placeholder="000000"
                maxLength={6}
                value={otp}
                onChange={e => setOtp(e.target.value)}
                className="bg-white dark:bg-dark-900 text-slate-900 dark:text-white text-center text-2xl tracking-[10px]"
              />
              <Button
                type="submit"
                isLoading={loading}
                disabled={loading || otp.length !== 6}
                className="w-full bg-primary hover:bg-primary/90 text-white dark:text-dark-900 shadow-md transition-all duration-200 block text-center mt-6"
                size="lg"
              >
                Verify & Sign In
              </Button>
              <p className="text-center text-sm text-slate-500 dark:text-textMuted mt-4">
                Didn't receive the code?
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-primary hover:underline ml-1 font-medium"
                >
                  Resend OTP
                </button>
              </p>
              <button
                type="button"
                onClick={() => setUnverified(false)}
                className="w-full text-center text-sm text-slate-400 hover:text-slate-600 mt-2"
              >
                Back to Sign In
              </button>
            </form>
          )}

          <p className="mt-8 text-center text-slate-500 dark:text-textMuted text-sm">
            Don't have an account? <Link to="/register" className="text-primary hover:underline font-medium">Sign up for free</Link>
          </p>
        </div>
      </div>

      {/* Right Side - Visuals (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center">
        {/* Abstract Shapes */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-slate-900 via-dark-800 to-dark-900 opacity-90 z-0"></div>
        <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-primary/20 blur-[120px] z-0 animate-pulse"></div>
        <div className="absolute bottom-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-secondary/20 blur-[100px] z-0 animate-pulse" style={{ animationDelay: '2s' }}></div>

        <div className="relative z-10 max-w-lg p-12 text-center text-white glass-card border-white/10 mx-auto">
          <h3 className="text-4xl font-heading font-bold mb-6 leading-tight">Build your dream portfolio <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">in minutes.</span></h3>
          <p className="text-slate-300 text-lg leading-relaxed">
            Harness the power of AI to generate compelling case studies, professional summaries, and beautiful layouts instantly.
          </p>
        </div>
      </div>
    </div>
  );
}