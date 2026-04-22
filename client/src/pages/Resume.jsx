import { useState } from "react";
import api from "../services/api";
import ImageUploader from "../components/upload/ImageUploader";

export default function Resume() {
  const [points, setPoints] = useState("");
  const [improvedText, setImprovedText] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [resumeUrl, setResumeUrl] = useState("");

  const handleGenerate = async () => {
    if (!points.trim()) return;
    setLoadingAI(true);
    try {
      const res = await api.post("/chat", { 
        message: `Act as an expert resume writer. Improve the following bullet points into professional, impactful resume achievements using action verbs and metrics. Here are the points: ${points}`
      });
      setImprovedText(res.data.reply);
    } catch {
      alert("AI generation failed.");
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 pt-24 p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-heading font-bold text-white text-gradient">Resume Management</h1>
          <p className="text-textMuted mt-1">Generate professional content with AI or upload an existing PDF.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* AI Content Generator */}
          <div className="glass-card p-6 flex flex-col space-y-4 h-fit">
             <h2 className="text-2xl font-bold text-white flex items-center gap-2">
               <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
               AI Resume Builder
             </h2>
             <p className="text-sm text-textMuted mb-2">Write rough bullet points of your experience below. Our AI will transform them into professional achievements.</p>
             <textarea 
               value={points}
               onChange={(e) => setPoints(e.target.value)}
               rows="5"
               placeholder="- built a website using react&#10;- managed 5 team members&#10;- increased sales"
               className="w-full bg-dark-800 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-secondary"
             />
             <button 
               onClick={handleGenerate}
               disabled={loadingAI || !points}
               className="w-full bg-primary text-dark-900 font-bold py-3 rounded-lg hover:opacity-90 disabled:opacity-50"
             >
               {loadingAI ? 'Generating...' : 'Enhance with AI'}
             </button>
             
             {improvedText && (
               <div className="mt-4 p-4 bg-dark-900/80 rounded-lg border border-white/10 relative">
                 <h3 className="text-sm font-semibold text-secondary mb-2 uppercase tracking-wide">AI Recommendation</h3>
                 <div className="text-white text-sm whitespace-pre-line leading-relaxed">{improvedText}</div>
               </div>
             )}
          </div>

          {/* PDF Upload & Preview */}
          <div className="glass-card p-6 flex flex-col space-y-4">
             <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
               <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
               Upload & Preview PDF
             </h2>
             <p className="text-sm text-textMuted mb-2">Upload your polished resume to display it publicly on your portfolio.</p>
             
             {!resumeUrl ? (
               <ImageUploader onUploadSuccess={(url) => setResumeUrl(url)} accept="application/pdf,image/*" />
             ) : (
               <div className="w-full aspect-[1/1.4] rounded-lg overflow-hidden border border-white/10 relative group bg-dark-800">
                 <iframe src={`${resumeUrl.replace("http://", "https://")}#toolbar=0`} className="w-full h-full" title="Resume PDF" />
                 <div className="absolute inset-0 bg-dark-900/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                   <a href={resumeUrl} target="_blank" rel="noreferrer" className="bg-primary text-dark-900 font-bold py-2 px-6 rounded shadow-lg hover:bg-white text-sm">Download</a>
                   <button onClick={() => setResumeUrl("")} className="bg-red-500/80 text-white font-bold py-2 px-6 rounded shadow-lg hover:bg-red-500 text-sm">Remove</button>
                 </div>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}