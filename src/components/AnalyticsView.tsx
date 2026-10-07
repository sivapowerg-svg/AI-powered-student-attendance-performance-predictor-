import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  Layers, 
  CalendarCheck, 
  FileCheck, 
  MessageSquare,
  ArrowUpRight,
  ShieldCheck,
  BrainCircuit
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell, 
  ScatterChart, 
  Scatter,
  AreaChart,
  Area
} from 'recharts';
import { useApp } from '../context/AppContext';
import { ACADEMIC_TREND_SERIES } from '../data/mockData';

export const AnalyticsView: React.FC = () => {
  const { students, theme } = useApp();
  const isDark = theme === 'dark';

  const [activeTab, setActiveTab] = useState<'attendance' | 'academic' | 'risk' | 'correlations'>('attendance');

  const total = students.length || 1;
  const avgAtt = Number((students.reduce((a, s) => a + s.attendancePercent, 0) / total).toFixed(1));
  const avgMarks = Number((students.reduce((a, s) => a + s.internalMarks, 0) / total).toFixed(1));
  const below75 = students.filter(s => s.attendancePercent < 75).length;
  const highRisk = students.filter(s => s.riskLevel === 'High').length;
  const medRisk = students.filter(s => s.riskLevel === 'Medium').length;
  const lowRisk = students.filter(s => s.riskLevel === 'Low').length;

  const monthlyAttendanceData = [
    { month: 'Nov', avgRate: 86.4 },
    { month: 'Dec', avgRate: 84.8 },
    { month: 'Jan', avgRate: 80.2 },
    { month: 'Feb', avgRate: 83.5 },
    { month: 'Mar', avgRate: 85.1 },
    { month: 'Apr (Current)', avgRate: avgAtt },
  ];

  const correlationAttendance = students.map(s => ({ x: s.attendancePercent, y: s.internalMarks, name: s.name }));
  const correlationAssignments = students.map(s => ({ x: s.assignmentScore, y: s.internalMarks, name: s.name }));

  const correlationStats = [
    { name: 'Attendance ↔ Marks', coeff: 'r = +0.84', strength: 'Very Strong Positive Driver', color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
    { name: 'Assignments ↔ Marks', coeff: 'r = +0.72', strength: 'High Problem Mastery Link', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
    { name: 'Participation ↔ Marks', coeff: 'r = +0.58', strength: 'Moderate Engagement Correlation', color: 'text-teal-400', bg: 'bg-teal-500/10 border-teal-500/20' },
  ];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      {/* Header */}
      <div>
        <h1 className={`text-xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Institutional Analytics & Longitudinal Trends
        </h1>
        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Longitudinal analytics across attendance behavior, academic progression, and risk modeling
        </p>
      </div>

      {/* Analytics Tabs */}
      <div className={`flex border-b gap-2 overflow-x-auto ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        {[
          { id: 'attendance', label: 'Attendance Analytics', icon: <CalendarCheck className="w-4 h-4" /> },
          { id: 'academic', label: 'Academic Analytics', icon: <TrendingUp className="w-4 h-4" /> },
          { id: 'risk', label: 'Risk Analytics', icon: <AlertTriangle className="w-4 h-4" /> },
          { id: 'correlations', label: 'Correlation Analytics', icon: <BrainCircuit className="w-4 h-4" /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-indigo-500 text-indigo-400'
                : (isDark ? 'border-transparent text-slate-400 hover:text-white' : 'border-transparent text-slate-500 hover:text-slate-800')
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab 1: Attendance Analytics */}
      {activeTab === 'attendance' && (
        <div className="space-y-6 md:space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5">
            <div className={isDark ? 'gradient-border-wrapper' : 'gradient-border-light'}>
              <div className={`p-5 md:p-6 rounded-[calc(1.5rem-1px)] h-full ${isDark ? 'bg-[#0E1526]/95 text-white' : 'bg-white text-slate-900'}`}>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Average Attendance</span>
                <p className="text-3xl font-black font-mono text-indigo-400 mt-2">{avgAtt}%</p>
                <p className="text-xs text-slate-500 mt-1">Across 248 active enrollments</p>
              </div>
            </div>

            <div className={isDark ? 'gradient-border-wrapper-rose' : 'gradient-border-light'}>
              <div className={`p-5 md:p-6 rounded-[calc(1.5rem-1px)] h-full ${isDark ? 'bg-[#0E1526]/95 text-white' : 'bg-rose-50/40 text-slate-900'}`}>
                <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">Under 75% Cutoff</span>
                <p className="text-3xl font-black font-mono text-rose-500 mt-2">{below75}</p>
                <p className="text-xs text-rose-400 mt-1">Debarment warning active</p>
              </div>
            </div>

            <div className={isDark ? 'gradient-border-wrapper-emerald' : 'gradient-border-light'}>
              <div className={`p-5 md:p-6 rounded-[calc(1.5rem-1px)] h-full ${isDark ? 'bg-[#0E1526]/95 text-white' : 'bg-emerald-50/40 text-slate-900'}`}>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Statutory Compliance</span>
                <p className="text-3xl font-black font-mono text-emerald-400 mt-2">
                  {Math.round(((total - below75) / total) * 100)}%
                </p>
                <p className="text-xs text-slate-500 mt-1">Eligible for final examinations</p>
              </div>
            </div>
          </div>

          <div className={isDark ? 'gradient-border-wrapper' : 'gradient-border-light'}>
            <div className={`p-6 md:p-8 rounded-[calc(1.5rem-1px)] ${isDark ? 'bg-[#0E1526]/95 text-white' : 'bg-white text-slate-900'}`}>
              <h3 className="text-xs font-bold uppercase tracking-wider mb-1">Monthly Attendance Trajectory</h3>
              <p className="text-xs text-slate-400 mb-4">Historical class attendance rates over current semester</p>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyAttendanceData}>
                    <defs>
                      <linearGradient id="colorAttTrend" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1e293b' : '#f1f5f9'} />
                    <XAxis dataKey="month" stroke={isDark ? '#64748b' : '#94a3b8'} fontSize={11} tickLine={false} />
                    <YAxis domain={[70, 100]} stroke={isDark ? '#64748b' : '#94a3b8'} fontSize={11} tickLine={false} unit="%" />
                    <Tooltip />
                    <Area type="monotone" dataKey="avgRate" name="Attendance %" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorAttTrend)" dot={{ r: 4 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Academic Analytics */}
      {activeTab === 'academic' && (
        <div className="space-y-6 md:space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5">
            <div className={isDark ? 'gradient-border-wrapper' : 'gradient-border-light'}>
              <div className={`p-5 md:p-6 rounded-[calc(1.5rem-1px)] h-full ${isDark ? 'bg-[#0E1526]/95 text-white' : 'bg-white text-slate-900'}`}>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Average Marks</span>
                <p className="text-3xl font-black font-mono text-indigo-400 mt-2">{avgMarks}%</p>
                <p className="text-xs text-slate-500 mt-1">Across all assessment checkpoints</p>
              </div>
            </div>

            <div className={isDark ? 'gradient-border-wrapper' : 'gradient-border-light'}>
              <div className={`p-5 md:p-6 rounded-[calc(1.5rem-1px)] h-full ${isDark ? 'bg-[#0E1526]/95 text-white' : 'bg-white text-slate-900'}`}>
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Honor Roll Cutoff</span>
                <p className="text-3xl font-black font-mono text-purple-400 mt-2">86%</p>
                <p className="text-xs text-slate-500 mt-1">Top quartile benchmark</p>
              </div>
            </div>

            <div className={isDark ? 'gradient-border-wrapper' : 'gradient-border-light'}>
              <div className={`p-5 md:p-6 rounded-[calc(1.5rem-1px)] h-full ${isDark ? 'bg-[#0E1526]/95 text-white' : 'bg-white text-slate-900'}`}>
                <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider">Pass Benchmark</span>
                <p className="text-3xl font-black font-mono text-teal-400 mt-2">96%</p>
                <p className="text-xs text-slate-500 mt-1">Passing percentage</p>
              </div>
            </div>
          </div>

          <div className={isDark ? 'gradient-border-wrapper' : 'gradient-border-light'}>
            <div className={`p-6 md:p-8 rounded-[calc(1.5rem-1px)] ${isDark ? 'bg-[#0E1526]/95 text-white' : 'bg-white text-slate-900'}`}>
              <h3 className="text-xs font-bold uppercase tracking-wider mb-1">Assessment Progression</h3>
              <p className="text-xs text-slate-400 mb-4">Cohort improvements from Unit 1 to Final Exam expectations</p>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={ACADEMIC_TREND_SERIES}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1e293b' : '#f1f5f9'} />
                    <XAxis dataKey="assessment" stroke={isDark ? '#64748b' : '#94a3b8'} fontSize={11} tickLine={false} />
                    <YAxis domain={[60, 95]} stroke={isDark ? '#64748b' : '#94a3b8'} fontSize={11} tickLine={false} unit="%" />
                    <Tooltip />
                    <Line type="monotone" dataKey="cseAverage" name="CSE" stroke="#6366f1" strokeWidth={2.5} />
                    <Line type="monotone" dataKey="itAverage" name="IT" stroke="#8b5cf6" strokeWidth={2.5} />
                    <Line type="monotone" dataKey="aidsAverage" name="AI & DS" stroke="#06b6d4" strokeWidth={2.5} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Risk Analytics */}
      {activeTab === 'risk' && (
        <div className="space-y-6 md:space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5">
            <div className={isDark ? 'gradient-border-wrapper-rose' : 'gradient-border-light'}>
              <div className={`p-5 md:p-6 rounded-[calc(1.5rem-1px)] h-full ${isDark ? 'bg-[#0E1526]/95 text-white' : 'bg-rose-50/40 text-slate-900'}`}>
                <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">High Risk</span>
                <p className="text-3xl font-black font-mono text-rose-500 mt-2">{highRisk}</p>
                <p className="text-xs text-rose-400 mt-1">{Math.round((highRisk / total) * 100)}% of cohort</p>
              </div>
            </div>

            <div className={isDark ? 'gradient-border-wrapper-amber' : 'gradient-border-light'}>
              <div className={`p-5 md:p-6 rounded-[calc(1.5rem-1px)] h-full ${isDark ? 'bg-[#0E1526]/95 text-white' : 'bg-amber-50/40 text-slate-900'}`}>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Medium Risk</span>
                <p className="text-3xl font-black font-mono text-amber-500 mt-2">{medRisk}</p>
                <p className="text-xs text-amber-400 mt-1">{Math.round((medRisk / total) * 100)}% of cohort</p>
              </div>
            </div>

            <div className={isDark ? 'gradient-border-wrapper-emerald' : 'gradient-border-light'}>
              <div className={`p-5 md:p-6 rounded-[calc(1.5rem-1px)] h-full ${isDark ? 'bg-[#0E1526]/95 text-white' : 'bg-emerald-50/40 text-slate-900'}`}>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Low Risk</span>
                <p className="text-3xl font-black font-mono text-emerald-400 mt-2">{lowRisk}</p>
                <p className="text-xs text-emerald-400 mt-1">{Math.round((lowRisk / total) * 100)}% of cohort</p>
              </div>
            </div>
          </div>

          <div className={isDark ? 'gradient-border-wrapper' : 'gradient-border-light'}>
            <div className={`p-6 md:p-8 rounded-[calc(1.5rem-1px)] ${isDark ? 'bg-[#0E1526]/95 text-white' : 'bg-white text-slate-900'}`}>
              <h3 className="text-xs font-bold uppercase tracking-wider mb-1">Departmental Risk Distribution</h3>
              <p className="text-xs text-slate-400 mb-4">Risk concentration mapped across departments</p>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { dept: 'CSE', high: 4, medium: 3, low: 7 },
                    { dept: 'IT', high: 1, medium: 2, low: 2 },
                    { dept: 'AI & DS', high: 2, medium: 1, low: 2 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1e293b' : '#f1f5f9'} />
                    <XAxis dataKey="dept" stroke={isDark ? '#64748b' : '#94a3b8'} fontSize={11} tickLine={false} />
                    <YAxis stroke={isDark ? '#64748b' : '#94a3b8'} fontSize={11} tickLine={false} />
                    <Tooltip />
                    <Bar dataKey="high" name="High Risk" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="medium" name="Medium Risk" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="low" name="Low Risk" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Correlations */}
      {activeTab === 'correlations' && (
        <div className="space-y-6 md:space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            {correlationStats.map((item, idx) => (
              <div key={idx} className={isDark ? 'gradient-border-wrapper' : 'gradient-border-light'}>
                <div className={`p-5 md:p-6 rounded-[calc(1.5rem-1px)] h-full ${isDark ? 'bg-[#0E1526]/95' : 'bg-white'}`}>
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{item.name}</h4>
                  <p className={`text-2xl font-black font-mono mt-2 ${item.color}`}>{item.coeff}</p>
                  <span className="text-xs font-medium text-slate-300 block mt-1">{item.strength}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            <div className={isDark ? 'gradient-border-wrapper' : 'gradient-border-light'}>
              <div className={`p-6 md:p-8 rounded-[calc(1.5rem-1px)] ${isDark ? 'bg-[#0E1526]/95 text-white' : 'bg-white text-slate-900'}`}>
                <h3 className="text-xs font-bold uppercase tracking-wider mb-1">Attendance % ↔ Marks %</h3>
                <p className="text-xs text-slate-400 mb-4">Strong empirical driver of final semester grades</p>
                <div className="h-60 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1e293b' : '#f1f5f9'} />
                      <XAxis dataKey="x" name="Attendance" unit="%" stroke={isDark ? '#64748b' : '#94a3b8'} fontSize={11} />
                      <YAxis dataKey="y" name="Marks" unit="%" stroke={isDark ? '#64748b' : '#94a3b8'} fontSize={11} />
                      <Tooltip />
                      <Scatter data={correlationAttendance} fill="#6366f1" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className={isDark ? 'gradient-border-wrapper' : 'gradient-border-light'}>
              <div className={`p-6 md:p-8 rounded-[calc(1.5rem-1px)] ${isDark ? 'bg-[#0E1526]/95 text-white' : 'bg-white text-slate-900'}`}>
                <h3 className="text-xs font-bold uppercase tracking-wider mb-1">Assignments % ↔ Marks %</h3>
                <p className="text-xs text-slate-400 mb-4">Lab submissions directly boost internal test mastery</p>
                <div className="h-60 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1e293b' : '#f1f5f9'} />
                      <XAxis dataKey="x" name="Assignments" unit="%" stroke={isDark ? '#64748b' : '#94a3b8'} fontSize={11} />
                      <YAxis dataKey="y" name="Marks" unit="%" stroke={isDark ? '#64748b' : '#94a3b8'} fontSize={11} />
                      <Tooltip />
                      <Scatter data={correlationAssignments} fill="#a855f7" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
