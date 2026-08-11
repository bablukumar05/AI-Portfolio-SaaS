import Navbar from "../components/layout/Navbar";
import Hero from "../components/portfolio/Hero";
import About from "../components/portfolio/About";
import Skills from "../components/portfolio/Skills";
import Experience from "../components/portfolio/Experience";
import Features from "../components/portfolio/Features";
import Projects from "../components/portfolio/Projects";
import Certifications from "../components/portfolio/Certifications";
import Testimonials from "../components/portfolio/Testimonials";
import BlogPreview from "../components/portfolio/BlogPreview";
import Contact from "../components/portfolio/Contact";
import ChatBot from "../components/chatbot/ChatBot";
import Footer from "../components/layout/Footer";
import SocialFloatingBar from "../components/ui/SocialFloatingBar";

export default function Home() {
  return (
    <div className="theme-cyberpunk bg-slate-50 dark:bg-dark-900 min-h-screen transition-colors duration-300">
      <Navbar />
      <SocialFloatingBar />
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Features />
      <Projects />
      <Certifications />
      <Testimonials />
      <BlogPreview />
      <Contact />
      <ChatBot />
      <Footer />
    </div>
  );
}