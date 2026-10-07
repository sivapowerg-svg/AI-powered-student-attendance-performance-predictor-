import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  Eye, 
  Sparkles, 
  Mail, 
  UserCheck, 
  Search, 
  Filter,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Avatar } from './Avatar';

export const AtRiskView: React.FC = () => {
  const { students, navigateToStudent, openExplainModal, addToast, theme } = useApp();
  const isDark = theme === 'dark';

  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'All' | 'High' | 'Medium'>('All');

  // Filter students who are High or Medium risk
  const atRiskStudents = students.filter(s => {
    const isRisk = s.riskLevel === 'High' || s.riskLevel === 'Medium';
    const matchesSeverity = severityFilter === 'All' || s.riskLevel === severityFilter;
    const matchesSearch = 
      s.name.toLowerCase().includes(search.toLowerCase()) || 
      s.rollNumber.toLowerCase().includes(search.toLowerCase());
    return isRisk && matchesSeverity && matchesSearch;
  }).sort((a, b) => (b.riskScore ?? 0) - (a.riskScore ?? 0));

  const handleNotifyAdvisor = (studentName: string) => {
    addToast({
      type: 'success',
      title: 'Advisor Alert Dispatched',
      message: `Priority academic mentoring request sent to department advisor for ${studentName}.`,
    });
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
            <h1 className={`text-xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              At-Risk Students Dossier & Early Intervention
            </h1>
          </div>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Immediate faculty attention required. Students flagged for potential examination debarment or academic distress.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-rose-500/15 border border-rose-500/30 text-rose-300 px-3.5 py-1.5 rounded-2xl text-xs font-bold self-start sm:self-auto">
          <AlertTriangle className="w-4 h-4 text-rose-400" />
          <span>{atRiskStudents.length} Students Requiring Intervention</span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className={`p-4 rounded-3xl border flex flex-col sm:flex-row items-center justify-between gap-3 ${
        isDark ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
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
          <span className="text-xs text-slate-400 font-medium">Severity:</span>
          {(['All', 'High', 'Medium'] as const).map(sev => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                severityFilter === sev
                  ? 'bg-rose-600 text-white shadow-xs'
                  : (isDark ? 'bg-slate-900 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200')
              }`}
            >
              {sev === 'All' ? 'All Risks' : `${sev} Risk`}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of At-Risk Student Cards with subtle border-gradients */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
        {atRiskStudents.map((student) => {
          const isHigh = student.riskLevel === 'High';
          const wrapperClass = isHigh
            ? (isDark ? 'gradient-border-wrapper-rose' : 'gradient-border-light')
            : (isDark ? 'gradient-border-wrapper-amber' : 'gradient-border-light');

          return (
            <div key={student.id} className={wrapperClass}>
              <div
                className={`rounded-[calc(1.5rem-1px)] p-6 h-full flex flex-col justify-between space-y-4 ${
                  isDark ? 'bg-[#0E1526]/95 text-white' : 'bg-white text-slate-900'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar name={student.name} size="md" />
                      <div>
                        <h3 className="text-xs font-bold text-slate-100">{student.name}</h3>
                        <span className="text-[11px] font-mono font-semibold text-slate-400">{student.rollNumber}</span>
                      </div>
                    </div>

                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border ${
                      isHigh
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    }`}>
                      {student.riskLevel} Risk
                    </span>
                  </div>

                  <div className={`grid grid-cols-2 gap-2.5 text-xs p-3.5 rounded-2xl border ${
                    isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-100'
                  }`}>
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase">Attendance</span>
                      <p className={`font-mono font-bold ${student.attendancePercent < 75 ? 'text-rose-400' : 'text-slate-300'}`}>
                        {student.attendancePercent}% {student.attendancePercent < 75 && '(Cutoff)'}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase">Internal Marks</span>
                      <p className="font-mono font-bold text-slate-300">{student.internalMarks}%</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase">Assignments</span>
                      <p className="font-mono font-bold text-slate-300">{student.assignmentScore}%</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase">Predicted Final</span>
                      <p className="font-mono font-bold text-indigo-400">{student.predictedScore}% ({student.expectedGrade})</p>
                    </div>
                  </div>

                  <div className="mt-3.5 text-xs bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20 flex items-start gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400 mt-0.5 shrink-0" />
                    <p className="leading-snug text-rose-300 text-[11px]">
                      {student.attendancePercent < 75
                        ? 'Attendance deficit threatens exam eligibility. Urgent counseling required.'
                        : 'Internal marks indicate significant gaps in foundational subjects.'}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openExplainModal(student.id)}
                      className="flex-1 py-1.5 px-3 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 border border-purple-500/20 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                      <span>Explain AI</span>
                    </button>
                    <button
                      onClick={() => navigateToStudent(student.id)}
                      className="flex-1 py-1.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1 shadow-xs transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Profile</span>
                    </button>
                  </div>

                  <button
                    onClick={() => handleNotifyAdvisor(student.name)}
                    className={`w-full py-1.5 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-1 transition-colors border ${
                      isDark 
                        ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800' 
                        : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Notify Department Advisor</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
