import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SortableSection from "./SortableSection";

export default function BuilderCanvas({ sections, removeSection, updateSectionData }) {
  return (
    <div className="w-full h-full bg-slate-50 dark:bg-[#0b0c10]">
      <SortableContext items={sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
        {sections.map(section => (
          <SortableSection key={section.id} section={section} removeSection={removeSection} updateSectionData={updateSectionData} />
        ))}
      </SortableContext>
    </div>
  );
}