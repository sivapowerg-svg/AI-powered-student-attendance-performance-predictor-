import React, { useState } from 'react';
import { 
  Settings, 
  Save, 
  RotateCcw, 
  Sliders, 
  Building, 
  User, 
  Bell, 
  BookOpen, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DEFAULT_SETTINGS } from '../services/predictionEngine';
import { Avatar } from './Avatar';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, user, addToast, theme } = useApp();
  const isDark = theme === 'dark';

  const [formSettings, setFormSettings] = useState({ ...settings });
  const [activeSection, setActiveSection] = useState<'prediction' | 'institution' | 'academic' | 'profile'>('prediction');

  const totalWeight = 
    Number(formSettings.attendanceWeight) +
    Number(formSettings.marksWeight) +
    Number(formSettings.assignmentsWeight) +
    Number(formSettings.participationWeight) +
    Number(formSettings.previousPerformanceWeight);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (totalWeight !== 100) {
      addToast({
        type: 'error',
        title: 'Invalid Prediction Weights',
        message: `Prediction weights must sum exactly to 100%. Current sum: ${totalWeight}%.`,
      });
      return;
    }

    if (formSettings.riskThresholdLow >= formSettings.riskThresholdHigh) {
      addToast({
        type: 'error',
        title: 'Invalid Risk Thresholds',
        message: 'Low risk threshold must be strictly less than high risk threshold.',
      });
      return;
    }

    await updateSettings(formSettings);
  };

  const handleResetDefaults = () => {
    setFormSettings({ ...DEFAULT_SETTINGS });
    addToast({
      type: 'info',
      title: 'Defaults Restored',
      message: 'Reset weights to institutional standards (30/30/15/10/15).',
    });
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      {/* Header */}
      <div>
        <h1 className={`text-xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
          System Parameters & AI Configuration
        </h1>
        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Fine-tune AI regression model weights, risk threshold boundaries, and institution parameters
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Navigation Sidebar (3 cols) */}
        <div className="lg:col-span-3 space-y-1">
          {[
            { id: 'prediction', label: 'Prediction Weights & Thresholds', icon: <Sliders className="w-4 h-4" /> },
            { id: 'institution', label: 'Institution Profile', icon: <Building className="w-4 h-4" /> },
            { id: 'academic', label: 'Academic Term Settings', icon: <BookOpen className="w-4 h-4" /> },
            { id: 'profile', label: 'Faculty Account', icon: <User className="w-4 h-4" /> },
          ].map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id as any)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-colors text-left ${
                activeSection === section.id
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/30'
                  : (isDark ? 'bg-[#0F172A] text-slate-400 hover:text-white border border-slate-800' : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80')
              }`}
            >
              {section.icon}
              <span>{section.label}</span>
            </button>
          ))}
        </div>

        {/* Content Panel (9 cols) with subtle border gradient wrapper */}
        <div className={`lg:col-span-9 ${isDark ? 'gradient-border-wrapper' : 'gradient-border-light'}`}>
          <div className={`p-7 md:p-9 rounded-[calc(1.5rem-1px)] transition-colors ${
            isDark ? 'bg-[#0E1526]/95 text-white' : 'bg-white text-slate-900'
          }`}>
          <form onSubmit={handleSave} className="space-y-6">
            {activeSection === 'prediction' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold tracking-tight">AI Risk Scoring Weights</h3>
                  <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Configure factor contributions used by the EduPredict AI regression engine. Sum must equal 100%.
                  </p>
                </div>

                {/* Live Weight Progress Meter */}
                <div className={`p-4 rounded-2xl border text-xs font-semibold flex items-center justify-between ${
                  totalWeight === 100 
                    ? (isDark ? 'bg-emerald-950/20 text-emerald-300 border-emerald-900/40' : 'bg-emerald-50 text-emerald-800 border-emerald-200') 
                    : (isDark ? 'bg-rose-950/20 text-rose-300 border-rose-900/40' : 'bg-rose-50 text-rose-800 border-rose-200')
                }`}>
                  <div className="flex items-center gap-2">
                    {totalWeight === 100 ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-400" />
                    )}
                    <span className="font-mono">Total Weight Allocation: {totalWeight}% / 100%</span>
                  </div>
                  <span className="font-mono">{totalWeight === 100 ? 'Balanced' : `${100 - totalWeight}% remaining`}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Attendance Weight */}
                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold mb-1">
                      <span>Attendance Weight</span>
                      <span className="font-bold font-mono text-indigo-400">{formSettings.attendanceWeight}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="60"
                      value={formSettings.attendanceWeight}
                      onChange={e => setFormSettings({ ...formSettings, attendanceWeight: Number(e.target.value) })}
                      className="w-full accent-indigo-500 cursor-pointer"
                    />
                    <span className="text-[10px] text-slate-400">Class presence consistency factor</span>
                  </div>

                  {/* Marks Weight */}
                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold mb-1">
                      <span>Internal Marks Weight</span>
                      <span className="font-bold font-mono text-indigo-400">{formSettings.marksWeight}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="60"
                      value={formSettings.marksWeight}
                      onChange={e => setFormSettings({ ...formSettings, marksWeight: Number(e.target.value) })}
                      className="w-full accent-indigo-500 cursor-pointer"
                    />
                    <span className="text-[10px] text-slate-400">Unit exams & midterms</span>
                  </div>

                  {/* Assignments Weight */}
                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold mb-1">
                      <span>Assignment Score Weight</span>
                      <span className="font-bold font-mono text-indigo-400">{formSettings.assignmentsWeight}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="40"
                      value={formSettings.assignmentsWeight}
                      onChange={e => setFormSettings({ ...formSettings, assignmentsWeight: Number(e.target.value) })}
                      className="w-full accent-indigo-500 cursor-pointer"
                    />
                    <span className="text-[10px] text-slate-400">Lab deliverables & technical problem sets</span>
                  </div>

                  {/* Participation Weight */}
                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold mb-1">
                      <span>Participation Weight</span>
                      <span className="font-bold font-mono text-indigo-400">{formSettings.participationWeight}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="30"
                      value={formSettings.participationWeight}
                      onChange={e => setFormSettings({ ...formSettings, participationWeight: Number(e.target.value) })}
                      className="w-full accent-indigo-500 cursor-pointer"
                    />
                    <span className="text-[10px] text-slate-400">In-class questioning & engagement</span>
                  </div>

                  {/* Previous Performance Weight */}
                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold mb-1">
                      <span>Previous Academic Baseline</span>
                      <span className="font-bold font-mono text-indigo-400">{formSettings.previousPerformanceWeight}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="40"
                      value={formSettings.previousPerformanceWeight}
                      onChange={e => setFormSettings({ ...formSettings, previousPerformanceWeight: Number(e.target.value) })}
                      className="w-full accent-indigo-500 cursor-pointer"
                    />
                    <span className="text-[10px] text-slate-400">Historical semester GPA trajectory</span>
                  </div>
                </div>

                <div className={`pt-4 border-t ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                  <h4 className="text-xs font-bold uppercase tracking-wider mb-1">Risk Score Classification Boundaries</h4>
                  <p className={`text-xs mb-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Threshold boundaries defining Low, Medium, and High academic risk designations.
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1">
                        Low / Medium Boundary (Default: 30)
                      </label>
                      <input
                        type="number"
                        min="10"
                        max="50"
                        value={formSettings.riskThresholdLow}
                        onChange={e => setFormSettings({ ...formSettings, riskThresholdLow: Number(e.target.value) })}
                        className={`w-full text-xs rounded-xl px-3 py-2 font-bold font-mono border focus:outline-none ${
                          isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                        }`}
                      />
                      <span className="text-[10px] text-slate-400">Scores below this are categorized as Low Risk</span>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold mb-1">
                        Medium / High Boundary (Default: 60)
                      </label>
                      <input
                        type="number"
                        min="50"
                        max="90"
                        value={formSettings.riskThresholdHigh}
                        onChange={e => setFormSettings({ ...formSettings, riskThresholdHigh: Number(e.target.value) })}
                        className={`w-full text-xs rounded-xl px-3 py-2 font-bold font-mono border focus:outline-none ${
                          isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                        }`}
                      />
                      <span className="text-[10px] text-slate-400">Scores above this trigger High Risk flags</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'institution' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold tracking-tight">Institution Profile</h3>
                <div>
                  <label className="block text-xs font-semibold mb-1">Institution Name</label>
                  <input
                    type="text"
                    value={formSettings.institutionName}
                    onChange={e => setFormSettings({ ...formSettings, institutionName: e.target.value })}
                    className={`w-full text-xs rounded-xl px-3 py-2 font-semibold border focus:outline-none ${
                      isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
              </div>
            )}

            {activeSection === 'academic' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold tracking-tight">Academic Term Settings</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1">Academic Year</label>
                    <input
                      type="text"
                      value={formSettings.academicYear}
                      onChange={e => setFormSettings({ ...formSettings, academicYear: e.target.value })}
                      className={`w-full text-xs rounded-xl px-3 py-2 font-semibold border focus:outline-none ${
                        isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1">Current Semester</label>
                    <input
                      type="text"
                      value={formSettings.currentSemester}
                      onChange={e => setFormSettings({ ...formSettings, currentSemester: e.target.value })}
                      className={`w-full text-xs rounded-xl px-3 py-2 font-semibold border focus:outline-none ${
                        isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                      }`}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'profile' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold tracking-tight">Faculty Account</h3>
                <div className={`flex items-center gap-4 p-4 rounded-2xl border ${
                  isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <Avatar name={user?.name || 'Dr. Ananya Rao'} size="lg" />
                  <div>
                    <h4 className="text-sm font-bold text-white">{user?.name}</h4>
                    <p className="text-xs text-slate-400">{user?.email} • {user?.role}</p>
                    <span className="text-[11px] text-indigo-400 font-semibold">{user?.department}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className={`pt-6 border-t flex items-center justify-between ${
              isDark ? 'border-slate-800' : 'border-slate-100'
            }`}>
              <button
                type="button"
                onClick={handleResetDefaults}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Defaults</span>
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-indigo-600/30 transition-all active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>Save Settings & Recalibrate Models</span>
              </button>
            </div>
          </form>
          </div>
        </div>
      </div>
    </div>
  );
};
