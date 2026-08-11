import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDashboardData } from "../services/dashboardService";
import Card from "../components/ui/Card";
import Skeleton from "../components/ui/Skeleton";
import EmptyState from "../components/ui/EmptyState";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { FolderGit2, FileText, Eye, Settings, Share2, LayoutDashboard, Heart, Activity, User, Edit3 } from "lucide-react";
import AccountSettingsModal from "../components/ui/AccountSettingsModal";

import { Helmet } from "react-helmet-async";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const fetchData = () => {
    setLoading(true);
    getDashboardData()
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log("Error fetching dashboard data:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="w-full">
      <Helmet>
        <title>Dashboard | AI Portfolio SaaS</title>
      </Helmet>
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

        {/* AI Insight */}
        {loading ? (
          <Skeleton className="h-20 w-full rounded-2xl" />
        ) : data?.aiInsight ? (
          <Card className="p-4 border-l-4 border-l-secondary bg-gradient-to-r from-slate-100 to-slate-50 dark:from-dark-800 dark:to-dark-900/50">
            <div className="flex items-start gap-3">
              <div className="bg-secondary/20 p-2 rounded-full mt-1">
                <Activity className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-1">AI Insight</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300">{data.aiInsight}</p>
              </div>
            </div>
          </Card>
        ) : null}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="flex flex-col p-6 group hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-slate-500 dark:text-textMuted uppercase tracking-widest">Projects</span>
              <FolderGit2 className="text-primary w-6 h-6" />
            </div>
            {loading ? <Skeleton className="h-10 w-24 rounded-lg" /> : <span className="text-4xl font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{data?.stats?.totalProjects || 0}</span>}
          </Card>

          <Card className="flex flex-col p-6 group hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-slate-500 dark:text-textMuted uppercase tracking-widest">Blogs</span>
              <FileText className="text-secondary w-6 h-6" />
            </div>
            {loading ? <Skeleton className="h-10 w-24 rounded-lg" /> : <span className="text-4xl font-bold text-slate-900 dark:text-white group-hover:text-secondary transition-colors">{data?.stats?.totalBlogs || 0}</span>}
          </Card>

          <Card className="flex flex-col p-6 group hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-slate-500 dark:text-textMuted uppercase tracking-widest">Total Views</span>
              <Eye className="text-purple-500 w-6 h-6" />
            </div>
            {loading ? <Skeleton className="h-10 w-24 rounded-lg" /> : <span className="text-4xl font-bold text-slate-900 dark:text-white group-hover:text-purple-500 transition-colors">{data?.stats?.totalViews || 0}</span>}
          </Card>

          <Card className="flex flex-col p-6 group hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-slate-500 dark:text-textMuted uppercase tracking-widest">Engagement</span>
              <Heart className="text-pink-500 w-6 h-6" />
            </div>
            {loading ? <Skeleton className="h-10 w-24 rounded-lg" /> : <span className="text-4xl font-bold text-slate-900 dark:text-white group-hover:text-pink-500 transition-colors">{data?.stats?.totalLikes || 0}</span>}
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">

          {/* Chart Section */}
          <Card className="lg:col-span-2 p-6 flex flex-col min-h-[400px]">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Traffic Activity</h2>
            {loading ? (
              <div className="w-full h-full flex flex-col gap-2">
                <Skeleton className="h-[300px] w-full" />
              </div>
            ) : (
              <div className="flex-1 w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data?.timelineData || []} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorProjectViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#66fcf1" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#66fcf1" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorBlogViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#45a29e" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#45a29e" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                    <XAxis dataKey="date" stroke="#64748b" tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                    />
                    <Area type="monotone" dataKey="projectViews" name="Project Views" stroke="#66fcf1" strokeWidth={3} fillOpacity={1} fill="url(#colorProjectViews)" />
                    <Area type="monotone" dataKey="blogViews" name="Blog Views" stroke="#45a29e" strokeWidth={3} fillOpacity={1} fill="url(#colorBlogViews)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </Card>

          {/* Sidebar Actions & Lists */}
          <div className="space-y-6">

            {/* User Profile Summary */}
            <Card className="p-6 text-center relative overflow-hidden group">
              <div className="absolute top-2 right-2">
                <button onClick={() => setIsSettingsOpen(true)} className="p-2 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full transition-colors">
                  <Edit3 size={16} className="text-slate-600 dark:text-slate-300" />
                </button>
              </div>
              {loading ? (
                <div className="flex flex-col items-center gap-4 py-4">
                  <Skeleton className="w-24 h-24 rounded-full" />
                  <div className="space-y-2 flex flex-col items-center">
                    <Skeleton className="h-6 w-40 rounded-lg" />
                    <Skeleton className="h-4 w-48 rounded-md" />
                  </div>
                  <Skeleton className="h-20 w-full rounded-xl" />
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full bg-slate-200 dark:bg-dark-800 border-2 border-primary overflow-hidden mb-3">
                    {data?.user?.profilePicture ? (
                      <img src={data.user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-10 h-10 m-auto mt-4 text-slate-400" />
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{data?.user?.name || "User"}</h3>
                  <p className="text-sm text-slate-500 dark:text-textMuted mb-3">{data?.user?.email}</p>
                  {data?.user?.bio && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 italic bg-slate-100 dark:bg-dark-800 p-3 rounded-lg w-full">"{data.user.bio}"</p>
                  )}
                  <div className="mt-4 flex gap-4 text-sm font-medium">
                    <div className="text-center">
                      <span className="block text-primary text-lg">{data?.user?.profileViews || 0}</span>
                      <span className="text-slate-500">Profile Views</span>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Settings className="text-secondary w-5 h-5" />
                Quick Actions
              </h3>
              <div className="flex flex-col gap-3">
                <Link to="/manage-projects" className="flex items-center gap-3 p-3 rounded-xl bg-slate-100 dark:bg-dark-900/50 hover:bg-slate-200 dark:hover:bg-dark-800 transition-colors text-slate-700 dark:text-textMuted font-medium group">
                  <FolderGit2 className="w-5 h-5 group-hover:text-primary transition-colors" /> + New Project
                </Link>
                <Link to="/manage-blogs" className="flex items-center gap-3 p-3 rounded-xl bg-slate-100 dark:bg-dark-900/50 hover:bg-slate-200 dark:hover:bg-dark-800 transition-colors text-slate-700 dark:text-textMuted font-medium group">
                  <FileText className="w-5 h-5 group-hover:text-secondary transition-colors" /> + New Blog
                </Link>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Recent Activity</h2>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex flex-col gap-2">
                      <div className="flex justify-between">
                        <Skeleton className="h-5 w-32 rounded-lg" />
                        <Skeleton className="h-5 w-16 rounded-md" />
                      </div>
                      <Skeleton className="h-3 w-24 rounded-sm" />
                    </div>
                  ))}
                </div>
              ) : !data?.recentActivity?.length ? (
                <EmptyState
                  title="No Activity Yet"
                  description="Start by adding your first project or blog."
                  action={<Link to="/manage-projects" className="text-primary font-medium hover:underline">Add Project</Link>}
                />
              ) : (
                <div className="space-y-3">
                  {data.recentActivity.map((act) => (
                    <div key={act.id} className="p-3 bg-slate-50 dark:bg-dark-900/50 rounded-xl border border-slate-200 dark:border-white/5 flex flex-col justify-center">
                      <div className="flex items-center justify-between">
                        <h4 className="text-slate-900 dark:text-white font-medium line-clamp-1">{act.title}</h4>
                        <span className={`text-xs px-2 py-1 rounded-md ${act.type === 'project' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'}`}>
                          {act.type}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-textMuted mt-1">
                        {new Date(act.createdAt).toLocaleDateString()}
                      </p>
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

      <AccountSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        user={data?.user}
        onUpdate={fetchData}
      />
    </div>
  );
}