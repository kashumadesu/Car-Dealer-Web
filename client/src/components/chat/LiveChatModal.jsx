import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  ShieldCheck, 
  CheckCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function LiveChatModal({ 
  isOpen, 
  onClose, 
  vehicleContext, 
  employees 
}) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [conversationId, setConversationId] = useState(null);
  const [activeAgent, setActiveAgent] = useState(employees?.[0] || {
    name: 'John Reyes',
    position: 'Sales Manager',
    profileImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80'
  });
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      initConversation();
    }
  }, [isOpen, vehicleContext]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const initConversation = async () => {
    try {
      const initialText = vehicleContext 
        ? `Hello! Inquiring regarding the ${vehicleContext.year} ${vehicleContext.brand} ${vehicleContext.model} (₱${vehicleContext.price.toLocaleString()}). Is this unit available for test drive?`
        : `Hello! Inquiring about available inventory and financing options.`;

      const res = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: user.name,
          customerPhone: user.phone,
          vehicleId: vehicleContext?.id || null,
          initialMessage: initialText
        })
      });

      if (res.ok) {
        const conv = await res.json();
        setConversationId(conv.id);
        setMessages(conv.messages || []);
      }
    } catch {
      // Local fallback initial messages
      setMessages([
        {
          id: 'msg-init-1',
          senderName: user.name,
          isStaff: false,
          text: vehicleContext 
            ? `Inquiring regarding ${vehicleContext.year} ${vehicleContext.brand} ${vehicleContext.model} (₱${vehicleContext.price.toLocaleString()}).`
            : `Hello! I would like to inquire regarding vehicle viewing.`,
          createdAt: new Date().toISOString()
        },
        {
          id: 'msg-init-2',
          senderName: `${activeAgent.name} (${activeAgent.position})`,
          isStaff: true,
          text: `Good day! Yes, this unit is available in our showroom. Would you like to schedule a viewing slot this weekend?`,
          createdAt: new Date().toISOString()
        }
      ]);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      senderId: user.id,
      senderName: user.name,
      isStaff: user.role === 'staff' || user.role === 'admin',
      text: inputText.trim(),
      createdAt: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMsg]);
    setInputText('');

    try {
      if (conversationId) {
        await fetch(`/api/conversations/${conversationId}/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newMsg)
        });
      }
    } catch {
      // ignore
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 w-full max-w-[360px] bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden flex flex-col h-[480px] text-left select-none animate-in fade-in">
      {/* Header */}
      <div className="bg-zinc-950 text-white p-3.5 flex items-center justify-between border-b border-zinc-800">
        <div className="flex items-center space-x-2.5">
          <div className="relative">
            <img
              src={activeAgent.profileImage}
              alt={activeAgent.name}
              className="w-8 h-8 rounded-full object-cover border border-zinc-700"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-zinc-950" />
          </div>
          <div>
            <div className="flex items-center space-x-1">
              <h3 className="text-xs font-bold text-white">{activeAgent.name}</h3>
              <ShieldCheck className="w-3.5 h-3.5 text-rose-500" />
            </div>
            <p className="text-[10px] text-zinc-400">{activeAgent.position} • Online</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded text-zinc-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Vehicle Context Bar */}
      {vehicleContext && (
        <div className="bg-zinc-900 px-3 py-2 flex items-center justify-between border-b border-zinc-800 text-[11px]">
          <div className="flex items-center space-x-2 truncate">
            <img
              src={vehicleContext.images?.[0]}
              alt={vehicleContext.model}
              className="w-8 h-6 rounded object-cover border border-zinc-700 shrink-0"
            />
            <span className="text-zinc-200 truncate font-semibold">
              {vehicleContext.year} {vehicleContext.brand} {vehicleContext.model}
            </span>
          </div>
          <span className="text-rose-400 font-bold shrink-0 ml-1">₱{vehicleContext.price.toLocaleString()}</span>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5 bg-zinc-50 text-xs">
        {messages.map((msg) => {
          const isMe = !msg.isStaff;
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-xl px-3 py-2 leading-relaxed shadow-2xs ${
                  isMe
                    ? 'bg-rose-600 text-white rounded-br-none'
                    : 'bg-white border border-zinc-200 text-zinc-800 rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>
              <div className="flex items-center space-x-1 text-[10px] text-zinc-400 mt-0.5 px-1">
                <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                {isMe && <CheckCheck className="w-3 h-3 text-rose-500" />}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSendMessage} className="p-2.5 bg-white border-t border-zinc-200 flex items-center space-x-1.5">
        <input
          type="text"
          placeholder="Message sales consultant..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 bg-zinc-100 border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs text-zinc-800 focus:outline-none focus:border-rose-500 focus:bg-white"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="w-8 h-8 rounded-lg bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white flex items-center justify-center transition-colors"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
