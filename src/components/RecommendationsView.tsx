import React, { useState } from 'react';
import { 
  Lightbulb, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Filter, 
  CalendarCheck, 
  FileCheck, 
  BookOpen, 
  UserCheck, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { evaluateStudent } from '../services/predictionEngine';
import { Recommendation } from '../types';

export const RecommendationsView: React.FC = () => {
  const { students, settings, navigateToStudent, addToast, theme } = useApp();
  const isDark = theme === 'dark';

  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Gather recommendations across all students
  const [allRecs, setAllRecs] = useState<Recommendation[]>(() => {
    const list: Recommendation[] = [];
    students.forEach(s => {
      const { recommendations } = evaluateStudent(s, settings);
      list.push(...recommendations);
    });
    return list;
  });

  const handleStatusToggle = (recId: string) => {
    setAllRecs(prev =>
      prev.map(r => {
        if (r.id !== recId) return r;
        const next = r.status === 'PENDING' ? 'IN_PROGRESS' : r.status === 'IN_PROGRESS' ? 'COMPLETED' : 'PENDING';
        addToast({
          type: 'success',
          title: 'Status Updated',
          message: `${r.title} marked as ${next.replace('_', ' ')}.`,
        });
        return { ...r, status: next };
      })
    );
  };

  const filteredRecs = allRecs.filter(r => {
    const matchesType = typeFilter === 'All' || r.type === typeFilter;
    const matchesPriority = priorityFilter === 'All' || r.priority === priorityFilter;
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    return matchesType && matchesPriority && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Personalized AI Recommendations
          </h1>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Targeted faculty interventions, attendance warnings, and academic recovery roadmaps
          </p>
        </div>

        <div className={`flex items-center gap-2 text-xs font-bold px-3.5 py-1.5 rounded-2xl border ${
          isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-600'
        }`}>
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>{filteredRecs.length} Actionable Recommendations</span>
        </div>
      </div>

      {/* Filter Row */}
      <div className={`p-4 rounded-3xl border flex flex-wrap items-center gap-3 ${
        isDark ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        {/* Type Filter */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-400 font-medium">Type:</span>
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className={`border rounded-xl px-2.5 py-1.5 text-xs font-semibold focus:outline-none ${
              isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <option value="All">All Intervention Types</option>
            <option value="ATTENDANCE">Attendance Counseling</option>
            <option value="SUBJECT_SUPPORT">Core Subject Support</option>
            <option value="ASSIGNMENT">Assignment Remediation</option>
            <option value="MENTORING">1-on-1 Faculty Mentorship</option>
            <option value="REINFORCEMENT">Positive Reinforcement</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-400 font-medium">Priority:</span>
          <select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
            className={`border rounded-xl px-2.5 py-1.5 text-xs font-semibold focus:outline-none ${
              isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <option value="All">All Priorities</option>
            <option value="HIGH">High Priority</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="LOW">Low Priority</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-400 font-medium">Status:</span>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className={`border rounded-xl px-2.5 py-1.5 text-xs font-semibold focus:outline-none ${
              isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <option value="All">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>

      {/* Cards Grid with subtle border-gradients */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
        {filteredRecs.map((rec) => {
          const isCompleted = rec.status === 'COMPLETED';
          const isInProgress = rec.status === 'IN_PROGRESS';
          const wrapperClass = rec.priority === 'HIGH'
            ? (isDark ? 'gradient-border-wrapper-rose' : 'gradient-border-light')
            : rec.priority === 'MEDIUM'
            ? (isDark ? 'gradient-border-wrapper-amber' : 'gradient-border-light')
            : (isDark ? 'gradient-border-wrapper' : 'gradient-border-light');

          return (
            <div key={rec.id} className={wrapperClass}>
              <div
                className={`p-6 rounded-[calc(1.5rem-1px)] h-full flex flex-col justify-between space-y-4 ${
                  isCompleted
                    ? (isDark ? 'bg-[#0E1526]/40 opacity-60 text-slate-300' : 'bg-slate-50 opacity-70 text-slate-700')
                    : (isDark ? 'bg-[#0E1526]/95 text-white' : 'bg-white text-slate-900')
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      rec.priority === 'HIGH'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : rec.priority === 'MEDIUM'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {rec.priority} Priority
                    </span>

                    <button
                      onClick={() => handleStatusToggle(rec.id)}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 transition-colors ${
                        isCompleted
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : isInProgress
                          ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>Completed</span>
                        </>
                      ) : isInProgress ? (
                        <>
                          <Clock className="w-3 h-3 text-indigo-400" />
                          <span>In Progress</span>
                        </>
                      ) : (
                        <span>Pending</span>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-xs font-bold text-slate-100">{rec.title}</h3>
                  </div>

                  <div className="text-xs font-semibold text-indigo-400 mb-2">
                    Student: {rec.studentName} ({rec.rollNumber})
                  </div>

                  <p className={`text-[11px] leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {rec.message}
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div className={`p-3.5 rounded-2xl border text-xs ${
                    isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">Suggested Faculty Action:</span>
                    <p className={`font-medium leading-snug ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{rec.suggestedAction}</p>
                  </div>

                  <button
                    onClick={() => navigateToStudent(rec.studentId)}
                    className={`w-full py-1.5 px-3 rounded-xl text-xs font-bold border transition-colors flex items-center justify-center gap-1 ${
                      isDark 
                        ? 'bg-slate-900 border-slate-800 text-indigo-300 hover:bg-slate-800' 
                        : 'bg-indigo-50/50 border-indigo-100 text-indigo-600 hover:bg-indigo-100'
                    }`}
                  >
                    <span>Open Student Profile</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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
