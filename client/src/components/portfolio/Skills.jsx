import { motion } from "framer-motion";

export default function Skills() {
  const skillCategories = [
    {
      title: "Frontend Development",
      skills: ["React.js", "JavaScript (ES6+)", "Tailwind CSS", "HTML5 & CSS3", "Framer Motion", "Vite"]
    },
    {
      title: "Backend & Database",
      skills: ["Node.js", "Express.js", "MongoDB", "Mongoose", "RESTful APIs", "JWT Auth"]
    },
    {
      title: "Tools & Deployment",
      skills: ["Git & GitHub", "Vercel", "Render", "Postman", "OpenAI API", "Cloudinary"]
    }
  ];

  return (
    <section id="skills" className="py-24 px-6 relative z-10 bg-dark-900 border-t border-b border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
           <h2 className="text-sm uppercase tracking-widest text-primary mb-3 font-semibold">Technical Expertise</h2>
           <h3 className="font-heading text-3xl md:text-5xl font-bold text-white">My <span className="text-gradient">Skills</span></h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {skillCategories.map((category, idx) => (
             <motion.div
               key={idx}
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.5, delay: idx * 0.1 }}
               className="glass-card p-8 rounded-2xl border border-white/5 hover:border-secondary/50 transition-all duration-300 group"
             >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-dark-800 border border-white/10 flex items-center justify-center text-secondary group-hover:bg-secondary/20 transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
                  </div>
                  <h4 className="text-xl font-bold text-white">{category.title}</h4>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  {category.skills.map((skill, sIdx) => (
                    <span 
                      key={sIdx} 
                      className="px-4 py-2 bg-dark-800 border border-white/5 text-sm font-medium text-textMuted rounded-full group-hover:border-secondary/30 group-hover:text-white transition-colors cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
             </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
