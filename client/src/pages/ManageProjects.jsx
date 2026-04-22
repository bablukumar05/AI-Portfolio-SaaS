import { useState, useEffect } from "react";
import api from "../services/api";
import ImageUploader from "../components/upload/ImageUploader";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Card from "../components/ui/Card";
import Modal from "../components/ui/Modal";
import toast from "react-hot-toast";
import { Plus, X, Trash2, Edit2, Loader2, Star } from "lucide-react";

export default function ManageProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });
  const [formOpen, setFormOpen] = useState(false);

  const [formData, setFormData] = useState({
    _id: null,
    title: "",
    description: "",
    imageUrl: "",
    githubLink: "",
    liveLink: "",
    category: "Full Stack",
    status: "Live",
    featured: false,
    technologies: "", // we will split by comma
    features: "",     // we will split by comma
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await api.get("/projects");
      setProjects(res.data);
    } catch {
      toast.error("Error fetching projects");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (project) => {
    setFormData({
      ...project,
      technologies: project.technologies?.join(", ") || "",
      features: project.features?.join(", ") || ""
    });
    setFormOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    // Format arrays
    const formattedData = {
      ...formData,
      technologies: formData.technologies.split(",").map(t => t.trim()).filter(Boolean),
      features: formData.features.split(",").map(f => f.trim()).filter(Boolean),
    };

    try {
      if (formData._id) {
        const res = await api.put(`/projects/${formData._id}`, formattedData);
        setProjects(projects.map(p => p._id === res.data._id ? res.data : p));
        toast.success("Project updated!");
      } else {
        const res = await api.post("/projects", formattedData);
        setProjects([res.data, ...projects]);
        toast.success("Project created!");
      }
      resetForm();
    } catch {
      toast.error("Failed to save project.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/projects/${deleteModal.id}`);
      setProjects(projects.filter(p => p._id !== deleteModal.id));
      toast.success("Project deleted.");
      setDeleteModal({ open: false, id: null });
    } catch {
      toast.error("Failed to delete project.");
    }
  };

  const resetForm = () => {
    setFormData({ _id: null, title: "", description: "", imageUrl: "", githubLink: "", liveLink: "", category: "Full Stack", status: "Live", featured: false, technologies: "", features: "" });
    setFormOpen(false);
  };

  if (loading) return <div className="min-h-screen pt-32 flex justify-center"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-900 pt-24 p-6 md:p-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-white dark:bg-dark-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-white/5 gap-4">
           <div>
             <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Project Matrix</h1>
             <p className="text-slate-500 dark:text-textMuted text-sm">Manage your portfolio projects and case studies.</p>
           </div>
           {!formOpen && (
             <Button onClick={() => { resetForm(); setFormOpen(true); }} className="flex items-center gap-2 bg-primary text-slate-900">
               <Plus size={18} /> Add Project
             </Button>
           )}
        </div>

        {formOpen ? (
          <Card className="p-8 animate-in slide-in-from-bottom-4 duration-300">
             <div className="flex justify-between items-center mb-8 border-b border-slate-200 dark:border-white/10 pb-4">
               <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{formData._id ? "Edit Project" : "New Project"}</h2>
               <button onClick={resetForm} className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full text-slate-500 transition-colors"><X size={20}/></button>
             </div>

             <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Input label="Project Title" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                  
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block mb-2">Category</label>
                      <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-white/10 rounded-lg p-3 text-slate-900 dark:text-white focus:outline-none focus:border-primary">
                        <option>Full Stack</option>
                        <option>Frontend</option>
                        <option>Mobile Dev</option>
                        <option>UI/UX</option>
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block mb-2">Status</label>
                      <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-white/10 rounded-lg p-3 text-slate-900 dark:text-white focus:outline-none focus:border-primary">
                        <option>Live</option>
                        <option>Beta</option>
                        <option>In Development</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                   <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block mb-2">Description</label>
                   <textarea rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-white/10 rounded-lg p-3 text-slate-900 dark:text-white focus:outline-none focus:border-primary resize-y" />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <Input label="Technologies (comma separated)" placeholder="React, Node.js, MongoDB" value={formData.technologies} onChange={e => setFormData({...formData, technologies: e.target.value})} />
                  <Input label="Key Features (comma separated)" placeholder="Auth, Checkout, Admin Panel" value={formData.features} onChange={e => setFormData({...formData, features: e.target.value})} />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                   <Input label="GitHub Link" type="url" value={formData.githubLink} onChange={e => setFormData({...formData, githubLink: e.target.value})} />
                   <Input label="Live Demo Link" type="url" value={formData.liveLink} onChange={e => setFormData({...formData, liveLink: e.target.value})} />
                </div>

                <div className="flex items-center gap-6 pb-6 border-b border-slate-200 dark:border-white/10">
                   <div className="flex-1">
                     <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block mb-2">Cover Image</label>
                     {formData.imageUrl ? (
                       <div className="relative rounded-lg overflow-hidden border border-slate-200 dark:border-white/10 w-fit">
                         <img src={formData.imageUrl} alt="preview" className="h-32 object-cover" />
                         <button type="button" onClick={() => setFormData({...formData, imageUrl: ""})} className="absolute top-2 right-2 bg-slate-900/80 p-1 rounded hover:text-red-400 text-white"><X size={16}/></button>
                       </div>
                     ) : (
                       <ImageUploader onUploadSuccess={(url) => setFormData({...formData, imageUrl: url})} />
                     )}
                   </div>
                   
                   <div className="flex-1 flex items-center justify-center">
                     <label className="flex items-center gap-3 cursor-pointer p-4 border border-slate-200 dark:border-white/10 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                        <input type="checkbox" checked={formData.featured} onChange={e => setFormData({...formData, featured: e.target.checked})} className="w-5 h-5 accent-primary" />
                        <span className="font-bold text-slate-700 dark:text-white flex items-center gap-2"><Star className={formData.featured ? "text-primary fill-primary" : "text-slate-400"} /> Mark as Featured</span>
                     </label>
                   </div>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <Button type="button" onClick={resetForm} className="bg-transparent border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300">Cancel</Button>
                  <Button type="submit" isLoading={submitLoading} className="bg-primary text-dark-900 px-8 font-bold">Save Project</Button>
                </div>
             </form>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {projects.length === 0 ? (
               <div className="col-span-full text-center py-20 text-slate-500">No projects deployed yet.</div>
             ) : projects.map(p => (
               <Card key={p._id} className="flex flex-col relative group">
                  {p.featured && <div className="absolute -top-3 -right-3 bg-primary text-dark-900 p-2 rounded-full shadow-lg z-10"><Star size={16} className="fill-dark-900" /></div>}
                  <div className="h-40 bg-slate-200 dark:bg-dark-800 rounded-lg overflow-hidden mb-4 relative">
                     {p.imageUrl ? (
                       <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                     ) : (
                       <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">No Image</div>
                     )}
                     <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded">
                       {p.category}
                     </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{p.title}</h3>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {p.technologies?.slice(0, 3).map((t, i) => <span key={i} className="text-[10px] uppercase font-bold bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded">{t}</span>)}
                      {p.technologies?.length > 3 && <span className="text-[10px] text-slate-400">+{p.technologies.length-3}</span>}
                    </div>
                  </div>
                  <div className="mt-auto flex gap-2 pt-4 border-t border-slate-100 dark:border-white/5">
                    <Button variant="outline" className="flex-1 py-2 text-sm" onClick={() => handleEdit(p)}>Edit</Button>
                    <Button className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white py-2" onClick={() => setDeleteModal({ open: true, id: p._id })}><Trash2 size={16}/></Button>
                  </div>
               </Card>
             ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: null })}
        title="Confirm Deletion"
        onConfirm={handleDeleteConfirm}
        confirmText="Delete Project"
        danger
      >
        <p>This will permanently erase this project. Are you sure?</p>
      </Modal>
    </div>
  );
}
