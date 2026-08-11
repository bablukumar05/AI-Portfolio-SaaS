import { motion } from "framer-motion";
import { HiStar, HiUser } from "react-icons/hi";

export default function Testimonials({ data = {} }) {
  const {
    subtitle = "What People Say",
    title = "Client <span class='text-gradient'>Testimonials</span>"
  } = data;

  const testimonials = [
    {
      id: 1,
      name: "Sarah Jenkins",
      role: "CTO, TechFlow",
      text: "An absolute pleasure to work with. Delivered our complex web application ahead of schedule with flawless code quality and outstanding responsiveness.",
      rating: 5
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Founder, StartupX",
      text: "The attention to detail in the UI/UX design was incredible. Our users love the new platform, and our conversion rates have doubled since launch.",
      rating: 5
    },
    {
      id: 3,
      name: "Emma Watson",
      role: "Product Manager, Innovate Corp",
      text: "Exceptional problem-solving skills and a deep understanding of modern web architectures. Highly recommended for any scalable SaaS project.",
      rating: 5
    }
  ];

  return (
    <section id="testimonials" className="py-24 px-6 relative z-10 bg-white dark:bg-dark-900 border-t border-b border-slate-200 dark:border-white/5 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-sm uppercase tracking-widest text-primary mb-3 font-semibold">{subtitle}</h2>
          <h3 className="font-heading text-3xl md:text-5xl font-bold text-slate-900 dark:text-white" dangerouslySetInnerHTML={{ __html: title }}></h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-slate-50 dark:bg-dark-800/40 p-8 rounded-2xl border border-slate-200 dark:border-white/5 hover:border-primary/50 dark:hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-xl relative group"
            >
              <div className="flex items-center gap-1 text-yellow-400 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <HiStar key={i} size={20} />
                ))}
              </div>
              <p className="text-slate-600 dark:text-textMuted leading-relaxed mb-8 italic">
                "{testimonial.text}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-dark-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
                  <HiUser size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">{testimonial.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
