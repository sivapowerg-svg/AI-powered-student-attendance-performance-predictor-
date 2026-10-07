import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  CalendarCheck, 
  TrendingUp, 
  AlertTriangle, 
  BrainCircuit, 
  Lightbulb, 
  BarChart3, 
  FileText, 
  Settings, 
  Sparkles,
  LogOut,
  Bell,
  GraduationCap,
  Sun,
  Moon,
  Command
} from 'lucide-react';
import { useApp, ActiveView } from '../context/AppContext';
import { Avatar } from './Avatar';

interface SidebarProps {
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const { 
    activeView, 
    setActiveView, 
    user, 
    logout, 
    notifications, 
    theme, 
    toggleTheme, 
    setIsCommandPaletteOpen 
  } = useApp();

  const unreadNotifs = notifications.filter(n => !n.read).length;

  const navItems: { id: ActiveView; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'students', label: 'Students Directory', icon: <Users className="w-4 h-4" /> },
    { id: 'attendance', label: 'Attendance', icon: <CalendarCheck className="w-4 h-4" /> },
    { id: 'performance', label: 'Performance Marks', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'at-risk', label: 'At-Risk Students', icon: <AlertTriangle className="w-4 h-4 text-rose-400" />, badge: 'Priority' },
    { id: 'predictions', label: 'AI Predictions', icon: <BrainCircuit className="w-4 h-4 text-purple-400" />, badge: 'Model' },
    { id: 'recommendations', label: 'Recommendations', icon: <Lightbulb className="w-4 h-4 text-amber-400" /> },
    { id: 'analytics', label: 'Longitudinal Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'reports', label: 'Accredited Reports', icon: <FileText className="w-4 h-4" /> },
    { id: 'settings', label: 'Model Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const handleNavClick = (view: ActiveView) => {
    setActiveView(view);
    if (setMobileOpen) setMobileOpen(false);
  };

  return (
    <aside className={`
      fixed inset-y-0 left-0 z-40 w-64 bg-[#080C17] text-slate-200 border-r border-slate-800/80 flex flex-col transition-transform duration-200 ease-in-out shadow-2xl shadow-indigo-950/20
      ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
    `}>
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 text-white ring-1 ring-white/20">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight text-white">EduPredict</span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-400/30">
                AI
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Predict. Prevent. Empower.</p>
          </div>
        </div>
      </div>

      {/* Quick Command Bar Trigger */}
      <div className="px-3 pt-3">
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 text-xs text-slate-400 hover:text-slate-200 transition-colors group"
        >
          <div className="flex items-center gap-2">
            <Command className="w-3.5 h-3.5 text-indigo-400" />
            <span>Search or command...</span>
          </div>
          <kbd className="text-[10px] font-mono bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 group-hover:text-slate-200">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        <div className="px-3 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          Workspace Navigation
        </div>
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all relative ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={isActive ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                <span className="tracking-tight">{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                  item.badge === 'Model'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-400/30'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Faculty Profile & Theme Switcher Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/70 space-y-2">
        <div className="flex items-center justify-between px-2">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Theme Mode</span>
          <button
            onClick={toggleTheme}
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 transition-colors"
            title="Toggle theme contrast"
          >
            {theme === 'dark' ? (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-[11px] font-semibold">Dark Theme</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px] font-semibold">Light Theme</span>
              </>
            )}
          </button>
        </div>

        <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <Avatar name={user?.name || 'Dr. Ananya Rao'} size="sm" />
            <div className="overflow-hidden">
              <h4 className="text-xs font-bold text-white truncate">{user?.name || 'Dr. Ananya Rao'}</h4>
              <p className="text-[10px] text-slate-400 truncate">{user?.department || 'Computer Science'}</p>
            </div>
          </div>
          <button
            onClick={logout}
            title="Sign out"
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors shrink-0"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
