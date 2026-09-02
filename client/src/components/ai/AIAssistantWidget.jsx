import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  Car, 
  ChevronRight,
  HelpCircle,
  ShieldCheck,
  Zap,
  RotateCcw
} from 'lucide-react';
import { INITIAL_VEHICLES } from '../../data/initialData';

// Helper to render markdown bold (**text**), bullet points, and italic (*text*) cleanly
function FormattedMessage({ text }) {
  if (!text) return null;

  // Split by newlines
  const lines = text.split('\n');

  return (
    <div className="space-y-1 text-xs leading-relaxed">
      {lines.map((line, lIdx) => {
        if (!line.trim()) {
          return <div key={lIdx} className="h-1.5" />;
        }

        // Format bold (**...**) and italic (*...*) in inline segments
        const parseInline = (str) => {
          // Match **bold** or *italic*
          const regex = /(\*\*.*?\*\*|\*.*?\*)/g;
          const parts = str.split(regex);

          return parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={pIdx} className="font-bold text-zinc-900">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            if (part.startsWith('*') && part.endsWith('*')) {
              return (
                <em key={pIdx} className="italic text-zinc-600">
                  {part.slice(1, -1)}
                </em>
              );
            }
            return <span key={pIdx}>{part}</span>;
          });
        };

        const trimmed = line.trimStart();
        const isBullet = trimmed.startsWith('• ') || trimmed.startsWith('- ');
        const isNumbered = /^\d+\.\s/.test(trimmed);

        if (isBullet || isNumbered) {
          const bulletContent = isBullet 
            ? trimmed.slice(2) 
            : trimmed.replace(/^\d+\.\s/, '');

          return (
            <div key={lIdx} className="flex items-start space-x-1.5 pl-1.5">
              <span className="text-rose-600 font-bold shrink-0 mt-0.5">•</span>
              <span className="flex-1">{parseInline(bulletContent)}</span>
            </div>
          );
        }

        return <p key={lIdx}>{parseInline(line)}</p>;
      })}
    </div>
  );
}

