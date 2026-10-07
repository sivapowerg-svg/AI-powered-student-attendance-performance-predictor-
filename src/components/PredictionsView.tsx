import React, { useState } from 'react';
import { 
  BrainCircuit, 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  RefreshCw, 
  Eye, 
  ShieldAlert, 
  CheckCircle2, 
  Filter, 
  Search 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Avatar } from './Avatar';

export const PredictionsView: React.FC = () => {
  const { 
    students, 
    runPredictionEngine, 
    isPredicting, 
    navigateToStudent, 
    openExplainModal,
    theme 
  } = useApp();

  const isDark = theme === 'dark';

  const [riskFilter, setRiskFilter] = useState<string>('All');
  const [search, setSearch] = useState<string>('');

  const highRiskCount = students.filter(s => s.riskLevel === 'High').length;
  const medRiskCount = students.filter(s => s.riskLevel === 'Medium').length;
  const lowRiskCount = students.filter(s => s.riskLevel === 'Low').length;
  const avgPredicted = Math.round(
    students.reduce((acc, s) => acc + (s.predictedScore ?? 0), 0) / (students.length || 1)
  );

  const filteredStudents = students.filter(s => {
    const matchesRisk = riskFilter === 'All' || s.riskLevel === riskFilter;
    const matchesSearch = 
      s.name.toLowerCase().includes(search.toLowerCase()) || 
      s.rollNumber.toLowerCase().includes(search.toLowerCase());
    return matchesRisk && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      {/* Top Banner with Run Prediction CTA */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 text-white rounded-3xl p-6 md:p-8 border border-indigo-500/20 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>EduPredict Neural Regression Model v4.2</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">AI Predictive Intelligence Hub</h1>
          <p className="text-xs md:text-sm text-indigo-200/80 leading-relaxed">
            Multi-variable regression models synthesized from attendance records, internal exams, lab submissions, and participation baselines.
          </p>
        </div>

        <button
          onClick={runPredictionEngine}
          disabled={isPredicting}
          className="relative px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs md:text-sm font-bold shadow-lg shadow-indigo-500/30 transition-all flex items-center gap-2.5 active:scale-95 disabled:opacity-75 z-10 shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${isPredicting ? 'animate-spin' : ''}`} />
          <span>{isPredicting ? 'Processing Neural Model...' : 'Run Prediction Engine'}</span>
        </button>
      </div>

      {/* 5 KPI Cards Row with subtle border gradients */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
        <div className={isDark ? 'gradient-border-wrapper' : 'gradient-border-light'}>
          <div className={`p-5 md:p-6 rounded-[calc(1.5rem-1px)] h-full flex flex-col justify-between ${
            isDark ? 'bg-[#0E1526]/95 text-white' : 'bg-white text-slate-900'
          }`}>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Predictions</span>
            <p className="text-2xl font-black font-mono mt-2">{students.length}</p>
            <span className="text-[10px] text-slate-500 mt-1">100% active coverage</span>
          </div>
        </div>

        <div className={isDark ? 'gradient-border-wrapper-rose' : 'gradient-border-light'}>
          <div className={`p-5 md:p-6 rounded-[calc(1.5rem-1px)] h-full flex flex-col justify-between ${
            isDark ? 'bg-[#0E1526]/95 text-white' : 'bg-rose-50/30 text-slate-900'
          }`}>
            <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">High-Risk</span>
            <p className="text-2xl font-black font-mono text-rose-500 mt-2">{highRiskCount}</p>
            <span className="text-[10px] text-rose-400 font-semibold mt-1">Immediate counseling</span>
          </div>
        </div>

        <div className={isDark ? 'gradient-border-wrapper-amber' : 'gradient-border-light'}>
          <div className={`p-5 md:p-6 rounded-[calc(1.5rem-1px)] h-full flex flex-col justify-between ${
            isDark ? 'bg-[#0E1526]/95 text-white' : 'bg-amber-50/30 text-slate-900'
          }`}>
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Medium-Risk</span>
            <p className="text-2xl font-black font-mono text-amber-500 mt-2">{medRiskCount}</p>
            <span className="text-[10px] text-amber-500 font-semibold mt-1">Advisory monitoring</span>
          </div>
        </div>

        <div className={isDark ? 'gradient-border-wrapper-emerald' : 'gradient-border-light'}>
          <div className={`p-5 md:p-6 rounded-[calc(1.5rem-1px)] h-full flex flex-col justify-between ${
            isDark ? 'bg-[#0E1526]/95 text-white' : 'bg-emerald-50/30 text-slate-900'
          }`}>
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Low-Risk</span>
            <p className="text-2xl font-black font-mono text-emerald-500 mt-2">{lowRiskCount}</p>
            <span className="text-[10px] text-emerald-400 font-semibold mt-1">On-track trajectory</span>
          </div>
        </div>

        <div className={`col-span-2 sm:col-span-1 ${isDark ? 'gradient-border-wrapper' : 'gradient-border-light'}`}>
          <div className={`p-5 md:p-6 rounded-[calc(1.5rem-1px)] h-full flex flex-col justify-between ${
            isDark ? 'bg-[#0E1526]/95 text-white' : 'bg-white text-slate-900'
          }`}>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avg Predicted</span>
            <p className="text-2xl font-black font-mono text-indigo-400 mt-2">{avgPredicted}%</p>
            <span className="text-[10px] text-slate-500 mt-1">Expected Grade B</span>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className={`p-4 rounded-3xl border flex flex-col sm:flex-row items-center justify-between gap-3 ${
        isDark ? 'bg-[#0E1526] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-xs'
      }`}>
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search student or roll number..."
            className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs border focus:outline-none ${
              isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
            }`}
          />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs text-slate-400 font-medium">Filter Risk:</span>
          {(['All', 'High', 'Medium', 'Low'] as const).map(level => (
            <button
              key={level}
              onClick={() => setRiskFilter(level)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                riskFilter === level
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : (isDark ? 'bg-slate-900 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200')
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Predictions Table with subtle border-gradient wrapper */}
      <div className={isDark ? 'gradient-border-wrapper' : 'gradient-border-light'}>
        <div className={`rounded-[calc(1.5rem-1px)] p-6 md:p-8 overflow-hidden ${
          isDark ? 'bg-[#0E1526]/95 text-white' : 'bg-white text-slate-900'
        }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className={`text-xs font-bold uppercase tracking-wider border-b ${
              isDark ? 'bg-slate-900/60 text-slate-400 border-slate-800' : 'bg-slate-50 text-slate-600 border-slate-100'
            }`}>
              <tr>
                <th className="px-6 py-3">Student</th>
                <th className="px-4 py-3">Current Score</th>
                <th className="px-4 py-3">Predicted Score</th>
                <th className="px-4 py-3">Confidence</th>
                <th className="px-4 py-3">Risk Level</th>
                <th className="px-4 py-3">Trend</th>
                <th className="px-4 py-3">Top AI Recommendation</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y text-xs font-medium ${
              isDark ? 'divide-slate-800/80 text-slate-200' : 'divide-slate-100 text-slate-700'
            }`}>
              {filteredStudents.map((student) => {
                const isHigh = student.riskLevel === 'High';
                const isMed = student.riskLevel === 'Medium';
                const diff = (student.predictedScore ?? 0) - student.internalMarks;
                return (
                  <tr 
                    key={student.id} 
                    className={`transition-colors ${
                      isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50/80'
                    }`}
                  >
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar name={student.name} size="sm" />
                        <div>
                          <p className="font-bold text-slate-100">{student.name}</p>
                          <p className="text-[10px] font-mono text-slate-400">{student.rollNumber}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-mono font-semibold">{student.internalMarks}%</td>
                    <td className="px-4 py-3.5 font-mono">
                      <span className="font-extrabold text-indigo-400 text-sm">{student.predictedScore}%</span>
                      <span className="text-[10px] font-bold text-slate-500 ml-1">({student.expectedGrade})</span>
                    </td>
                    <td className="px-4 py-3.5 font-mono">
                      <span className={`inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded ${
                        isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {student.confidence}%
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 font-bold px-2.5 py-0.5 rounded-full ${
                        isHigh
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : isMed
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isHigh ? 'bg-rose-500' : isMed ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                        {student.riskLevel}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-mono">
                      {diff > 2 ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                          <TrendingUp className="w-3.5 h-3.5" />
                          <span>+{diff}%</span>
                        </span>
                      ) : diff < -2 ? (
                        <span className="inline-flex items-center gap-1 text-rose-400 font-bold">
                          <TrendingDown className="w-3.5 h-3.5" />
                          <span>{diff}%</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-slate-500 font-semibold">
                          <Minus className="w-3.5 h-3.5" />
                          <span>Stable</span>
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 max-w-xs truncate text-slate-400">
                      {student.attendancePercent < 75 
                        ? 'Statutory Attendance Counseling' 
                        : student.internalMarks < 60 
                        ? 'Core Subject Remedial Tutoring' 
                        : 'Maintain Current Velocity'}
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openExplainModal(student.id)}
                          className="px-2.5 py-1 rounded-xl bg-purple-500/15 text-purple-300 hover:bg-purple-500/25 border border-purple-500/20 font-bold text-xs flex items-center gap-1"
                          title="Explain Diagnostics"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                          <span>Explain</span>
                        </button>
                        <button
                          onClick={() => navigateToStudent(student.id)}
                          className="px-2.5 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1 shadow-xs"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        </div>
      </div>
    </div>
  );
};
