import { useState } from "react";
import { registerUser } from "../services/authService";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

export default function Register() {
  const [data, setData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1); // 1: Sign up, 2: Verification
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (step === 1) {
      if (!data.name || !data.email || !data.password) {
        toast.error("Please fill in all fields.");
        setLoading(false);
        return;
      }

      try {
        await registerUser(data);
        toast.success("OTP sent to your email!");
        setStep(2);
      } catch (err) {
        toast.error(err.response?.data?.msg || "Registration failed. Try again.");
      } finally {
        setLoading(false);
      }
    } else {
      if (!otp) {
        toast.error("Please enter the OTP.");
        setLoading(false);
        return;
      }

      try {
        const res = await registerUser({ ...data, otp, email: data.email }); // Note: Using verifyOTP instead
        // Wait, handleRegister was for step 1. Let's move verify to separate function
      } catch (err) {
        toast.error(err.response?.data?.msg || "Verification failed.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await import("../services/authService").then(m => m.verifyOTP({ email: data.email, otp }));
      toast.success("Email verified! Redirecting to login...");
      setTimeout(() => navigate('/login'), 2000);
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

      {/* Left Side - Visuals (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center order-2 lg:order-1">
        {/* Abstract Shapes */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-slate-900 via-dark-800 to-dark-900 opacity-90 z-0"></div>
        <div className="absolute -bottom-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-secondary/20 blur-[120px] z-0 animate-pulse"></div>
        <div className="absolute top-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[100px] z-0 animate-pulse" style={{ animationDelay: '2s' }}></div>

        <div className="relative z-10 max-w-lg p-12 text-center text-white glass-card border-white/10 mx-auto">
          <h3 className="text-4xl font-heading font-bold mb-6 leading-tight">Elevate your <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary">digital presence.</span></h3>
          <p className="text-slate-300 text-lg leading-relaxed">
            Join thousands of developers and designers building lightning-fast, highly-optimized portfolios with AI.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-12 lg:p-24 relative z-10 order-1 lg:order-2">
        <div className="w-full max-w-md fade-in">
          <Link to="/" className="text-2xl font-heading font-black tracking-tighter mb-12 block lg:hidden">
            AI<span className="text-primary">.</span>Portfolio
          </Link>

          <h2 className="text-3xl font-heading font-bold text-slate-900 dark:text-white mb-2">
            {step === 1 ? "Create Account" : "Verify Email"}
          </h2>
          <p className="text-slate-500 dark:text-textMuted mb-8">
            {step === 1 ? "Start building your AI portfolio today" : `We've sent a 6-digit code to ${data.email}`}
          </p>

          {step === 1 ? (
            <form onSubmit={handleRegister} className="space-y-5">
              <Input
                label="Full Name"
                type="text"
                required
                placeholder="John Doe"
                value={data.name}
                onChange={e => setData({ ...data, name: e.target.value })}
                className="bg-white dark:bg-dark-900 text-slate-900 dark:text-white"
              />
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
              <div className="pt-2">
                <Button
                  type="submit"
                  isLoading={loading}
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90 text-white dark:text-dark-900 shadow-md transition-all duration-200 block text-center"
                  size="lg"
                >
                  Sign Up
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-5">
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
              <div className="pt-2">
                <Button
                  type="submit"
                  isLoading={loading}
                  disabled={loading || otp.length !== 6}
                  className="w-full bg-primary hover:bg-primary/90 text-white dark:text-dark-900 shadow-md transition-all duration-200 block text-center"
                  size="lg"
                >
                  Verify & Create Account
                </Button>
              </div>
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
                onClick={() => setStep(1)}
                className="w-full text-center text-sm text-slate-400 hover:text-slate-600 mt-2"
              >
                Back to Sign Up
              </button>
            </form>
          )}

          <p className="mt-8 text-center text-slate-500 dark:text-textMuted text-sm">
            Already have an account? <Link to="/login" className="text-primary hover:underline font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}