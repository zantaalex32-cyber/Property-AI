import React, { useState } from 'react';
import { useApp, AppView } from '../context/AppContext';
import { UserRole } from '../types';
import {
  Building2,
  Sparkles,
  MapPin,
  Calculator,
  TrendingUp,
  Hammer,
  Users,
  LayoutDashboard,
  ShieldCheck,
  Bookmark,
  Sun,
  Moon,
  Menu,
  X,
  Bell,
  CheckCircle2,
  ChevronDown,
  User,
  LogOut,
  PlusCircle,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    isDarkMode,
    toggleTheme,
    currentUser,
    switchRole,
    savedPropertyIds,
    notifications,
    markNotificationsAsRead,
    setIsAuthModalOpen,
    logout,
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems: { view: AppView; label: string; icon: React.ReactNode; badge?: string }[] = [
    { view: 'marketplace', label: 'Properties', icon: <Building2 className="w-4 h-4" /> },
    { view: 'map', label: 'Map', icon: <MapPin className="w-4 h-4" /> },
    {
      view: 'assistant',
      label: 'PropertyAI',
      icon: <Sparkles className="w-4 h-4 text-amber-500" />,
      badge: 'Gemini',
    },
    { view: 'affordability', label: 'Affordability', icon: <Calculator className="w-4 h-4" /> },
    { view: 'investment', label: 'Investment AI', icon: <TrendingUp className="w-4 h-4" /> },
    { view: 'build', label: 'Build & Furnish', icon: <Hammer className="w-4 h-4" /> },
    { view: 'professionals', label: 'Professionals', icon: <Users className="w-4 h-4" /> },
  ];

  const roles: { role: UserRole; label: string }[] = [
    { role: 'buyer', label: 'Buyer' },
    { role: 'tenant', label: 'Tenant' },
    { role: 'seller', label: 'Seller' },
    { role: 'agent', label: 'Agent' },
    { role: 'developer', label: 'Developer' },
    { role: 'professional', label: 'Professional' },
    { role: 'admin', label: 'Administrator' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur border-b border-stone-200 dark:border-stone-800 transition-colors">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-emerald-800 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="font-semibold tracking-wide">Zanta Technologies</span>
            <span className="opacity-60 hidden sm:inline">·</span>
            <span className="hidden sm:inline opacity-90">
              East Africa’s AI-Native Real Estate Ecosystem · “Find it. Finance it. Build it. Live it.”
            </span>
            <span className="sm:hidden opacity-90 text-[11px]">Kenya Pilot · Zanta PropertyAI</span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Role Switcher Pill */}
            <div className="relative">
              <button
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="flex items-center gap-1.5 text-[11px] font-medium bg-black/20 hover:bg-black/30 px-2.5 py-0.5 rounded transition"
                title="Switch test user role"
              >
                <span className="opacity-80">Role:</span>
                <span className="capitalize font-semibold text-amber-200">{currentUser.role}</span>
                <ChevronDown className="w-3 h-3 opacity-80" />
              </button>

              {isRoleDropdownOpen && (
                <div
                  className="absolute right-0 mt-1.5 w-48 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 rounded-lg shadow-xl border border-stone-200 dark:border-stone-800 py-1.5 z-50 text-xs"
                  onMouseLeave={() => setIsRoleDropdownOpen(false)}
                >
                  <div className="px-3 py-1 text-[10px] uppercase font-bold tracking-wider text-stone-400">
                    Switch Workspace Role
                  </div>
                  {roles.map(r => (
                    <button
                      key={r.role}
                      onClick={() => {
                        switchRole(r.role);
                        setIsRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-stone-100 dark:hover:bg-stone-800 transition ${
                        currentUser.role === r.role ? 'text-amber-600 dark:text-amber-400 font-semibold' : ''
                      }`}
                    >
                      <span>{r.label}</span>
                      {currentUser.role === r.role && <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <span className="text-[10px] opacity-75 hidden md:inline">
              Kenya Hub (Nairobi & Kisii)
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <button
            onClick={() => setCurrentView('marketplace')}
            className="flex items-center gap-2.5 text-left focus:outline-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white font-bold text-xl shadow-md group-hover:scale-105 transition-transform">
              Z
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight font-display text-stone-900 dark:text-white">
                  Zanta
                </span>
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400">
                  PropertyAI
                </span>
              </div>
              <div className="text-[10px] tracking-wider uppercase text-stone-500 dark:text-stone-400 font-medium">
                Zanta Technologies
              </div>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map(item => {
              const isActive = currentView === item.view;
              return (
                <button
                  key={item.view}
                  onClick={() => setCurrentView(item.view)}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors relative ${
                    isActive
                      ? 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 font-semibold'
                      : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 rounded">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-amber-500 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-2">
            {/* Direct Add Property button for Sellers/Agents */}
            {(currentUser.role === 'seller' ||
              currentUser.role === 'agent' ||
              currentUser.role === 'developer' ||
              currentUser.role === 'admin') && (
              <button
                onClick={() => setCurrentView('agent-dashboard')}
                className="hidden sm:flex items-center gap-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg shadow-sm transition"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>List Property</span>
              </button>
            )}

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsNotifDropdownOpen(!isNotifDropdownOpen);
                  if (!isNotifDropdownOpen) markNotificationsAsRead();
                }}
                className="p-2 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg relative transition"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full ring-2 ring-white dark:ring-stone-900" />
                )}
              </button>

              {isNotifDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-80 bg-white dark:bg-stone-900 rounded-xl shadow-2xl border border-stone-200 dark:border-stone-800 py-2 z-50 text-xs"
                  onMouseLeave={() => setIsNotifDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
                    <span className="font-semibold text-stone-900 dark:text-white">Notifications</span>
                    <span className="text-[10px] text-stone-400">Live property alerts</span>
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-stone-100 dark:divide-stone-800">
                    {notifications.map(n => (
                      <div key={n.id} className="p-3 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition">
                        <p className="text-stone-800 dark:text-stone-200 font-medium">{n.title}</p>
                        <span className="text-[10px] text-stone-400 mt-1 block">{n.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Saved Properties Shortcut */}
            <button
              onClick={() => setCurrentView('user-dashboard')}
              className="p-2 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg relative transition"
              title="Saved Properties"
            >
              <Bookmark className="w-4 h-4" />
              {savedPropertyIds.length > 0 && (
                <span className="absolute top-1 right-1 text-[9px] font-bold bg-amber-500 text-white w-4 h-4 rounded-full flex items-center justify-center">
                  {savedPropertyIds.length}
                </span>
              )}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* User Profile / Dashboard Menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center gap-2 p-1.5 pl-2 border border-stone-200 dark:border-stone-800 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-800/60 transition"
              >
                <div className="w-6 h-6 rounded-full bg-stone-200 dark:bg-stone-700 overflow-hidden">
                  {currentUser.avatar ? (
                    <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-4 h-4 text-stone-500 m-1" />
                  )}
                </div>
                <span className="text-xs font-medium text-stone-800 dark:text-stone-200 hidden sm:inline max-w-[90px] truncate">
                  {currentUser.name || 'Account'}
                </span>
                <ChevronDown className="w-3 h-3 text-stone-400" />
              </button>

              {isUserDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white dark:bg-stone-900 rounded-xl shadow-2xl border border-stone-200 dark:border-stone-800 py-1.5 z-50 text-xs"
                  onMouseLeave={() => setIsUserDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-stone-100 dark:border-stone-800">
                    <p className="font-semibold text-stone-900 dark:text-white truncate">{currentUser.name}</p>
                    <p className="text-[11px] text-stone-400 truncate">{currentUser.email || 'guest@zanta.co.ke'}</p>
                    <div className="mt-1 flex items-center gap-1.5">
                      <ShieldCheck className="w-3 h-3 text-emerald-500" />
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 capitalize font-medium">
                        {currentUser.role} Account Verified
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setCurrentView('user-dashboard');
                      setIsUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center gap-2"
                  >
                    <LayoutDashboard className="w-4 h-4 text-stone-500" />
                    <span>User Dashboard</span>
                  </button>

                  <button
                    onClick={() => {
                      setCurrentView('agent-dashboard');
                      setIsUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center gap-2"
                  >
                    <Building2 className="w-4 h-4 text-stone-500" />
                    <span>Agent & Seller Portal</span>
                  </button>

                  <button
                    onClick={() => {
                      setCurrentView('admin-dashboard');
                      setIsUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4 text-stone-500" />
                    <span>Admin Command Center</span>
                  </button>

                  <div className="border-t border-stone-100 dark:border-stone-800 mt-1 pt-1">
                    {currentUser.email ? (
                      <button
                        onClick={() => {
                          logout();
                          setIsUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setIsAuthModalOpen(true);
                          setIsUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/20 font-semibold"
                      >
                        Sign In / Register
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg"
              aria-label="Toggle Mobile Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 px-4 pt-3 pb-6 space-y-1">
          {navItems.map(item => {
            const isActive = currentView === item.view;
            return (
              <button
                key={item.view}
                onClick={() => {
                  setCurrentView(item.view);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 font-semibold'
                    : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 rounded">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-3 border-t border-stone-200 dark:border-stone-800 grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => {
                setCurrentView('user-dashboard');
                setIsMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-medium text-center"
            >
              User Dashboard
            </button>
            <button
              onClick={() => {
                setCurrentView('agent-dashboard');
                setIsMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-lg bg-amber-500 text-white font-medium text-center"
            >
              Seller / Agent
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
