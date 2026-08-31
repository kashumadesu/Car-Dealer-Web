import React, { useState } from 'react';
import { 
  Car, 
  Search, 
  Heart, 
  GitCompare, 
  User, 
  ShieldCheck, 
  Menu, 
  X, 
  Phone, 
  MessageSquare, 
  LayoutDashboard,
  Layers,
  Users,
  Info
} from 'lucide-react';
import { useFavorites } from '../../context/FavoritesContext';
import { useCompare } from '../../context/CompareContext';
import { useAuth } from '../../context/AuthContext';

export default function Navbar({ activeTab, setActiveTab, onOpenSearch, onOpenLiveChat }) {
  const { favorites } = useFavorites();
  const { compareList, setIsCompareOpen } = useCompare();
  const { user, isAdminMode, setIsAdminMode, loginAs } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const navLinks = [
    { id: 'showroom', label: 'Showroom', icon: Car },
    { id: 'categories', label: 'Categories', icon: Layers },
    { id: 'team', label: 'Our Team', icon: Users },
    { id: 'about', label: 'About Us', icon: Info }
  ];

  return (
    <header className="sticky top-0 z-40 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800 text-white select-none">
      {/* Top utility bar */}
      <div className="hidden lg:flex items-center justify-between px-6 py-1.5 text-xs text-zinc-400 border-b border-zinc-900">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-rose-500" />
            <span>Official Controlled Dealership Inventory</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Phone className="w-3.5 h-3.5 text-zinc-500" />
            <span>Hotline: +63 999 888 7777</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <button 
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center space-x-1.5 px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 transition-colors"
            >
              <User className="w-3.5 h-3.5 text-rose-400" />
              <span>Role: <strong className="capitalize text-white font-medium">{user.role}</strong></span>
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-1 w-44 bg-zinc-900 border border-zinc-800 rounded shadow-xl py-1 z-50">
                <button
                  onClick={() => { loginAs('customer'); setRoleMenuOpen(false); }}
                  className="w-full text-left px-3 py-1.5 text-xs hover:bg-zinc-800 text-zinc-300 hover:text-white"
                >
                  Customer View
                </button>
                <button
                  onClick={() => { loginAs('staff'); setRoleMenuOpen(false); }}
                  className="w-full text-left px-3 py-1.5 text-xs hover:bg-zinc-800 text-zinc-300 hover:text-white"
                >
                  Staff / Agent View
                </button>
                <button
                  onClick={() => { loginAs('admin'); setRoleMenuOpen(false); }}
                  className="w-full text-left px-3 py-1.5 text-xs hover:bg-zinc-800 text-zinc-300 hover:text-white"
                >
                  Admin / Owner View
                </button>
              </div>
            )}
          </div>

          <button 
            onClick={() => setIsAdminMode(!isAdminMode)}
            className={`flex items-center space-x-1.5 px-2.5 py-0.5 rounded text-xs font-medium transition-colors ${
              isAdminMode 
                ? 'bg-rose-600 text-white' 
                : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>{isAdminMode ? 'Exit Admin' : 'Admin Panel'}</span>
          </button>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <button 
            onClick={() => { setActiveTab('showroom'); setIsAdminMode(false); }}
            className="flex items-center space-x-3 text-left group"
          >
            <div className="w-10 h-10 rounded-lg bg-rose-600 flex items-center justify-center text-white shadow-lg shadow-rose-600/30 group-hover:bg-rose-500 transition-colors">
              <Car className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl font-bold tracking-tight text-white flex items-center space-x-1">
                <span>Drive</span>
                <span className="text-rose-500">Hub</span>
              </div>
              <p className="text-[10px] tracking-wider text-zinc-400 uppercase font-medium">Auto Showroom & Sales</p>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeTab === link.id && !isAdminMode;
              return (
                <button
                  key={link.id}
                  onClick={() => { setActiveTab(link.id); setIsAdminMode(false); }}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-md text-sm font-medium transition-all ${
                    isActive 
                      ? 'text-white bg-rose-600/15 border border-rose-500/30 text-rose-400' 
                      : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-rose-500' : 'text-zinc-400'}`} />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Quick Search */}
            <button
              onClick={onOpenSearch}
              className="p-2 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
              title="Search vehicles"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Compare Badge Button */}
            <button
              onClick={() => setIsCompareOpen(true)}
              className="relative p-2 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
              title="Vehicle Comparison"
            >
              <GitCompare className="w-5 h-5" />
              {compareList.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {compareList.length}
                </span>
              )}
            </button>

            {/* Favorites Badge Button */}
            <button
              onClick={() => setActiveTab('favorites')}
              className={`relative p-2 rounded-md transition-colors ${
                activeTab === 'favorites' ? 'text-rose-500 bg-rose-500/10' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
              title="Saved Favorites"
            >
              <Heart className="w-5 h-5" />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </button>

            {/* Direct Live Chat Button */}
            <button
              onClick={() => onOpenLiveChat(null)}
              className="hidden sm:flex items-center space-x-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold px-3.5 py-2 rounded-md shadow-sm transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Live Chat</span>
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-900"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-zinc-900 border-t border-zinc-800 px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = activeTab === link.id && !isAdminMode;
            return (
              <button
                key={link.id}
                onClick={() => {
                  setActiveTab(link.id);
                  setIsAdminMode(false);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-md text-sm font-medium text-left ${
                  isActive ? 'bg-rose-600 text-white' : 'text-zinc-300 hover:bg-zinc-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </button>
            );
          })}
          
          <button
            onClick={() => {
              setActiveTab('favorites');
              setIsAdminMode(false);
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium text-zinc-300 hover:bg-zinc-800"
          >
            <span className="flex items-center space-x-3">
              <Heart className="w-4 h-4 text-rose-500" />
              <span>Saved Favorites</span>
            </span>
            <span className="bg-zinc-800 text-xs px-2 py-0.5 rounded text-zinc-400">{favorites.length}</span>
          </button>

          <button
            onClick={() => {
              setIsCompareOpen(true);
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium text-zinc-300 hover:bg-zinc-800"
          >
            <span className="flex items-center space-x-3">
              <GitCompare className="w-4 h-4 text-rose-500" />
              <span>Vehicle Comparison</span>
            </span>
            <span className="bg-zinc-800 text-xs px-2 py-0.5 rounded text-zinc-400">{compareList.length}</span>
          </button>

          <div className="pt-2 border-t border-zinc-800 flex items-center justify-between">
            <button
              onClick={() => {
                setIsAdminMode(!isAdminMode);
                setMobileMenuOpen(false);
              }}
              className="flex items-center space-x-2 text-xs font-semibold px-3 py-2 rounded bg-zinc-800 text-zinc-200"
            >
              <LayoutDashboard className="w-4 h-4 text-rose-500" />
              <span>{isAdminMode ? 'Exit Admin Dashboard' : 'Open Admin Dashboard'}</span>
            </button>

            <button
              onClick={() => {
                onOpenLiveChat(null);
                setMobileMenuOpen(false);
              }}
              className="flex items-center space-x-1.5 bg-rose-600 text-white text-xs font-semibold px-3 py-2 rounded"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Live Chat</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