// Comprehensive Automotive Knowledge Engine
const AUTOMOTIVE_KNOWLEDGE = [
  {
    keywords: ['vios vs city', 'city vs vios', 'compare vios and city', 'vios or city'],
    reply: `🚗 **Toyota Vios vs. Honda City (Comparison)**:

• **Toyota Vios (1.3 XLE)**:
  - **Strengths**: Bulletproof reliability, lowest PMS maintenance cost in PH, highest parts availability anywhere, excellent fuel economy (14-18 km/L).
  - **Best for**: First-time car owners, daily city commuting, low maintenance budget.

• **Honda City (1.5 RS)**:
  - **Strengths**: More powerful engine (121hp vs 98hp), sportier interior with paddle shifters, superior sound insulation, and modern sporty styling.
  - **Best for**: Drivers wanting spirited highway acceleration and premium cabin tech.

👉 *Both are available in our showroom! Would you like to compare their specs side-by-side?*`,
    vehicles: ['veh-1', 'veh-2'],
    chips: ['Show Vios details', 'Show City RS details', 'Financing requirements', 'Talk to an agent']
  },
  {
    keywords: ['7-seater', '7 seater', 'family car', 'family vehicle', 'under 1m', 'under 1 million', 'spacious'],
    reply: `👨‍👩‍👧‍👦 **Best 7-Seater Family Vehicles Under ₱1.2 Million**:

1. **Mitsubishi Xpander 1.5 GLS** (₱820,000):
   - 225mm ground clearance (flood-ready).
   - Very comfortable coil-spring ride for 7 passengers with flexible fold-flat rear seats.

2. **Toyota Hiace GL Grandia Tourer** (₱1,100,000):
   - Heavy-duty 2.8L turbo diesel engine with 14 passenger seats and dual overhead AC vents.

3. **Toyota Fortuner 2.4 V** (₱1,390,000):
   - Tough ladder-frame SUV with commanding road presence and high resale value.`,
    vehicles: ['veh-6', 'veh-4', 'veh-10'],
    chips: ['Show Mitsubishi Xpander', 'Show Toyota Fortuner', 'Downpayment computation', 'Talk to an agent']
  },
  {
    keywords: ['fuel efficient', 'tipid', 'gas mileage', 'under 700k', 'cheap', 'budget car', 'first car'],
    reply: `⛽ **Most Fuel-Efficient & Budget-Friendly Cars**:

1. **Honda Brio 1.2 RS** (₱590,000):
   - Achieves up to **18 - 22 km/L** on expressways. Super nimble and effortless to park.

2. **Toyota Vios 1.3 XLE** (₱680,000):
   - Practical 5-seater with 14 - 18 km/L fuel economy and ultra-cheap maintenance.

3. **Honda City 1.5 RS** (₱750,000):
   - 15 - 19 km/L with Eco Assist coaching light.`,
    vehicles: ['veh-8', 'veh-1', 'veh-2'],
    chips: ['Show Honda Brio', 'Show Toyota Vios', 'Monthly payment under ₱15k', 'Talk to an agent']
  },
  {
    keywords: ['crv vs fortuner', 'fortuner vs crv', 'cr-v vs fortuner', 'suv comparison'],
    reply: `🚙 **Honda CR-V Turbo vs. Toyota Fortuner**:

• **Honda CR-V 1.5 Turbo Prestige AWD** (₱1,250,000):
  - **Structure**: Unibody crossover.
  - **Drive**: Smooth, car-like ride, panoramic sunroof, Honda SENSING driver-assist safety.
  - **Best for**: City cruising, luxury comfort, family roadtrips.

• **Toyota Fortuner 2.4 V Diesel** (₱1,390,000):
  - **Structure**: Rugged ladder-frame truck chassis.
  - **Drive**: High ground clearance, heavy-duty suspension, high towing/rough-road durability.
  - **Best for**: Provincial roads, heavy floods, maximum resale value.`,
    vehicles: ['veh-3', 'veh-10'],
    chips: ['View Honda CR-V', 'View Toyota Fortuner', 'Apply for financing', 'Talk to an agent']
  },
  {
    keywords: ['pickup', 'ranger vs navara', 'navara vs ranger', 'truck'],
    reply: `🛻 **Ford Ranger Wildtrak vs. Nissan Navara EL Calibre**:

• **Ford Ranger Wildtrak 2.0 Bi-Turbo** (₱1,080,000):
  - 213 PS / 500 Nm torque with 10-speed automatic.
  - Loaded with tech: SYNC 3 touchscreen, AEB auto brake, roller shutter cover.

• **Nissan Navara 2.5 EL** (₱890,000):
  - Famous multi-link rear coil suspension (rides smoothly like an SUV without bouncing).
  - Proven 2.5L turbo diesel engine with reliable 7-speed gearbox.`,
    vehicles: ['veh-5', 'veh-7'],
    chips: ['View Ford Ranger', 'View Nissan Navara', 'Talk to an agent']
  },
  {
    keywords: ['loan', 'financing', 'requirements', 'bank', 'ofw', 'seaman', 'requirements for loan'],
    reply: `📋 **Auto Loan & Bank Financing Requirements**:

• **Downpayment**: 20% to 30% of total price.
• **Interest Rate**: Approx. 7.5% - 9% per annum (24 to 60 months terms).

**Required Documents**:
1. **Employed**: COE with Compensation, Latest 3-Month Payslips, ITR 2316, 2 Valid Government IDs.
2. **Business Owners / Self-Employed**: DTI/SEC Certificate, Mayor's Permit, 6-Month Bank Statements, ITR 1701.
3. **OFW / Seafarers**: Latest POEA Contract, Proof of Remittance (past 3 months), Passport & Seaman's Book.

💡 *Our in-house financing officers offer fast 24 to 48-hour approvals with BDO, BPI, Security Bank, and EastWest!*`,
    vehicles: [],
    chips: ['Financing calculator', 'Calculate 30% downpayment', 'Talk to an agent']
  },
  {
    keywords: ['lto', 'transfer', 'papers', 'registration', 'title', 'warranty', 'inspection'],
    reply: `🛡️ **DriveHub Peace-of-Mind Guarantee**:

• **150-Point Certified Inspection**: Checked engine compression, transmission shifting, suspension, and zero flood/accident history.
• **Clean LTO Documentation**: Verified registered titles with complete original OR/CR, release of chattel mortgage, and PNP-HPG clearance.
• **Warranty**: 6 months engine & transmission limited warranty included on all certified units.
• **Transfer Service**: Complete transfer of ownership to your name handled in 3-5 business days.`,
    vehicles: [],
    chips: ['Browse certified cars', 'Talk to an agent', 'View customer handovers']
  }
];

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
      text: "👋 Hi! I am DriveHub's Automotive Advisor. Ask me anything about car comparisons, fuel economy, bank financing requirements, or our available inventory!",
      vehicles: [],
      chips: [
        "Compare Vios vs City",
        "Best 7-seater under ₱1.2M",
        "Fuel-efficient cars under ₱700k",
        "Bank loan requirements",
        "CR-V vs Fortuner",
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

    const q = textToSend.toLowerCase();

    // 1. Check client-side automotive knowledge base for instant expert answer
    const matchedKnowledge = AUTOMOTIVE_KNOWLEDGE.find(item => 
      item.keywords.some(kw => q.includes(kw))
    );

    if (matchedKnowledge) {
      setTimeout(() => {
        const matchedVehicles = (matchedKnowledge.vehicles || []).map(vid => 
          INITIAL_VEHICLES.find(v => v.id === vid)
        ).filter(Boolean);

        setMessages(prev => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            isAi: true,
            text: matchedKnowledge.reply,
            vehicles: matchedVehicles,
            chips: matchedKnowledge.chips
          }
        ]);
        setLoading(false);
      }, 400);
      return;
    }

    // 2. Try Server API if not matched directly in local dictionary
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
        setMessages(prev => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            isAi: true,
            text: data.reply,
            vehicles: data.vehicles || [],
            chips: data.suggestedChips || ["Compare Vios vs City", "Bank loan requirements", "Talk to an agent"]
          }
        ]);
      } else {
        throw new Error("Server response not ok");
      }
    } catch {
      // Intelligent Inventory Search Fallback
      setTimeout(() => {
        const matchingCars = INITIAL_VEHICLES.filter(v => 
          q.includes(v.brand.toLowerCase()) || 
          q.includes(v.model.toLowerCase()) || 
          q.includes(v.categoryId.toLowerCase()) ||
          (q.includes('automatic') && v.transmission === 'Automatic') ||
          (q.includes('manual') && v.transmission === 'Manual') ||
          (q.includes('diesel') && v.fuelType === 'Diesel') ||
          (q.includes('gas') && v.fuelType === 'Gasoline')
        ).slice(0, 3);

        let replyText = `We have inspected units available in our showroom matching your inquiry.`;
        if (matchingCars.length > 0) {
          replyText += ` Here are top recommendations with complete LTO papers and 6-month warranty:`;
        } else {
          replyText = `Our inventory includes sedans, SUVs, vans, and pickups starting from ₱590,000. All units undergo a 150-point inspection. Would you like to check specific models or speak with our sales manager?`;
        }

        setMessages(prev => [
          ...prev,
          {
            id: `ai-fb-${Date.now()}`,
            isAi: true,
            text: replyText,
            vehicles: matchingCars,
            chips: ["Compare Vios vs City", "Best 7-seater under ₱1.2M", "Bank loan requirements", "Talk to an agent"]
          }
        ]);
      }, 400);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-5 z-40 bg-zinc-950 hover:bg-zinc-900 text-white p-2.5 sm:px-3.5 sm:py-2.5 rounded-full shadow-xl border border-zinc-700 flex items-center space-x-2 transition-transform hover:scale-105"
          title="Auto Advisor"
        >
          <div className="w-7 h-7 rounded-full bg-rose-600 flex items-center justify-center text-white shrink-0">
            <Bot className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold hidden sm:inline text-zinc-200">Auto Advisor</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-5 right-5 z-50 w-full max-w-[380px] bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden flex flex-col h-[520px] text-left select-none animate-in fade-in">
          {/* Header */}
          <div className="bg-zinc-950 text-white p-3.5 flex items-center justify-between border-b border-zinc-800">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white shadow">
                <Bot className="w-4.5 h-4.5" />
              </div>
              <div>
                <div className="flex items-center space-x-1">
                  <h3 className="text-xs font-bold text-white">DriveHub Auto Advisor</h3>
                  <Sparkles className="w-3 h-3 text-rose-400" />
                </div>
                <p className="text-[10px] text-zinc-400">Automotive Intelligence • Online</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-zinc-50 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.isAi ? 'items-start' : 'items-end'}`}
              >
                <div
                  className={`max-w-[92%] rounded-xl px-3.5 py-2.5 leading-relaxed shadow-2xs ${
                    msg.isAi
                      ? 'bg-white border border-zinc-200 text-zinc-800 rounded-bl-none'
                      : 'bg-rose-600 text-white rounded-br-none font-medium'
                  }`}
                >
                  {/* Formatted Markdown (Bold, Bullets, Italics) */}
                  <FormattedMessage text={msg.text} />

                  {/* Matched Car Cards */}
                  {msg.vehicles && msg.vehicles.length > 0 && (
                    <div className="mt-2.5 space-y-1.5 pt-2 border-t border-zinc-100">
                      {msg.vehicles.map((car) => (
                        <div
                          key={car.id}
                          className="bg-zinc-50 border border-zinc-200 rounded-lg p-2 flex items-center justify-between gap-2 hover:border-rose-300 transition-colors"
                        >
                          <img
                            src={car.images?.[0]}
                            alt={car.model}
                            className="w-12 h-9 rounded object-cover shrink-0"
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
                  <div className="flex flex-wrap gap-1 mt-2 max-w-[95%]">
                    {msg.chips.map((chip, idx) => (
                      <button
                        key={idx}
                        onClick={() => sendQuery(chip)}
                        className="bg-white hover:bg-rose-50 border border-zinc-200 hover:border-rose-200 text-zinc-700 hover:text-rose-700 text-[10px] font-semibold px-2.5 py-1 rounded-full shadow-2xs transition-colors"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center space-x-2 text-xs text-zinc-500 bg-white p-2.5 rounded-lg border border-zinc-200 w-fit">
                <Bot className="w-4 h-4 text-rose-500 animate-spin" />
                <span>Consulting automotive knowledge base...</span>
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
              placeholder="Ask about car comparison, loan, mileage..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              className="flex-1 bg-zinc-100 border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs text-zinc-800 focus:outline-none focus:border-rose-500 focus:bg-white"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || loading}
              className="w-8 h-8 rounded-lg bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white flex items-center justify-center transition-colors shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
