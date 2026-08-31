const { getDbData } = require('../config/db');

// Dealership knowledge base
const DEALERSHIP_INFO = {
  name: "DriveHub Philippines",
  location: "123 AutoHub Drive, Quezon City, Metro Manila, Philippines",
  operatingHours: "Monday to Saturday, 8:00 AM – 6:00 PM (Closed on Sundays)",
  contactNumber: "+63 999 888 7777 / (02) 8123 4567",
  email: "inquiry@drivehub.ph",
  financing: {
    downpayment: "As low as 20% to 30% Downpayment",
    terms: "Flexible terms of 12, 24, 36, 48, or 60 months",
    bankPartners: "BDO, BPI, Metrobank, Security Bank, RCBC, and EastWest Bank",
    requirements: [
      "2 Government-Issued Valid IDs (Passport, Driver's License, UMID)",
      "Proof of Billing (Meralco / Water bill)",
      "Certificate of Employment with Compensation (or DTI/SEC for Business Owners)",
      "Latest 3 Months Bank Statements or Payslips",
      "Latest Income Tax Return (ITR 2316 or 1701)"
    ]
  },
  tradeIn: "We accept trade-ins! Bring your current unit to our showroom for on-the-spot appraisal and get trade-in credit toward any vehicle.",
  warranty: "All DriveHub Certified Pre-Owned vehicles come with a 6-month engine & transmission warranty and guaranteed clean LTO papers."
};

