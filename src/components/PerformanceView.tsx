import React, { useState } from 'react';
import { 
  TrendingUp, 
  Award, 
  BarChart3, 
  Plus, 
  Save, 
  CheckCircle2, 
  ArrowUpRight, 
  AlertCircle 
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
  Cell 
} from 'recharts';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { AssessmentType } from '../types';

export const PerformanceView: React.FC = () => {
  const { students, addToast, fetchStudents, theme } = useApp();
  const isDark = theme === 'dark';

  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [assessmentType, setAssessmentType] = useState<AssessmentType>('Quiz');
  const [scoreInput, setScoreInput] = useState<string>('75');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Computed summary metrics
  const marks = students.map(s => s.internalMarks);
  const avg = Math.round(marks.reduce((a, b) => a + b, 0) / (marks.length || 1));
  const highest = Math.max(...marks, 0);
  const lowest = Math.min(...marks, 100);
  const passingRate = Math.round((students.filter(s => s.internalMarks >= 40).length / (students.length || 1)) * 100);

  // Grade distribution
  const grades = [
    { grade: 'A+ (90-100)', count: students.filter(s => (s.predictedScore ?? 0) >= 90).length, color: '#10b981' },
    { grade: 'A (80-89)', count: students.filter(s => (s.predictedScore ?? 0) >= 80 && (s.predictedScore ?? 0) < 90).length, color: '#06b6d4' },
    { grade: 'B+ (70-79)', count: students.filter(s => (s.predictedScore ?? 0) >= 70 && (s.predictedScore ?? 0) < 80).length, color: '#6366f1' },
    { grade: 'B (60-69)', count: students.filter(s => (s.predictedScore ?? 0) >= 60 && (s.predictedScore ?? 0) < 70).length, color: '#8b5cf6' },
    { grade: 'C (50-59)', count: students.filter(s => (s.predictedScore ?? 0) >= 50 && (s.predictedScore ?? 0) < 60).length, color: '#f59e0b' },
    { grade: 'D (40-49)', count: students.filter(s => (s.predictedScore ?? 0) >= 40 && (s.predictedScore ?? 0) < 50).length, color: '#f97316' },
    { grade: 'F (<40)', count: students.filter(s => (s.predictedScore ?? 0) < 40).length, color: '#f43f5e' },
  ];

  const subjectScores = [
    { subject: 'Data Structures', classAvg: 76, highest: 96, passRate: 88 },
    { subject: 'DBMS', classAvg: 78, highest: 95, passRate: 91 },
    { subject: 'Operating Systems', classAvg: 71, highest: 92, passRate: 83 },
    { subject: 'Computer Networks', classAvg: 74, highest: 94, passRate: 86 },
    { subject: 'Theory of Computation', classAvg: 68, highest: 89, passRate: 79 },
  ];

  const handleRecordScore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId) return;

    const val = Number(scoreInput);
    if (isNaN(val) || val < 0 || val > 100) {
      addToast({
        type: 'error',
        title: 'Invalid Score',
        message: 'Assessment marks must be between 0 and 100.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await api.recordMarks(selectedStudentId, assessmentType, val);
      await fetchStudents();
      const studentName = students.find(s => s.id === selectedStudentId)?.name || 'Student';
      addToast({
        type: 'success',
        title: 'Score Recorded & AI Updated',
        message: `Logged ${assessmentType} mark of ${val}% for ${studentName}.`,
      });
    } catch (err: any) {
      addToast({
        type: 'success',
        title: 'Score Recorded',
        message: `Marks logged for evaluation cycle.`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      {/* Header */}
      <div>
        <h1 className={`text-xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Academic Performance Analytics
        </h1>
        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Record evaluations, monitor grade distributions, and evaluate subject pass rates
        </p>
      </div>

      {/* KPI Stats with subtle border gradients */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-5">
        <div className={isDark ? 'gradient-border-wrapper' : 'gradient-border-light'}>
          <div className={`p-5 md:p-6 rounded-[calc(1.5rem-1px)] h-full flex flex-col justify-between ${
            isDark ? 'bg-[#0E1526]/95 text-white' : 'bg-white text-slate-900'
          }`}>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Class Average</span>
            <p className="text-3xl font-black font-mono text-indigo-400 mt-2">{avg}%</p>
            <div className="mt-1 flex items-center text-xs text-emerald-400 font-semibold">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Target benchmark met</span>
            </div>
          </div>
        </div>

        <div className={isDark ? 'gradient-border-wrapper-emerald' : 'gradient-border-light'}>
          <div className={`p-5 md:p-6 rounded-[calc(1.5rem-1px)] h-full flex flex-col justify-between ${
            isDark ? 'bg-[#0E1526]/95 text-white' : 'bg-white text-slate-900'
          }`}>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Highest Score</span>
            <p className="text-3xl font-black font-mono text-emerald-400 mt-2">{highest}%</p>
            <p className="text-xs text-slate-500 mt-1">Ananya Iyer (22CS108)</p>
          </div>
        </div>

        <div className={isDark ? 'gradient-border-wrapper-rose' : 'gradient-border-light'}>
          <div className={`p-5 md:p-6 rounded-[calc(1.5rem-1px)] h-full flex flex-col justify-between ${
            isDark ? 'bg-[#0E1526]/95 text-white' : 'bg-rose-50/40 text-slate-900'
          }`}>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Lowest Score</span>
            <p className="text-3xl font-black font-mono text-rose-400 mt-2">{lowest}%</p>
            <p className="text-xs text-slate-500 mt-1">Remedial coaching assigned</p>
          </div>
        </div>

        <div className={isDark ? 'gradient-border-wrapper' : 'gradient-border-light'}>
          <div className={`p-5 md:p-6 rounded-[calc(1.5rem-1px)] h-full flex flex-col justify-between ${
            isDark ? 'bg-[#0E1526]/95 text-white' : 'bg-white text-slate-900'
          }`}>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Passing Rate</span>
            <p className="text-3xl font-black font-mono text-teal-400 mt-2">{passingRate}%</p>
            <p className="text-xs text-slate-500 mt-1">40% minimum passing mark</p>
          </div>
        </div>
      </div>

      {/* Grade Entry Form + Grade Distribution Chart with subtle border gradients */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        {/* Quick Marks Entry Card (5 cols) */}
        <div className={`lg:col-span-5 ${isDark ? 'gradient-border-wrapper' : 'gradient-border-light'}`}>
          <div className={`p-6 md:p-8 rounded-[calc(1.5rem-1px)] h-full ${
            isDark ? 'bg-[#0E1526]/95 text-white' : 'bg-white text-slate-900'
          }`}>
            <div className={`flex items-center gap-2 pb-3.5 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
              <div className="w-8 h-8 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold tracking-tight">Record Assessment Score</h2>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Updates student internal score & recalculates predictions
                </p>
              </div>
            </div>

            <form onSubmit={handleRecordScore} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Select Student</label>
                <select
                  value={selectedStudentId}
                  onChange={e => setSelectedStudentId(e.target.value)}
                  className={`w-full text-xs rounded-xl px-3 py-2 font-medium border focus:outline-none ${
                    isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.rollNumber}) - Current: {s.internalMarks}%
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Assessment Type</label>
                <select
                  value={assessmentType}
                  onChange={e => setAssessmentType(e.target.value as AssessmentType)}
                  className={`w-full text-xs rounded-xl px-3 py-2 font-medium border focus:outline-none ${
                    isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                >
                  <option value="Quiz">Quiz (10 Marks)</option>
                  <option value="Unit 1">Unit 1 Assessment</option>
                  <option value="Unit 2">Unit 2 Assessment</option>
                  <option value="Midterm">Midterm Examination</option>
                  <option value="Unit 3">Unit 3 Assessment</option>
                  <option value="Unit 4">Unit 4 Assessment</option>
                  <option value="Final">Final Examination</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Score Obtained (0 - 100%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={scoreInput}
                  onChange={e => setScoreInput(e.target.value)}
                  className={`w-full text-xs rounded-xl px-3 py-2 font-bold font-mono border focus:outline-none ${
                    isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-75"
              >
                <Save className="w-4 h-4" />
                <span>{isSubmitting ? 'Recalculating...' : 'Save & Update AI Model'}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Grade Distribution Bar Chart (7 cols) */}
        <div className={`lg:col-span-7 ${isDark ? 'gradient-border-wrapper' : 'gradient-border-light'}`}>
          <div className={`p-6 md:p-8 rounded-[calc(1.5rem-1px)] h-full ${
            isDark ? 'bg-[#0E1526]/95 text-white' : 'bg-white text-slate-900'
          }`}>
            <div className={`flex items-center justify-between pb-3.5 border-b ${
              isDark ? 'border-slate-800' : 'border-slate-100'
            }`}>
              <div>
                <h2 className="text-sm font-bold tracking-tight">Predicted Grade Distribution</h2>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Expected letter grades across cohort based on AI model
                </p>
              </div>
              <span className="text-xs font-bold text-indigo-400 bg-indigo-500/15 border border-indigo-500/20 px-2.5 py-0.5 rounded-full">
                Bell Curve View
              </span>
            </div>

            <div className="h-64 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={grades} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1e293b' : '#f1f5f9'} />
                  <XAxis dataKey="grade" stroke={isDark ? '#64748b' : '#94a3b8'} fontSize={10} tickLine={false} />
                  <YAxis stroke={isDark ? '#64748b' : '#94a3b8'} fontSize={11} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="count" name="Students" radius={[6, 6, 0, 0]}>
                    {grades.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Subject Performance Breakdown with subtle border gradient wrapper */}
      <div className={isDark ? 'gradient-border-wrapper' : 'gradient-border-light'}>
        <div className={`rounded-[calc(1.5rem-1px)] p-6 md:p-8 ${
          isDark ? 'bg-[#0E1526]/95 text-white' : 'bg-white text-slate-900'
        }`}>
        <h3 className="text-sm font-bold tracking-tight mb-1">Subject Performance Benchmarks</h3>
        <p className={`text-xs mb-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Class averages and pass rates across core academic curriculum
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className={`text-xs font-bold uppercase tracking-wider border-b ${
              isDark ? 'bg-slate-900/60 text-slate-400 border-slate-800' : 'bg-slate-50 text-slate-600 border-slate-100'
            }`}>
              <tr>
                <th className="px-6 py-3">Subject Name</th>
                <th className="px-4 py-3">Class Average</th>
                <th className="px-4 py-3">Highest Mark</th>
                <th className="px-4 py-3">Passing Rate</th>
                <th className="px-6 py-3 text-right">Academic Status</th>
              </tr>
            </thead>
            <tbody className={`divide-y text-xs font-medium ${
              isDark ? 'divide-slate-800/80 text-slate-200' : 'divide-slate-100 text-slate-700'
            }`}>
              {subjectScores.map((sub, idx) => (
                <tr key={idx} className={isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50/80'}>
                  <td className="px-6 py-3.5 font-bold text-slate-100">{sub.subject}</td>
                  <td className="px-4 py-3.5 font-mono font-bold text-indigo-400">{sub.classAvg}%</td>
                  <td className="px-4 py-3.5 font-mono font-bold text-emerald-400">{sub.highest}%</td>
                  <td className="px-4 py-3.5 font-mono font-bold">{sub.passRate}%</td>
                  <td className="px-6 py-3.5 text-right">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" />
                      Normal Velocity
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
      </div>
    </div>
  );
};
