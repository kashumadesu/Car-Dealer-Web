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
import CompareFloatingBar from './components/compare/CompareFloatingBar';
import LiveChatModal from './components/chat/LiveChatModal';
import AIAssistantWidget from './components/ai/AIAssistantWidget';
import AdminDashboard from './components/admin/AdminDashboard';
import AuthModal from './components/auth/AuthModal';
import { INITIAL_VEHICLES, INITIAL_CATEGORIES, INITIAL_EMPLOYEES } from './data/initialData';
import { Search, X } from 'lucide-react';

function AppContent() {
  const { isAdminMode } = useAuth();
  const [activeTab, setActiveTab] = useState('showroom');
  const [vehicles, setVehicles] = useState(() => {
    try {
      const saved = localStorage.getItem('drivehub_vehicles');
      return saved ? JSON.parse(saved) : INITIAL_VEHICLES;
    } catch {
      return INITIAL_VEHICLES;
    }
  });

  const [categories, setCategories] = useState(() => {
    try {
      const saved = localStorage.getItem('drivehub_categories');
      return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  const [employees, setEmployees] = useState(() => {
    try {
      const saved = localStorage.getItem('drivehub_employees');
      return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
    } catch {
      return INITIAL_EMPLOYEES;
    }
  });

  const [selectedVehicle, setSelectedVehicle] = useState(null);

  // Live Chat & AI Assistant States
  const [isLiveChatOpen, setIsLiveChatOpen] = useState(false);
  const [chatVehicleContext, setChatVehicleContext] = useState(null);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [aiVehicleContext, setAiVehicleContext] = useState(null);

  // Global Quick Search Modal State
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [quickSearchInput, setQuickSearchInput] = useState('');

  // Sync with API when available
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [vRes, cRes, eRes] = await Promise.allSettled([
        fetch('/api/vehicles?status=ALL'),
        fetch('/api/categories'),
        fetch('/api/employees')
      ]);

      if (vRes.status === 'fulfilled' && vRes.value.ok) {
        const vData = await vRes.value.json();
        if (Array.isArray(vData) && vData.length > 0) {
          setVehicles(vData);
          localStorage.setItem('drivehub_vehicles', JSON.stringify(vData));
        }
      }
      if (cRes.status === 'fulfilled' && cRes.value.ok) {
        const cData = await cRes.value.json();
        if (Array.isArray(cData) && cData.length > 0) {
          setCategories(cData);
          localStorage.setItem('drivehub_categories', JSON.stringify(cData));
        }
      }
      if (eRes.status === 'fulfilled' && eRes.value.ok) {
        const eData = await eRes.value.json();
        if (Array.isArray(eData) && eData.length > 0) {
          setEmployees(eData);
          localStorage.setItem('drivehub_employees', JSON.stringify(eData));
        }
      }
    } catch (err) {
      console.warn('Backend API offline or cold-starting; using robust local inventory data.', err);
    }
  };

  const handleOpenLiveChat = (vehicle) => {
    setChatVehicleContext(vehicle || null);
    setIsAiAssistantOpen(false);
    setIsLiveChatOpen(true);
  };

  const handleOpenAiAssistant = (vehicle) => {
    setAiVehicleContext(vehicle || null);
    setIsLiveChatOpen(false);
    setIsAiAssistantOpen(true);
  };

  const handleSelectVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
  }).slice(0, 6);

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
            onNavigateCategories={() => setActiveTab('categories')}
          />
        ) : activeTab === 'categories' ? (
          <CategoriesView
            categories={categories}
            vehicles={vehicles}
            onSelectVehicle={handleSelectVehicle}
            onOpenChat={handleOpenLiveChat}
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

      {/* Floating Compare Bar & Modal */}
      <CompareFloatingBar />

      <ComparisonModal
        onSelectVehicle={handleSelectVehicle}
        onOpenChat={handleOpenLiveChat}
        onBrowseMore={() => {
          setActiveTab('showroom');
          setSelectedVehicle(null);
        }}
      />

      {/* Auth Modal (Sign In / Register) */}
      <AuthModal />

      {/* Live Chat Modal */}
      <LiveChatModal
        isOpen={isLiveChatOpen}
        onClose={() => setIsLiveChatOpen(false)}
        vehicleContext={chatVehicleContext}
        employees={employees}
      />

      {/* AI Assistant Widget */}
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
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden text-left">
            <div className="p-4 border-b border-zinc-200 flex items-center space-x-3">
              <Search className="w-5 h-5 text-zinc-500" />
              <input
                type="text"
                autoFocus
                placeholder="Search Toyota, Honda, SUV, Ranger, Vios..."
                value={quickSearchInput}
                onChange={(e) => setQuickSearchInput(e.target.value)}
                className="flex-1 text-base text-zinc-900 font-medium placeholder-zinc-400 focus:outline-none"
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
              <div className="p-3 divide-y divide-zinc-100 max-h-96 overflow-y-auto">
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
                          className="w-14 h-10 rounded-lg object-cover border border-zinc-200"
                        />
                        <div>
                          <strong className="text-sm font-bold text-zinc-900 block">{car.year} {car.brand} {car.model}</strong>
                          <span className="text-xs text-zinc-500 font-medium">{car.variant} • {car.categoryId}</span>
                        </div>
                      </div>
                      <span className="text-sm font-black text-rose-600">₱{car.price.toLocaleString()}</span>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-sm font-semibold text-zinc-400">
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
