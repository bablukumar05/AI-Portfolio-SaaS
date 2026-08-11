import { motion } from "framer-motion";

export default function Features({ data = {} }) {
  const {
    subtitle = "Platform Highlights",
    title = "Why Choose Our <span class='text-gradient'>Engine</span>"
  } = data;

  const features = [
    {
      title: "AI-Powered Generation",
      description: "Dynamically sculpts your portfolio language and content utilizing cutting-edge LLMs.",
      icon: (
        <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
      )
    },
    {
      title: "Flawless Responsiveness",
      description: "Tested against strict breakpoints to guarantee perfect rendering on Mobile, Tablet. and Desktop natively.",
      icon: (
        <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
      )
    },
    {
      title: "Modern Architecture",
      description: "Propelled by React and Vite to produce highly reactive, lightning-fast navigation flows without reloading.",
      icon: (
        <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
      )
    }
  ];

  return (
    <section id="features" className="py-24 px-6 relative z-10 bg-slate-50 dark:bg-dark-900 border-t border-b border-slate-200 dark:border-white/5 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
           <h2 className="text-sm uppercase tracking-widest text-primary mb-3 font-semibold">{subtitle}</h2>
           <h3 className="font-heading text-3xl md:text-5xl font-bold text-slate-900 dark:text-white" dangerouslySetInnerHTML={{ __html: title }}></h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((item, idx) => (
             <motion.div
               key={idx}
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.5, delay: idx * 0.1 }}
               className="bg-white dark:bg-dark-800/40 p-8 rounded-2xl border border-slate-200 dark:border-white/5 hover:border-primary/50 dark:hover:border-primary/50 transition-all duration-300 group shadow-sm hover:shadow-md"
             >
                <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-dark-800 border border-slate-200 dark:border-white/10 flex items-center justify-center mb-6 group-hover:-translate-y-2 transition-transform duration-300">
                  {item.icon}
                </div>
                <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{item.title}</h4>
                <p className="text-slate-600 dark:text-textMuted leading-relaxed">{item.description}</p>
             </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
