import Navbar from "../components/layout/Navbar";
import Hero from "../components/portfolio/Hero";
import About from "../components/portfolio/About";
import Skills from "../components/portfolio/Skills";
import Features from "../components/portfolio/Features";
import Projects from "../components/portfolio/Projects";
import Contact from "../components/portfolio/Contact";
import ChatBot from "../components/chatbot/ChatBot";
import Footer from "../components/layout/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Features />
      <Projects />
      <Contact />
      <ChatBot />
      <Footer />
    </>
  );
}