import { useState, useEffect } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import api from "../services/api";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import toast from "react-hot-toast";
import { Loader2, Plus, Edit2, Trash2, Wand2, X } from "lucide-react";

export default function ManageBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiTopic, setAiTopic] = useState("");

  const [formData, setFormData] = useState({
    _id: null,
    title: "",
    slug: "",
    content: "",
    category: "",
    imageUrl: "",
    metaTitle: "",
    metaDescription: "",
  });

  const fetchBlogs = async () => {
    try {
      const res = await api.get("/blogs");
      setBlogs(res.data);
    } catch (err) {
      toast.error("Failed to fetch blogs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleEdit = (blog) => {
    setFormData(blog);
    setFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await api.delete(`/blogs/${id}`);
      setBlogs(blogs.filter(b => b._id !== id));
      toast.success("Blog deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete blog.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return toast.error("Title and Content are required.");

    // Auto-generate slug if not provided
    if (!formData.slug) {
      formData.slug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + "-" + Date.now().toString().slice(-4);
    }

    try {
      if (formData._id) {
        const res = await api.put(`/blogs/${formData._id}`, formData);
        setBlogs(blogs.map(b => (b._id === res.data._id ? res.data : b)));
        toast.success("Blog updated successfully!");
      } else {
        const res = await api.post("/blogs", formData);
        setBlogs([res.data, ...blogs]);
        toast.success("Blog created successfully!");
      }
      setFormOpen(false);
      resetForm();
    } catch (err) {
      console.error(err);
      toast.error("Error saving blog.");
    }
  };

  const handleAIGenerate = async () => {
    if (!aiTopic) return toast.error("Please enter a topic for AI generation.");
    setAiLoading(true);
    try {
      const res = await api.post("/blogs/generate", { topic: aiTopic });
      setFormData(prev => ({
        ...prev,
        title: res.data.title,
        content: res.data.content,
        category: res.data.tags[0] || "Tech",
      }));
      toast.success("AI Content Generated!");
      setAiTopic("");
    } catch (err) {
      toast.error(err.response?.data?.msg || "AI Generation Failed.");
    } finally {
      setAiLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ _id: null, title: "", slug: "", content: "", category: "", imageUrl: "", metaTitle: "", metaDescription: "" });
  };

  const toolbarOptions = [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike", "blockquote", "code-block"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image"],
    ["clean"],
  ];

  if (loading) return <div className="min-h-screen pt-32 flex justify-center"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-900 pt-24 pb-12 px-6 md:px-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-white dark:bg-dark-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-white/5 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Blog Manager</h1>
            <p className="text-slate-500 dark:text-textMuted text-sm">Create, edit, and orchestrate your content.</p>
          </div>
          {!formOpen && (
            <Button onClick={() => { resetForm(); setFormOpen(true); }} className="flex items-center gap-2 bg-primary text-slate-900">
              <Plus size={18} /> New Post
            </Button>
          )}
        </div>

        {/* Editor Form Modal/Section */}
        {formOpen ? (
          <Card className="p-8 animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex justify-between items-center mb-8 border-b border-slate-200 dark:border-white/10 pb-4">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{formData._id ? "Edit Post" : "Compose Post"}</h2>
              <button onClick={() => setFormOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full text-slate-500 transition-colors"><X size={20} /></button>
            </div>

            {/* AI Generator Tools */}
            {!formData._id && (
              <div className="mb-8 p-6 bg-gradient-to-r from-blue-500/10 to-primary/10 rounded-xl border border-primary/20">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                  <Wand2 className="text-primary" /> AI Blog Generator
                </h3>
                <div className="flex gap-4">
                  <Input
                    placeholder="e.g. The Future of React Serverside Components"
                    value={aiTopic}
                    onChange={e => setAiTopic(e.target.value)}
                    className="bg-white dark:bg-dark-900 flex-1"
                  />
                  <Button onClick={handleAIGenerate} disabled={aiLoading} className="bg-primary text-dark-900 whitespace-nowrap min-w-[140px]">
                    {aiLoading ? <Loader2 className="animate-spin w-5 h-5 mx-auto" /> : "Generate"}
                  </Button>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Input label="Post Title" required placeholder="My Awesome Topic" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                <Input label="Category" placeholder="Tech, AI, UI/UX" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} />
                <Input label="URL Slug (Optional)" placeholder="my-awesome-topic" value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} />
                <Input label="Cover Image URL" placeholder="https://..." value={formData.imageUrl} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Content</label>
                <div className="bg-white text-slate-900 rounded-lg overflow-hidden border border-slate-300">
                  <ReactQuill
                    theme="snow"
                    value={formData.content}
                    onChange={val => setFormData({ ...formData, content: val })}
                    modules={{ toolbar: toolbarOptions }}
                    className="h-96 w-full"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-slate-200 dark:border-white/10 mt-12">
                <Input label="SEO Meta Title" placeholder="Title for search engines" value={formData.metaTitle} onChange={e => setFormData({ ...formData, metaTitle: e.target.value })} />
                <Input label="SEO Meta Description" placeholder="Short summary for search results" value={formData.metaDescription} onChange={e => setFormData({ ...formData, metaDescription: e.target.value })} />
              </div>

              <div className="pt-6 flex justify-end gap-4">
                <Button type="button" onClick={() => setFormOpen(false)} className="bg-transparent border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300">Cancel</Button>
                <Button type="submit" className="bg-primary text-dark-900 px-8 font-bold">Publish Post</Button>
              </div>
            </form>
          </Card>
        ) : (
          <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-sm border border-slate-200 dark:border-white/5 overflow-hidden">
            <div className="overflow-x-auto min-h-[400px]">
              <table className="w-full text-left text-slate-600 dark:text-textMuted">
                <thead className="bg-slate-50 dark:bg-dark-900/50 uppercase text-xs font-bold text-slate-500 dark:text-slate-400">
                  <tr>
                    <th className="px-6 py-4">Article Title</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Stats</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {blogs.length === 0 ? (
                    <tr><td colSpan="4" className="text-center py-12">No blogs found. Start writing!</td></tr>
                  ) : blogs.map(b => (
                    <tr key={b._id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-white flex flex-col">
                        {b.title}
                        <span className="text-xs font-normal text-slate-400">/{b.slug}</span>
                      </td>
                      <td className="px-6 py-4"><span className="bg-slate-100 dark:bg-white/10 px-2 py-1 rounded text-xs">{b.category || "Tech"}</span></td>
                      <td className="px-6 py-4 text-sm flex gap-4">
                        <span>👁️ {b.views || 0}</span>
                        <span>❤️ {b.likes || 0}</span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button onClick={() => handleEdit(b)} className="p-2 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:text-primary rounded-lg transition-colors"><Edit2 size={16} /></button>
                        <button onClick={() => handleDelete(b._id)} className="p-2 bg-red-100 dark:bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
