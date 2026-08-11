import { motion } from "framer-motion";
import { HiBriefcase, HiAcademicCap } from "react-icons/hi";

export default function Experience({ data = {} }) {
  const {
    subtitle = "My Journey",
    title = "Experience & <span class='text-gradient'>Education</span>"
  } = data;

  const timeline = [
    {
      id: 1,
      type: "work",
      title: "Senior Full Stack Engineer",
      organization: "Tech Innovators Inc.",
      duration: "2023 - Present",
      description: "Leading the development of highly scalable SaaS platforms using the MERN stack. Mentoring junior developers and architecting cloud-native solutions."
    },
    {
      id: 2,
      type: "work",
      title: "Software Developer",
      organization: "Creative Solutions LLC",
      duration: "2020 - 2023",
      description: "Developed and maintained interactive web applications, focusing on React frontends and Node.js microservices."
    },
    {
      id: 3,
      type: "education",
      title: "M.S. Computer Science",
      organization: "State University",
      duration: "2018 - 2020",
      description: "Specialized in Artificial Intelligence and Distributed Systems. Graduated with Honors."
    },
    {
      id: 4,
      type: "education",
      title: "B.S. Software Engineering",
      organization: "Tech Institute",
      duration: "2014 - 2018",
      description: "Core coursework in Data Structures, Algorithms, and Software Architecture."
    }
  ];

  return (
    <section id="experience" className="py-24 px-6 relative z-10 bg-slate-50 dark:bg-dark-900 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-sm uppercase tracking-widest text-primary mb-3 font-semibold">{subtitle}</h2>
          <h3 className="font-heading text-3xl md:text-5xl font-bold text-slate-900 dark:text-white" dangerouslySetInnerHTML={{ __html: title }}></h3>
        </div>

        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-white/10 transform md:-translate-x-1/2"></div>

          <div className="space-y-12">
            {timeline.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className={`relative flex flex-col md:flex-row items-center justify-between ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Timeline Icon */}
                <div className="absolute left-4 md:left-1/2 w-10 h-10 rounded-full bg-slate-100 dark:bg-dark-800 border-4 border-slate-50 dark:border-dark-900 flex items-center justify-center transform -translate-x-1/2 z-10 shadow-lg text-primary">
                  {item.type === "work" ? <HiBriefcase size={20} /> : <HiAcademicCap size={20} />}
                </div>

                {/* Content Card */}
                <div className={`w-full md:w-5/12 pl-12 md:pl-0 ${idx % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
                  <div className="bg-white dark:bg-dark-800/60 p-6 rounded-2xl border border-slate-200 dark:border-white/5 shadow-md hover:shadow-lg hover:border-primary/50 transition-all duration-300">
                    <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold mb-3">
                      {item.duration}
                    </span>
                    <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{item.title}</h4>
                    <h5 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">{item.organization}</h5>
                    <p className="text-slate-600 dark:text-textMuted leading-relaxed text-sm">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
