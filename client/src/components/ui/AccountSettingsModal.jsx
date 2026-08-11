import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { updateProfile } from "../../services/authService";
import Modal from "./Modal";
import Input from "./Input";
import Button from "./Button";

export default function AccountSettingsModal({ isOpen, onClose, user, onUpdate }) {
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    profilePicture: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        bio: user.bio || "",
        profilePicture: user.profilePicture || "",
        password: "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Only send password if it's filled out
      const submitData = { ...formData };
      if (!submitData.password) {
        delete submitData.password;
      }

      await updateProfile(submitData);
      onUpdate();
      onClose();
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-white dark:bg-dark-800 rounded-2xl w-full max-w-md mx-auto overflow-hidden shadow-2xl relative">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-100 dark:border-white/10 flex justify-between items-center bg-slate-50 dark:bg-dark-900/50">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Account Settings</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 text-sm rounded-lg border border-red-200 dark:border-red-500/30">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. John Doe"
            />
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="A short bio about yourself..."
                rows={3}
                className="w-full bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all resize-none"
              />
            </div>

            <Input
              label="Profile Picture URL"
              name="profilePicture"
              value={formData.profilePicture}
              onChange={handleChange}
              placeholder="https://example.com/avatar.jpg"
            />

            <div className="pt-2 border-t border-slate-100 dark:border-white/10">
              <Input
                label="New Password (Optional)"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Leave blank to keep current"
              />
            </div>

            <div className="pt-4 flex gap-3">
              <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1 flex justify-center" disabled={loading}>
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
}
