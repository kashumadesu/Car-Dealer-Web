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
      text: "Hello! I am your DriveHub Auto Assistant. I can help you search our live inventory, calculate financing terms, or answer dealership questions.",
      vehicles: [],
      chips: [
        "Find a car for me",
        "Cars under ₱700k",
        "Show me SUVs",
        "How to buy a car?",
        "Payment options",
        "Talk to an agent"
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
        throw new Error("Failed to query assistant");
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          isAi: true,
          text: "I am having trouble checking the inventory database right now. Would you like to speak directly with our sales representative?",
          vehicles: [],
          chips: ["Talk to an agent", "Show all cars"]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button on Standard Bottom-Right */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-zinc-950 hover:bg-zinc-900 text-white p-4 rounded-full shadow-2xl border-2 border-zinc-700 flex items-center space-x-3 transition-all hover:scale-105 group"
        >
          <div className="w-9 h-9 rounded-full bg-rose-600 flex items-center justify-center text-white group-hover:bg-rose-500 transition-colors shadow-md">
            <Bot className="w-5 h-5" />
          </div>
          <div className="text-left pr-2 hidden sm:block">
            <span className="text-sm font-black block leading-tight">Auto Assistant</span>
            <span className="text-xs text-rose-400 font-semibold">Ask AI Inventory</span>
          </div>
        </button>
      )}

      {/* Floating Assistant Modal on Bottom-Right */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm sm:max-w-md bg-white rounded-3xl shadow-2xl border-2 border-zinc-300 overflow-hidden flex flex-col h-[580px] animate-in fade-in duration-200 text-left select-none">
          {/* Header */}
          <div className="bg-zinc-950 text-white p-4 sm:p-5 flex items-center justify-between border-b border-zinc-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-rose-600 flex items-center justify-center text-white shadow-md">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <h3 className="text-base font-bold text-white">Auto Assistant</h3>
                  <Sparkles className="w-4 h-4 text-rose-400" />
                </div>
                <p className="text-xs text-zinc-400 font-medium">Inventory-Aware AI • 24/7 Available</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-zinc-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.isAi ? 'items-start' : 'items-end'}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm font-medium ${
                    msg.isAi
                      ? 'bg-white border-2 border-zinc-200 text-zinc-900 rounded-bl-none'
                      : 'bg-rose-600 text-white rounded-br-none font-semibold'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Matched Car Cards */}
                  {msg.vehicles && msg.vehicles.length > 0 && (
                    <div className="mt-3 space-y-2 pt-2 border-t border-zinc-200">
                      {msg.vehicles.map((car) => (
                        <div
                          key={car.id}
                          className="bg-zinc-50 border border-zinc-300 rounded-xl p-2.5 flex items-center justify-between gap-2.5 hover:border-rose-400 transition-colors"
                        >
                          <img
                            src={car.images?.[0]}
                            alt={car.model}
                            className="w-14 h-11 rounded-lg object-cover shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h5 className="text-xs font-bold text-zinc-900 truncate">
                              {car.year} {car.brand} {car.model}
                            </h5>
                            <span className="text-sm font-black text-rose-600 block">
                              ₱{car.price.toLocaleString()}
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              onSelectVehicle(car);
                              setIsOpen(false);
                            }}
                            className="bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold px-3 py-2 rounded-lg shrink-0 flex items-center space-x-1"
                          >
                            <span>View</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Prompt Chips */}
                {msg.chips && msg.chips.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2 max-w-[95%]">
                    {msg.chips.map((chip, idx) => (
                      <button
                        key={idx}
                        onClick={() => sendQuery(chip)}
                        className="bg-white hover:bg-rose-50 hover:border-rose-300 border border-zinc-300 text-zinc-800 hover:text-rose-700 text-xs font-bold px-3 py-1.5 rounded-full shadow-xs transition-colors"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center space-x-2 text-xs font-bold text-zinc-600 bg-white p-3.5 rounded-2xl rounded-bl-none border border-zinc-200 w-fit">
                <Bot className="w-4 h-4 text-rose-500 animate-spin" />
                <span>Checking dealership database...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Query Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendQuery();
            }}
            className="p-3 sm:p-4 bg-white border-t border-zinc-200 flex items-center space-x-2"
          >
            <input
              type="text"
              placeholder="Ask about budget, SUVs, downpayment..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              className="flex-1 bg-zinc-100 border border-zinc-300 rounded-xl px-4 py-3 text-sm text-zinc-900 font-medium focus:outline-none focus:border-rose-500 focus:bg-white transition-colors"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || loading}
              className="w-11 h-11 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white flex items-center justify-center transition-colors shadow-md"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
