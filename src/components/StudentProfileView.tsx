import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Sparkles, 
  BrainCircuit, 
  CalendarCheck, 
  TrendingUp, 
  FileCheck, 
  MessageSquare, 
  History, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Mail, 
  Phone, 
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  HelpCircle,
  RefreshCw,
  Edit,
  GraduationCap
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Student, PredictionResult, Recommendation } from '../types';
import { evaluateStudent } from '../services/predictionEngine';
import { Avatar } from './Avatar';

export const StudentProfileView: React.FC = () => {
  const { 
    selectedStudentId, 
    setActiveView, 
    students, 
    settings, 
    addToast,
    openExplainModal,
    theme
  } = useApp();

  const isDark = theme === 'dark';

  const [timeframe, setTimeframe] = useState<'Weekly' | 'Semester'>('Semester');
  const [studentData, setStudentData] = useState<Student | null>(null);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isAiExplaining, setIsAiExplaining] = useState<boolean>(false);
  const [aiCustomNarrative, setAiCustomNarrative] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedStudentId) return;
    const currentStudent = students.find(s => s.id === selectedStudentId);
    if (currentStudent) {
      setStudentData(currentStudent);
      const evalResult = evaluateStudent(currentStudent, settings);
      setPrediction(evalResult.prediction);
      setRecommendations(evalResult.recommendations);
    }
  }, [selectedStudentId, students, settings]);

  if (!studentData || !prediction) {
    return (
      <div className="p-12 text-center text-slate-500">
        <p>No student selected.</p>
        <button
          onClick={() => setActiveView('students')}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
        >
          Return to Student Directory
        </button>
      </div>
    );
  }

  // Multi-period performance graph data
  const semesterGraphData = [
    { period: 'Unit 1', attendance: studentData.attendancePercent + 4, marks: Math.round(studentData.internalMarks * 0.92), assignments: studentData.assignmentScore - 2, participation: studentData.participationScore + 2 },
    { period: 'Unit 2', attendance: studentData.attendancePercent + 2, marks: Math.round(studentData.internalMarks * 0.96), assignments: studentData.assignmentScore, participation: studentData.participationScore },
    { period: 'Midterm', attendance: studentData.attendancePercent - 3, marks: studentData.internalMarks, assignments: studentData.assignmentScore - 5, participation: studentData.participationScore - 4 },
    { period: 'Unit 3', attendance: studentData.attendancePercent - 1, marks: Math.round(studentData.internalMarks * 1.02), assignments: studentData.assignmentScore + 3, participation: studentData.participationScore },
    { period: 'Unit 4', attendance: studentData.attendancePercent, marks: Math.round(studentData.internalMarks * 1.04), assignments: studentData.assignmentScore + 4, participation: studentData.participationScore + 3 },
  ];

  const weeklyGraphData = [
    { period: 'W1', attendance: studentData.attendancePercent + 5, marks: studentData.internalMarks - 4, assignments: studentData.assignmentScore, participation: studentData.participationScore },
    { period: 'W2', attendance: studentData.attendancePercent + 2, marks: studentData.internalMarks - 2, assignments: studentData.assignmentScore - 2, participation: studentData.participationScore + 2 },
    { period: 'W3', attendance: studentData.attendancePercent - 4, marks: studentData.internalMarks, assignments: studentData.assignmentScore + 1, participation: studentData.participationScore - 3 },
    { period: 'W4', attendance: studentData.attendancePercent, marks: studentData.internalMarks + 2, assignments: studentData.assignmentScore + 4, participation: studentData.participationScore },
  ];

  const currentChartData = timeframe === 'Weekly' ? weeklyGraphData : semesterGraphData;

  const handleStatusChange = async (recId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'PENDING' ? 'IN_PROGRESS' : currentStatus === 'IN_PROGRESS' ? 'COMPLETED' : 'PENDING';
    setRecommendations(prev =>
      prev.map(r => (r.id === recId ? { ...r, status: nextStatus as any } : r))
    );
    try {
      await api.updateRecommendationStatus(recId, nextStatus);
    } catch (e) {
      // client update
    }
    addToast({
      type: 'success',
      title: 'Action Status Updated',
      message: `Recommendation moved to ${nextStatus.replace('_', ' ')}.`,
    });
  };

  const handleExplainAI = async () => {
    setIsAiExplaining(true);
    try {
      const res = await api.explainPrediction(studentData.id);
      if (res && res.narrative) {
        setAiCustomNarrative(res.narrative);
      }
    } catch (err) {
      setAiCustomNarrative(
        `${studentData.name}'s performance deficit is closely aligned with attendance interruptions and lab delays. Targeted academic counseling in algorithmic core units provides estimated +12% final marks recovery.`
      );
    } finally {
      setIsAiExplaining(false);
    }
  };

  // Circular progress calculations
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (prediction.riskScore / 100) * circumference;

  const getRiskColors = (level: string) => {
    if (level === 'High') {
      return { 
        stroke: '#f43f5e', 
        text: 'text-rose-400', 
        bg: isDark ? 'bg-rose-950/20' : 'bg-rose-50', 
        border: isDark ? 'border-rose-900/40' : 'border-rose-200' 
      };
    }
    if (level === 'Medium') {
      return { 
        stroke: '#f59e0b', 
        text: 'text-amber-400', 
        bg: isDark ? 'bg-amber-950/20' : 'bg-amber-50', 
        border: isDark ? 'border-amber-900/40' : 'border-amber-200' 
      };
    }
    return { 
      stroke: '#10b981', 
      text: 'text-emerald-400', 
      bg: isDark ? 'bg-emerald-950/20' : 'bg-emerald-50', 
      border: isDark ? 'border-emerald-900/40' : 'border-emerald-200' 
    };
  };

  const riskColors = getRiskColors(prediction.riskLevel);

  return (
    <div className="space-y-8 md:space-y-10 pb-16 animate-in fade-in">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveView('students')}
          className={`inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl border transition-colors ${
            isDark
              ? 'bg-slate-900/80 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Students Directory</span>
        </button>

        <button
          onClick={() => openExplainModal(studentData.id)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-300 bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 px-4 py-2 rounded-xl transition-all shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>Explain AI Diagnostics</span>
        </button>
      </div>

      {/* Student Profile Header & Circular Radial Gauge with Border-Gradient */}
      <div className={isDark ? 'gradient-border-wrapper' : 'gradient-border-light'}>
        <div className={`p-8 md:p-10 rounded-[calc(1.5rem-1px)] flex flex-col lg:flex-row items-center justify-between gap-8 ${
          isDark ? 'bg-[#0E1526]/95 text-white' : 'bg-white text-slate-900'
        }`}>
          {/* Left: Avatar & Info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6">
            <Avatar name={studentData.name} size="xl" className="ring-4 ring-indigo-500/30 shadow-xl" />
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{studentData.name}</h1>
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300">
                  {studentData.rollNumber}
                </span>
              </div>
              <p className={`text-xs md:text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {studentData.department} • {studentData.course}
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs pt-1 text-slate-400">
                <span className="flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-slate-500" />
                  Semester {studentData.semester} (Section {studentData.section})
                </span>
                <span className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-slate-500" />
                  {studentData.email}
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-slate-500" />
                  {studentData.phone}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Circular Overall Risk Indicator */}
          <div className={`flex items-center gap-6 p-5 rounded-2xl ${riskColors.bg} border ${riskColors.border} self-stretch lg:self-auto justify-center`}>
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-28 h-28 -rotate-90 transform">
                <circle
                  cx="56"
                  cy="56"
                  r={radius}
                  stroke={isDark ? '#1e293b' : '#e2e8f0'}
                  strokeWidth="9"
                  fill="transparent"
                />
                <circle
                  cx="56"
                  cy="56"
                  r={radius}
                  stroke={riskColors.stroke}
                  strokeWidth="9"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-black font-mono">{prediction.riskScore}</span>
                <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">/ 100</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Overall Risk Score
              </span>
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${prediction.riskLevel === 'High' ? 'bg-rose-500' : prediction.riskLevel === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                <h3 className={`text-lg font-extrabold ${riskColors.text}`}>{prediction.riskLevel} Risk</h3>
              </div>
              <p className={`text-[11px] max-w-[170px] leading-tight ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Multi-factor composite weighted index.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metric Cards with subtle border-gradient styling */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
        {/* Attendance */}
        <div className={isDark ? 'gradient-border-wrapper' : 'gradient-border-light'}>
          <div className={`p-6 rounded-[calc(1.5rem-1px)] h-full flex flex-col justify-between ${
            isDark ? 'bg-[#0E1526]/95 text-white' : 'bg-white text-slate-900'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Attendance</span>
              <CalendarCheck className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-2xl font-black font-mono mt-2">{studentData.attendancePercent}%</p>
            <div className="mt-1 text-[11px] font-semibold">
              {studentData.attendancePercent < 75 ? (
                <span className="text-rose-400">Under 75% Cutoff</span>
              ) : (
                <span className="text-emerald-400">Above Threshold</span>
              )}
            </div>
          </div>
        </div>

        {/* Average Marks */}
        <div className={isDark ? 'gradient-border-wrapper' : 'gradient-border-light'}>
          <div className={`p-6 rounded-[calc(1.5rem-1px)] h-full flex flex-col justify-between ${
            isDark ? 'bg-[#0E1526]/95 text-white' : 'bg-white text-slate-900'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Average Marks</span>
              <TrendingUp className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-2xl font-black font-mono mt-2">{studentData.internalMarks}%</p>
            <p className="mt-1 text-[11px] text-slate-400">Internal evaluations</p>
          </div>
        </div>

        {/* Assignment Score */}
        <div className={isDark ? 'gradient-border-wrapper' : 'gradient-border-light'}>
          <div className={`p-6 rounded-[calc(1.5rem-1px)] h-full flex flex-col justify-between ${
            isDark ? 'bg-[#0E1526]/95 text-white' : 'bg-white text-slate-900'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Assignment Score</span>
              <FileCheck className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-2xl font-black font-mono mt-2">{studentData.assignmentScore}%</p>
            <p className="mt-1 text-[11px] text-slate-400">Lab deliverables</p>
          </div>
        </div>

        {/* Participation */}
        <div className={isDark ? 'gradient-border-wrapper' : 'gradient-border-light'}>
          <div className={`p-6 rounded-[calc(1.5rem-1px)] h-full flex flex-col justify-between ${
            isDark ? 'bg-[#0E1526]/95 text-white' : 'bg-white text-slate-900'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Participation</span>
              <MessageSquare className="w-4 h-4 text-teal-400" />
            </div>
            <p className="text-2xl font-black font-mono mt-2">{studentData.participationScore}%</p>
            <p className="mt-1 text-[11px] text-slate-400">In-class engagement</p>
          </div>
        </div>

        {/* Previous Semester */}
        <div className={`col-span-2 sm:col-span-1 ${isDark ? 'gradient-border-wrapper' : 'gradient-border-light'}`}>
          <div className={`p-6 rounded-[calc(1.5rem-1px)] h-full flex flex-col justify-between ${
            isDark ? 'bg-[#0E1526]/95 text-white' : 'bg-white text-slate-900'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Previous Sem</span>
              <History className="w-4 h-4 text-slate-400" />
            </div>
            <p className="text-2xl font-black font-mono mt-2">{studentData.previousSemesterScore}%</p>
            <p className="mt-1 text-[11px] text-slate-400">Semester 3 baseline</p>
          </div>
        </div>
      </div>

      {/* Grid: Performance Graph (Left 7) + AI Prediction Panel (Right 5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        {/* Performance Graph Card with Border-Gradient */}
        <div className={`lg:col-span-7 ${isDark ? 'gradient-border-wrapper' : 'gradient-border-light'}`}>
          <div className={`p-7 md:p-9 rounded-[calc(1.5rem-1px)] h-full flex flex-col justify-between ${
            isDark ? 'bg-[#0E1526]/95 text-white' : 'bg-white text-slate-900'
          }`}>
            <div>
              <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b ${
                isDark ? 'border-slate-800' : 'border-slate-100'
              }`}>
                <div>
                  <h2 className="text-base font-extrabold tracking-tight">Performance Velocity Over Time</h2>
                  <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Multi-metric trajectory tracking across academic evaluations
                  </p>
                </div>
                {/* Filter Weekly / Semester */}
                <div className={`inline-flex rounded-xl p-0.5 text-xs font-semibold border ${
                  isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
                }`}>
                  {(['Weekly', 'Semester'] as const).map(mode => (
                    <button
                      key={mode}
                      onClick={() => setTimeframe(mode)}
                      className={`px-3 py-1 rounded-lg transition-colors ${
                        timeframe === mode
                          ? (isDark ? 'bg-indigo-600 text-white font-bold' : 'bg-white text-indigo-700 font-bold shadow-2xs')
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 h-64 sm:h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={currentChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1e293b' : '#f1f5f9'} />
                    <XAxis dataKey="period" stroke={isDark ? '#64748b' : '#94a3b8'} fontSize={11} tickLine={false} />
                    <YAxis domain={[30, 100]} stroke={isDark ? '#64748b' : '#94a3b8'} fontSize={11} tickLine={false} unit="%" />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-slate-900 border border-slate-700 text-white p-3.5 rounded-2xl shadow-xl text-xs space-y-1">
                              <p className="font-bold text-slate-200 border-b border-slate-800 pb-1">{label}</p>
                              {payload.map((entry: any, index: number) => (
                                <div key={`p-${index}`} className="flex items-center justify-between gap-4 font-mono">
                                  <span style={{ color: entry.color }}>{entry.name}:</span>
                                  <span className="font-bold">{entry.value}%</span>
                                </div>
                              ))}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Line type="monotone" dataKey="attendance" name="Attendance" stroke="#4f46e5" strokeWidth={2.5} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="marks" name="Marks" stroke="#a855f7" strokeWidth={2.5} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="assignments" name="Assignments" stroke="#06b6d4" strokeWidth={2} strokeDasharray="3 3" dot={false} />
                    <Line type="monotone" dataKey="participation" name="Participation" stroke="#10b981" strokeWidth={2} strokeDasharray="3 3" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="mt-4 pt-3.5 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span> Attendance</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> Marks</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span> Assignments</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> Participation</span>
            </div>
          </div>
        </div>

        {/* AI Prediction Panel with Border-Gradient */}
        <div className="lg:col-span-5 gradient-border-wrapper">
          <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-white rounded-[calc(1.5rem-1px)] p-7 md:p-9 h-full flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between border-b border-indigo-500/20 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
                    <BrainCircuit className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold tracking-tight text-white">AI Performance Prediction</h3>
                    <span className="text-[10px] text-indigo-200/70 font-mono">EduPredict Neural Model v4.2</span>
                  </div>
                </div>
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                  prediction.riskLevel === 'High'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    : prediction.riskLevel === 'Medium'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                }`}>
                  {prediction.riskLevel} Risk
                </span>
              </div>

              {/* Prediction KPIs */}
              <div className="grid grid-cols-3 gap-3 my-5">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Predicted Score</span>
                  <p className="text-2xl font-black text-indigo-300 mt-1 font-mono">{prediction.predictedScore}%</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Expected Grade</span>
                  <p className="text-2xl font-black text-purple-300 mt-1 font-mono">{prediction.expectedGrade}</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Confidence</span>
                  <p className="text-2xl font-black text-emerald-300 mt-1 font-mono">{prediction.confidence}%</p>
                </div>
              </div>

              <p className="text-xs text-indigo-200/80 italic leading-relaxed">
                “Based on attendance, marks, assignments, participation, and previous academic trends.”
              </p>

              {/* Why this prediction (Explainable AI) */}
              <div className="mt-4 pt-4 border-t border-indigo-500/20">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-indigo-200 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                    Why this prediction?
                  </h4>
                  <button
                    onClick={handleExplainAI}
                    disabled={isAiExplaining}
                    className="text-[11px] font-semibold text-purple-300 hover:text-white underline underline-offset-2 flex items-center gap-1"
                  >
                    <RefreshCw className={`w-3 h-3 ${isAiExplaining ? 'animate-spin' : ''}`} />
                    <span>{isAiExplaining ? 'Generating...' : 'Refresh Diagnostic'}</span>
                  </button>
                </div>

                {aiCustomNarrative ? (
                  <div className="p-3 bg-purple-950/60 border border-purple-500/30 rounded-xl text-xs text-slate-200 leading-relaxed mb-3">
                    {aiCustomNarrative}
                  </div>
                ) : null}

                <ul className="space-y-1.5 text-xs text-slate-300">
                  {prediction.explanations.map((exp, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                      <span>{exp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 pt-3.5 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-mono">Model v4.2 • Deterministic</span>
              <button
                onClick={() => openExplainModal(studentData.id)}
                className="text-xs font-semibold text-indigo-300 hover:text-white"
              >
                Full Factor Decomposition →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Personalized AI Recommendations Section with Border-Gradient */}
      <div className={isDark ? 'gradient-border-wrapper' : 'gradient-border-light'}>
        <div className={`p-7 md:p-9 rounded-[calc(1.5rem-1px)] space-y-6 ${
          isDark ? 'bg-[#0E1526]/95 text-white' : 'bg-white text-slate-900'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                <h2 className="text-base font-extrabold tracking-tight">Personalized AI Recommendations</h2>
              </div>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Actionable intervention steps tailored to {studentData.name}'s performance deficit areas
              </p>
            </div>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${
              isDark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
            }`}>
              {recommendations.length} Active Interventions
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {recommendations.map((rec) => {
              const isCompleted = rec.status === 'COMPLETED';
              const isInProgress = rec.status === 'IN_PROGRESS';
              return (
                <div
                  key={rec.id}
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                    isCompleted
                      ? (isDark ? 'bg-slate-900/40 border-slate-800 opacity-60' : 'bg-slate-50 border-slate-200 opacity-70')
                      : (isDark ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:shadow-md')
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
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
                        onClick={() => handleStatusChange(rec.id, rec.status)}
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
                            <span>Resolved</span>
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

                    <h3 className="text-xs font-bold text-slate-100">{rec.title}</h3>
                    <p className={`text-[11px] mt-1.5 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {rec.message}
                    </p>
                  </div>

                  <div className={`p-3.5 rounded-xl border text-xs space-y-1 ${
                    isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">Suggested Action:</span>
                    <p className={`font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{rec.suggestedAction}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
