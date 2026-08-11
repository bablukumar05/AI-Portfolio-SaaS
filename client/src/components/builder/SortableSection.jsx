import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Hero from "../portfolio/Hero";
import About from "../portfolio/About";
import Skills from "../portfolio/Skills";
import Features from "../portfolio/Features";
import Projects from "../portfolio/Projects";
import Certifications from "../portfolio/Certifications";
import Contact from "../portfolio/Contact";
import Card from "../ui/Card";
import { useState } from "react";
import SectionEditorModal from "./SectionEditorModal";

const COMPONENTS = {
  Hero,
  About,
  Skills,
  Features,
  Projects,
  Certifications,
  Contact
};

export default function SortableSection({ section, removeSection, updateSectionData }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });
  const [isEditing, setIsEditing] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || "transform 250ms cubic-bezier(0.18, 0.67, 0.6, 1.22)",
    zIndex: isDragging ? 50 : 1,
  };

  const Component = COMPONENTS[section.type] || (() => <div className="p-10 text-center text-white">Unknown Component: {section.type}</div>);

  return (
    <div ref={setNodeRef} style={style}>
      <Card className={`relative group mb-4 !p-0 overflow-hidden border-2 transition-all duration-300 pointer-events-auto ${isDragging ? "border-primary shadow-2xl shadow-primary/20 scale-[1.02] backdrop-blur-xl bg-dark-900/80" : "border-transparent hover:border-primary/50 bg-dark-900"}`}>
        <div 
          {...attributes} 
          {...listeners} 
          className={`absolute top-4 left-4 border border-white/10 p-2 rounded cursor-grab transition-all z-50 flex items-center shadow-lg hover:text-white ${isDragging ? "opacity-100 bg-primary text-dark-900 cursor-grabbing" : "bg-dark-800 text-textMuted opacity-0 group-hover:opacity-100 hover:bg-dark-900"}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </div>
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-50">
          <button 
            onClick={() => setIsEditing(true)}
            className="bg-primary hover:bg-primary/80 text-dark-900 p-2 rounded shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
          </button>
          <button 
            onClick={() => removeSection(section.id)}
            className="bg-red-500/80 hover:bg-red-500 text-white p-2 rounded shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <div className="relative z-10 opacity-90 group-hover:opacity-100 transition-opacity p-2">
          <Component data={section.data} onChange={(data) => updateSectionData(section.id, data)} />
        </div>
      </Card>

      <SectionEditorModal 
        isOpen={isEditing} 
        onClose={() => setIsEditing(false)} 
        section={section} 
        onSave={(data) => updateSectionData(section.id, data)}
      />
    </div>
  );
}
