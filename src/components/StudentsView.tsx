import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  ArrowUpDown, 
  Eye, 
  Edit, 
  BrainCircuit, 
  Sparkles, 
  GraduationCap, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Student } from '../types';
import { Avatar } from './Avatar';

export const StudentsView: React.FC = () => {
  const { 
    students, 
    navigateToStudent, 
    openExplainModal, 
    setIsAddStudentModalOpen, 
    setEditingStudent,
    theme,
    tableDensity,
    setTableDensity
  } = useApp();

  const isDark = theme === 'dark';

  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [semesterFilter, setSemesterFilter] = useState('All');
  const [riskFilter, setRiskFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'attendancePercent' | 'internalMarks' | 'predictedScore' | 'name'>('predictedScore');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filter & sort logic
  const filteredStudents = useMemo(() => {
    return students
      .filter((student) => {
        const matchesSearch = 
          student.name.toLowerCase().includes(search.toLowerCase()) ||
          student.rollNumber.toLowerCase().includes(search.toLowerCase()) ||
          student.email.toLowerCase().includes(search.toLowerCase());

        const matchesDept = departmentFilter === 'All' || student.department === departmentFilter;
        const matchesSem = semesterFilter === 'All' || String(student.semester) === semesterFilter;
        const matchesRisk = riskFilter === 'All' || student.riskLevel === riskFilter;

        return matchesSearch && matchesDept && matchesSem && matchesRisk;
      })
      .sort((a, b) => {
        const valA = a[sortBy] ?? 0;
        const valB = b[sortBy] ?? 0;
        if (typeof valA === 'string' && typeof valB === 'string') {
          return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        return sortOrder === 'asc' ? Number(valA) - Number(valB) : Number(valB) - Number(valA);
      });
  }, [students, search, departmentFilter, semesterFilter, riskFilter, sortBy, sortOrder]);

  const toggleSort = (field: 'attendancePercent' | 'internalMarks' | 'predictedScore' | 'name') => {
    if (sortBy === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setIsAddStudentModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      {/* Top Banner / Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Student Directory & Academic Records
          </h1>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Monitor attendance percentages, exam benchmarks, and individual AI risk indices
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          {/* Table Density Switcher for efficiency */}
          <div className={`inline-flex rounded-xl p-0.5 text-xs font-semibold border ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            <button
              onClick={() => setTableDensity('comfort')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                tableDensity === 'comfort' 
                  ? (isDark ? 'bg-indigo-600 text-white' : 'bg-white text-slate-900 shadow-2xs') 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Comfort
            </button>
            <button
              onClick={() => setTableDensity('compact')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                tableDensity === 'compact' 
                  ? (isDark ? 'bg-indigo-600 text-white' : 'bg-white text-slate-900 shadow-2xs') 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Compact
            </button>
          </div>

          <button
            onClick={() => {
              setEditingStudent(null);
              setIsAddStudentModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className={`p-4 md:p-5 rounded-3xl border space-y-3 transition-colors ${
        isDark ? 'bg-[#0E1526] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-xs'
      }`}>
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student name, roll number, or institutional email..."
              className={`w-full pl-10 pr-4 py-2 rounded-xl text-xs font-medium border focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                isDark 
                  ? 'bg-slate-900/90 border-slate-800 text-white placeholder:text-slate-500' 
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'
              }`}
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border focus:outline-none ${
                isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <option value="All">All Departments</option>
              <option value="Computer Science & Engineering">CSE</option>
              <option value="Information Technology">IT</option>
              <option value="AI & Data Science">AI & DS</option>
            </select>

            <select
              value={semesterFilter}
              onChange={(e) => setSemesterFilter(e.target.value)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border focus:outline-none ${
                isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <option value="All">All Semesters</option>
              <option value="3">Semester 3</option>
              <option value="4">Semester 4</option>
              <option value="5">Semester 5</option>
            </select>

            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border focus:outline-none ${
                isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <option value="All">All Risk Tiers</option>
              <option value="High">🔴 High Risk</option>
              <option value="Medium">🟠 Medium Risk</option>
              <option value="Low">🟢 Low Risk</option>
            </select>
          </div>
        </div>
      </div>

      {/* Students Table with subtle border-gradient wrapper */}
      <div className={isDark ? 'gradient-border-wrapper' : 'gradient-border-light'}>
        <div className={`rounded-[calc(1.5rem-1px)] p-6 md:p-8 overflow-hidden transition-colors ${
          isDark ? 'bg-[#0E1526]/95 text-white' : 'bg-white text-slate-900'
        }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className={`text-xs font-bold uppercase tracking-wider border-b ${
              isDark ? 'bg-slate-900/60 text-slate-400 border-slate-800' : 'bg-slate-50 text-slate-600 border-slate-100'
            }`}>
              <tr>
                <th 
                  className="px-6 py-3 cursor-pointer hover:text-white"
                  onClick={() => toggleSort('name')}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Student</span>
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </div>
                </th>
                <th className="px-4 py-3">Roll Number</th>
                <th className="px-4 py-3">Department</th>
                <th 
                  className="px-4 py-3 cursor-pointer hover:text-white"
                  onClick={() => toggleSort('attendancePercent')}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Attendance</span>
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </div>
                </th>
                <th 
                  className="px-4 py-3 cursor-pointer hover:text-white"
                  onClick={() => toggleSort('internalMarks')}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Marks</span>
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </div>
                </th>
                <th 
                  className="px-4 py-3 cursor-pointer hover:text-white"
                  onClick={() => toggleSort('predictedScore')}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Predicted</span>
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </div>
                </th>
                <th className="px-4 py-3">Risk Level</th>
                <th className="px-4 py-3">Updated</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y text-xs font-medium ${
              isDark ? 'divide-slate-800/80 text-slate-200' : 'divide-slate-100 text-slate-700'
            }`}>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-slate-500">
                    No students match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  const isHigh = student.riskLevel === 'High';
                  const isMed = student.riskLevel === 'Medium';
                  const isCompact = tableDensity === 'compact';

                  return (
                    <tr 
                      key={student.id} 
                      className={`transition-colors ${
                        isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50/80'
                      }`}
                    >
                      <td className={`px-6 ${isCompact ? 'py-2' : 'py-3.5'}`}>
                        <div className="flex items-center gap-3">
                          <Avatar name={student.name} size="sm" />
                          <div>
                            <p className="font-bold text-slate-100">{student.name}</p>
                            <p className="text-[11px] text-slate-400 font-mono">{student.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-slate-400">
                        {student.rollNumber}
                      </td>
                      <td className="px-4 py-3 text-slate-400">
                        {student.department.split(' ')[0]} (Sem {student.semester})
                      </td>
                      <td className="px-4 py-3 font-mono">
                        <span className={`inline-flex items-center font-bold px-2 py-0.5 rounded ${
                          student.attendancePercent < 75 
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}>
                          {student.attendancePercent}%
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono font-semibold">
                        {student.internalMarks}%
                      </td>
                      <td className="px-4 py-3 font-mono">
                        <span className="font-bold text-indigo-400">{student.predictedScore}%</span>
                        <span className="text-[10px] text-slate-500 ml-1">({student.expectedGrade})</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-bold ${
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
                      <td className="px-4 py-3 font-mono text-slate-500">
                        {student.lastUpdated}
                      </td>
                      <td className="px-6 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openExplainModal(student.id)}
                            className="p-1.5 text-purple-400 hover:bg-purple-500/20 rounded-lg transition-colors border border-transparent hover:border-purple-500/30"
                            title="View AI Diagnostics"
                          >
                            <BrainCircuit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(student)}
                            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                            title="Edit Record"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => navigateToStudent(student.id)}
                            className="px-2.5 py-1 text-xs font-bold text-indigo-300 hover:text-white bg-indigo-500/15 hover:bg-indigo-600 rounded-lg transition-all"
                          >
                            <Eye className="w-3.5 h-3.5 inline mr-1" />
                            <span>View</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        </div>
      </div>
    </div>
  );
};
