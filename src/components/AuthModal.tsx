import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { X, ShieldCheck, Mail, Lock, User, ArrowRight } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, loginAs, switchRole } = useApp();
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('buyer');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    loginAs(email, name || email.split('@')[0], selectedRole);
    switchRole(selectedRole);
  };

  const handleGoogleSignIn = () => {
    loginAs('user.google@zanta.co.ke', 'Alex Zanta', selectedRole);
    switchRole(selectedRole);
  };

  const roles: { role: UserRole; label: string; desc: string }[] = [
    { role: 'buyer', label: 'Buyer', desc: 'Acquire homes, land & commercial assets' },
    { role: 'tenant', label: 'Tenant', desc: 'Rent apartments & residential houses' },
    { role: 'seller', label: 'Seller', desc: 'Sell personal or commercial properties' },
    { role: 'agent', label: 'Agent', desc: 'EARB-licensed real estate broker' },
    { role: 'developer', label: 'Developer', desc: 'Master planners & apartment builders' },
    { role: 'professional', label: 'Professional', desc: 'Advocates, architects, valuers' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 p-6 space-y-5 animate-in fade-in duration-200 text-xs">
        <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white font-bold text-sm shadow">
              Z
            </div>
            <div>
              <h3 className="font-extrabold text-base text-stone-900 dark:text-white font-display">
                {isSignUp ? 'Create Zanta Account' : 'Welcome to Zanta PropertyAI'}
              </h3>
              <p className="text-stone-400 text-[11px]">
                {isSignUp ? 'Join East Africa’s property ecosystem' : 'Sign in to your real estate portal'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="text-stone-400 hover:text-stone-700 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Google Sign-In Button */}
        <button
          onClick={handleGoogleSignIn}
          className="w-full py-2.5 px-4 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 font-semibold flex items-center justify-center gap-3 transition shadow-sm"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="flex items-center gap-3 text-[11px] text-stone-400">
          <div className="h-px bg-stone-200 dark:bg-stone-800 flex-1" />
          <span>or email credentials</span>
          <div className="h-px bg-stone-200 dark:bg-stone-800 flex-1" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Role Selector (Crucial for ecosystem persona) */}
          <div>
            <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
              Select Your Workspace Role
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {roles.map(r => (
                <button
                  type="button"
                  key={r.role}
                  onClick={() => setSelectedRole(r.role)}
                  className={`p-2 rounded-lg border text-center transition ${
                    selectedRole === r.role
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-bold'
                      : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-stone-400'
                  }`}
                >
                  <div className="capitalize">{r.label}</div>
                </button>
              ))}
            </div>
          </div>

          {isSignUp && (
            <div>
              <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
                Full Legal Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Alex Zanta"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@example.co.ke"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold flex items-center justify-center gap-1.5 shadow transition"
          >
            <span>{isSignUp ? 'Register Account' : 'Sign In'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="text-center pt-1 border-t border-stone-100 dark:border-stone-800">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-stone-500 hover:text-amber-600 dark:hover:text-amber-400 font-medium text-[11px]"
          >
            {isSignUp
              ? 'Already registered? Sign in here'
              : 'Don’t have an account? Create one'}
          </button>
        </div>
      </div>
    </div>
  );
};
