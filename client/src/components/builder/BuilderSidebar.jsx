import { useContext } from "react";
import { HiOutlineCheck, HiOutlineMoon, HiOutlineSun, HiOutlinePlus } from "react-icons/hi";
import { ThemeContext } from "../../context/ThemeContext";
import Button from "../ui/Button";

export default function BuilderSidebar({ addSection, handleSave, loading }) {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const sections = ["Hero", "About", "Skills", "Features", "Projects", "Contact"];

  return (
    <div className="w-72 flex-shrink-0 bg-dark-800 border-r border-white/5 p-6 flex flex-col h-full z-10 shadow-2xl relative">
      <h2 className="text-2xl font-heading font-bold text-white mb-8 text-gradient">Builder AI</h2>
      
      <div className="flex-1 space-y-4">
        {sections.map(type => (
          <Button 
            key={type}
            variant="secondary"
            onClick={() => addSection(type)}
            className="w-full text-left justify-start px-4 py-3 group"
          >
            <div className="bg-white/5 p-1.5 rounded group-hover:bg-primary/20 transition-colors mr-3">
              <HiOutlinePlus className="w-4 h-4 text-textMuted group-hover:text-primary transition-colors" />
            </div>
            {type}
          </Button>
        ))}
      </div>

      <div className="pt-6 border-t border-white/5 mt-auto space-y-4">
        <Button 
          variant="secondary"
          onClick={toggleTheme}
          className="w-full font-medium py-3 rounded-xl flex items-center justify-center gap-2"
        >
          {theme === "dark" ? <HiOutlineSun size={20} /> : <HiOutlineMoon size={20} />}
          {theme === "dark" ? 'Light Mode' : 'Dark Mode'}
        </Button>
        <Button 
          onClick={handleSave}
          isLoading={loading}
          className="w-full bg-gradient-to-r from-primary to-secondary text-dark-900 font-bold py-3.5 rounded-xl border-none shadow-lg shadow-primary/10 gap-2"
        >
          {!loading && <HiOutlineCheck size={20} />}
          Save Changes
        </Button>
      </div>
    </div>
  );
}