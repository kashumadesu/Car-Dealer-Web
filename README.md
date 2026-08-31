# DriveHub — Web-Based Car Showcase, Sales & Customer Communication Platform

> **DriveHub** is a modern, responsive, and minimalist digital car showroom and communication management system built for automotive dealerships.

---

## ✨ Key Features & Architectural Highlights

1. **Minimalist & Clean UI (100% SVG Icons, Zero Emojis)**:
   - Precision Automotive Red (`#E11D48`), Obsidian/Carbon Dark Slate, and Crisp Off-White.
   - Strict zero-emoji policy; all specs, badges, and buttons utilize crisp Lucide vector SVG icons.
   - Progressive disclosure to prevent information overload: 4-spec buying drivers on cards, expandable technical accordions on detailed pages.

2. **Controlled Dealership Inventory Model**:
   - Authorized administrative publishing only (no open marketplace spam).
   - Real-time vehicle availability statuses: `AVAILABLE`, `RESERVED`, and `SOLD`.

3. **Real-Time Vehicle-Linked Chat**:
   - Live messaging between customers and sales representatives.
   - Automatically attaches vehicle context (`2020 Toyota Vios 1.3 XLE - ₱680,000`) to the chat header when initiated from any vehicle page.

4. **Inventory-Aware AI Auto-Assistant**:
   - Floating AI conversational assistant that parses natural language queries (budget limits, body types, transmission, fuel economy) and returns structured mini vehicle cards from the active database.
   - Pre-loaded dealership knowledge base (loan requirements, operating hours, trade-in policy, bank financing partners).

5. **Side-by-Side Vehicle Comparison**:
   - Compare up to 4 selected models side-by-side with a "Highlight Differences" toggle.

6. **Dealership Administration & Lead CRM**:
   - Inventory CRUD with multi-image gallery support.
   - Instant availability status switcher (`AVAILABLE` / `RESERVED` / `SOLD`).
   - Lead pipeline CRM (`New Inquiry` ➔ `In Progress` ➔ `Viewing Scheduled` ➔ `Negotiation` ➔ `Sold`).
   - Sales team roster management with direct social media integrations.

---

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS v4, Lucide Icons
- **Backend**: Node.js, Express, Socket.io (Real-Time Live Chat)
- **Database**: File-persisted JSON / SQLite architecture with realistic Philippine vehicle models (Toyota Vios, Honda City, Honda CR-V, Toyota Hiace, Ford Ranger, Mitsubishi Xpander, Nissan Navara, Toyota Fortuner, etc.)

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
npm --prefix client install
```

### 2. Run Both Server & Client Concurrently
```bash
npm run dev
```

- **Frontend**: `http://localhost:3000`
- **Backend API**: `http://localhost:5000/api`
- **Real-Time Socket Gateway**: `http://localhost:5000`

---

## 📁 Project Structure

```
Car-Dealer-Web/
├── server/
│   ├── config/
│   │   └── db.js                 # Data persistence layer
│   ├── data/
│   │   ├── db.json               # Live database file
│   │   └── seedData.json         # Seed automotive data
│   ├── controllers/
│   │   └── aiController.js       # Inventory-aware AI query engine
│   ├── routes/
│   │   └── api.js                # REST API endpoints
│   └── index.js                  # Express API + Socket.io Server
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/           # Navbar, Footer
│   │   │   ├── showcase/         # HeroSection, CategoryExplorer, VehicleCard, FilterSidebar, VehicleShowcase, FavoritesView, AboutView, CategoriesView
│   │   │   ├── detail/           # VehicleDetailPage, Gallery, SpecsGrid, LoanCalculator
│   │   │   ├── compare/          # ComparisonModal
│   │   │   ├── chat/             # LiveChatModal (Vehicle-Linked)
│   │   │   ├── ai/               # AIAssistantWidget (Inventory-Aware)
│   │   │   ├── team/             # TeamSection
│   │   │   └── admin/            # AdminDashboard, Inventory CRUD, Lead CRM
│   │   ├── context/              # AuthContext, FavoritesContext, CompareContext
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vite.config.js
│   └── tailwind.config.js
├── package.json
└── README.md
```
