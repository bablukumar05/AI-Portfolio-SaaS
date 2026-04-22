import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getProjects } from "../../services/projectService";
import { ExternalLink, Github, Star, FolderGit2 } from "lucide-react";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    getProjects()
      .then(res => setProjects(res.data))
      .catch(() => console.log("Error fetching projects"));
  }, []);

  const categories = ["All", "Full Stack", "Frontend", "Mobile Dev", "UI/UX"];

  const filteredProjects = projects.filter(p => {
    if (activeCategory === "All") return true;
    return p.category === activeCategory;
  });

  return (
    <section id="projects" className="py-32 px-6 relative z-10 bg-slate-50 dark:bg-dark-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        
        {/* Modern Header block */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
           <div className="max-w-2xl">
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <h2 className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-sm mb-4">
                  <FolderGit2 size={18} /> Portfolio Showcase
                </h2>
                <h3 className="text-4xl md:text-6xl font-heading font-black text-slate-900 dark:text-white leading-tight">
                  Featured <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Deployments.</span>
                </h3>
              </motion.div>
           </div>
           
           {/* Tab Filter */}
           {projects.length > 0 && (
             <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                      activeCategory === cat 
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl scale-105' 
                      : 'bg-white dark:bg-dark-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 shadow-sm border border-slate-200 dark:border-white/5'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
             </motion.div>
           )}
        </div>

        {/* Matrix Grid */}
        {projects.length === 0 ? (
          <div className="py-32 text-center border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-3xl">
             <p className="text-xl text-slate-500 dark:text-textMuted font-medium">The matrix is empty. Deploy some projects!</p>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredProjects.map((p, i) => (
                <motion.div
                  layout
                  key={p._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="group relative bg-white dark:bg-dark-800 rounded-3xl overflow-hidden border border-slate-200 dark:border-white/5 shadow-xl hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 flex flex-col"
                >
                  {/* Glassmorphism Image Container */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-dark-900">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/90 z-10 opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                    
                    {p.imageUrl ? (
                      <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FolderGit2 className="text-slate-300 dark:text-slate-700 w-24 h-24" />
                      </div>
                    )}

                    {/* Overlay Badges */}
                    <div className="absolute top-4 right-4 z-20 flex gap-2">
                       {p.status === "Live" && <span className="bg-green-500/90 text-white text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full backdrop-blur-md">Live</span>}
                       {p.status === "Beta" && <span className="bg-blue-500/90 text-white text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full backdrop-blur-md">Beta</span>}
                       {p.status === "In Development" && <span className="bg-orange-500/90 text-white text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full backdrop-blur-md">Dev</span>}
                    </div>
                    {p.featured && (
                      <div className="absolute top-4 left-4 z-20 bg-primary/90 backdrop-blur-md text-slate-900 px-3 py-1 text-xs font-bold rounded-full flex items-center gap-1 shadow-lg">
                        <Star size={14} className="fill-slate-900" /> Featured
                      </div>
                    )}

                    {/* Overlay Title */}
                    <div className="absolute bottom-0 left-0 w-full p-6 z-20 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                       <h4 className="text-2xl font-bold text-white mb-1 drop-shadow-md">{p.title}</h4>
                       <p className="text-slate-300 text-sm font-medium">{p.category}</p>
                    </div>
                  </div>

                  {/* Details Container */}
                  <div className="p-6 flex-1 flex flex-col bg-white dark:bg-dark-800 relative z-20">
                    <p className="text-slate-600 dark:text-textMuted text-sm mb-6 line-clamp-3 leading-relaxed">
                      {p.description || "A brilliant piece of engineering built to solve complex problems with modern architectural patterns."}
                    </p>

                    {/* Tech Badges */}
                    {p.technologies && p.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-8">
                        {p.technologies.map((tech, idx) => (
                          <span key={idx} className="px-3 py-1 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 text-[11px] font-bold uppercase tracking-wider rounded-lg border border-slate-200 dark:border-white/5">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Action Links */}
                    <div className="mt-auto flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-white/10">
                      {p.liveLink ? (
                        <a href={p.liveLink} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-3 rounded-xl font-bold text-sm hover:scale-[1.02] transition-transform">
                          <ExternalLink size={16} /> Live Demo
                        </a>
                      ) : (
                        <button disabled className="flex-1 py-3 rounded-xl font-bold text-sm bg-slate-100 dark:bg-white/5 text-slate-400 cursor-not-allowed">
                          Private Repo
                        </button>
                      )}
                      
                      {p.githubLink && (
                        <a href={p.githubLink} target="_blank" rel="noreferrer" className="flex items-center justify-center w-12 h-12 bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white rounded-xl hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
                          <Github size={20} />
                        </a>
                      )}
                    </div>
                  </div>

                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
}