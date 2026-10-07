import React, { useState } from 'react';
import { 
  GraduationCap, 
  BrainCircuit, 
  Lock, 
  Mail, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LoginView: React.FC = () => {
  const { login } = useApp();

  const [email, setEmail] = useState('faculty@edupredict.ai');
  const [password, setPassword] = useState('••••••••••••');
  const [rememberMe, setRememberMe] = useState(true);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, email.includes('admin') ? 'Admin' : 'Faculty');
  };

  const handleQuickDemo = (demoEmail: string, role: 'Admin' | 'Faculty') => {
    setEmail(demoEmail);
    login(demoEmail, role);
  };

  return (
    <div className="min-h-screen bg-[#080C17] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background glowing gradients */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/12 rounded-full blur-[140px] pointer-events-none" />

      <div className="gradient-border-wrapper w-full max-w-md relative z-10 animate-in fade-in zoom-in-95">
        <div className="bg-[#0E1526]/95 backdrop-blur-md text-white rounded-[calc(1.5rem-1px)] p-8 sm:p-10 shadow-2xl">
        {/* Brand Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center mx-auto text-white shadow-lg shadow-indigo-500/30">
            <GraduationCap className="w-7 h-7" />
          </div>
          <div className="flex items-center justify-center gap-1.5 pt-2">
            <h1 className="text-2xl font-black text-white tracking-tight">EduPredict</h1>
            <span className="text-xs font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
              AI
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium">
            AI-powered student success analytics
          </p>
        </div>

        {/* Demo Accounts Quick Pill Selector */}
        <div className="mb-6 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-center">
            Quick 1-Click Demo Accounts
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('admin@edupredict.ai', 'Admin')}
              className="py-2 px-3 rounded-xl bg-slate-800/80 border border-slate-700/80 hover:border-indigo-400 hover:shadow-xs text-xs font-semibold text-slate-200 hover:text-white transition-all text-center flex flex-col items-center"
            >
              <span className="font-bold text-white">Admin Account</span>
              <span className="text-[10px] text-slate-400">admin@edupredict.ai</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('faculty@edupredict.ai', 'Faculty')}
              className="py-2 px-3 rounded-xl bg-slate-800/80 border border-slate-700/80 hover:border-indigo-400 hover:shadow-xs text-xs font-semibold text-slate-200 hover:text-white transition-all text-center flex flex-col items-center"
            >
              <span className="font-bold text-white">Faculty Account</span>
              <span className="text-[10px] text-slate-400">faculty@edupredict.ai</span>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                placeholder="faculty@edupredict.ai"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                placeholder="••••••••••••"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-slate-400 font-medium">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className="rounded accent-indigo-600"
              />
              <span>Remember me</span>
            </label>
            <button
              type="button"
              onClick={() => setForgotModalOpen(true)}
              className="text-indigo-400 font-semibold hover:underline"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <span>Sign in to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
          <p>EduPredict AI • Predict. Prevent. Empower.</p>
        </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">Reset Credentials</h3>
              <p className="text-xs text-slate-500">
                For demo testing, enter any valid institutional email or use the 1-click accounts.
              </p>
            </div>
            <button
              onClick={() => setForgotModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold"
            >
              Return to Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
