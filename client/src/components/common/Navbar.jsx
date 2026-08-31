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
  Info,
  LogIn
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
      <div className="hidden lg:flex items-center justify-between px-8 py-2 text-xs text-zinc-300 border-b border-zinc-900">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-rose-500" />
            <span className="font-medium">DriveHub Official Controlled Inventory</span>
          </div>
          <div className="flex items-center space-x-2">
            <Phone className="w-4 h-4 text-zinc-400" />
            <span className="font-medium">Direct Hotline: +63 999 888 7777</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Role selector */}
          <div className="relative">
            <button 
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center space-x-1.5 px-3 py-1 rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 transition-colors"
            >
              <User className="w-3.5 h-3.5 text-rose-400" />
              <span>Account: <strong className="capitalize text-white font-semibold">{user.name} ({user.role})</strong></span>
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-1 w-52 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl py-1.5 z-50 text-xs">
                <button
                  onClick={() => { loginAs('customer'); setRoleMenuOpen(false); }}
                  className="w-full text-left px-4 py-2 hover:bg-zinc-800 text-zinc-200 hover:text-white flex items-center justify-between"
                >
                  <span>Customer View</span>
                  {user.role === 'customer' && <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />}
                </button>
                <button
                  onClick={() => { loginAs('staff'); setRoleMenuOpen(false); }}
                  className="w-full text-left px-4 py-2 hover:bg-zinc-800 text-zinc-200 hover:text-white flex items-center justify-between"
                >
                  <span>Sales Agent View</span>
                  {user.role === 'staff' && <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />}
                </button>
                <button
                  onClick={() => { loginAs('admin'); setRoleMenuOpen(false); }}
                  className="w-full text-left px-4 py-2 hover:bg-zinc-800 text-zinc-200 hover:text-white flex items-center justify-between"
                >
                  <span>Admin / Owner Console</span>
                  {user.role === 'admin' && <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />}
                </button>
              </div>
            )}
          </div>

          <button 
            onClick={() => setIsAdminMode(!isAdminMode)}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-bold transition-colors ${
              isAdminMode 
                ? 'bg-rose-600 text-white shadow' 
                : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>{isAdminMode ? 'Exit Admin Mode' : 'Admin Portal'}</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo on Left */}
          <button 
            onClick={() => { setActiveTab('showroom'); setIsAdminMode(false); }}
            className="flex items-center space-x-3 text-left group shrink-0"
          >
            <div className="w-11 h-11 rounded-xl bg-rose-600 flex items-center justify-center text-white shadow-lg shadow-rose-600/30 group-hover:bg-rose-500 transition-colors">
              <Car className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black tracking-tight text-white flex items-center space-x-1">
                <span>Drive</span>
                <span className="text-rose-500">Hub</span>
              </div>
              <p className="text-[11px] tracking-wider text-zinc-400 uppercase font-semibold">Automotive Showroom</p>
            </div>
          </button>

          {/* Desktop Center Navigation Links */}
          <nav className="hidden md:flex items-center space-x-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeTab === link.id && !isAdminMode;
              return (
                <button
                  key={link.id}
                  onClick={() => { setActiveTab(link.id); setIsAdminMode(false); }}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-semibold border transition-all duration-150 ${
                    isActive 
                      ? 'text-white bg-rose-600 border-rose-600 shadow-sm' 
                      : 'text-zinc-300 border-transparent hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-3">
            {/* Quick Search */}
            <button
              onClick={onOpenSearch}
              className="p-2.5 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-900 border border-transparent transition-colors"
              title="Search vehicles"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Compare Badge */}
            <button
              onClick={() => setIsCompareOpen(true)}
              className="relative p-2.5 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-900 border border-transparent transition-colors"
              title="Vehicle Comparison"
            >
              <GitCompare className="w-5 h-5" />
              {compareList.length > 0 && (
                <span className="absolute top-1 right-1 bg-rose-600 text-white text-[11px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {compareList.length}
                </span>
              )}
            </button>

            {/* Favorites Badge */}
            <button
              onClick={() => setActiveTab('favorites')}
              className={`relative p-2.5 rounded-lg border transition-colors ${
                activeTab === 'favorites' ? 'text-rose-500 bg-rose-500/15 border-rose-500/30' : 'text-zinc-300 border-transparent hover:text-white hover:bg-zinc-900'
              }`}
              title="Saved Favorites"
            >
              <Heart className="w-5 h-5" />
              {favorites.length > 0 && (
                <span className="absolute top-1 right-1 bg-rose-600 text-white text-[11px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </button>

            {/* Live Chat CTA Button */}
            <button
              onClick={() => onOpenLiveChat(null)}
              className="hidden sm:flex items-center space-x-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-md transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Live Chat</span>
            </button>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-900"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-zinc-900 border-t border-zinc-800 px-4 pt-3 pb-5 space-y-2 text-sm">
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
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg font-semibold text-left ${
                  isActive ? 'bg-rose-600 text-white' : 'text-zinc-200 hover:bg-zinc-800'
                }`}
              >
                <Icon className="w-5 h-5" />
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
            className="w-full flex items-center justify-between px-3 py-3 rounded-lg font-semibold text-zinc-200 hover:bg-zinc-800"
          >
            <span className="flex items-center space-x-3">
              <Heart className="w-5 h-5 text-rose-500" />
              <span>Saved Favorites</span>
            </span>
            <span className="bg-zinc-800 text-xs px-2.5 py-1 rounded text-zinc-300 font-bold">{favorites.length}</span>
          </button>

          <button
            onClick={() => {
              setIsCompareOpen(true);
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-between px-3 py-3 rounded-lg font-semibold text-zinc-200 hover:bg-zinc-800"
          >
            <span className="flex items-center space-x-3">
              <GitCompare className="w-5 h-5 text-rose-500" />
              <span>Vehicle Comparison</span>
            </span>
            <span className="bg-zinc-800 text-xs px-2.5 py-1 rounded text-zinc-300 font-bold">{compareList.length}</span>
          </button>

          <div className="pt-3 border-t border-zinc-800 flex items-center justify-between gap-3">
            <button
              onClick={() => {
                setIsAdminMode(!isAdminMode);
                setMobileMenuOpen(false);
              }}
              className="flex-1 flex items-center justify-center space-x-2 text-xs font-bold px-3 py-2.5 rounded-lg bg-zinc-800 text-zinc-100"
            >
              <LayoutDashboard className="w-4 h-4 text-rose-500" />
              <span>{isAdminMode ? 'Exit Admin' : 'Admin Console'}</span>
            </button>

            <button
              onClick={() => {
                onOpenLiveChat(null);
                setMobileMenuOpen(false);
              }}
              className="flex-1 flex items-center justify-center space-x-2 bg-rose-600 text-white text-xs font-bold px-3 py-2.5 rounded-lg"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Live Chat</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
