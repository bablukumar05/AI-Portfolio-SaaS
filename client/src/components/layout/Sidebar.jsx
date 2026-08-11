import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Paintbrush, 
  FolderGit2, 
  FileText, 
  CreditCard, 
  LogOut,
  X
} from "lucide-react";

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();

  const links = [
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "AI Builder", path: "/builder", icon: <Paintbrush size={20} /> },
    { name: "Projects", path: "/manage-projects", icon: <FolderGit2 size={20} /> },
    { name: "Blogs", path: "/manage-blogs", icon: <FileText size={20} /> },
    { name: "Billing", path: "/billing", icon: <CreditCard size={20} /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`fixed top-0 left-0 h-screen w-64 bg-white dark:bg-dark-900 border-r border-slate-200 dark:border-white/10 flex flex-col transition-transform duration-300 ease-in-out z-50 ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        
        {/* Header / Logo */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-200 dark:border-white/10">
          <Link to="/" className="text-2xl font-heading font-black tracking-tighter">
            AI<span className="text-primary">.</span>Portfolio
          </Link>
          <button onClick={onClose} className="lg:hidden text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
          {links.map((link) => {
            const isActive = location.pathname.startsWith(link.path);
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-slate-600 dark:text-textMuted hover:bg-slate-100 dark:hover:bg-dark-800 hover:text-slate-900 dark:hover:text-white"
                }`}
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
              >
                {link.icon}
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-colors font-medium text-slate-600 dark:text-textMuted hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}