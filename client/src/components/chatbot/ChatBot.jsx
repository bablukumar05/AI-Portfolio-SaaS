import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiChatAlt2, HiX, HiPaperAirplane } from "react-icons/hi";
import API from "../../services/api";

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([{ bot: "Hi! I am the AI Portfolio assistant. How can I help you today?" }]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [chat]);

  const sendMessage = async (e) => {
    e?.preventDefault();
    if (!msg.trim()) return;

    const newChat = [...chat, { user: msg }];
    setChat(newChat);
    setMsg("");
    setIsLoading(true);

    try {
      // Assuming a valid mock or real AI response endpoint
      const res = await API.post("/chat", { message: msg });
      setChat([...newChat, { bot: res.data.reply || "I received your message!" }]);
    } catch {
      setChat([...newChat, { bot: "Sorry, I am having trouble connecting right now." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary text-dark-900 flex items-center justify-center shadow-[0_0_20px_rgba(102,252,241,0.5)] z-50 ${isOpen ? 'hidden' : 'block'}`}
      >
        <HiChatAlt2 size={30} />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 right-6 w-80 md:w-96 glass-card overflow-hidden z-50 flex flex-col shadow-[0_10px_40px_rgba(0,0,0,0.8)]"
          >
            {/* Header */}
            <div className="bg-dark-900/80 p-4 border-b border-white/10 flex justify-between items-center backdrop-blur-xl">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
                <h3 className="font-bold text-white font-heading">AI Assistant</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-textMuted hover:text-white transition-colors">
                <HiX size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="h-80 p-4 overflow-y-auto flex flex-col gap-3 scrollbar-thin scrollbar-thumb-dark-800 scrollbar-track-transparent">
              {chat.map((c, i) => (
                <div key={i} className={`flex ${c.user ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl p-3 text-sm ${
                    c.user 
                      ? 'bg-primary text-dark-900 rounded-br-sm' 
                      : 'bg-dark-800 border border-white/5 text-white rounded-bl-sm'
                  }`}>
                    {c.user || c.bot}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-dark-800 border border-white/5 text-textMuted rounded-2xl rounded-bl-sm p-3 text-sm flex gap-1">
                    <span className="animate-bounce">.</span><span className="animate-bounce delay-100">.</span><span className="animate-bounce delay-200">.</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={sendMessage} className="p-3 bg-dark-900/50 border-t border-white/10 flex gap-2">
              <input
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 bg-dark-800 border border-white/10 rounded-full px-4 py-2 text-sm text-white placeholder:text-textMuted focus:outline-none focus:border-primary transition-colors"
              />
              <button
                type="submit"
                disabled={!msg.trim() || isLoading}
                className="w-10 h-10 rounded-full bg-primary text-dark-900 flex items-center justify-center disabled:opacity-50 transition-opacity"
              >
                <HiPaperAirplane className="rotate-90 ml-1" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}