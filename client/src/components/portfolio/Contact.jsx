import { useState } from "react";
import { motion } from "framer-motion";
import { HiMail, HiPaperAirplane } from "react-icons/hi";
import API from "../../services/api";

export default function Contact({ data = {} }) {
  const {
    title = "Get In Touch",
    description = "Have an opportunity? Send a message.",
    buttonText = "Send Message"
  } = data;

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState(null); // 'sending', 'success', 'error'

  const submit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await API.post("/contact", form);
      setStatus("success");
      setForm({ name: "", email: "", message: "" }); // Reset form
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="py-24 px-6 relative z-10">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-8 md:p-12 relative overflow-hidden"
        >
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
          
          <div className="text-center mb-10 relative z-10">
            <HiMail className="mx-auto text-4xl text-primary mb-4" />
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2" dangerouslySetInnerHTML={{ __html: title }}></h2>
            <p className="text-slate-600 dark:text-textMuted">{description}</p>
          </div>

          <form onSubmit={submit} className="flex flex-col gap-5 relative z-10">
            <div className="grid md:grid-cols-2 gap-5">
              <input
                required
                placeholder="Your Name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full bg-slate-50 dark:bg-dark-900/50 border border-slate-200 dark:border-white/10 rounded-xl p-4 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30 focus:outline-none focus:border-primary transition-colors"
              />
              <input
                required
                type="email"
                placeholder="Email Address"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full bg-slate-50 dark:bg-dark-900/50 border border-slate-200 dark:border-white/10 rounded-xl p-4 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30 focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <textarea
              required
              rows="4"
              placeholder="Your Message..."
              value={form.message}
              onChange={e => setForm({ ...form, message: e.target.value })}
              className="w-full bg-slate-50 dark:bg-dark-900/50 border border-slate-200 dark:border-white/10 rounded-xl p-4 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30 focus:outline-none focus:border-primary transition-colors resize-none"
            />
            
            <button
              disabled={status === "sending"}
              type="submit"
              className="mt-2 glass hover:bg-primary hover:text-white dark:hover:text-dark-900 text-slate-900 dark:text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50"
            >
              {status === "sending" ? "Sending..." : status === "success" ? "Message Sent!" : (
                <>{buttonText} <HiPaperAirplane className="rotate-90" /></>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}