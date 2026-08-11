import { useContext, useState } from "react";
import { HiOutlineCheck, HiOutlineMoon, HiOutlineSun, HiOutlinePlus } from "react-icons/hi";
import { ThemeContext } from "../../context/ThemeContext";
import Button from "../ui/Button";

export default function BuilderSidebar({ addSection, handleSave, loading, designSettings, updateDesignSettings }) {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState("sections"); // "sections" or "design"
  const sections = ["Hero", "About", "Skills", "Features", "Projects", "Certifications", "Contact"];

  const themes = ["cyberpunk", "minimal", "sunset", "hacker"];
  const fonts = ["Inter", "Playfair Display", "Fira Code", "Roboto", "Space Grotesk"];

  return (
    <div className="w-72 flex-shrink-0 bg-dark-800 border-r border-white/5 p-6 flex flex-col h-full z-10 shadow-2xl relative">
      <h2 className="text-2xl font-heading font-bold text-white mb-6 text-gradient">Builder AI</h2>
      
      {/* Tabs */}
      <div className="flex bg-dark-900 rounded-lg p-1 mb-6 border border-white/5">
        <button 
          onClick={() => setActiveTab("sections")}
          className={`flex-1 text-sm py-2 rounded-md transition-colors ${activeTab === "sections" ? "bg-white/10 text-white font-medium" : "text-textMuted hover:text-white"}`}
        >
          Sections
        </button>
        <button 
          onClick={() => setActiveTab("design")}
          className={`flex-1 text-sm py-2 rounded-md transition-colors ${activeTab === "design" ? "bg-white/10 text-white font-medium" : "text-textMuted hover:text-white"}`}
        >
          Design
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
        {activeTab === "sections" ? (
          <div className="space-y-4">
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
        ) : (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white mb-3">Theme</label>
              <div className="space-y-2">
                {themes.map(t => (
                  <button
                    key={t}
                    onClick={() => updateDesignSettings("theme", t)}
                    className={`w-full text-left px-4 py-3 rounded-xl border transition-colors capitalize ${designSettings.theme === t ? "border-primary bg-primary/10 text-primary" : "border-white/5 bg-dark-900 text-textMuted hover:border-white/20 hover:text-white"}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white mb-3">Typography</label>
              <select 
                value={designSettings.font}
                onChange={(e) => updateDesignSettings("font", e.target.value)}
                className="w-full bg-dark-900 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                style={{ fontFamily: designSettings.font }}
              >
                {fonts.map(f => (
                  <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>
                ))}
              </select>
            </div>
          </div>
        )}
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