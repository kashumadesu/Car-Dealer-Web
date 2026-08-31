import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { CompareProvider } from './context/CompareContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import VehicleShowcase from './components/showcase/VehicleShowcase';
import VehicleDetailPage from './components/detail/VehicleDetailPage';
import CategoriesView from './components/showcase/CategoriesView';
import TeamSection from './components/team/TeamSection';
import AboutView from './components/showcase/AboutView';
import FavoritesView from './components/showcase/FavoritesView';
import ComparisonModal from './components/compare/ComparisonModal';
import LiveChatModal from './components/chat/LiveChatModal';
import AIAssistantWidget from './components/ai/AIAssistantWidget';
import AdminDashboard from './components/admin/AdminDashboard';
import { Search, X } from 'lucide-react';

function AppContent() {
  const { isAdminMode } = useAuth();
  const [activeTab, setActiveTab] = useState('showroom'); // 'showroom', 'categories', 'team', 'about', 'favorites'
  const [vehicles, setVehicles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Live Chat & AI Assistant States
  const [isLiveChatOpen, setIsLiveChatOpen] = useState(false);
  const [chatVehicleContext, setChatVehicleContext] = useState(null);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [aiVehicleContext, setAiVehicleContext] = useState(null);

  // Global Quick Search Modal State
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [quickSearchInput, setQuickSearchInput] = useState('');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [vRes, cRes, eRes] = await Promise.all([
        fetch('/api/vehicles?status=ALL'),
        fetch('/api/categories'),
        fetch('/api/employees')
      ]);

      if (vRes.ok) setVehicles(await vRes.json());
      if (cRes.ok) setCategories(await cRes.json());
      if (eRes.ok) setEmployees(await eRes.json());
    } catch (err) {
      console.error('Failed to load initial data:', err);
    }
  };

  const handleOpenLiveChat = (vehicle, agent) => {
    setChatVehicleContext(vehicle || null);
    setIsLiveChatOpen(true);
  };

  const handleOpenAiAssistant = (vehicle) => {
    setAiVehicleContext(vehicle || null);
    setIsAiAssistantOpen(true);
  };

  const handleSelectVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedVehicle(null);
    setActiveTab('showroom');
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const filteredQuickSearchResults = vehicles.filter(v => {
    if (!quickSearchInput.trim()) return false;
    const q = quickSearchInput.toLowerCase();
    return (
      v.brand.toLowerCase().includes(q) ||
      v.model.toLowerCase().includes(q) ||
      v.variant.toLowerCase().includes(q) ||
      v.categoryId.toLowerCase().includes(q)
    );
  }).slice(0, 5);

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 font-sans antialiased text-zinc-900">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSelectedVehicle(null);
        }}
        onOpenSearch={() => setIsSearchModalOpen(true)}
        onOpenLiveChat={handleOpenLiveChat}
      />

      {/* Main App Body */}
      <main className="flex-1">
        {isAdminMode ? (
          <AdminDashboard onRefreshData={fetchAllData} />
        ) : selectedVehicle ? (
          <VehicleDetailPage
            vehicle={selectedVehicle}
            onBack={() => setSelectedVehicle(null)}
            onOpenChat={handleOpenLiveChat}
            onOpenAiChat={handleOpenAiAssistant}
            employees={employees}
          />
        ) : activeTab === 'showroom' ? (
          <VehicleShowcase
            vehicles={vehicles}
            categories={categories}
            onSelectVehicle={handleSelectVehicle}
            onOpenChat={handleOpenLiveChat}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        ) : activeTab === 'categories' ? (
          <CategoriesView
            categories={categories}
            onSelectCategory={handleCategorySelect}
          />
        ) : activeTab === 'team' ? (
          <TeamSection
            employees={employees}
            onOpenChat={handleOpenLiveChat}
          />
        ) : activeTab === 'about' ? (
          <AboutView
            onBrowseShowroom={() => {
              setActiveTab('showroom');
              setSelectedVehicle(null);
            }}
          />
        ) : activeTab === 'favorites' ? (
          <FavoritesView
            onSelectVehicle={handleSelectVehicle}
            onOpenChat={handleOpenLiveChat}
            onBrowseMore={() => {
              setActiveTab('showroom');
              setSelectedVehicle(null);
            }}
          />
        ) : null}
      </main>

      {/* Footer */}
      {!isAdminMode && (
        <Footer
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setSelectedVehicle(null);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {/* Modals & Floating Widgets */}
      <ComparisonModal
        onSelectVehicle={handleSelectVehicle}
        onOpenChat={handleOpenLiveChat}
        onBrowseMore={() => {
          setActiveTab('showroom');
          setSelectedVehicle(null);
        }}
      />

      <LiveChatModal
        isOpen={isLiveChatOpen}
        onClose={() => setIsLiveChatOpen(false)}
        vehicleContext={chatVehicleContext}
        employees={employees}
      />

      <AIAssistantWidget
        isOpen={isAiAssistantOpen}
        setIsOpen={setIsAiAssistantOpen}
        onSelectVehicle={handleSelectVehicle}
        onOpenLiveChat={handleOpenLiveChat}
        prefilledVehicle={aiVehicleContext}
      />

      {/* Quick Search Overlay Modal */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-zinc-950/80 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden text-left">
            <div className="p-4 border-b border-zinc-200 flex items-center space-x-3">
              <Search className="w-5 h-5 text-zinc-400" />
              <input
                type="text"
                autoFocus
                placeholder="Search by brand, model, or type (e.g. Vios, SUV)..."
                value={quickSearchInput}
                onChange={(e) => setQuickSearchInput(e.target.value)}
                className="flex-1 text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none"
              />
              <button
                onClick={() => {
                  setIsSearchModalOpen(false);
                  setQuickSearchInput('');
                }}
                className="p-1 rounded text-zinc-400 hover:text-zinc-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {quickSearchInput && (
              <div className="p-3 divide-y divide-zinc-100 max-h-80 overflow-y-auto">
                {filteredQuickSearchResults.length > 0 ? (
                  filteredQuickSearchResults.map((car) => (
                    <div
                      key={car.id}
                      onClick={() => {
                        handleSelectVehicle(car);
                        setIsSearchModalOpen(false);
                        setQuickSearchInput('');
                      }}
                      className="p-3 hover:bg-zinc-50 rounded-xl cursor-pointer flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={car.images?.[0]}
                          alt={car.model}
                          className="w-12 h-9 rounded object-cover border border-zinc-200"
                        />
                        <div>
                          <strong className="text-xs font-bold text-zinc-900 block">{car.year} {car.brand} {car.model}</strong>
                          <span className="text-[11px] text-zinc-500">{car.variant} • {car.categoryId}</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-rose-600">₱{car.price.toLocaleString()}</span>
                    </div>
                  ))
                ) : (
                  <div className="py-6 text-center text-xs text-zinc-400">
                    No vehicles found matching "{quickSearchInput}"
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <CompareProvider>
          <AppContent />
        </CompareProvider>
      </FavoritesProvider>
    </AuthProvider>
  );
}
