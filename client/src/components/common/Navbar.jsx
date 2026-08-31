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
    { id: 'showroom', label: 'Showroom' },
    { id: 'categories', label: 'Categories' },
    { id: 'team', label: 'Our Team' },
    { id: 'about', label: 'About Us' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800 text-white select-none">
      {/* Top Utility Bar - Slim & Subtle */}
      <div className="hidden lg:flex items-center justify-between px-8 py-1.5 text-xs text-zinc-400 border-b border-zinc-900">
        <div className="flex items-center space-x-5">
          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-rose-500" />
            <span>Official Controlled Dealership</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Phone className="w-3.5 h-3.5 text-zinc-500" />
            <span>Hotline: +63 999 888 7777</span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Role selector */}
          <div className="relative">
            <button 
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-colors text-xs"
            >
              <User className="w-3 h-3 text-rose-400" />
              <span>{user.name} (<span className="capitalize text-zinc-200 font-semibold">{user.role}</span>)</span>
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-1 w-48 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl py-1 z-50 text-xs">
                <button
                  onClick={() => { loginAs('customer'); setRoleMenuOpen(false); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-zinc-800 text-zinc-300 hover:text-white flex items-center justify-between"
                >
                  <span>Customer View</span>
                  {user.role === 'customer' && <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />}
                </button>
                <button
                  onClick={() => { loginAs('staff'); setRoleMenuOpen(false); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-zinc-800 text-zinc-300 hover:text-white flex items-center justify-between"
                >
                  <span>Sales Agent View</span>
                  {user.role === 'staff' && <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />}
                </button>
                <button
                  onClick={() => { loginAs('admin'); setRoleMenuOpen(false); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-zinc-800 text-zinc-300 hover:text-white flex items-center justify-between"
                >
                  <span>Admin Console</span>
                  {user.role === 'admin' && <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />}
                </button>
              </div>
            )}
          </div>

          <button 
            onClick={() => setIsAdminMode(!isAdminMode)}
            className={`flex items-center space-x-1 px-2.5 py-0.5 rounded text-xs font-semibold transition-colors ${
              isAdminMode 
                ? 'bg-rose-600 text-white' 
                : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
            }`}
          >
            <LayoutDashboard className="w-3 h-3" />
            <span>{isAdminMode ? 'Exit Admin' : 'Admin Panel'}</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar - Slim 60px Height */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-15">
          {/* Logo on Left */}
          <button 
            onClick={() => { setActiveTab('showroom'); setIsAdminMode(false); }}
            className="flex items-center space-x-2.5 text-left group shrink-0"
          >
            <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white shadow group-hover:bg-rose-500 transition-colors">
              <Car className="w-4.5 h-4.5" />
            </div>
            <div>
              <div className="text-lg font-extrabold tracking-tight text-white flex items-center space-x-0.5 leading-none">
                <span>Drive</span>
                <span className="text-rose-500">Hub</span>
              </div>
              <p className="text-[9px] tracking-wider text-zinc-400 uppercase font-medium mt-0.5">Automotive Showroom</p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id && !isAdminMode;
              return (
                <button
                  key={link.id}
                  onClick={() => { setActiveTab(link.id); setIsAdminMode(false); }}
                  className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                    isActive 
                      ? 'text-white bg-rose-600 shadow-xs' 
                      : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & Live Chat */}
          <div className="flex items-center space-x-2">
            {/* Quick Search */}
            <button
              onClick={onOpenSearch}
              className="p-2 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
              title="Search vehicles"
            >
              <Search className="w-4.5 h-4.5" />
            </button>

            {/* Compare Badge */}
            <button
              onClick={() => setIsCompareOpen(true)}
              className="relative p-2 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
              title="Compare Vehicles"
            >
              <GitCompare className="w-4.5 h-4.5" />
              {compareList.length > 0 && (
                <span className="absolute 0 top-0.5 right-0.5 bg-rose-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {compareList.length}
                </span>
              )}
            </button>

            {/* Favorites Badge */}
            <button
              onClick={() => setActiveTab('favorites')}
              className={`relative p-2 rounded-md transition-colors ${
                activeTab === 'favorites' ? 'text-rose-500 bg-rose-500/10' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
              title="Favorites"
            >
              <Heart className="w-4.5 h-4.5" />
              {favorites.length > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-rose-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </button>

            {/* Live Chat Button */}
            <button
              onClick={() => onOpenLiveChat(null)}
              className="hidden sm:flex items-center space-x-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold px-3 py-1.5 rounded-md shadow-sm transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Live Chat</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-900"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-zinc-900 border-t border-zinc-800 px-4 py-3 space-y-1.5 text-xs">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id && !isAdminMode;
            return (
              <button
                key={link.id}
                onClick={() => {
                  setActiveTab(link.id);
                  setIsAdminMode(false);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center px-3 py-2 rounded-md font-semibold text-left ${
                  isActive ? 'bg-rose-600 text-white' : 'text-zinc-300 hover:bg-zinc-800'
                }`}
              >
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
            className="w-full flex items-center justify-between px-3 py-2 rounded-md font-semibold text-zinc-300 hover:bg-zinc-800"
          >
            <span className="flex items-center space-x-2">
              <Heart className="w-3.5 h-3.5 text-rose-500" />
              <span>Favorites ({favorites.length})</span>
            </span>
          </button>

          <button
            onClick={() => {
              setIsCompareOpen(true);
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-between px-3 py-2 rounded-md font-semibold text-zinc-300 hover:bg-zinc-800"
          >
            <span className="flex items-center space-x-2">
              <GitCompare className="w-3.5 h-3.5 text-rose-500" />
              <span>Compare ({compareList.length})</span>
            </span>
          </button>

          <div className="pt-2 border-t border-zinc-800 flex items-center justify-between gap-2">
            <button
              onClick={() => {
                setIsAdminMode(!isAdminMode);
                setMobileMenuOpen(false);
              }}
              className="flex-1 text-center py-2 rounded bg-zinc-800 text-zinc-200 font-semibold"
            >
              {isAdminMode ? 'Exit Admin' : 'Admin Panel'}
            </button>
            <button
              onClick={() => {
                onOpenLiveChat(null);
                setMobileMenuOpen(false);
              }}
              className="flex-1 text-center py-2 rounded bg-rose-600 text-white font-bold"
            >
              Live Chat
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
