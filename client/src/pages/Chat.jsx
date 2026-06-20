import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { MessageSquare, Send, Sparkles, User, Bot } from 'lucide-react';

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "Hello! I am your AutoVerse AI Assistant. Ask me anything about used car buying, best mileage models, luxury vehicle depreciation, or budget-friendly options!"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    // Clear input
    if (!textToSend) setInput('');

    // Append user message
    setMessages(prev => [...prev, { sender: 'user', text }]);
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/api/ml/chat', { message: text });
      setMessages(prev => [...prev, { sender: 'ai', text: response.data.reply }]);
    } catch (err) {
      console.error("Chat call failed", err);
      // Fallback local chatbot response
      setMessages(prev => [...prev, {
        sender: 'ai',
        text: "I am running in local safe mode. I suggest checking out Maruti Suzuki Swift or Tata Nexon EV. They offer high efficiency and reliable resale value!"
      }]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    "What are the best mileage cars under ₹8 Lakhs?",
    "Which SUV is safest for a large family?",
    "Tell me about BMW 3 Series depreciation.",
    "Recommend a low-maintenance hatchback."
  ];

  return (
    <div className="relative min-h-[calc(100vh-2rem)] py-8 px-4 md:px-8 max-w-4xl mx-auto z-10 flex flex-col h-[calc(100vh-2rem)]">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-4 border-b border-white/5 pb-4 flex-shrink-0">
        <div className="p-3 bg-autoverseSecondary/15 border border-autoverseSecondary/30 rounded-2xl text-autoverseSecondary shadow-neonSecondary">
          <MessageSquare className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <span>AI Purchasing Advisor</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-autoverseAccent/10 border border-autoverseAccent/30 text-[8px] font-black text-autoverseAccent uppercase">
              <Sparkles className="w-2.5 h-2.5" /> Core Online
            </span>
          </h2>
          <p className="text-[10px] text-gray-400">Conversational natural language interface for market recommendations</p>
        </div>
      </div>

      {/* Messages Board */}
      <div className="flex-1 overflow-y-auto glass-card border border-white/10 rounded-3xl p-6 space-y-4 mb-4 min-h-[250px]">
        {messages.map((msg, i) => {
          const isUser = msg.sender === 'user';
          return (
            <div key={i} className={`flex items-start gap-3 ${isUser ? 'justify-end' : ''}`}>
              {!isUser && (
                <div className="w-8 h-8 rounded-lg bg-autoverseSecondary/20 border border-autoverseSecondary/30 flex items-center justify-center text-autoverseSecondary flex-shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              
              <div className={`p-4 rounded-2xl text-xs max-w-md ${
                isUser 
                  ? 'bg-gradient-to-r from-autoverseSecondary to-autoversePrimary text-white rounded-tr-none shadow-neonSecondary' 
                  : 'bg-white/5 border border-white/10 text-gray-200 rounded-tl-none'
              }`}>
                {msg.text}
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-lg bg-autoversePrimary/20 border border-autoversePrimary/30 flex items-center justify-center text-autoversePrimary flex-shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-autoverseSecondary/20 border border-autoverseSecondary/30 flex items-center justify-center text-autoverseSecondary">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl text-xs bg-white/5 border border-white/10 text-gray-400 rounded-tl-none flex items-center gap-1.5 font-semibold">
              <span className="w-1.5 h-1.5 bg-autoversePrimary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-autoversePrimary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-autoversePrimary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Suggestion Chips */}
      {messages.length === 1 && (
        <div className="flex flex-wrap gap-2 mb-4 flex-shrink-0">
          {suggestions.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(s)}
              className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-[10px] text-autoversePrimary font-bold transition-colors cursor-pointer"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input panel */}
      <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-2.5 flex-shrink-0">
        <input
          type="text"
          placeholder="Ask a question (e.g. 'find family SUVs with 5-star safety')..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 bg-transparent border-none outline-none text-xs text-white pl-2"
        />
        <button
          onClick={() => handleSend()}
          className="p-3 bg-gradient-to-r from-autoverseSecondary to-autoversePrimary hover:brightness-110 active:scale-95 text-white rounded-xl shadow-neonSecondary cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};

export default Chat;
