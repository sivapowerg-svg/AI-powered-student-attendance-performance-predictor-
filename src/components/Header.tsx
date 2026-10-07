import React, { useState } from 'react';
import { 
  Bell, 
  Calendar, 
  Download, 
  BrainCircuit, 
  Menu, 
  Search, 
  Sparkles, 
  AlertTriangle, 
  TrendingUp, 
  X,
  Sun,
  Moon,
  Plus,
  Command
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface HeaderProps {
  onToggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileMenu }) => {
  const { 
    user, 
    notifications, 
    markNotificationRead, 
    runPredictionEngine, 
    isPredicting, 
    setActiveView,
    navigateToStudent,
    setIsAddStudentModalOpen,
    theme,
    toggleTheme,
    setIsCommandPaletteOpen
  } = useApp();

  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = (notif: any) => {
    markNotificationRead(notif.id);
    if (notif.studentId) {
      navigateToStudent(notif.studentId);
    } else if (notif.targetView) {
      setActiveView(notif.targetView as any);
    }
    setNotifDropdownOpen(false);
  };

  const isDark = theme === 'dark';

  return (
    <header className={`sticky top-0 z-30 px-4 md:px-8 py-3.5 flex items-center justify-between border-b backdrop-blur-md transition-colors ${
      isDark 
        ? 'bg-[#080C17]/90 border-slate-800/80 text-white shadow-xs' 
        : 'bg-white/90 border-slate-200/90 text-slate-900 shadow-xs'
    }`}>
      {/* Left: Mobile hamburger & Greetings */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className={`md:hidden p-2 rounded-xl transition-colors ${
            isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'
          }`}
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base md:text-lg font-extrabold tracking-tight">
              Good morning, {user?.name ? user.name.split(' ')[1] || user.name : 'Dr. Ananya'} 👋
            </h1>
          </div>
          <p className={`text-[11px] md:text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Here's your student success overview for Spring 2026.
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Quick Search / Command Palette Button */}
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors ${
            isDark
              ? 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700'
          }`}
        >
          <Search className="w-3.5 h-3.5" />
          <span>Quick search...</span>
          <kbd className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-200/80 text-slate-600'}`}>
            ⌘K
          </kbd>
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-xl border transition-colors ${
            isDark
              ? 'bg-slate-900/80 border-slate-800 text-amber-400 hover:bg-slate-800'
              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
          }`}
          title={`Switch to ${isDark ? 'Light' : 'Dark'} Theme`}
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Register Student Quick CTA */}
        <button
          onClick={() => setIsAddStudentModalOpen(true)}
          className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors ${
            isDark
              ? 'bg-slate-900 border-slate-700/80 hover:bg-slate-800 text-slate-200'
              : 'bg-white border-slate-300 hover:bg-slate-50 text-slate-700'
          }`}
        >
          <Plus className="w-3.5 h-3.5 text-indigo-500" />
          <span>Add Student</span>
        </button>

        {/* Run AI Prediction Button */}
        <button
          onClick={runPredictionEngine}
          disabled={isPredicting}
          className="relative flex items-center gap-2 px-3.5 py-1.5 md:py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs md:text-sm font-bold shadow-md shadow-indigo-600/25 active:scale-95 transition-all disabled:opacity-75"
        >
          <BrainCircuit className={`w-4 h-4 ${isPredicting ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">
            {isPredicting ? 'Processing...' : 'Run Prediction'}
          </span>
          <span className="sm:hidden">Predict</span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
            className={`relative p-2 rounded-xl border transition-colors ${
              isDark
                ? 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Dropdown panel */}
          {notifDropdownOpen && (
            <div className={`absolute right-0 mt-2 w-80 md:w-96 rounded-2xl shadow-2xl border py-2 z-50 animate-in fade-in slide-in-from-top-2 ${
              isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}>
              <div className={`px-4 py-2 border-b flex items-center justify-between ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider">Alerts & Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="bg-indigo-500/20 text-indigo-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setNotifDropdownOpen(false)}
                  className="text-slate-400 hover:text-slate-200 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className={`max-h-80 overflow-y-auto divide-y ${isDark ? 'divide-slate-800' : 'divide-slate-100'}`}>
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500">
                    No active notifications
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => handleNotificationClick(notif)}
                      className={`px-4 py-3 cursor-pointer transition-colors flex items-start gap-3 ${
                        isDark ? 'hover:bg-slate-800/60' : 'hover:bg-slate-50'
                      } ${!notif.read ? (isDark ? 'bg-indigo-950/40' : 'bg-indigo-50/50') : ''}`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {notif.type === 'HIGH_RISK' && (
                          <div className="w-6 h-6 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
                            <AlertTriangle className="w-3.5 h-3.5" />
                          </div>
                        )}
                        {notif.type === 'ATTENDANCE_DROP' && (
                          <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                            <Calendar className="w-3.5 h-3.5" />
                          </div>
                        )}
                        {notif.type === 'IMPROVEMENT' && (
                          <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                            <TrendingUp className="w-3.5 h-3.5" />
                          </div>
                        )}
                        {notif.type === 'NEW_PREDICTION' && (
                          <div className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                            <Sparkles className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p className={`text-xs ${!notif.read ? 'font-bold text-white' : 'font-medium text-slate-300'} truncate`}>
                            {notif.title}
                          </p>
                          <span className="text-[10px] text-slate-500 shrink-0">{notif.timestamp}</span>
                        </div>
                        <p className={`text-[11px] line-clamp-2 mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          {notif.message}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className={`px-4 py-2 border-t text-center ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                <button
                  onClick={() => {
                    setActiveView('students');
                    setNotifDropdownOpen(false);
                  }}
                  className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
                >
                  View All Student Alerts →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
