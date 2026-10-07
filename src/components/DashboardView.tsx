import React, { useState } from 'react';
import { 
  Users, 
  CalendarCheck, 
  TrendingUp, 
  AlertTriangle, 
  ArrowUpRight, 
  ArrowDownRight, 
  ChevronRight, 
  Filter, 
  Lightbulb, 
  Sparkles, 
  GraduationCap, 
  Eye, 
  CheckCircle2, 
  Info,
  Clock,
  Layers,
  BarChart2
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  ScatterChart, 
  Scatter, 
  ZAxis, 
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { useApp } from '../context/AppContext';
import { ACADEMIC_TREND_SERIES } from '../data/mockData';
import { Avatar } from './Avatar';

export const DashboardView: React.FC = () => {
  const { 
    students, 
    kpis, 
    navigateToStudent, 
    openExplainModal, 
    setActiveView, 
    theme,
    tableDensity,
    setTableDensity
  } = useApp();

  const [selectedDept, setSelectedDept] = useState<string>('All');
  const isDark = theme === 'dark';

  // Filter students requiring attention
  const atRiskStudents = students
    .filter(s => s.riskLevel === 'High' || s.riskLevel === 'Medium')
    .sort((a, b) => (b.riskScore ?? 0) - (a.riskScore ?? 0));

  // Scatter plot data
  const scatterData = students.map(s => ({
    name: s.name,
    rollNumber: s.rollNumber,
    attendance: s.attendancePercent,
    marks: s.internalMarks,
    riskLevel: s.riskLevel,
    riskScore: s.riskScore,
    studentId: s.id,
  }));

  const getRiskColor = (level?: string) => {
    switch (level) {
      case 'High':
        return '#f43f5e';
      case 'Medium':
        return '#f59e0b';
      default:
        return '#10b981';
    }
  };

  const facultyInsights = [
    {
      severity: 'Critical Intervention',
      title: 'Exam Debarment Exposure in Semester 4',
      summary: '7 students are tracking under the statutory 75% attendance cutoff. Department compliance requires formal notice within 48h.',
      action: 'Issue statutory warning emails & schedule counseling.',
      badgeClass: 'bg-rose-500/20 text-rose-300 border border-rose-500/30',
      borderClass: 'border-l-rose-500',
    },
    {
      severity: 'Empirical Correlation',
      title: 'Strong Attendance ↔ Marks Correlation (r = 0.84)',
      summary: 'Students with >85% attendance average 82% in Unit 3 exams vs 51% for peers below 70%. Attendance directly predicts exam readiness.',
      action: 'Present attendance distribution in faculty review.',
      badgeClass: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30',
      borderClass: 'border-l-indigo-500',
    },
    {
      severity: 'Positive Recovery',
      title: '8 Students Show Upward Recovery Momentum',
      summary: 'Targeted peer problem-solving sessions boosted internal test marks by +14% across previously borderline students.',
      action: 'Acknowledge peer tutors & expand weekly lab circles.',
      badgeClass: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
      borderClass: 'border-l-emerald-500',
    },
  ];

  return (
    <div className="space-y-8 md:space-y-10 pb-12 animate-in fade-in">
      {/* 4 Major KPI Cards with Subtle Border-Gradients */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
        {/* Total Students */}
        <div className={isDark ? 'gradient-border-wrapper' : 'gradient-border-light'}>
          <div className={`p-6 sm:p-7 md:p-8 rounded-[calc(1.5rem-1px)] h-full flex flex-col justify-between ${
            isDark ? 'bg-[#0E1526]/95 text-white' : 'bg-white text-slate-900'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Total Enrolled Students
              </span>
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center border border-indigo-500/25">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-5">
              <h3 className={`text-3xl sm:text-4xl font-extrabold tracking-tight font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {kpis.totalStudents}
              </h3>
              <div className="flex items-center gap-1.5 mt-2.5 text-xs font-semibold text-emerald-400">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>{kpis.totalStudentsTrend}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Average Attendance */}
        <div className={isDark ? 'gradient-border-wrapper' : 'gradient-border-light'}>
          <div className={`p-6 sm:p-7 md:p-8 rounded-[calc(1.5rem-1px)] h-full flex flex-col justify-between ${
            isDark ? 'bg-[#0E1526]/95 text-white' : 'bg-white text-slate-900'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Average Attendance Rate
              </span>
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center border border-indigo-500/25">
                <CalendarCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-5">
              <h3 className={`text-3xl sm:text-4xl font-extrabold tracking-tight font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {kpis.averageAttendance}%
              </h3>
              <div className="flex items-center gap-1.5 mt-2.5 text-xs font-semibold text-emerald-400">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>{kpis.attendanceTrend}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Average Performance */}
        <div className={isDark ? 'gradient-border-wrapper' : 'gradient-border-light'}>
          <div className={`p-6 sm:p-7 md:p-8 rounded-[calc(1.5rem-1px)] h-full flex flex-col justify-between ${
            isDark ? 'bg-[#0E1526]/95 text-white' : 'bg-white text-slate-900'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Average Academic Score
              </span>
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center border border-indigo-500/25">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-5">
              <h3 className={`text-3xl sm:text-4xl font-extrabold tracking-tight font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {kpis.averagePerformance}%
              </h3>
              <div className="flex items-center gap-1.5 mt-2.5 text-xs font-semibold text-emerald-400">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>{kpis.performanceTrend}</span>
              </div>
            </div>
          </div>
        </div>

        {/* At-Risk Students */}
        <div className={isDark ? 'gradient-border-wrapper-rose' : 'gradient-border-light'}>
          <div className={`p-6 sm:p-7 md:p-8 rounded-[calc(1.5rem-1px)] h-full flex flex-col justify-between ${
            isDark ? 'bg-[#0E1526]/95 text-white' : 'bg-rose-50/30 text-slate-900'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider">
                At-Risk Students
              </span>
              <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-5">
              <h3 className="text-3xl sm:text-4xl font-extrabold text-rose-500 tracking-tight font-mono">
                {kpis.atRiskStudentsCount}
              </h3>
              <div className="flex items-center gap-1.5 mt-2.5 text-xs font-semibold text-emerald-400">
                <ArrowDownRight className="w-3.5 h-3.5" />
                <span>{kpis.atRiskStudentsTrend}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid: Performance Trajectory + Attendance vs Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        {/* Performance Overview (7 Cols) with Border-Gradient */}
        <div className={`lg:col-span-7 ${isDark ? 'gradient-border-wrapper' : 'gradient-border-light'}`}>
          <div className={`p-7 md:p-9 rounded-[calc(1.5rem-1px)] h-full flex flex-col justify-between ${
            isDark ? 'bg-[#0E1526]/95 text-white' : 'bg-white text-slate-900'
          }`}>
            <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b ${
              isDark ? 'border-slate-800' : 'border-slate-100'
            }`}>
              <div>
                <h2 className="text-base font-extrabold tracking-tight">Average Academic Performance</h2>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Cohort trajectory across semester evaluation milestones
                </p>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className={`text-xs rounded-xl px-3.5 py-1.5 font-semibold border focus:outline-none ${
                    isDark ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <option value="All">All Departments</option>
                  <option value="CSE">Computer Science (CSE)</option>
                  <option value="IT">Information Tech (IT)</option>
                  <option value="AIDS">AI & Data Science (AIDS)</option>
                </select>
              </div>
            </div>

            <div className="mt-6 h-72 sm:h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={ACADEMIC_TREND_SERIES} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorOverall" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={isDark ? 0.45 : 0.25}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1e293b' : '#f1f5f9'} />
                  <XAxis dataKey="assessment" stroke={isDark ? '#64748b' : '#94a3b8'} fontSize={11} tickLine={false} />
                  <YAxis domain={[55, 100]} stroke={isDark ? '#64748b' : '#94a3b8'} fontSize={11} tickLine={false} unit="%" />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-slate-900 border border-slate-700 text-white p-3.5 rounded-2xl shadow-2xl text-xs space-y-1">
                            <p className="font-bold text-slate-200 border-b border-slate-800 pb-1">{label} Assessment</p>
                            {payload.map((entry: any, index: number) => (
                              <div key={`item-${index}`} className="flex items-center justify-between gap-5 font-mono">
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
                  <Area
                    type="monotone"
                    dataKey="overallAverage"
                    name="Class Average"
                    stroke="#6366f1"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorOverall)"
                    dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: isDark ? '#0F172A' : '#fff' }}
                    activeDot={{ r: 7 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="cseAverage"
                    name="CSE Cohort"
                    stroke="#a855f7"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="aidsAverage"
                    name="AI & DS Cohort"
                    stroke="#06b6d4"
                    strokeWidth={1.5}
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-3 flex items-center justify-center gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-3 h-1 bg-indigo-500 rounded"></span>
                <span>Overall Average</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-1 bg-purple-500 rounded"></span>
                <span>CSE Cohort</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-1 bg-cyan-400 rounded"></span>
                <span>AI & DS Cohort</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scatter Plot: Attendance vs Performance (5 Cols) with Border-Gradient */}
        <div className={`lg:col-span-5 ${isDark ? 'gradient-border-wrapper' : 'gradient-border-light'}`}>
          <div className={`p-7 md:p-9 rounded-[calc(1.5rem-1px)] h-full flex flex-col justify-between ${
            isDark ? 'bg-[#0E1526]/95 text-white' : 'bg-white text-slate-900'
          }`}>
            <div className={`pb-5 border-b flex items-center justify-between ${
              isDark ? 'border-slate-800' : 'border-slate-100'
            }`}>
              <div>
                <h2 className="text-base font-extrabold tracking-tight">Attendance vs Performance</h2>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Empirical correlation mapped across risk tiers
                </p>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Low
                <span className="w-2 h-2 rounded-full bg-amber-500 ml-1"></span> Med
                <span className="w-2 h-2 rounded-full bg-rose-500 ml-1"></span> High
              </div>
            </div>

            <div className="mt-6 h-72 sm:h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1e293b' : '#f1f5f9'} />
                  <XAxis
                    type="number"
                    dataKey="attendance"
                    name="Attendance"
                    unit="%"
                    domain={[45, 100]}
                    stroke={isDark ? '#64748b' : '#94a3b8'}
                    fontSize={11}
                    tickLine={false}
                  />
                  <YAxis
                    type="number"
                    dataKey="marks"
                    name="Marks"
                    unit="%"
                    domain={[35, 100]}
                    stroke={isDark ? '#64748b' : '#94a3b8'}
                    fontSize={11}
                    tickLine={false}
                  />
                  <ZAxis range={[70, 70]} />
                  <Tooltip
                    cursor={{ strokeDasharray: '3 3' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-slate-900 border border-slate-700 text-white p-3.5 rounded-2xl shadow-2xl text-xs space-y-1">
                            <p className="font-bold text-white">{data.name} ({data.rollNumber})</p>
                            <p className="text-slate-300">Attendance: <span className="text-white font-mono font-semibold">{data.attendance}%</span></p>
                            <p className="text-slate-300">Marks: <span className="text-white font-mono font-semibold">{data.marks}%</span></p>
                            <p className="text-slate-300">
                              Risk Level: <span className={`font-bold ${data.riskLevel === 'High' ? 'text-rose-400' : data.riskLevel === 'Medium' ? 'text-amber-400' : 'text-emerald-400'}`}>{data.riskLevel}</span>
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Scatter name="Students" data={scatterData}>
                    {scatterData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={getRiskColor(entry.riskLevel)}
                        className="cursor-pointer transition-transform hover:scale-125"
                        onClick={() => navigateToStudent(entry.studentId)}
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 text-center text-xs text-slate-500">
              Click on any student node to inspect AI prediction dossier
            </div>
          </div>
        </div>
      </div>

      {/* At-Risk Students Section with Border-Gradient */}
      <div className={isDark ? 'gradient-border-wrapper' : 'gradient-border-light'}>
        <div className={`p-7 md:p-9 rounded-[calc(1.5rem-1px)] ${
          isDark ? 'bg-[#0E1526]/95 text-white' : 'bg-white text-slate-900'
        }`}>
          <div className={`pb-5 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            isDark ? 'border-slate-800' : 'border-slate-100'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold tracking-tight">Students Requiring Immediate Attention</h2>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Prioritized by academic deficit and attendance debarment exposure
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Density Toggle for faculty efficiency */}
              <div className={`inline-flex rounded-xl p-0.5 text-xs font-semibold border ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
              }`}>
                <button
                  onClick={() => setTableDensity('comfort')}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    tableDensity === 'comfort' 
                      ? (isDark ? 'bg-indigo-600 text-white' : 'bg-white text-slate-900 shadow-2xs') 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Comfort
                </button>
                <button
                  onClick={() => setTableDensity('compact')}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    tableDensity === 'compact' 
                      ? (isDark ? 'bg-indigo-600 text-white' : 'bg-white text-slate-900 shadow-2xs') 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Compact
                </button>
              </div>

              <button
                onClick={() => setActiveView('at-risk')}
                className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                <span>View All At-Risk ({atRiskStudents.length})</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Responsive Table */}
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left text-sm">
              <thead className={`text-xs font-bold uppercase tracking-wider border-b ${
                isDark ? 'bg-slate-900/60 text-slate-400 border-slate-800' : 'bg-slate-50 text-slate-600 border-slate-100'
              }`}>
                <tr>
                  <th className="px-6 py-3.5">Student</th>
                  <th className="px-4 py-3.5">Roll Number</th>
                  <th className="px-4 py-3.5">Attendance</th>
                  <th className="px-4 py-3.5">Average Marks</th>
                  <th className="px-4 py-3.5">Assignments</th>
                  <th className="px-4 py-3.5">Participation</th>
                  <th className="px-4 py-3.5">Predicted Score</th>
                  <th className="px-4 py-3.5">Risk Level</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y text-xs font-medium ${
                isDark ? 'divide-slate-800/80 text-slate-200' : 'divide-slate-100 text-slate-700'
              }`}>
                {atRiskStudents.slice(0, 6).map((student) => {
                  const isHigh = student.riskLevel === 'High';
                  const isCompact = tableDensity === 'compact';

                  return (
                    <tr 
                      key={student.id} 
                      className={`transition-colors ${
                        isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50/80'
                      }`}
                    >
                      <td className={`px-6 ${isCompact ? 'py-2.5' : 'py-4'}`}>
                        <div className="flex items-center gap-3">
                          <Avatar name={student.name} size="sm" />
                          <div>
                            <p className="font-bold text-slate-100">{student.name}</p>
                            <p className="text-[11px] text-slate-400">{student.department.split(' ')[0]}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 font-mono font-semibold text-slate-400">{student.rollNumber}</td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center font-bold px-2 py-0.5 rounded font-mono ${
                          student.attendancePercent < 75 ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-slate-800 text-slate-300'
                        }`}>
                          {student.attendancePercent}%
                        </span>
                      </td>
                      <td className="px-4 py-4 font-mono font-semibold">{student.internalMarks}%</td>
                      <td className="px-4 py-4 font-mono text-slate-400">{student.assignmentScore}%</td>
                      <td className="px-4 py-4 font-mono text-slate-400">{student.participationScore}%</td>
                      <td className="px-4 py-4 font-mono">
                        <span className="font-black text-indigo-400">{student.predictedScore}%</span>
                        <span className="text-[10px] text-slate-500 ml-1">({student.expectedGrade})</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold ${
                          isHigh
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isHigh ? 'bg-rose-500' : 'bg-amber-500'}`} />
                          {student.riskLevel}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openExplainModal(student.id)}
                            className="px-2.5 py-1.5 text-xs font-semibold text-purple-300 bg-purple-500/15 hover:bg-purple-500/25 rounded-xl transition-colors flex items-center gap-1 border border-purple-500/20"
                            title="Explain AI Diagnostics"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                            <span>Explain</span>
                          </button>
                          <button
                            onClick={() => navigateToStudent(student.id)}
                            className="px-3.5 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all flex items-center gap-1 shadow-sm shadow-indigo-600/30"
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

      {/* Faculty AI Insights Section with Border-Gradient */}
      <div className={isDark ? 'gradient-border-wrapper' : 'gradient-border-light'}>
        <div className={`p-7 md:p-9 rounded-[calc(1.5rem-1px)] space-y-6 ${
          isDark ? 'bg-[#0E1526]/95 text-white' : 'bg-white text-slate-900'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center border border-indigo-500/25">
                <Lightbulb className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold tracking-tight">Faculty AI Diagnostic Insights</h2>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Empirical diagnostic patterns detected across current academic cohorts
                </p>
              </div>
            </div>
            <span className="text-[11px] font-mono text-slate-500">Updated today</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {facultyInsights.map((insight, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-2xl border-l-4 ${insight.borderClass} border ${
                  isDark ? 'bg-slate-900/60 border-slate-800/80' : 'bg-slate-50/80 border-slate-200/80'
                } flex flex-col justify-between space-y-3 transition-transform hover:-translate-y-0.5`}
              >
                <div>
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${insight.badgeClass}`}>
                    {insight.severity}
                  </span>
                  <h4 className="text-xs font-bold text-slate-100 mt-2">{insight.title}</h4>
                  <p className={`text-[11px] mt-1.5 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {insight.summary}
                  </p>
                </div>
                <div className="pt-2.5 border-t border-slate-800 text-[11px] font-medium flex items-start gap-1.5 text-slate-300">
                  <span className="text-indigo-400 font-bold shrink-0">Action:</span>
                  <span>{insight.action}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
