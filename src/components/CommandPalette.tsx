import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  BrainCircuit, 
  UserPlus, 
  CalendarCheck, 
  TrendingUp, 
  AlertTriangle, 
  FileText, 
  Settings, 
  Sun, 
  Moon, 
  ArrowRight, 
  X,
  GraduationCap
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Avatar } from './Avatar';

export const CommandPalette: React.FC = () => {
  const { 
    isCommandPaletteOpen, 
    setIsCommandPaletteOpen, 
    students, 
    navigateToStudent, 
    setActiveView, 
    runPredictionEngine, 
    setIsAddStudentModalOpen,
    theme,
    toggleTheme
  } = useApp();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  // Search filtered students
  const filteredStudents = query.trim()
    ? students.filter(s => 
        s.name.toLowerCase().includes(query.toLowerCase()) || 
        s.rollNumber.toLowerCase().includes(query.toLowerCase()) ||
        s.department.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
    : [];

  // Quick Action items
  const quickActions = [
    {
      id: 'run-predict',
      title: 'Run AI Prediction Simulation',
      sub: 'Recalibrate multi-factor regression models across all cohorts',
      icon: <BrainCircuit className="w-4 h-4 text-purple-400" />,
      run: () => runPredictionEngine(),
    },
    {
      id: 'add-student',
      title: 'Register New Student Profile',
      sub: 'Input student attendance, marks, and historical scores',
      icon: <UserPlus className="w-4 h-4 text-indigo-400" />,
      run: () => setIsAddStudentModalOpen(true),
    },
    {
      id: 'at-risk',
      title: 'View At-Risk Students Dossier',
      sub: 'Monitor students near 75% exam debarment cutoff',
      icon: <AlertTriangle className="w-4 h-4 text-rose-400" />,
      run: () => setActiveView('at-risk'),
    },
    {
      id: 'attendance',
      title: 'Open Attendance Management',
      sub: 'Record daily attendance and view 75% cutoff compliance',
      icon: <CalendarCheck className="w-4 h-4 text-emerald-400" />,
      run: () => setActiveView('attendance'),
    },
    {
      id: 'reports',
      title: 'Generate Academic Reports',
      sub: 'Export CSV datasets or print dean-certified dossiers',
      icon: <FileText className="w-4 h-4 text-blue-400" />,
      run: () => setActiveView('reports'),
    },
    {
      id: 'theme',
      title: `Toggle Theme (Currently ${theme === 'dark' ? 'Executive Dark' : 'Pristine Light'})`,
      sub: 'Switch interface contrast mode',
      icon: theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-400" />,
      run: () => toggleTheme(),
    },
    {
      id: 'settings',
      title: 'Model & Weight Settings',
      sub: 'Tune factor weights and risk threshold boundaries',
      icon: <Settings className="w-4 h-4 text-slate-400" />,
      run: () => setActiveView('settings'),
    },
  ].filter(act => 
    !query.trim() || act.title.toLowerCase().includes(query.toLowerCase()) || act.sub.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelectStudent = (id: string) => {
    navigateToStudent(id);
    setIsCommandPaletteOpen(false);
  };

  const handleAction = (act: typeof quickActions[0]) => {
    act.run();
    setIsCommandPaletteOpen(false);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-start justify-center pt-20 px-4 animate-in fade-in duration-150"
      onClick={() => setIsCommandPaletteOpen(false)}
    >
      <div 
        className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col text-slate-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-indigo-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Type a student name, roll number, or action..."
            className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono font-semibold text-slate-400 bg-slate-800 border border-slate-700 px-2 py-0.5 rounded-md">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-4 divide-y divide-slate-800/60">
          {/* Students Match Section */}
          {filteredStudents.length > 0 && (
            <div className="space-y-1 pt-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3">
                Students Found
              </span>
              {filteredStudents.map((s) => (
                <div
                  key={s.id}
                  onClick={() => handleSelectStudent(s.id)}
                  className="px-3 py-2.5 rounded-xl hover:bg-slate-800/90 cursor-pointer flex items-center justify-between transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Avatar name={s.name} size="sm" />
                    <div>
                      <p className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                        {s.name}
                      </p>
                      <p className="text-[11px] text-slate-400 font-mono">
                        {s.rollNumber} • {s.department.split(' ')[0]} • Sem {s.semester}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      s.riskLevel === 'High' ? 'bg-rose-500/20 text-rose-300' : s.riskLevel === 'Medium' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                    }`}>
                      {s.riskLevel} Risk
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-300" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick Actions Section */}
          <div className="space-y-1 pt-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3">
              Commands & Quick Actions
            </span>
            {quickActions.map((act) => (
              <div
                key={act.id}
                onClick={() => handleAction(act)}
                className="px-3 py-2.5 rounded-xl hover:bg-slate-800/90 cursor-pointer flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                    {act.icon}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors">
                      {act.title}
                    </h4>
                    <p className="text-[11px] text-slate-400">{act.sub}</p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-300" />
              </div>
            ))}
          </div>
        </div>

        {/* Footer shortcuts hint */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-[11px] text-slate-400 px-4">
          <span>Navigate with <kbd className="text-[10px] bg-slate-800 px-1 rounded">↑</kbd> <kbd className="text-[10px] bg-slate-800 px-1 rounded">↓</kbd></span>
          <span>Open with <kbd className="text-[10px] bg-slate-800 px-1 rounded">⌘K</kbd> / <kbd className="text-[10px] bg-slate-800 px-1 rounded">Ctrl+K</kbd></span>
        </div>
      </div>
    </div>
  );
};
