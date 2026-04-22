import { useState } from "react";
import api from "../../services/api";

export default function ImageUploader({ onUploadSuccess, accept = "image/*" }) {
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      onUploadSuccess(res.data.url);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to upload image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative border-2 border-dashed border-white/20 rounded-xl p-6 hover:border-primary/50 transition-colors text-center group cursor-pointer">
      {loading ? (
        <span className="text-primary font-medium text-sm flex justify-center items-center gap-2">
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Uploading...
        </span>
      ) : (
        <div className="text-textMuted flex flex-col items-center gap-2 group-hover:text-white transition-colors">
          <svg className="w-8 h-8 opacity-70 group-hover:opacity-100 group-hover:text-primary transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
          <span className="text-sm font-medium">Click or drag image to upload</span>
        </div>
      )}
      <input
        type="file"
        accept={accept}
        onChange={handleUpload}
        disabled={loading}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
      />
    </div>
  );
}
