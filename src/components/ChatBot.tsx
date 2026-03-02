import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Message = { role: "user" | "bot"; content: string };

const quickReplies = [
  "Best restaurant for a date under ₹1500?",
  "Family dinner for 6, budget ₹3000",
  "Quick lunch near Connaught Place",
];

const getBotReply = (msg: string): string => {
  const lower = msg.toLowerCase();
  if (lower.includes("date") || lower.includes("romantic")) {
    return "💕 For a romantic date, I'd recommend **The Grand Pavilion** in Hauz Khas — great ambience, excellent food, and you can earn 40 loyalty points! Budget-friendly at around ₹1200 for two.";
  }
  if (lower.includes("family") || lower.includes("6") || lower.includes("group")) {
    return "👨‍👩‍👧‍👦 For a family outing, try **The Royal Kitchen** — they have spacious seating, a kid-friendly menu, and great North Indian cuisine. Book via DineOut to earn 25 bonus points!";
  }
  if (lower.includes("quick") || lower.includes("lunch") || lower.includes("fast")) {
    return "⚡ For a quick bite near you, **Burger Barn** delivers in 20 min and **Pizza Paradise** in 25 min. Both are highly rated and you'll earn loyalty points on every order!";
  }
  if (lower.includes("budget") || lower.includes("cheap")) {
    return "💰 On a budget? Try **Burger Barn** (₹ range) or order from **Pizza Paradise** — both offer great value. Use your loyalty points for extra discounts!";
  }
  return "🍽️ I can help you find the perfect restaurant! Tell me about your **budget**, **occasion**, **number of people**, and **location** — I'll find the best match for you.";
};

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", content: "👋 Hi! I'm MealMatch AI. Tell me your budget, occasion, group size, and location — I'll find the perfect spot for you!" },
  ]);
  const [input, setInput] = useState("");

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { role: "user", content: text };
    const botMsg: Message = { role: "bot", content: getBotReply(text) };
    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput("");
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-4 z-50 w-[360px] max-h-[500px] rounded-2xl bg-card border border-border shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="p-4 bg-gradient-warm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-primary-foreground" />
                <span className="font-display font-semibold text-primary-foreground">MealMatch AI</span>
              </div>
              <button onClick={() => setOpen(false)}>
                <X className="w-5 h-5 text-primary-foreground/80 hover:text-primary-foreground" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[280px]">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : ""}`}>
                  {msg.role === "bot" && (
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 text-sm ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-secondary text-secondary-foreground rounded-bl-sm"
                    }`}
                  >
                    {msg.content}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-border">
              <div className="flex flex-wrap gap-1.5 mb-2">
                {quickReplies.map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className="text-xs px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send(input)}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-secondary rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none"
                />
                <Button variant="hero" size="icon" onClick={() => send(input)}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-warm flex items-center justify-center shadow-lg glow-primary"
      >
        {open ? (
          <X className="w-6 h-6 text-primary-foreground" />
        ) : (
          <MessageCircle className="w-6 h-6 text-primary-foreground" />
        )}
      </motion.button>
    </>
  );
};

export default ChatBot;
