import { motion } from "framer-motion";
import { Github, Linkedin, Twitter, Mail } from "lucide-react";

export default function SocialFloatingBar() {
  const socials = [
    { icon: <Github size={20} />, url: "https://github.com", label: "GitHub" },
    { icon: <Linkedin size={20} />, url: "https://linkedin.com", label: "LinkedIn" },
    { icon: <Twitter size={20} />, url: "https://twitter.com", label: "Twitter" },
    { icon: <Mail size={20} />, url: "mailto:contact@example.com", label: "Email" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 1 }}
      className="fixed left-6 bottom-0 z-40 hidden xl:flex flex-col items-center gap-6"
    >
      {socials.map((social, idx) => (
        <motion.a
          key={idx}
          href={social.url}
          target="_blank"
          rel="noreferrer"
          whileHover={{ y: -5, scale: 1.1 }}
          className="text-slate-500 dark:text-textMuted hover:text-primary dark:hover:text-primary transition-colors cursor-pointer p-2 bg-white/50 dark:bg-dark-800/50 backdrop-blur-sm rounded-full border border-slate-200 dark:border-white/10 shadow-sm"
          title={social.label}
        >
          {social.icon}
        </motion.a>
      ))}
      {/* Vertical Line */}
      <div className="w-px h-24 bg-slate-300 dark:bg-white/20 mt-4"></div>
    </motion.div>
  );
}
