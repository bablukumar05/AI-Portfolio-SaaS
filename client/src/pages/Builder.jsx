import { useState, useEffect } from "react";
import BuilderSidebar from "../components/builder/BuilderSidebar";
import BuilderCanvas from "../components/builder/BuilderCanvas";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { savePortfolio, getPortfolio } from "../services/portfolioService";
import toast from "react-hot-toast";
import Spinner from "../components/ui/Spinner";
import { Monitor, Smartphone, Tablet, CopyPlus } from "lucide-react";
import MagicResumeUpload from "../components/builder/MagicResumeUpload";

export default function Builder() {
  const [sections, setSections] = useState([]);
  const [designSettings, setDesignSettings] = useState({ theme: "dark", font: "Inter" });
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [viewport, setViewport] = useState("desktop"); // desktop, tablet, mobile

  useEffect(() => {
    // Load existing portfolio sections on mount
    getPortfolio().then(res => {
      if (res.data) {
        if (res.data.sections) setSections(res.data.sections);
        if (res.data.design) setDesignSettings(res.data.design);
      }
    }).catch(err => toast.error("Failed to load generic portfolio"))
      .finally(() => setInitialLoad(false));
  }, []);

  useEffect(() => {
    if (designSettings.font) {
      const link = document.createElement("link");
      link.href = `https://fonts.googleapis.com/css2?family=${designSettings.font.replace(/\s+/g, '+')}:wght@300;400;500;600;700&display=swap`;
      link.rel = "stylesheet";
      document.head.appendChild(link);
      return () => { document.head.removeChild(link); };
    }
  }, [designSettings.font]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setSections((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const addSection = (type) => {
    setSections([...sections, { id: `${type.toLowerCase()}-${Date.now()}`, type, data: {} }]);
  };

  const removeSection = (id) => {
    setSections(sections.filter(s => s.id !== id));
  };

  const updateSectionData = (id, newData) => {
    setSections(sections.map(s => s.id === id ? { ...s, data: { ...s.data, ...newData } } : s));
  };

  const handleMagicGenerate = (generatedSections) => {
    setSections(generatedSections);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await savePortfolio({ sections, design: designSettings });
      toast.success("Portfolio layout saved successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save portfolio configuration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex h-[calc(100vh-64px)] bg-slate-50 dark:bg-dark-900 text-slate-900 dark:text-textMuted overflow-hidden transition-colors duration-300 theme-${designSettings.theme}`} style={{ fontFamily: designSettings.font }}>
      <BuilderSidebar
        addSection={addSection}
        handleSave={handleSave}
        loading={loading}
        designSettings={designSettings}
        updateDesignSettings={(key, value) => setDesignSettings({ ...designSettings, [key]: value })}
      />
      <div className="flex-1 flex flex-col bg-[#0b0c10] relative">
        {/* Top Viewport Bar */}
        <div className="h-14 border-b border-white/10 bg-dark-900 flex items-center justify-between px-6 z-20">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          </div>
          <div className="flex bg-dark-800 rounded-lg p-1 border border-white/5">
            <button onClick={() => setViewport("desktop")} className={`p-1.5 rounded-md transition-colors ${viewport === "desktop" ? "bg-white/10 text-white" : "text-slate-500 hover:text-white"}`}>
              <Monitor size={18} />
            </button>
            <button onClick={() => setViewport("tablet")} className={`p-1.5 rounded-md transition-colors ${viewport === "tablet" ? "bg-white/10 text-white" : "text-slate-500 hover:text-white"}`}>
              <Tablet size={18} />
            </button>
            <button onClick={() => setViewport("mobile")} className={`p-1.5 rounded-md transition-colors ${viewport === "mobile" ? "bg-white/10 text-white" : "text-slate-500 hover:text-white"}`}>
              <Smartphone size={18} />
            </button>
          </div>
          <div className="w-12"></div> {/* Spacer for symmetry */}
        </div>

        <div className="flex-1 overflow-y-auto w-full p-4 md:p-8 flex justify-center custom-scrollbar relative">

          <div
            className="transition-all duration-500 ease-in-out bg-slate-50 dark:bg-dark-900 shadow-2xl relative"
            style={{
              width: viewport === "desktop" ? "100%" : viewport === "tablet" ? "768px" : "375px",
              maxWidth: "1200px",
              minHeight: "800px"
            }}
          >
            {initialLoad ? (
              <div className="h-full flex items-center justify-center">
                <Spinner size="lg" />
              </div>
            ) : sections.length === 0 ? (
              <div className="h-full px-6">
                <MagicResumeUpload onGenerate={handleMagicGenerate} />
              </div>
            ) : (
              <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <BuilderCanvas sections={sections} removeSection={removeSection} updateSectionData={updateSectionData} />
              </DndContext>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}