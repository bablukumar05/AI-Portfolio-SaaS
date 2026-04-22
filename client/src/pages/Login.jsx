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

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Validate generic shape
    if (!data.email || !data.password) {
      toast.error("Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      const res = await loginUser(data);
      localStorage.setItem("token", res.data.token);
      toast.success("Successfully logged in!");
      window.location.href = "/dashboard";
    } catch (err) {
      toast.error(err.response?.data?.msg || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-dark-900 transition-colors duration-300">
      <div className="bg-white dark:bg-dark-800 border border-slate-200 dark:border-slate-700 w-full max-w-md p-8 md:p-10 rounded-2xl shadow-xl fade-in relative">
        <h2 className="text-3xl font-heading font-bold text-slate-900 dark:text-white mb-2 text-center">Welcome Back</h2>
        <p className="text-slate-500 dark:text-textMuted text-center mb-8">Sign in to your AI Portfolio Builder</p>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <Input
            label="Email Address"
            type="email"
            required
            placeholder="you@example.com"
            onChange={e => setData({ ...data, email: e.target.value })}
            className="bg-slate-50 dark:bg-dark-900 text-slate-900 dark:text-white"
          />
          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="••••••••"
              onChange={e => setData({ ...data, password: e.target.value })}
              className="bg-slate-50 dark:bg-dark-900 text-slate-900 dark:text-white"
            />
            <button
              type="button"
              className="absolute right-3 top-[38px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <Button 
            type="submit" 
            isLoading={loading}
            className="w-full bg-primary hover:bg-primary/90 text-white dark:text-dark-900 shadow-md transition-all duration-200 block text-center"
            size="lg"
          >
            Sign In
          </Button>
        </form>
        
        <p className="mt-6 text-center text-slate-500 dark:text-textMuted text-sm">
          Don't have an account? <Link to="/register" className="text-primary hover:underline font-medium">Sign up</Link>
        </p>
      </div>
    </div>
  );
}