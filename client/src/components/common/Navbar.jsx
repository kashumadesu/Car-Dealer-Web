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
  LogIn,
  LogOut
} from 'lucide-react';
import { useFavorites } from '../../context/FavoritesContext';
import { useCompare } from '../../context/CompareContext';
import { useAuth } from '../../context/AuthContext';

export default function Navbar({ activeTab, setActiveTab, onOpenSearch, onOpenLiveChat }) {
  const { favorites } = useFavorites();
  const { compareList, setIsCompareOpen } = useCompare();
  const { user, isAdminMode, setIsAdminMode, promptSignIn, signOut, loginAs } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navLinks = [
    { id: 'showroom', label: 'Showroom' },
    { id: 'categories', label: 'Categories' },
    { id: 'team', label: 'Our Team' },
    { id: 'about', label: 'About Us' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800 text-white select-none">
      {/* Top Utility Bar */}
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
          {user ? (
            <div className="relative">
              <button 
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 transition-colors text-xs"
              >
                <User className="w-3 h-3 text-rose-400" />
                <span>Hi, <strong className="text-white font-bold">{user.fullName || user.username}</strong></span>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-1 w-52 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl py-1 z-50 text-xs text-left">
                  <div className="px-3 py-2 border-b border-zinc-800 text-[11px] text-zinc-400">
                    Signed in as: <strong className="text-white block truncate">{user.fullName}</strong>
                    <span className="text-[10px] text-rose-400 uppercase font-semibold">({user.role})</span>
                  </div>

                  <button
                    onClick={() => { setActiveTab('favorites'); setUserMenuOpen(false); }}
                    className="w-full text-left px-3 py-1.5 hover:bg-zinc-800 text-zinc-300 hover:text-white flex items-center space-x-2"
                  >
                    <Heart className="w-3.5 h-3.5 text-rose-500" />
                    <span>My Saved Favorites ({favorites.length})</span>
                  </button>

                  {(user.role === 'admin' || user.role === 'staff') && (
                    <button
                      onClick={() => { setIsAdminMode(!isAdminMode); setUserMenuOpen(false); }}
                      className="w-full text-left px-3 py-1.5 hover:bg-zinc-800 text-rose-400 hover:text-rose-300 flex items-center space-x-2"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5" />
                      <span>{isAdminMode ? 'Exit Admin Mode' : 'Admin Control Panel'}</span>
                    </button>
                  )}

                  <div className="border-t border-zinc-800 my-1" />

                  <button
                    onClick={() => { signOut(); setUserMenuOpen(false); }}
                    className="w-full text-left px-3 py-1.5 hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center space-x-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => promptSignIn('Sign in with your Name and Account to access live messaging, chat with consultants, and save favorites.')}
              className="flex items-center space-x-1.5 px-3 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors shadow-xs"
            >
              <LogIn className="w-3 h-3" />
              <span>Sign In / Register</span>
            </button>
          )}

          {user && (user.role === 'admin' || user.role === 'staff') && (
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
          )}
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-15">
          {/* Logo */}
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

          {/* Right Action Icons */}
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
                <span className="absolute top-0.5 right-0.5 bg-rose-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {compareList.length}
                </span>
              )}
            </button>

            {/* Favorites Badge */}
            <button
              onClick={() => {
                if (!user) {
                  promptSignIn('Sign in to view and manage your saved vehicles.');
                } else {
                  setActiveTab('favorites');
                }
              }}
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

            {/* Live Chat CTA Button */}
            <button
              onClick={() => {
                if (!user) {
                  promptSignIn('Sign in with your Name so our sales representatives know who they are speaking with.');
                } else {
                  onOpenLiveChat(null);
                }
              }}
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
        <div className="md:hidden bg-zinc-900 border-t border-zinc-800 px-4 py-3 space-y-2 text-xs">
          {user ? (
            <div className="p-2.5 bg-zinc-950 rounded-lg border border-zinc-800 flex items-center justify-between">
              <div>
                <strong className="text-white block">{user.fullName}</strong>
                <span className="text-[10px] text-zinc-400">@{user.username}</span>
              </div>
              <button
                onClick={() => { signOut(); setMobileMenuOpen(false); }}
                className="text-xs text-rose-400 font-semibold"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                promptSignIn('Sign in to chat with agents and save vehicles.');
              }}
              className="w-full py-2 bg-rose-600 text-white font-bold rounded-lg text-center"
            >
              Sign In / Register
            </button>
          )}

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
        </div>
      )}
    </header>
  );
}
