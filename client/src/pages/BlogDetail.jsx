import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import api from "../services/api";
import Spinner from "../components/ui/Spinner";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import toast from "react-hot-toast";
import { ArrowLeft, Calendar, Eye, Heart, MessageSquare, Share2, User } from "lucide-react";
import { motion } from "framer-motion";

export default function BlogDetail() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [commentName, setCommentName] = useState("");
  const [isLiking, setIsLiking] = useState(false);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    setLoading(true);
    api.get(`/blogs/${slug}`)
      .then(res => {
         setBlog(res.data);
         api.get(`/blogs`).then(allRes => {
           const others = allRes.data.filter(b => b._id !== res.data._id).slice(0, 2);
           setRelated(others);
         }).catch(() => {});
      })
      .catch(err => {
         console.error(err);
         toast.error("Failed to load generic post");
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const handleLike = async () => {
    if (isLiking || !blog) return;
    setIsLiking(true);
    try {
      const res = await api.put(`/blogs/${blog._id}/like`);
      setBlog({ ...blog, likes: res.data.likes });
      toast.success("Thanks for loving this post!");
    } catch (error) {
      toast.error("Couldn't like the post right now.");
    } finally {
      setIsLiking(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog?.metaTitle || blog?.title,
          text: blog?.metaDescription || `Check out this insight on ${blog?.category}`,
          url: window.location.href,
        });
      } catch (err) {
        console.error(err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !commentName.trim()) {
      return toast.error("Please provide both name and a comment.");
    }
    try {
      const res = await api.post(`/blogs/${blog._id}/comment`, { user: commentName, text: commentText });
      setBlog({ ...blog, comments: res.data.comments });
      setCommentText("");
      setCommentName("");
      toast.success("Comment added successfully!");
    } catch (err) {
      toast.error("Failed to post comment.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-dark-900 pt-32 pb-12 px-6 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-dark-900 pt-32 pb-12 px-6">
        <EmptyState 
           title="Post Not Found" 
           description="The article you are looking for does not exist or has been removed."
           action={<Link to="/blog"><Button>Return to Blog</Button></Link>}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-900 pt-24 pb-16 px-6 md:px-10 transition-colors duration-300">
      
      {/* SEO META TAGS via Helmet */}
      <Helmet>
        <title>{blog.metaTitle || `${blog.title} | AI Portfolio`}</title>
        <meta name="description" content={blog.metaDescription || blog.content.substring(0, 150).replace(/<[^>]+>/g, '')} />
        {blog.imageUrl && <meta property="og:image" content={blog.imageUrl} />}
      </Helmet>

      <motion.article 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <Link to="/blog" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-medium mb-8">
          <ArrowLeft size={18} /> Back to Insights
        </Link>
        
        {/* Banner Image */}
        {blog.imageUrl && (
          <div className="w-full aspect-[21/9] rounded-2xl overflow-hidden mb-10 shadow-xl bg-slate-200 dark:bg-dark-800">
             <img src={blog.imageUrl} alt={blog.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Heading Info */}
        <div className="space-y-6 mb-12">
           <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
              <span className="bg-primary/20 text-primary px-4 py-1.5 rounded-full uppercase tracking-wider">{blog.category || "Tech"}</span>
              <div className="flex items-center gap-2 text-slate-500 dark:text-textMuted"><Calendar size={16} /> {new Date(blog.createdAt).toLocaleDateString()}</div>
              <div className="flex items-center gap-2 text-slate-500 dark:text-textMuted"><Eye size={16} /> {blog.views} Views</div>
           </div>
           
           <h1 className="text-4xl md:text-5xl font-heading font-bold text-slate-900 dark:text-white leading-tight">
             {blog.title}
           </h1>
        </div>

        {/* Rich Text Body */}
        <div 
          className="prose prose-lg dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 mb-16"
          dangerouslySetInnerHTML={{ __mainContent: false, __html: blog.content }}
        />

        {/* Action Bar */}
        <div className="flex items-center justify-between py-6 border-y border-slate-200 dark:border-white/10 mb-16">
          <button 
            onClick={handleLike} 
            disabled={isLiking}
            className="flex items-center gap-2 text-slate-600 dark:text-textMuted hover:text-red-500 transition-colors group"
          >
             <Heart size={24} className={`group-hover:fill-red-500 ${isLiking ? 'animate-pulse' : ''}`} /> 
             <span className="font-bold text-lg">{blog.likes || 0}</span>
          </button>
          
          <button onClick={handleShare} className="flex items-center gap-2 bg-slate-200 dark:bg-dark-800 hover:bg-slate-300 dark:hover:bg-white/5 px-4 py-2 rounded-lg text-slate-700 dark:text-slate-300 font-medium transition-colors">
            <Share2 size={18} /> Share
          </button>
        </div>

        {/* Comments Section */}
        <section className="bg-white dark:bg-dark-800 p-8 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3 mb-8">
            <MessageSquare className="text-primary" />
            Discussion ({blog.comments?.length || 0})
          </h3>

          {!localStorage.getItem("token") ? (
             <div className="mb-10 p-6 bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-white/10 rounded-xl text-center">
               <p className="text-slate-600 dark:text-slate-300 font-medium mb-3">Join the conversation</p>
               <Link to="/login" className="inline-block bg-primary text-slate-900 font-bold px-6 py-2 rounded-lg transition-colors hover:bg-primary/90">Sign in to comment</Link>
             </div>
          ) : (
             <form onSubmit={handleCommentSubmit} className="mb-10 space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                   <input 
                     type="text" 
                     required 
                     placeholder="Your display name..." 
                     value={commentName} 
                     onChange={(e) => setCommentName(e.target.value)}
                     className="md:w-1/3 bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-3 text-slate-800 dark:text-white focus:outline-none focus:border-primary"
                   />
                </div>
                <textarea 
                   required 
                   placeholder="What are your thoughts on this?" 
                   value={commentText} 
                   onChange={(e) => setCommentText(e.target.value)}
                   className="w-full min-h-[120px] bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-white/10 rounded-lg p-4 text-slate-800 dark:text-white focus:outline-none focus:border-primary resize-y"
                />
                <Button type="submit" className="bg-primary hover:bg-primary/90 text-dark-900 px-8">Post Comment</Button>
             </form>
          )}

          <div className="space-y-6">
            {(!blog.comments || blog.comments.length === 0) ? (
              <p className="text-slate-500 dark:text-textMuted text-center py-6">Be the first to share your perspective!</p>
            ) : (
              blog.comments.slice().reverse().map((c, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-xl bg-slate-50 dark:bg-dark-900/50 border border-slate-100 dark:border-transparent">
                  <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-dark-800 flex items-center justify-center shrink-0">
                    <User className="text-slate-500" size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-bold text-slate-900 dark:text-white">{c.userName || c.user}</span>
                      <span className="text-xs text-slate-400">{new Date(c.createdAt || c.date).toLocaleDateString()}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300">{c.text}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Related Posts Section */}
        {related.length > 0 && (
          <section className="mt-16 pt-10 border-t border-slate-200 dark:border-white/10">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Related Reads</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {related.map(rBlog => (
                <Link to={`/blog/${rBlog.slug}`} key={rBlog._id} className="group block bg-white dark:bg-dark-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-white/5 hover:border-primary/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  {rBlog.imageUrl && (
                    <div className="w-full h-48 overflow-hidden bg-slate-200 dark:bg-dark-900">
                      <img src={rBlog.imageUrl} alt={rBlog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <div className="p-6">
                    <span className="text-xs font-bold text-primary uppercase tracking-wider mb-2 block">{rBlog.category || "Tech"}</span>
                    <h4 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors line-clamp-2">{rBlog.title}</h4>
                    <div className="mt-4 flex items-center justify-between text-sm text-slate-500 dark:text-textMuted">
                      <span>{new Date(rBlog.createdAt).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1"><Eye size={14} /> {rBlog.views || 0}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

      </motion.article>
    </div>
  );
}
