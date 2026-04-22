import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProjects } from "../services/projectService";
import Card from "../components/ui/Card";
import Skeleton from "../components/ui/Skeleton";
import EmptyState from "../components/ui/EmptyState";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { FolderGit2, FileText, Eye, Settings, Share2, LayoutDashboard } from "lucide-react";

// Mock Data for the chart
const activityData = [
  { name: "Jan", views: 400 },
  { name: "Feb", views: 300 },
  { name: "Mar", views: 550 },
  { name: "Apr", views: 480 },
  { name: "May", views: 700 },
  { name: "Jun", views: 650 },
  { name: "Jul", views: 1200 },
];

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Artificial delay to show skeleton mapping
    setTimeout(() => {
      getProjects()
        .then((res) => {
          setProjects(res.data);
          setLoading(false);
        })
        .catch(() => {
          console.log("Error fetching projects");
          setLoading(false);
        });
    }, 800);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-900 pt-20 p-6 md:p-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-heading font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <LayoutDashboard className="text-primary w-8 h-8" />
              Dashboard
            </h1>
            <p className="text-slate-500 dark:text-textMuted mt-1">
              Manage your AI-generated portfolio & observe analytics.
            </p>
          </div>
          <div className="flex gap-3">
             <Link to="/builder" className="bg-primary text-white dark:text-dark-900 font-bold px-6 py-2.5 rounded-xl shadow-[0_4px_14px_0_rgba(102,252,241,0.39)] hover:shadow-[0_6px_20px_rgba(102,252,241,0.23)] hover:scale-105 transition-all duration-200">
               Open Builder
             </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="flex flex-col p-6 group hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
             <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-slate-500 dark:text-textMuted uppercase tracking-widest">Projects</span>
                <FolderGit2 className="text-primary w-6 h-6" />
             </div>
             {loading ? <Skeleton className="h-10 w-20" /> : <span className="text-4xl font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{projects.length || 0}</span>}
          </Card>
           
          <Card className="flex flex-col p-6 group hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
             <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-slate-500 dark:text-textMuted uppercase tracking-widest">Blogs</span>
                <FileText className="text-secondary w-6 h-6" />
             </div>
             {loading ? <Skeleton className="h-10 w-20" /> : <span className="text-4xl font-bold text-slate-900 dark:text-white group-hover:text-secondary transition-colors">0</span>}
          </Card>
           
          <Card className="flex flex-col p-6 group hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
             <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-slate-500 dark:text-textMuted uppercase tracking-widest">Profile Views</span>
                <Eye className="text-purple-500 w-6 h-6" />
             </div>
             <span className="text-4xl font-bold text-slate-900 dark:text-white group-hover:text-purple-500 transition-colors">1,204</span>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
           
           {/* Chart Section */}
           <Card className="lg:col-span-2 p-6 flex flex-col min-h-[400px]">
             <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Traffic Activity</h2>
             <div className="flex-1 w-full h-full">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={activityData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                   <defs>
                     <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#66fcf1" stopOpacity={0.8}/>
                       <stop offset="95%" stopColor="#66fcf1" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                   <XAxis dataKey="name" stroke="#64748b" tickLine={false} axisLine={false} />
                   <YAxis stroke="#64748b" tickLine={false} axisLine={false} />
                   <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                      itemStyle={{ color: '#66fcf1' }}
                   />
                   <Area type="monotone" dataKey="views" stroke="#66fcf1" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
                 </AreaChart>
               </ResponsiveContainer>
             </div>
           </Card>

           {/* Sidebar Actions & Lists */}
           <div className="space-y-8">
             
             {/* Quick Actions */}
             <Card className="p-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Settings className="text-secondary w-5 h-5" />
                  Quick Links
                </h3>
                <div className="flex flex-col gap-3">
                  <Link to="/manage-projects" className="flex items-center gap-3 p-3 rounded-xl bg-slate-100 dark:bg-dark-900/50 hover:bg-slate-200 dark:hover:bg-dark-800 transition-colors text-slate-700 dark:text-textMuted font-medium group">
                    <FolderGit2 className="w-5 h-5 group-hover:text-primary transition-colors" /> Manage Projects
                  </Link>
                  <Link to="/manage-blogs" className="flex items-center gap-3 p-3 rounded-xl bg-slate-100 dark:bg-dark-900/50 hover:bg-slate-200 dark:hover:bg-dark-800 transition-colors text-slate-700 dark:text-textMuted font-medium group">
                    <FileText className="w-5 h-5 group-hover:text-secondary transition-colors" /> Manage Blogs
                  </Link>
                </div>
             </Card>

             <Card className="p-6">
               <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Recent Projects</h2>
               {loading ? (
                 <div className="space-y-3">
                   <Skeleton className="h-16 w-full" />
                   <Skeleton className="h-16 w-full" />
                 </div>
               ) : projects.length === 0 ? (
                 <EmptyState 
                   title="No Projects Yet"
                   description="Start by adding your first project to showcase on your portfolio."
                   action={<Link to="/manage-projects" className="text-primary font-medium hover:underline">Add Project</Link>}
                 />
               ) : (
                 <div className="space-y-3">
                   {projects.slice(0, 3).map((p) => (
                     <div key={p._id} className="p-3 bg-slate-50 dark:bg-dark-900/50 rounded-xl border border-slate-200 dark:border-white/5 flex flex-col justify-center">
                       <h4 className="text-slate-900 dark:text-white font-medium">{p.title}</h4>
                       <p className="text-sm text-slate-500 dark:text-textMuted line-clamp-1">{p.description || "No description provided."}</p>
                     </div>
                   ))}
                 </div>
               )}
             </Card>
             
             <Card className="p-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Share2 className="text-primary w-5 h-5" />
                  Share Link
                </h3>
                <div className="flex bg-slate-100 dark:bg-dark-900 rounded-lg overflow-hidden border border-slate-200 dark:border-white/10 p-1">
                  <input type="text" readOnly value="https://portfolio.ai/public/demo" className="bg-transparent px-3 py-2 text-sm text-slate-600 dark:text-textMuted w-full outline-none" />
                  <button onClick={() => { navigator.clipboard.writeText("https://portfolio.ai/public/demo"); alert("Copied!") }} className="bg-slate-200 dark:bg-white/5 hover:bg-slate-300 dark:hover:bg-white/10 px-4 text-sm font-medium text-slate-800 dark:text-white rounded-md transition-colors cursor-pointer">Copy</button>
                </div>
             </Card>

           </div>
        </div>
      </div>
    </div>
  );
}