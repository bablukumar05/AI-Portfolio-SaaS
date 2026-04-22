import { useState, useEffect } from "react";
import BuilderSidebar from "../components/builder/BuilderSidebar";
import BuilderCanvas from "../components/builder/BuilderCanvas";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { savePortfolio, getPortfolio } from "../services/portfolioService";
import toast from "react-hot-toast";
import Spinner from "../components/ui/Spinner";
import EmptyState from "../components/ui/EmptyState";
import { CopyPlus } from "lucide-react";

export default function Builder() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    // Load existing portfolio sections on mount
    getPortfolio().then(res => {
      if (res.data && res.data.sections) {
        setSections(res.data.sections);
      }
    }).catch(err => toast.error("Failed to load generic portfolio"))
      .finally(() => setInitialLoad(false));
  }, []);

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

  const handleSave = async () => {
    setLoading(true);
    try {
      await savePortfolio({ sections });
      toast.success("Portfolio layout saved successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save portfolio configuration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-dark-900 text-slate-900 dark:text-textMuted overflow-hidden transition-colors duration-300 pt-16">
      <BuilderSidebar addSection={addSection} handleSave={handleSave} loading={loading} />
      <div className="flex-1 overflow-y-auto w-full relative p-8">
        {initialLoad ? (
           <div className="h-full flex items-center justify-center">
              <Spinner size="lg" />
           </div>
        ) : sections.length === 0 ? (
           <div className="h-full flex items-center justify-center max-w-lg mx-auto">
              <EmptyState 
                 icon={<CopyPlus />}
                 title="Canvas is Empty"
                 description="Drag or click elements from the sidebar to start constructing your layout. You can reorder them anytime."
              />
           </div>
        ) : (
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <BuilderCanvas sections={sections} removeSection={removeSection} updateSectionData={updateSectionData} />
          </DndContext>
        )}
      </div>
    </div>
  );
}