function handleAiQuery(req, res) {
  try {
    const { message, vehicleContext } = req.body;
    const cleanMsg = (message || "").toLowerCase().trim();
    const db = getDbData();
    const allVehicles = db.vehicles || [];
    const availableVehicles = allVehicles.filter(v => v.status === 'AVAILABLE');

    let responseText = "";
    let matchedVehicles = [];
    let suggestedChips = [
      "Show cars under ₱700k",
      "Show automatic SUVs",
      "Financing requirements",
      "Schedule a viewing",
      "Talk to an agent"
    ];

    // 1. Specific Vehicle Context Query
    if (vehicleContext && vehicleContext.id) {
      const targetCar = allVehicles.find(v => v.id === vehicleContext.id);
      if (targetCar) {
        if (cleanMsg.includes('price') || cleanMsg.includes('cost') || cleanMsg.includes('how much')) {
          responseText = `The ${targetCar.year} ${targetCar.brand} ${targetCar.model} ${targetCar.variant} is priced at ₱${targetCar.price.toLocaleString()}. We also offer flexible financing starting from 20% downpayment.`;
          matchedVehicles = [targetCar];
          suggestedChips = ["Financing calculator", "Schedule test drive", "Chat with sales agent"];
          return res.json({ reply: responseText, vehicles: matchedVehicles, suggestedChips });
        } else if (cleanMsg.includes('mileage') || cleanMsg.includes('km')) {
          responseText = `This ${targetCar.year} ${targetCar.brand} ${targetCar.model} has an authentic odometer reading of ${targetCar.mileage.toLocaleString()} km with full dealership service history.`;
          matchedVehicles = [targetCar];
          return res.json({ reply: responseText, vehicles: matchedVehicles, suggestedChips });
        } else if (cleanMsg.includes('feature') || cleanMsg.includes('spec') || cleanMsg.includes('engine')) {
          responseText = `Key specs for ${targetCar.year} ${targetCar.brand} ${targetCar.model}: Engine is ${targetCar.engine}, Transmission: ${targetCar.transmission}, Fuel: ${targetCar.fuelType}. It includes: ${targetCar.features.slice(0, 4).join(', ')}.`;
          matchedVehicles = [targetCar];
          return res.json({ reply: responseText, vehicles: matchedVehicles, suggestedChips });
        }
      }
    }

    // 2. Budget Queries (e.g. "under 700k", "under 800000", "below 1M", "cheapest")
    const budgetMatch = cleanMsg.match(/(?:under|below|less than|budget of|max)\s*(?:₱|p|php)?\s*(\d+(?:\.\d+)?)\s*(k|m|million|thousand)?/i);
    if (budgetMatch || cleanMsg.includes('under 700k') || cleanMsg.includes('cheapest')) {
      let maxBudget = 10000000;
      if (cleanMsg.includes('cheapest')) {
        matchedVehicles = [...availableVehicles].sort((a, b) => a.price - b.price).slice(0, 3);
        responseText = `Here are our most affordable available vehicles starting from ₱${matchedVehicles[0]?.price.toLocaleString()}:`;
        return res.json({ reply: responseText, vehicles: matchedVehicles, suggestedChips: ["Schedule test drive", "Show SUVs", "Talk to agent"] });
      }

      if (budgetMatch) {
        let val = parseFloat(budgetMatch[1]);
        const unit = (budgetMatch[2] || "").toLowerCase();
        if (unit === 'k' || unit === 'thousand') {
          maxBudget = val * 1000;
        } else if (unit === 'm' || unit === 'million') {
          maxBudget = val * 1000000;
        } else if (val < 1000) {
          maxBudget = val * 1000; // e.g. 700 -> 700k
        } else {
          maxBudget = val;
        }
      } else if (cleanMsg.includes('700k')) {
        maxBudget = 700000;
      }

      matchedVehicles = availableVehicles.filter(v => v.price <= maxBudget);
      if (matchedVehicles.length > 0) {
        responseText = `I found ${matchedVehicles.length} available vehicle(s) within your budget of ₱${maxBudget.toLocaleString()}:`;
      } else {
        matchedVehicles = [...availableVehicles].sort((a, b) => a.price - b.price).slice(0, 2);
        responseText = `We currently do not have units strictly under ₱${maxBudget.toLocaleString()}, but here are our closest available options:`;
      }
      return res.json({ reply: responseText, vehicles: matchedVehicles, suggestedChips: ["View all sedans", "Financing options", "Talk to agent"] });
    }

    // 3. Category Queries (SUV, Sedan, Pickup, MPV, Van, Hatchback, Coupe)
    const categories = ['suv', 'sedan', 'pickup', 'mpv', 'van', 'hatchback', 'coupe'];
    const foundCategory = categories.find(cat => cleanMsg.includes(cat));
    if (foundCategory) {
      matchedVehicles = availableVehicles.filter(v => v.categoryId.toLowerCase() === foundCategory);
      if (cleanMsg.includes('automatic')) {
        matchedVehicles = matchedVehicles.filter(v => v.transmission.toLowerCase() === 'automatic');
      }
      responseText = `Here are the available ${foundCategory.toUpperCase()} models in our showroom inventory:`;
      return res.json({ reply: responseText, vehicles: matchedVehicles, suggestedChips: ["Filter by price", "Schedule a viewing", "Financing requirements"] });
    }

    // 4. Brand Queries (Toyota, Honda, Ford, Mitsubishi, Nissan)
    const brands = ['toyota', 'honda', 'ford', 'mitsubishi', 'nissan'];
    const foundBrand = brands.find(b => cleanMsg.includes(b));
    if (foundBrand) {
      matchedVehicles = availableVehicles.filter(v => v.brand.toLowerCase() === foundBrand);
      responseText = `We have ${matchedVehicles.length} available ${foundBrand.toUpperCase()} unit(s) in stock:`;
      return res.json({ reply: responseText, vehicles: matchedVehicles, suggestedChips: ["Show automatic models", "View sedans", "Chat with agent"] });
    }

    // 5. Financing & Requirements
    if (cleanMsg.includes('financ') || cleanMsg.includes('loan') || cleanMsg.includes('downpayment') || cleanMsg.includes('document') || cleanMsg.includes('requirement')) {
      responseText = `Our financing packages offer downpayments as low as 20% to 30% with terms up to 60 months with major bank partners (BDO, BPI, Metrobank, Security Bank).

Standard Requirements:
1. 2 Valid Government IDs
2. Proof of Billing (Electric/Water)
3. Certificate of Employment or DTI/SEC Business Registration
4. Latest 3-Month Bank Statements or Payslips
5. Latest ITR (2316 or 1701)

Our Financing Officer, Mark Aquino, can assist you with pre-approval in as fast as 24-48 hours.`;
      return res.json({
        reply: responseText,
        vehicles: [],
        suggestedChips: ["Talk to Financing Officer", "Show cars under ₱800k", "Schedule a viewing"]
      });
    }

    // 6. Location / Viewing / Test Drive Hours
    if (cleanMsg.includes('location') || cleanMsg.includes('where') || cleanMsg.includes('address') || cleanMsg.includes('schedule') || cleanMsg.includes('viewing') || cleanMsg.includes('test drive') || cleanMsg.includes('hour')) {
      responseText = `DriveHub Showroom is located at ${DEALERSHIP_INFO.location}.
Operating Hours: ${DEALERSHIP_INFO.operatingHours}.
Contact: ${DEALERSHIP_INFO.contactNumber}.

You can walk in anytime during business hours or message one of our sales consultants to reserve a priority viewing slot with the vehicle ready.`;
      return res.json({
        reply: responseText,
        vehicles: [],
        suggestedChips: ["View Team consultants", "Show available cars", "Chat with agent"]
      });
    }

    // 7. Trade-in query
    if (cleanMsg.includes('trade') || cleanMsg.includes('swap') || cleanMsg.includes('sell my car')) {
      responseText = `${DEALERSHIP_INFO.tradeIn} We provide fair market valuation within 30 minutes at our showroom.`;
      return res.json({
        reply: responseText,
        vehicles: [],
        suggestedChips: ["Show available inventory", "Talk to an agent", "Financing options"]
      });
    }

    // 8. Default fallback with recommendation overview
    matchedVehicles = availableVehicles.filter(v => v.isFeatured).slice(0, 3);
    responseText = `Welcome to DriveHub. I can help you search our live inventory, calculate financing terms, explain loan requirements, or connect you directly with a dedicated sales consultant.

What type of car or budget are you considering today?`;

    return res.json({
      reply: responseText,
      vehicles: matchedVehicles,
      suggestedChips: [
        "Cars under ₱700k",
        "Show automatic SUVs",
        "Financing requirements",
        "Where are you located?",
        "Talk to an agent"
      ]
    });

  } catch (error) {
    console.error("AI Query Error:", error);
    return res.status(500).json({ error: "Failed to process AI assistant query" });
  }
}

module.exports = {
  handleAiQuery,
  DEALERSHIP_INFO
};
