import { useState, useEffect } from "react";
import { X, Loader2, Sparkles } from "lucide-react";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Button from "../ui/Button";

// Centralized schema for what fields each component type supports
const SECTION_SCHEMAS = {
  Hero: [
    { name: "subheading", label: "Subheading", type: "text" },
    { name: "heading", label: "Heading (supports HTML)", type: "text" },
    { name: "description", label: "Description", type: "textarea", aiEnhance: true },
    { name: "primaryButton", label: "Primary Button Text", type: "text" },
    { name: "secondaryButton", label: "Secondary Button Text", type: "text" }
  ],
  About: [
    { name: "subtitle", label: "Subtitle", type: "text" },
    { name: "title", label: "Title (supports HTML)", type: "text" },
    { name: "description1", label: "Paragraph 1", type: "textarea", aiEnhance: true },
    { name: "description2", label: "Paragraph 2", type: "textarea", aiEnhance: true },
    { name: "skillsTitle", label: "Skills Title", type: "text" },
    { name: "skillsList", label: "Skills (comma separated)", type: "textarea" }
  ],
  Contact: [
    { name: "title", label: "Title (supports HTML)", type: "text" },
    { name: "description", label: "Description", type: "textarea", aiEnhance: true },
    { name: "buttonText", label: "Submit Button Text", type: "text" }
  ],
  Skills: [
    { name: "subtitle", label: "Subtitle", type: "text" },
    { name: "title", label: "Title (supports HTML)", type: "text" }
  ],
  Features: [
    { name: "subtitle", label: "Subtitle", type: "text" },
    { name: "title", label: "Title (supports HTML)", type: "text" }
  ],
  Projects: [
    { name: "subtitle", label: "Subtitle", type: "text" },
    { name: "title", label: "Title (supports HTML)", type: "text" }
  ],
  Certifications: [
    { name: "subtitle", label: "Subtitle", type: "text" },
    { name: "title", label: "Title (supports HTML)", type: "text" },
    { name: "certsList", label: "Certifications (comma separated)", type: "textarea" }
  ]
};

export default function SectionEditorModal({ isOpen, onClose, section, onSave }) {
  const [formData, setFormData] = useState({});
  const [isEnhancing, setIsEnhancing] = useState(null); // Field name being enhanced
  const [activePromptField, setActivePromptField] = useState(null);
  const [customPrompts, setCustomPrompts] = useState({});

  useEffect(() => {
    if (section && isOpen) {
      setFormData(section.data || {});
    }
  }, [section, isOpen]);

  if (!section) return null;

  const schema = SECTION_SCHEMAS[section.type] || [];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEnhance = async (fieldName, currentValue) => {
    if (!currentValue) return;
    
    setIsEnhancing(fieldName);
    try {
      const instruction = customPrompts[fieldName] 
        ? `Follow this specific instruction: "${customPrompts[fieldName]}".` 
        : "Rewrite it to be more professional, engaging, and impactful.";
        
      const messages = [
        { role: "system", content: `You are a professional copywriter for a software developer's portfolio. The user will provide a draft text. ${instruction} Output ONLY the final rewritten text, without any conversational filler or quotes around it.` },
        { role: "user", content: currentValue }
      ];

      const token = localStorage.getItem("token");
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = token;

      const res = await fetch((import.meta.env.VITE_API_URL || "http://localhost:5000/api") + "/chat", {
        method: "POST",
        headers,
        body: JSON.stringify({ messages })
      });

      if (!res.ok) throw new Error("Failed to enhance");

      // Read from stream
      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      
      let fullResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n").filter(line => line.trim() !== "");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const dataStr = line.replace("data: ", "");
            if (dataStr === "[DONE]") break;
            
            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.text) {
                fullResponse += parsed.text;
                setFormData(prev => ({ ...prev, [fieldName]: fullResponse }));
              }
            } catch (err) {}
          }
        }
      }
    } catch (err) {
      console.error("AI Enhance error:", err);
      alert("Failed to enhance text. Make sure you have a valid OpenAI API key or wait a moment.");
    } finally {
      setIsEnhancing(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-white dark:bg-dark-800 rounded-2xl w-full max-w-2xl mx-auto overflow-hidden shadow-2xl relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-100 dark:border-white/10 flex justify-between items-center bg-slate-50 dark:bg-dark-900/50">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Edit {section.type} Section</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {schema.length === 0 ? (
            <div className="text-center text-slate-500 py-10">
              No editable properties for this section type yet.
            </div>
          ) : (
            <form id="section-form" onSubmit={handleSubmit} className="space-y-5">
              {schema.map(field => (
                <div key={field.name} className="space-y-1">
                  <div className="flex justify-between items-end mb-1">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {field.label}
                    </label>
                    {field.aiEnhance && (
                      <button
                        type="button"
                        onClick={() => activePromptField === field.name ? handleEnhance(field.name, formData[field.name]) : setActivePromptField(field.name)}
                        disabled={!formData[field.name] || isEnhancing === field.name}
                        className={`text-xs font-bold flex items-center gap-1 disabled:opacity-50 transition-all px-3 py-1.5 rounded-lg ${activePromptField === field.name ? "bg-primary text-dark-900" : "text-primary bg-primary/10 hover:bg-primary/20"}`}
                      >
                        {isEnhancing === field.name ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                        {activePromptField === field.name ? "Run AI" : "AI Co-pilot"}
                      </button>
                    )}
                  </div>
                  
                  {field.aiEnhance && activePromptField === field.name && (
                    <div className="flex items-center gap-2 mb-2 animate-in slide-in-from-top-2">
                       <input 
                         type="text" 
                         placeholder='e.g. "Make it aggressive", "Shorten to 2 sentences"...'
                         value={customPrompts[field.name] || ""}
                         onChange={(e) => setCustomPrompts({...customPrompts, [field.name]: e.target.value})}
                         className="flex-1 bg-primary/5 border border-primary/20 text-sm rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200 outline-none focus:border-primary/50 placeholder-primary/40"
                         onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleEnhance(field.name, formData[field.name]))}
                       />
                       <button type="button" onClick={() => setActivePromptField(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-2">
                         <X size={14} />
                       </button>
                    </div>
                  )}
                  
                  {field.type === "textarea" ? (
                    <textarea
                      name={field.name}
                      value={formData[field.name] || ""}
                      onChange={handleChange}
                      rows={4}
                      className="w-full bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                    />
                  ) : (
                    <Input
                      name={field.name}
                      value={formData[field.name] || ""}
                      onChange={handleChange}
                    />
                  )}
                </div>
              ))}
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-dark-900/50 flex gap-3 justify-end">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="section-form">
            Save Changes
          </Button>
        </div>
      </div>
    </Modal>
  );
}
