import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Hero from "../portfolio/Hero";
import About from "../portfolio/About";
import Skills from "../portfolio/Skills";
import Features from "../portfolio/Features";
import Projects from "../portfolio/Projects";
import Contact from "../portfolio/Contact";
import Card from "../ui/Card";

const COMPONENTS = {
  Hero,
  About,
  Skills,
  Features,
  Projects,
  Contact
};

export default function SortableSection({ section, removeSection, updateSectionData }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const Component = COMPONENTS[section.type] || (() => <div className="p-10 text-center text-white">Unknown Component: {section.type}</div>);

  return (
    <div ref={setNodeRef} style={style}>
      <Card className="relative group mb-4 !p-0 overflow-hidden border-2 border-transparent hover:border-primary/50 transition-colors pointer-events-auto">
        <div 
          {...attributes} 
          {...listeners} 
          className="absolute top-4 left-4 bg-dark-800 border border-white/10 text-textMuted p-2 rounded cursor-grab opacity-0 group-hover:opacity-100 transition-opacity z-50 flex items-center shadow-lg hover:text-white hover:bg-dark-900"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </div>
        <button 
          onClick={() => removeSection(section.id)}
          className="absolute top-4 right-4 bg-red-500/80 hover:bg-red-500 text-white p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 shadow-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        <div className="relative z-10 opacity-90 group-hover:opacity-100 transition-opacity p-2">
          <Component data={section.data} onChange={(data) => updateSectionData(section.id, data)} />
        </div>
      </Card>
    </div>
  );
}
