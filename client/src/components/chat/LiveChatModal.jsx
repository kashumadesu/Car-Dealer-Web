import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  MessageSquare, 
  User, 
  ShieldCheck, 
  Car, 
  Clock,
  CheckCheck,
  Phone
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
    profileImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80'
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
        ? `Hello! I am inquiring regarding the ${vehicleContext.year} ${vehicleContext.brand} ${vehicleContext.model} (${vehicleContext.variant}) priced at ₱${vehicleContext.price.toLocaleString()}. Is this unit still available for viewing/test drive?`
        : `Hello! I would like to inquire about your available inventory and financing requirements.`;

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

        // If newly created and only customer message exists, simulate realistic sales rep welcome reply after 1 sec
        if (conv.messages && conv.messages.length === 1) {
          setTimeout(() => {
            const replyMsg = {
              id: `msg-rep-${Date.now()}`,
              senderId: 'emp-1',
              senderName: `${activeAgent.name} (${activeAgent.position})`,
              isStaff: true,
              text: `Good day ${user.name}! Thank you for reaching out to DriveHub. Yes, ${vehicleContext ? `the ${vehicleContext.year} ${vehicleContext.brand} ${vehicleContext.model}` : 'our showroom units'} are 100% available and ready for inspection. Would you like to schedule a viewing or request a computation for bank financing?`,
              createdAt: new Date().toISOString()
            };
            setMessages(prev => [...prev, replyMsg]);
          }, 800);
        }
      }
    } catch (error) {
      console.error('Error initializing conversation:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !conversationId) return;

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
      await fetch(`/api/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMsg)
      });
    } catch (err) {
      console.error('Failed to send message to API:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-md bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden flex flex-col h-[560px] animate-in fade-in duration-200 text-left select-none">
      {/* Chat Header */}
      <div className="bg-zinc-950 text-white p-4 flex items-center justify-between border-b border-zinc-800">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src={activeAgent.profileImage}
              alt={activeAgent.name}
              className="w-10 h-10 rounded-full object-cover border border-zinc-700"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-zinc-950" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h3 className="text-sm font-bold text-white">{activeAgent.name}</h3>
              <ShieldCheck className="w-3.5 h-3.5 text-rose-500" />
            </div>
            <p className="text-[11px] text-zinc-400">{activeAgent.position} • Online</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Vehicle Context Pin Header */}
      {vehicleContext && (
        <div className="bg-zinc-900 px-4 py-2.5 flex items-center justify-between border-b border-zinc-800 text-xs">
          <div className="flex items-center space-x-2.5 min-w-0">
            <img
              src={vehicleContext.images?.[0]}
              alt={vehicleContext.model}
              className="w-10 h-8 rounded object-cover border border-zinc-700 shrink-0"
            />
            <div className="truncate">
              <span className="text-[10px] text-zinc-400 block uppercase font-semibold">Inquiring About:</span>
              <strong className="text-zinc-100 truncate block">{vehicleContext.year} {vehicleContext.brand} {vehicleContext.model}</strong>
            </div>
          </div>
          <span className="text-rose-400 font-bold shrink-0 ml-2">₱{vehicleContext.price.toLocaleString()}</span>
        </div>
      )}

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-zinc-50">
        <div className="text-center my-2">
          <span className="text-[10px] uppercase font-semibold tracking-wider text-zinc-400 bg-zinc-200/60 px-2.5 py-1 rounded-full">
            Official Dealership Live Chat
          </span>
        </div>

        {messages.map((msg) => {
          const isMe = !msg.isStaff;
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
            >
              <span className="text-[10px] text-zinc-400 mb-1 px-1 font-medium">
                {msg.senderName}
              </span>
              <div
                className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-xs shadow-sm leading-relaxed ${
                  isMe
                    ? 'bg-rose-600 text-white rounded-br-none'
                    : 'bg-white border border-zinc-200 text-zinc-800 rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>
              <div className="flex items-center space-x-1 text-[10px] text-zinc-400 mt-1 px-1">
                <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                {isMe && <CheckCheck className="w-3 h-3 text-rose-500" />}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Action Chips for live chat */}
      <div className="bg-white px-3 py-1.5 border-t border-zinc-100 flex items-center space-x-1.5 overflow-x-auto text-[11px]">
        <button
          onClick={() => setInputText("What are the requirements for bank loan financing?")}
          className="whitespace-nowrap bg-zinc-100 hover:bg-zinc-200 text-zinc-700 px-2.5 py-1 rounded-full transition-colors"
        >
          Financing requirements
        </button>
        <button
          onClick={() => setInputText("Can I schedule a test drive this Saturday at 10:00 AM?")}
          className="whitespace-nowrap bg-zinc-100 hover:bg-zinc-200 text-zinc-700 px-2.5 py-1 rounded-full transition-colors"
        >
          Schedule Saturday Viewing
        </button>
      </div>

      {/* Message Input Bar */}
      <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-zinc-200 flex items-center space-x-2">
        <input
          type="text"
          placeholder="Type your message to sales agent..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 bg-zinc-100 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-800 focus:outline-none focus:border-rose-500 focus:bg-white transition-colors"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="w-10 h-10 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white flex items-center justify-center transition-colors shadow-sm"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
