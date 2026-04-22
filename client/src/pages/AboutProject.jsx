import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Server, Database, Code2, Rocket } from "lucide-react";
import Card from "../components/ui/Card";
import { motion } from "framer-motion";

export default function AboutProject() {
  const features = [
    "Premium Dark/Light Mode Toggling with Persistence",
    "Drag & Drop Portfolio Builder using @dnd-kit/core",
    "Real-time Inline Editing inside the Canvas",
    "Secure JWT Authentication and Protected Routes",
    "Analytics Dashboard with Recharts Visualizations",
    "Skeleton Loading States for Optimal UX",
    "Full Mobile Responsiveness with Tailwind Grid/Flexbox",
    "Toast Notifications integrated via React-Hot-Toast"
  ];

  const techStack = [
    { title: "Frontend", tools: ["React 18", "Vite", "Tailwind CSS", "Framer Motion", "Recharts"] },
    { title: "Backend", tools: ["Node.js", "Express.js", "Mongoose", "JWT Auth", "Multer"] },
    { title: "Database", tools: ["MongoDB Atlas", "Cloudinary (Images)"] },
    { title: "Deployment", tools: ["Vercel (Client)", "Render (Server)"] },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-900 pt-20 p-6 md:p-10 transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-12 fade-in">
        
        {/* Header */}
        <div className="text-center space-y-4 relative">
          <Link to="/dashboard" className="absolute left-0 top-2 lg:top-4 text-slate-500 hover:text-slate-900 dark:text-textMuted dark:hover:text-white transition-colors flex items-center gap-2">
            <ArrowLeft size={20} /> Back
          </Link>
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-5xl font-heading font-bold text-slate-900 dark:text-white mb-2">About This Project</h1>
            <p className="text-xl text-slate-500 dark:text-textMuted">The ultimate AI Portfolio SaaS built on the MERN Stack.</p>
          </motion.div>
        </div>

        {/* Features Matrix */}
        <div className="grid md:grid-cols-2 gap-6 pt-8">
          <Card className="p-8 group hover:-translate-y-1 transition-all duration-300">
             <div className="flex items-center gap-3 mb-6">
                <Rocket className="text-primary w-8 h-8" />
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Key Features</h2>
             </div>
             <ul className="space-y-4">
                {features.map((feature, i) => (
                  <motion.li 
                    key={i} 
                    initial={{ opacity: 0, x: -10 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-3 text-slate-600 dark:text-textMuted"
                  >
                    <CheckCircle2 className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                    {feature}
                  </motion.li>
                ))}
             </ul>
          </Card>

          <Card className="p-8 group hover:-translate-y-1 transition-all duration-300">
             <div className="flex items-center gap-3 mb-6">
                <Code2 className="text-purple-500 w-8 h-8" />
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Tech Stack</h2>
             </div>
             <div className="space-y-6">
                {techStack.map((stack, i) => (
                  <div key={i}>
                    <div className="flex items-center gap-2 mb-2">
                      {i === 0 && <Code2 size={16} className="text-primary" />}
                      {i === 1 && <Server size={16} className="text-secondary" />}
                      {i === 2 && <Database size={16} className="text-green-500" />}
                      {i === 3 && <Rocket size={16} className="text-orange-500" />}
                      <span className="font-semibold text-slate-800 dark:text-slate-300">{stack.title}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {stack.tools.map((tool, j) => (
                         <span key={j} className="px-3 py-1 bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300 rounded-md text-sm font-medium">
                           {tool}
                         </span>
                      ))}
                    </div>
                  </div>
                ))}
             </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
