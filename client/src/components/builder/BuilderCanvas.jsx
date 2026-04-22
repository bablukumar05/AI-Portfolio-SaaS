import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SortableSection from "./SortableSection";

export default function BuilderCanvas({ sections, removeSection, updateSectionData }) {
  return (
    <div className="min-h-screen bg-black/40 p-8">
      <div className="max-w-6xl mx-auto bg-dark-900 shadow-2xl overflow-hidden border border-white/5 min-h-[800px] flex flex-col relative">
        <div className="bg-dark-800 border-b border-white/5 p-3 flex items-center space-x-2">
           <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
           <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
           <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
           <span className="text-xs text-textMuted ml-4 font-mono">Live Preview</span>
        </div>
        <div className="flex-1 w-full bg-[#0b0c10]">
          <SortableContext items={sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
            {sections.length === 0 ? (
              <div className="flex items-center justify-center h-full text-textMuted font-medium text-lg pt-40 flex-col space-y-4">
                <svg className="w-20 h-20 text-white/5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                <span>Drag or add sections from the sidebar to start building your portfolio.</span>
              </div>
            ) : (
              sections.map(section => (
                <SortableSection key={section.id} section={section} removeSection={removeSection} updateSectionData={updateSectionData} />
              ))
            )}
          </SortableContext>
        </div>
      </div>
    </div>
  );
}