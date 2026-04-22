import { Github, Linkedin, Facebook, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full bg-[#0b0c10] border-t border-white/10 pt-16 pb-8 px-6 mt-10 relative overflow-hidden">
      {/* Decorative Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 relative z-10">
        
        {/* Brand */}
        <div className="md:col-span-1 space-y-4">
          <Link to="/" className="text-3xl font-heading font-black tracking-tighter text-white block">
            Portify <span className="text-primary">AI</span>
          </Link>
          <p className="text-slate-400 text-sm leading-relaxed">
            The next generation AI-powered portfolio builder. Generate, orchestrate, and deploy your professional identity at lightning speed.
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-white font-bold mb-4">Platform</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><Link to="/#features" className="hover:text-primary transition-colors">Features</Link></li>
            <li><Link to="/blog" className="hover:text-primary transition-colors">Tech Blog</Link></li>
            <li><Link to="/about-project" className="hover:text-primary transition-colors">About Us</Link></li>
            <li><Link to="/login" className="hover:text-primary transition-colors">Build Portfolio</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-white font-bold mb-4">Legal</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Cookie Policy</a></li>
          </ul>
        </div>

        {/* Socials */}
        <div>
          <h4 className="text-white font-bold mb-4">Connect With Us</h4>
          <div className="flex items-center gap-4">
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-[#0077b5] hover:text-white transition-all transform hover:-translate-y-1">
              <Linkedin size={18} />
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-[#333] hover:text-white transition-all transform hover:-translate-y-1">
              <Github size={18} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-[#1DA1F2] hover:text-white transition-all transform hover:-translate-y-1">
              <Twitter size={18} />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-[#4267B2] hover:text-white transition-all transform hover:-translate-y-1">
              <Facebook size={18} />
            </a>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/10 text-center text-slate-500 text-sm relative z-10 flex flex-col md:flex-row justify-between items-center">
        <p>&copy; {new Date().getFullYear()} Portify AI. All rights reserved.</p>
        <p className="mt-2 md:mt-0">Crafted with ❤️ by the Portify Team</p>
      </div>
    </footer>
  );
}
