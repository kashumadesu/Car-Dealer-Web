import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  Car, 
  ChevronRight
} from 'lucide-react';

export default function AIAssistantWidget({ 
  isOpen, 
  setIsOpen, 
  onSelectVehicle, 
  onOpenLiveChat,
  prefilledVehicle 
}) {
  const [messages, setMessages] = useState([
    {
      id: 'ai-welcome',
      isAi: true,
      text: "Hi! I am DriveHub's Auto Assistant. I can search our inventory, estimate financing, or connect you with a sales consultant.",
      vehicles: [],
      chips: [
        "Cars under ₱700k",
        "Show SUVs",
        "Loan requirements",
        "Talk to agent"
      ]
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendQuery = async (queryText) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || loading) return;

    if (textToSend.toLowerCase().includes('talk to an agent') || textToSend.toLowerCase().includes('talk to agent')) {
      onOpenLiveChat(prefilledVehicle || null);
      setIsOpen(false);
      return;
    }

    const userMsg = {
      id: `usr-${Date.now()}`,
      isAi: false,
      text: textToSend
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          vehicleContext: prefilledVehicle
        })
      });

      if (res.ok) {
        const data = await res.json();
        const aiMsg = {
          id: `ai-${Date.now()}`,
          isAi: true,
          text: data.reply,
          vehicles: data.vehicles || [],
          chips: data.suggestedChips || ["Show available cars", "Financing options", "Talk to an agent"]
        };
        setMessages(prev => [...prev, aiMsg]);
      } else {
        throw new Error("API call failed");
      }
    } catch {
      // Fallback local response
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            id: `ai-fb-${Date.now()}`,
            isAi: true,
            text: "All our certified vehicles include 6-month warranty and updated LTO registration. Would you like to speak directly with our Sales Manager?",
            vehicles: [],
            chips: ["Talk to agent", "Show all sedans"]
          }
        ]);
      }, 400);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Compact Circular Floating Trigger on Bottom-Right */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-5 z-40 bg-zinc-950 hover:bg-zinc-900 text-white p-2.5 sm:px-3.5 sm:py-2.5 rounded-full shadow-xl border border-zinc-700 flex items-center space-x-2 transition-transform hover:scale-105"
          title="Auto Assistant"
        >
          <div className="w-7 h-7 rounded-full bg-rose-600 flex items-center justify-center text-white shrink-0">
            <Bot className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold hidden sm:inline text-zinc-200">Auto Assistant</span>
        </button>
      )}

      {/* Compact Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-5 right-5 z-50 w-full max-w-[360px] bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden flex flex-col h-[480px] text-left select-none animate-in fade-in">
          {/* Header */}
          <div className="bg-zinc-950 text-white p-3.5 flex items-center justify-between border-b border-zinc-800">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white shadow">
                <Bot className="w-4.5 h-4.5" />
              </div>
              <div>
                <div className="flex items-center space-x-1">
                  <h3 className="text-xs font-bold text-white">Auto Assistant</h3>
                  <Sparkles className="w-3 h-3 text-rose-400" />
                </div>
                <p className="text-[10px] text-zinc-400">Inventory AI • Online</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Message History */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-zinc-50 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.isAi ? 'items-start' : 'items-end'}`}
              >
                <div
                  className={`max-w-[90%] rounded-xl px-3 py-2 leading-relaxed shadow-2xs ${
                    msg.isAi
                      ? 'bg-white border border-zinc-200 text-zinc-800 rounded-bl-none'
                      : 'bg-rose-600 text-white rounded-br-none font-medium'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Matched Car Cards */}
                  {msg.vehicles && msg.vehicles.length > 0 && (
                    <div className="mt-2 space-y-1.5 pt-2 border-t border-zinc-100">
                      {msg.vehicles.map((car) => (
                        <div
                          key={car.id}
                          className="bg-zinc-50 border border-zinc-200 rounded-lg p-2 flex items-center justify-between gap-2 hover:border-rose-300 transition-colors"
                        >
                          <img
                            src={car.images?.[0]}
                            alt={car.model}
                            className="w-10 h-8 rounded object-cover shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h5 className="text-[11px] font-bold text-zinc-900 truncate">
                              {car.year} {car.brand} {car.model}
                            </h5>
                            <span className="text-[11px] font-black text-rose-600 block">
                              ₱{car.price.toLocaleString()}
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              onSelectVehicle(car);
                              setIsOpen(false);
                            }}
                            className="bg-zinc-900 hover:bg-zinc-800 text-white text-[10px] font-semibold px-2 py-1 rounded shrink-0 flex items-center space-x-0.5"
                          >
                            <span>View</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Prompt Chips */}
                {msg.chips && msg.chips.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5 max-w-[95%]">
                    {msg.chips.map((chip, idx) => (
                      <button
                        key={idx}
                        onClick={() => sendQuery(chip)}
                        className="bg-white hover:bg-rose-50 border border-zinc-200 text-zinc-700 text-[10px] font-medium px-2 py-0.5 rounded-full shadow-2xs transition-colors"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center space-x-1.5 text-[11px] text-zinc-500 bg-white p-2 rounded-lg border border-zinc-200 w-fit">
                <Bot className="w-3.5 h-3.5 text-rose-500 animate-spin" />
                <span>Searching inventory...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendQuery();
            }}
            className="p-2.5 bg-white border-t border-zinc-200 flex items-center space-x-1.5"
          >
            <input
              type="text"
              placeholder="Ask about cars, SUVs, budget..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              className="flex-1 bg-zinc-100 border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs text-zinc-800 focus:outline-none focus:border-rose-500 focus:bg-white"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || loading}
              className="w-8 h-8 rounded-lg bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white flex items-center justify-center transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
