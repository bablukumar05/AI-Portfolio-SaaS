import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { HiArrowRight, HiOutlineCalendar, HiOutlineClock } from "react-icons/hi";
import { getBlogs } from "../../services/blogService";

export default function BlogPreview({ data = {} }) {
  const {
    subtitle = "Latest Articles",
    title = "Insights & <span class='text-gradient'>Thoughts</span>"
  } = data;

  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    getBlogs()
      .then(res => {
        // Grab the latest 3 blogs
        const publishedBlogs = res.data.filter(b => !b.status || b.status === 'Published');
        setBlogs(publishedBlogs.slice(0, 3));
      })
      .catch(() => console.log("Error fetching blogs for preview"));
  }, []);

  if (blogs.length === 0) return null; // Don't show if no blogs

  return (
    <section id="blog-preview" className="py-24 px-6 relative z-10 bg-slate-50 dark:bg-dark-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <h2 className="text-sm uppercase tracking-widest text-primary mb-3 font-semibold">{subtitle}</h2>
            <h3 className="font-heading text-3xl md:text-5xl font-bold text-slate-900 dark:text-white" dangerouslySetInnerHTML={{ __html: title }}></h3>
          </div>
          <Link to="/blog" className="hidden md:flex items-center gap-2 text-primary hover:text-white dark:hover:text-white transition-colors font-semibold group">
            View All Posts <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog, idx) => (
            <motion.div
              key={blog._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group bg-white dark:bg-dark-800 rounded-3xl overflow-hidden border border-slate-200 dark:border-white/5 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <div className="relative aspect-video overflow-hidden bg-slate-100 dark:bg-dark-900">
                {blog.coverImage ? (
                  <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-200 dark:bg-dark-800 text-slate-400 dark:text-slate-600">No Image</div>
                )}
              </div>
              
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 dark:text-textMuted mb-4">
                  <span className="flex items-center gap-1"><HiOutlineCalendar size={14} /> {new Date(blog.createdAt).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1 text-primary"><HiOutlineClock size={14} /> 5 min read</span>
                </div>
                
                <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                  <Link to={`/blog/${blog.slug}`}>{blog.title}</Link>
                </h4>
                <p className="text-slate-600 dark:text-textMuted text-sm mb-6 line-clamp-3">
                  {blog.excerpt || "Read more about this topic..."}
                </p>
                
                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-white/10">
                  <Link to={`/blog/${blog.slug}`} className="text-sm font-bold text-primary hover:text-slate-900 dark:hover:text-white flex items-center gap-2 w-fit group/link">
                    Read Article <HiArrowRight className="group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-10 text-center md:hidden">
          <Link to="/blog" className="inline-flex items-center gap-2 bg-slate-200 dark:bg-dark-800 text-slate-900 dark:text-white px-6 py-3 rounded-full font-bold hover:bg-primary hover:text-slate-900 transition-colors">
            View All Posts <HiArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}
