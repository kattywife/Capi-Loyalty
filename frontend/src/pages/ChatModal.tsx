// frontend/src/pages/ChatModal.tsx

import { useState, useRef, useEffect } from 'react';
import { api } from '../lib/api';
import { ArrowLeft, ChevronRight, Send } from 'lucide-react';
import { motion } from 'motion/react';
import { useAppContext } from '../data';

interface Message {
  id: string;
  sender: 'ai' | 'user' | 'system';
  text: string;
  time: string;
  type?: 'text' | 'links';
}

const USEFUL_LINKS = [
  { id: 'l1', text: 'Как заработать больше мандаринов?' },
  { id: 'l2', text: 'Где взять новые скины?' },
  { id: 'l3', text: 'Как работают квесты?' },
];

export default function ChatModal({ onClose }: { onClose: () => void }) {
  const { currentUser } = useAppContext();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: "Привет! Я Капи-Ассистент. Чем могу помочь?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },
    { id: '2', sender: 'system', text: 'Полезные ссылки', time: '', type: 'links' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text?: string) => {
    const userText = text || input;
    if (!userText.trim()) return;

    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      sender: 'user',
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    setInput('');
    setLoading(true);

    try {
      const responseText = await api.sendChatMessage(Number(currentUser?.id), userText);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: responseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ y: "100%" }} 
      animate={{ y: 0 }} 
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="w-full h-full bg-[#F4F4F5] dark:bg-black flex flex-col transition-colors"
    >
      <header className="bg-white dark:bg-[#1a1a1a] px-4 py-3 flex items-center gap-3 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
          <button onClick={onClose} className="p-1 text-zinc-400"><ArrowLeft className="w-6 h-6" /></button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-yellow-400 overflow-hidden shrink-0">
                <img src={currentUser?.avatar} className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="font-bold text-[16px] dark:text-white leading-tight">Капи-Помощник</h2>
              <span className="text-[12px] text-green-500 font-bold">В сети</span>
            </div>
          </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 flex flex-col gap-5 hide-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
            {msg.type === 'links' ? (
              <div className="w-full max-w-[90%] flex flex-col gap-2">
                <div className="bg-white dark:bg-[#1c1c1e] rounded-[18px] overflow-hidden shadow-sm border border-zinc-100 dark:border-zinc-800">
                  {USEFUL_LINKS.map((link) => (
                    <button key={link.id} onClick={() => handleSend(link.text)} className="w-full flex items-center justify-between px-5 py-4 border-b border-zinc-50 dark:border-zinc-800 last:border-none">
                      <span className="text-[14px] font-bold dark:text-zinc-100">{link.text}</span>
                      <ChevronRight className="w-4 h-4 text-zinc-400" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className={`p-4 shadow-sm relative max-w-[85%] ${
                msg.sender === 'user' 
                ? 'bg-yellow-400 text-yellow-900 rounded-[22px_22px_4px_22px]' 
                : 'bg-white dark:bg-[#1c1c1e] text-zinc-900 dark:text-zinc-100 rounded-[22px_22px_22px_4px] border border-zinc-100 dark:border-zinc-800'
              }`}>
                <p className="text-[14px] font-medium leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                {msg.time && <span className="text-[10px] opacity-40 font-bold mt-1 block text-right">{msg.time}</span>}
              </div>
            )}
          </div>
        ))}
        {loading && <div className="text-xs font-bold text-zinc-400 animate-pulse px-4">Капибара думает...</div>}
        <div ref={endRef} className="h-4" />
      </main>

      <footer className="bg-white dark:bg-[#1a1a1a] p-4 border-t border-zinc-100 dark:border-zinc-800 shrink-0">
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-center gap-3">
          <input 
            type="text" value={input} onChange={e => setInput(e.target.value)}
            placeholder="Спроси Капибару..."
            className="flex-1 bg-[#F4F4F5] dark:bg-zinc-800 border-none rounded-full px-5 py-3 text-[15px] outline-none dark:text-white"
          />
          <button type="submit" disabled={!input.trim()} className="w-12 h-12 bg-yellow-400 text-zinc-900 rounded-full flex items-center justify-center active:scale-90 transition-all shrink-0">
            <Send className="w-5 h-5" />
          </button>
        </form>
      </footer>
    </motion.div>
  );
}