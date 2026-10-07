import React, { useState } from 'react';
import { AppProvider, useApp, ActiveView } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { StudentsView } from './components/StudentsView';
import { StudentProfileView } from './components/StudentProfileView';
import { AttendanceView } from './components/AttendanceView';
import { PerformanceView } from './components/PerformanceView';
import { AtRiskView } from './components/AtRiskView';
import { PredictionsView } from './components/PredictionsView';
import { RecommendationsView } from './components/RecommendationsView';
import { AnalyticsView } from './components/AnalyticsView';
import { ReportsView } from './components/ReportsView';
import { SettingsView } from './components/SettingsView';
import { LoginView } from './components/LoginView';
import { AddStudentModal } from './components/AddStudentModal';
import { ExplainModal } from './components/ExplainModal';
import { CommandPalette } from './components/CommandPalette';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { user, activeView, toasts, removeToast, theme } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isDark = theme === 'dark';

  if (!user || activeView === 'login') {
    return <LoginView />;
  }

  const renderCurrentView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'students':
        return <StudentsView />;
      case 'student-profile':
        return <StudentProfileView />;
      case 'attendance':
        return <AttendanceView />;
      case 'performance':
        return <PerformanceView />;
      case 'at-risk':
        return <AtRiskView />;
      case 'predictions':
        return <PredictionsView />;
      case 'recommendations':
        return <RecommendationsView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'reports':
        return <ReportsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col antialiased transition-colors duration-200 relative ${
      isDark ? 'bg-[#090D1A] text-slate-100' : 'bg-[#F8FAFC] text-slate-800'
    }`}>
      {/* Background ambient lighting in dark theme with refined slate-indigo gradients */}
      {isDark && (
        <>
          <div className="fixed top-0 left-1/4 w-[550px] h-[550px] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none" />
          <div className="fixed bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-500/8 rounded-full blur-[150px] pointer-events-none" />
          <div className="fixed top-1/2 right-1/12 w-[400px] h-[400px] bg-slate-700/12 rounded-full blur-[130px] pointer-events-none" />
        </>
      )}

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-30 md:hidden"
        />
      )}

      {/* Sidebar Navigation */}
      <Sidebar mobileOpen={mobileMenuOpen} setMobileOpen={setMobileMenuOpen} />

      {/* Main Content Area */}
      <div className="md:pl-64 flex flex-col flex-1 min-w-0 relative z-10">
        <Header onToggleMobileMenu={() => setMobileMenuOpen(prev => !prev)} />

        <main className="flex-1 px-6 py-8 sm:px-10 sm:py-10 md:px-12 md:py-12 lg:px-16 lg:py-14 max-w-[1600px] w-full mx-auto space-y-10 md:space-y-12">
          {renderCurrentView()}
        </main>
      </div>

      {/* Global Modals & Command Palette */}
      <CommandPalette />
      <AddStudentModal />
      <ExplainModal />

      {/* Floating Toast Notification Center */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none p-2">
        {toasts.map(toast => {
          const isSuccess = toast.type === 'success';
          const isError = toast.type === 'error';
          const isWarning = toast.type === 'warning';

          return (
            <div
              key={toast.id}
              className="pointer-events-auto bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border border-slate-700/80 flex items-start gap-3 animate-in slide-in-from-bottom-2 fade-in duration-200"
            >
              <div className="mt-0.5 shrink-0">
                {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                {isError && <AlertCircle className="w-4 h-4 text-rose-400" />}
                {isWarning && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                {!isSuccess && !isError && !isWarning && <Info className="w-4 h-4 text-indigo-400" />}
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-white tracking-tight">{toast.title}</h4>
                {toast.message && (
                  <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">{toast.message}</p>
                )}
              </div>

              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
