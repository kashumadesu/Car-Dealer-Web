import React, { useState } from 'react';
import { 
  X, 
  User, 
  Lock, 
  Phone, 
  LogIn, 
  UserPlus, 
  ShieldCheck, 
  Car,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AuthModal() {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    authModalReason, 
    signIn, 
    signUp, 
    loginAs 
  } = useAuth();

  const [mode, setMode] = useState('signin'); // 'signin' or 'signup'
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (mode === 'signin') {
      if (!username.trim() || !password.trim()) {
        setErrorMessage('Please enter both username and password.');
        return;
      }
      const res = signIn({ username, password });
      if (!res.success) {
        setErrorMessage(res.error);
      }
    } else {
      if (!username.trim() || !fullName.trim() || !password.trim()) {
        setErrorMessage('Please fill in username, full name, and password.');
        return;
      }
      const res = signUp({ username, fullName, password, phone });
      if (!res.success) {
        setErrorMessage(res.error);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm select-none animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden text-left">
        {/* Modal Header */}
        <div className="bg-zinc-950 text-white p-5 flex items-center justify-between border-b border-zinc-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-600 flex items-center justify-center text-white shadow">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {mode === 'signin' ? 'Sign In to DriveHub' : 'Create Customer Account'}
              </h3>
              <p className="text-xs text-zinc-400">Unlock Live Chat and Saved Favorites</p>
            </div>
          </div>

          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feature Gating Reason Prompt */}
        {authModalReason && (
          <div className="bg-rose-50 border-b border-rose-100 p-3.5 flex items-start space-x-2.5 text-xs text-rose-800">
            <ShieldCheck className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold block">Account Required</strong>
              <span>{authModalReason}</span>
            </div>
          </div>
        )}

        {/* Form Container */}
        <div className="p-5 space-y-4">
          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-zinc-100 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => { setMode('signin'); setErrorMessage(''); }}
              className={`py-2 rounded-lg transition-colors ${
                mode === 'signin' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setErrorMessage(''); }}
              className={`py-2 rounded-lg transition-colors ${
                mode === 'signup' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              Sign Up / Register
            </button>
          </div>

          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            {/* Username */}
            <div>
              <label className="block text-zinc-700 font-bold mb-1">Username</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. juandelacruz"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-lg pl-8 pr-3 py-2 text-zinc-900 font-medium focus:outline-none focus:border-rose-500 focus:bg-white"
                />
                <User className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            {/* Full Name (Sign Up only) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-zinc-700 font-bold mb-1">Full Name (First & Last Name)</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Juan Dela Cruz"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-lg pl-8 pr-3 py-2 text-zinc-900 font-medium focus:outline-none focus:border-rose-500 focus:bg-white"
                  />
                  <CheckCircle2 className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2.5" />
                </div>
                <p className="text-[10px] text-zinc-400 mt-0.5">This name is what our sales consultants and admins will see when chatting with you.</p>
              </div>
            )}

            {/* Phone Number (Sign Up only) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-zinc-700 font-bold mb-1">Contact Phone Number (Optional)</label>
                <div className="relative">
                  <input
                    type="tel"
                    placeholder="e.g. +63 918 555 1234"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-lg pl-8 pr-3 py-2 text-zinc-900 font-medium focus:outline-none focus:border-rose-500 focus:bg-white"
                  />
                  <Phone className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2.5" />
                </div>
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-zinc-700 font-bold mb-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-lg pl-8 pr-3 py-2 text-zinc-900 font-medium focus:outline-none focus:border-rose-500 focus:bg-white"
                />
                <Lock className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-2.5 rounded-xl shadow transition-colors flex items-center justify-center space-x-1.5 text-xs mt-2 uppercase tracking-wider"
            >
              {mode === 'signin' ? <LogIn className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
              <span>{mode === 'signin' ? 'Sign In' : 'Create Account'}</span>
            </button>
          </form>

          {/* Quick Demo Role Logins */}
          <div className="pt-4 border-t border-zinc-100 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block text-center">
              Quick One-Click Test Accounts:
            </span>
            <div className="grid grid-cols-3 gap-1.5 text-[11px] font-semibold">
              <button
                type="button"
                onClick={() => loginAs('customer')}
                className="p-1.5 rounded-lg border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-800 text-center"
              >
                Customer
              </button>
              <button
                type="button"
                onClick={() => loginAs('staff')}
                className="p-1.5 rounded-lg border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-800 text-center"
              >
                Sales Agent
              </button>
              <button
                type="button"
                onClick={() => loginAs('admin')}
                className="p-1.5 rounded-lg border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-800 text-center"
              >
                Admin / Owner
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
