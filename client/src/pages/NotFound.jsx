import { Link } from "react-router-dom";
import { HiHome } from "react-icons/hi";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-900 flex items-center justify-center p-6 transition-colors duration-300 relative overflow-hidden">
      
      {/* Background Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[100px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center z-10 glass-card p-12 max-w-lg border-white/5"
      >
        <h1 className="text-8xl font-heading font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-4">404</h1>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Page Not Found</h2>
        <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
          Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-dark-900 font-bold px-8 py-4 rounded-xl shadow-lg transition-transform hover:-translate-y-1"
        >
          <HiHome size={20} />
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
}
