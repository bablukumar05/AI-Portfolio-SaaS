import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword, resetPassword } from "../services/authService";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import toast from "react-hot-toast";
import { Eye, EyeOff, CheckCircle2, KeyRound, Mail, ArrowLeft } from "lucide-react";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Request OTP, 2: Reset Password, 3: Success
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Step 1: Handle sending OTP to email
  const handleRequestOTP = async (e) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      toast.error("Please enter your email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await forgotPassword({ email: cleanEmail });
      toast.success(res.data.msg || "Password reset OTP sent to your email!");
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to send reset OTP. Please check your email.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Resend OTP handler
  const handleResendOTP = async () => {
    setLoading(true);
    try {
      const res = await forgotPassword({ email: email.trim().toLowerCase() });
      toast.success(res.data.msg || "New OTP sent to your email!");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Handle resetting password with OTP
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      toast.error("Please enter the 6-digit OTP code.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await resetPassword({
        email: email.trim().toLowerCase(),
        otp,
        password,
      });
      toast.success(res.data.msg || "Password reset successfully!");
      setStep(3);
    } catch (err) {
      toast.error(err.response?.data?.msg || "Password reset failed. Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-dark-900 transition-colors duration-300">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-12 lg:p-24 relative z-10">
        <div className="w-full max-w-md fade-in">
          <Link to="/" className="text-2xl font-heading font-black tracking-tighter mb-8 block">
            AI<span className="text-primary">.</span>Portfolio
          </Link>

          {step === 1 && (
            <div>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4">
                <KeyRound size={24} />
              </div>
              <h2 className="text-3xl font-heading font-bold text-slate-900 dark:text-white mb-2">
                Forgot Password?
              </h2>
              <p className="text-slate-500 dark:text-textMuted mb-8 text-sm leading-relaxed">
                No worries! Enter your registered email address below and we'll send you a 6-digit OTP code to reset your password.
              </p>

              <form onSubmit={handleRequestOTP} className="space-y-6">
                <Input
                  label="Email Address"
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white dark:bg-dark-900 text-slate-900 dark:text-white"
                />

                <Button
                  type="submit"
                  isLoading={loading}
                  className="w-full bg-primary hover:bg-primary/90 text-white dark:text-dark-900 shadow-md transition-all duration-200 block text-center mt-6"
                  size="lg"
                >
                  Send OTP Code
                </Button>
              </form>

              <div className="mt-8 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 dark:text-textMuted dark:hover:text-white transition-colors"
                >
                  <ArrowLeft size={16} /> Back to Sign In
                </Link>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4">
                <Mail size={24} />
              </div>
              <h2 className="text-3xl font-heading font-bold text-slate-900 dark:text-white mb-2">
                Reset Password
              </h2>
              <p className="text-slate-500 dark:text-textMuted mb-8 text-sm">
                Enter the 6-digit OTP sent to <span className="font-semibold text-slate-700 dark:text-slate-300">{email}</span> along with your new password.
              </p>

              <form onSubmit={handleResetPassword} className="space-y-5">
                <Input
                  label="6-Digit OTP Code"
                  type="text"
                  required
                  placeholder="000000"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  className="bg-white dark:bg-dark-900 text-slate-900 dark:text-white text-center text-2xl tracking-[8px] font-mono"
                />

                <div className="relative">
                  <Input
                    label="New Password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

                <div className="relative">
                  <Input
                    label="Confirm New Password"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-white dark:bg-dark-900 text-slate-900 dark:text-white"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-[38px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                <Button
                  type="submit"
                  isLoading={loading}
                  disabled={loading || otp.length !== 6 || !password || !confirmPassword}
                  className="w-full bg-primary hover:bg-primary/90 text-white dark:text-dark-900 shadow-md transition-all duration-200 block text-center mt-6"
                  size="lg"
                >
                  Reset Password
                </Button>

                <p className="text-center text-sm text-slate-500 dark:text-textMuted mt-4">
                  Didn't receive the code?{" "}
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={loading}
                    className="text-primary hover:underline font-medium disabled:opacity-50"
                  >
                    Resend OTP
                  </button>
                </p>

                <div className="text-center mt-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  >
                    Change email address
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 mb-6 animate-bounce">
                <CheckCircle2 size={36} />
              </div>
              <h2 className="text-3xl font-heading font-bold text-slate-900 dark:text-white mb-2">
                Password Reset Complete!
              </h2>
              <p className="text-slate-500 dark:text-textMuted mb-8 text-sm leading-relaxed">
                Your password has been successfully updated. You can now log into your AI Portfolio account with your new password.
              </p>

              <Button
                onClick={() => navigate("/login")}
                className="w-full bg-primary hover:bg-primary/90 text-white dark:text-dark-900 shadow-md transition-all duration-200 block text-center"
                size="lg"
              >
                Sign In Now
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Visual Accent (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-slate-900 via-dark-800 to-dark-900 opacity-90 z-0"></div>
        <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-primary/20 blur-[120px] z-0 animate-pulse"></div>
        <div
          className="absolute bottom-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-secondary/20 blur-[100px] z-0 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>

        <div className="relative z-10 max-w-lg p-12 text-center text-white glass-card border-white/10 mx-auto">
          <h3 className="text-4xl font-heading font-bold mb-6 leading-tight">
            Secure & Seamless <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Authentication.</span>
          </h3>
          <p className="text-slate-300 text-lg leading-relaxed">
            Your account is guarded with state-of-the-art verification and OTP security standards.
          </p>
        </div>
      </div>
    </div>
  );
}
