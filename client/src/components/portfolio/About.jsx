import { motion } from "framer-motion";
import profileImg from "./profile.png";

export default function About({ data = {} }) {
  const {
    subtitle = "About Me",
    title = "Passionate Developer & <span class='text-gradient'>Innovator</span>.",
    description1 = "Hello! I am a full-stack developer dedicated to building elegant, highly responsive interfaces and robust backend architectures. I thrive in turning complex problems into simple, beautiful, and intuitive designs.",
    description2 = "My career is built on a passion for continuous learning and driving innovation in tech, currently specializing in the MERN stack with modern animation frameworks.",
    skillsTitle = "Core Skills",
    skillsList = "JavaScript, React.js, Node.js, Tailwind CSS, MongoDB, Express, Framer Motion, UI/UX Design"
  } = data;

  const skills = skillsList.split(',').map(s => s.trim());

  return (
    <section id="about" className="py-24 px-6 relative z-10 bg-[#fbfcfd] dark:bg-dark-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-16 items-center">

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:w-1/3 relative flex justify-center"
          >
            <div className="w-64 h-64 md:w-80 md:h-80 rounded-full border-4 border-slate-200 dark:border-white/10 overflow-hidden shadow-2xl relative bg-slate-100 dark:bg-dark-800 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 to-transparent mix-blend-overlay z-10 pointer-events-none"></div>
              <img
                src={profileImg}
                alt="Profile"
                className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/20 rounded-full blur-3xl"></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="md:w-2/3"
          >
            <h2 className="text-sm uppercase tracking-widest text-primary mb-3 font-semibold">{subtitle}</h2>
            <h3
              className="font-heading text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6"
              dangerouslySetInnerHTML={{ __html: title }}
            />

            <div className="text-slate-600 dark:text-textMuted text-lg mb-8 space-y-4 leading-relaxed">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >{description1}</motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >{description2}</motion.p>
            </div>

            <div>
              <h4 className="text-slate-900 dark:text-white font-semibold text-lg mb-4">{skillsTitle}</h4>
              <motion.div
                className="flex flex-wrap gap-3"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1
                    }
                  }
                }}
              >
                {skills.map((skill, i) => (
                  <motion.span
                    key={i}
                    variants={{
                      hidden: { opacity: 0, scale: 0.8, y: 10 },
                      visible: { opacity: 1, scale: 1, y: 0 }
                    }}
                    className="px-4 py-2 bg-slate-100 dark:bg-dark-800 border border-slate-200 dark:border-white/5 text-sm font-medium text-slate-700 dark:text-textMuted rounded-full hover:border-primary/50 hover:text-slate-900 dark:hover:text-white transition-all cursor-default hover:shadow-lg hover:shadow-primary/10"
                  >
                    {skill}
                  </motion.span>
                ))}
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}