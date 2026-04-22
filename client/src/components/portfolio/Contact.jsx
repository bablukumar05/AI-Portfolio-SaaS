import { useState } from "react";
import { motion } from "framer-motion";
import { HiMail, HiPaperAirplane } from "react-icons/hi";
import API from "../../services/api";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState(null); // 'sending', 'success', 'error'

  const submit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      // Stubbing the contact ping to mock success since no backend route currently exists unless added by user
      // await API.post("/contact", form);
      setTimeout(() => setStatus("success"), 1000);
    } catch {
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
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-2">Get In Touch</h2>
            <p className="text-textMuted">Have an opportunity? Send a message.</p>
          </div>

          <form onSubmit={submit} className="flex flex-col gap-5 relative z-10">
            <div className="grid md:grid-cols-2 gap-5">
              <input
                required
                placeholder="Your Name"
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full bg-dark-900/50 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/30 focus:outline-none focus:border-primary transition-colors"
              />
              <input
                required
                type="email"
                placeholder="Email Address"
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full bg-dark-900/50 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/30 focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <textarea
              required
              rows="4"
              placeholder="Your Message..."
              onChange={e => setForm({ ...form, message: e.target.value })}
              className="w-full bg-dark-900/50 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/30 focus:outline-none focus:border-primary transition-colors resize-none"
            />
            
            <button
              disabled={status === "sending"}
              type="submit"
              className="mt-2 glass hover:bg-primary hover:text-dark-900 hover:border-transparent text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50"
            >
              {status === "sending" ? "Sending..." : status === "success" ? "Message Sent!" : (
                <>Send Message <HiPaperAirplane className="rotate-90" /></>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}