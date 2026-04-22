import { useEffect, useState } from "react";
import { getBlogs } from "../services/blogService";
import { Link } from "react-router-dom";
import Card from "../components/ui/Card";
import Skeleton from "../components/ui/Skeleton";
import EmptyState from "../components/ui/EmptyState";
import { BookOpen, Calendar, ArrowRight, Search, TrendingUp, Tags, Eye } from "lucide-react";
import { motion } from "framer-motion";

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filtering state
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    getBlogs()
      .then(res => {
        setBlogs(res.data);
      })
      .catch((err) => {
         console.error("Error fetching blogs", err);
      })
      .finally(() => {
        setTimeout(() => setLoading(false), 500);
      });
  }, []);

  // Compute Categories from existing blogs uniquely
  const categories = ["All", ...new Set(blogs.map(b => b.category || "Tech"))];

  // Filtering Logic
  const filteredBlogs = blogs.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || (b.category || "Tech") === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Featured Blog Logic (Most Views)
  const featuredBlog = blogs.length > 0 ? [...blogs].sort((a, b) => (b.views || 0) - (a.views || 0))[0] : null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-900 pt-24 pb-12 px-6 md:px-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header & Search */}
        <div className="text-center fade-in space-y-6 flex flex-col items-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-heading font-bold text-slate-900 dark:text-white"
          >
            Insights &amp; <span className="text-primary">Writings</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-500 dark:text-textMuted max-w-2xl"
          >
            Explore my latest thoughts on AI, web development, and the future of software engineering.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full max-w-2xl relative mt-4"
          >
            <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search articles by title..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-dark-800 border-2 border-slate-200 dark:border-white/10 rounded-full py-3 pl-12 pr-6 text-slate-900 dark:text-white focus:outline-none focus:border-primary transition-colors shadow-sm"
            />
          </motion.div>
        </div>

        {/* Categories Bar */}
        {!loading && blogs.length > 0 && (
          <div className="flex items-center gap-3 overflow-x-auto pb-4 hide-scrollbar">
            <Tags className="text-slate-400 shrink-0 mr-2" size={20} />
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat ? 'bg-primary text-slate-900 shadow-md' : 'bg-slate-200 dark:bg-dark-800 text-slate-600 dark:text-textMuted hover:bg-slate-300 dark:hover:bg-white/10'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="space-y-12">
            <Skeleton className="w-full h-[400px] rounded-2xl" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="flex flex-col h-[350px]">
                  <Skeleton className="h-48 w-full rounded-lg mb-4" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <div className="mt-auto flex justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : blogs.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <EmptyState 
              icon={<BookOpen />}
              title="No Articles Published"
              description="I haven't written any blog posts yet. Check back later for updates on my latest tech insights!"
            />
          </motion.div>
        ) : (
          <div className="space-y-16">
            
            {/* Featured Blog Section */}
            {searchQuery === "" && activeCategory === "All" && featuredBlog && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-2xl blur-lg opacity-25 group-hover:opacity-50 transition duration-500"></div>
                <div className="relative bg-white dark:bg-dark-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-xl flex flex-col md:flex-row">
                  <div className="w-full md:w-1/2 relative min-h-[300px]">
                     {featuredBlog.imageUrl ? (
                       <img src={featuredBlog.imageUrl} alt={featuredBlog.title} className="w-full h-full object-cover absolute inset-0 group-hover:scale-105 transition-transform duration-700" />
                     ) : (
                       <div className="w-full h-full absolute inset-0 bg-slate-200 dark:bg-dark-900 flex items-center justify-center">
                          <TrendingUp className="text-slate-400 w-24 h-24 opacity-50" />
                       </div>
                     )}
                     <div className="absolute top-4 left-4 bg-primary text-slate-900 font-bold px-3 py-1 text-sm rounded-full flex items-center gap-1 shadow-md">
                       <TrendingUp size={16} /> Featured
                     </div>
                  </div>
                  <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                     <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-textMuted mb-4 font-medium">
                        <span className="text-secondary">{featuredBlog.category || "Tech"}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1"><Eye size={16}/> {featuredBlog.views || 0} views</div>
                     </div>
                     <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 leading-tight group-hover:text-primary transition-colors">
                       {featuredBlog.title}
                     </h2>
                     {/* Remove HTML tags safely from preview */}
                     <p className="text-slate-600 dark:text-textMuted mb-8 text-lg line-clamp-3">
                       {featuredBlog.content.replace(/<[^>]+>/g, '') || "Click below to read this trending insight..."}
                     </p>
                     <Link to={`/blog/${featuredBlog.slug || featuredBlog._id}`} className="inline-flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-xl font-bold hover:gap-3 transition-all w-max shadow-md">
                       Read Article <ArrowRight size={20} />
                     </Link>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Grid Layout */}
            {filteredBlogs.length === 0 ? (
               <div className="text-center py-20">
                 <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300">No results found for "{searchQuery}"</h3>
                 <p className="text-slate-500 mt-2">Try adjusting your filters or search terms.</p>
               </div>
            ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {filteredBlogs.map((b, index) => (
                   <motion.div 
                     key={b._id}
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: (index % 3) * 0.1 }}
                   >
                     <Card className="flex flex-col h-full group hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 border border-slate-200 dark:border-white/5 !p-0 overflow-hidden">
                       <div className="relative aspect-video w-full bg-slate-200 dark:bg-dark-800 overflow-hidden">
                         {b.imageUrl ? (
                           <img src={b.imageUrl} alt={b.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                         ) : (
                           <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-dark-800 border-b border-slate-200 dark:border-white/5 transition-transform duration-500">
                             <BookOpen className="text-slate-300 dark:text-slate-700 w-16 h-16" />
                           </div>
                         )}
                       </div>
                       
                       <div className="flex-1 flex flex-col p-6">
                         <div className="flex justify-between items-center mb-3">
                           <span className="text-xs font-bold uppercase tracking-wider text-primary">
                             {b.category || "Tech"}
                           </span>
                           <div className="flex items-center gap-1 text-slate-400 text-xs">
                             <Eye size={14} /> {b.views || 0}
                           </div>
                         </div>
     
                         <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                           {b.title}
                         </h2>
                         
                         <p className="text-slate-600 dark:text-textMuted mb-6 line-clamp-3 text-sm">
                           {b.content.replace(/<[^>]+>/g, '') || "Unlock the full perspective..."}
                         </p>
     
                         <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/10">
                           <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-textMuted font-medium">
                             <Calendar size={14} />
                             <span>{new Date(b.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                           </div>
                           <Link to={`/blog/${b.slug || b._id}`} className="flex items-center gap-1 text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                             Read <ArrowRight size={16} />
                           </Link>
                         </div>
                       </div>
                     </Card>
                   </motion.div>
                 ))}
               </div>
            )}
            
          </div>
        )}

      </div>
    </div>
  );
}