import { motion } from "framer-motion";

export default function Certifications({ data = {} }) {
  const {
    subtitle = "Credentials",
    title = "My <span class='text-gradient'>Certifications</span>",
    certsList = "AWS Certified Solutions Architect, Meta Front-End Developer Professional Certificate, Google Cloud Associate Cloud Engineer"
  } = data;

  const certifications = certsList.split(',').map(c => c.trim()).filter(c => c);

  return (
    <section id="certifications" className="py-24 px-6 relative z-10 bg-slate-50 dark:bg-dark-900 border-t border-b border-white/5 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
           <h2 className="text-sm uppercase tracking-widest text-primary mb-3 font-semibold">{subtitle}</h2>
           <h3 className="font-heading text-3xl md:text-5xl font-bold text-slate-900 dark:text-white" dangerouslySetInnerHTML={{ __html: title }}></h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {certifications.map((cert, idx) => (
             <motion.div
               key={idx}
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.5, delay: idx * 0.1 }}
               className="glass-card p-8 rounded-2xl border border-slate-200 dark:border-white/5 hover:border-primary/50 transition-all duration-300 group flex flex-col items-center text-center bg-white dark:bg-dark-800 shadow-lg"
             >
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-dark-900 border border-slate-200 dark:border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 text-primary">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg>
                </div>
                <h4 className="text-xl font-bold text-slate-900 dark:text-white leading-snug">{cert}</h4>
             </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
