import { useState, useRef } from "react";
import { UploadCloud, FileText, Loader2, Wand2 } from "lucide-react";
import toast from "react-hot-toast";

export default function MagicResumeUpload({ onGenerate }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file) => {
    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("resume", file);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch((import.meta.env.VITE_API_URL || "http://localhost:5000/api") + "/portfolio/generate", {
        method: "POST",
        headers: {
          ...(token && { Authorization: token })
        },
        body: formData
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.msg || "Failed to generate");
      }

      const data = await res.json();
      if (data && data.sections) {
        onGenerate(data.sections);
        toast.success("Magic Portfolio Generated!");
      } else {
        throw new Error("Invalid response from AI");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to parse resume with AI.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-20">
      <div 
        className={`relative overflow-hidden rounded-3xl border-2 border-dashed transition-all duration-300 p-12 text-center flex flex-col items-center justify-center cursor-pointer min-h-[300px] ${
          isDragging 
            ? "border-primary bg-primary/10 scale-105" 
            : "border-slate-300 dark:border-white/10 hover:border-primary/50 hover:bg-white/5 bg-white dark:bg-dark-800 shadow-xl"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          ref={fileInputRef}
          type="file" 
          className="hidden" 
          accept="application/pdf"
          onChange={handleChange}
        />
        
        {isUploading ? (
          <div className="flex flex-col items-center space-y-4 animate-in fade-in duration-500">
            <div className="relative">
              <Loader2 className="w-16 h-16 text-primary animate-spin" />
              <Wand2 className="w-6 h-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              AI is reading your resume...
            </h3>
            <p className="text-slate-500 dark:text-textMuted max-w-sm">
              Please wait while our models parse your experience and auto-generate the perfect portfolio layout.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <div className={`p-4 rounded-2xl ${isDragging ? "bg-primary text-dark-900" : "bg-primary/10 text-primary"} transition-colors`}>
              <UploadCloud className="w-12 h-12" />
            </div>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
              Magic Auto-Builder
            </h3>
            <p className="text-slate-500 dark:text-textMuted max-w-md text-lg">
              Drag & drop your <span className="font-bold text-primary">PDF Resume</span> here to instantly generate your entire portfolio using AI.
            </p>
            <div className="flex items-center gap-2 text-sm text-slate-400 mt-4 bg-slate-100 dark:bg-white/5 px-4 py-2 rounded-full">
              <FileText size={16} /> Supports .pdf up to 5MB
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-4 mt-8">
        <div className="h-px bg-slate-200 dark:bg-white/10 w-full max-w-[100px]"></div>
        <span className="text-slate-400 text-sm font-medium uppercase tracking-widest">OR</span>
        <div className="h-px bg-slate-200 dark:bg-white/10 w-full max-w-[100px]"></div>
      </div>
      <p className="text-center text-slate-500 dark:text-slate-400 mt-4 text-sm">
        Start from scratch by clicking a section in the sidebar.
      </p>
    </div>
  );
}
