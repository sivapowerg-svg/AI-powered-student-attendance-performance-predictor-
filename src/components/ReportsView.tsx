import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  Calendar, 
  CheckCircle2, 
  GraduationCap, 
  Sparkles, 
  AlertTriangle, 
  FileSpreadsheet, 
  Eye, 
  X 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ReportsView: React.FC = () => {
  const { students, settings, addToast, theme } = useApp();
  const isDark = theme === 'dark';

  const [selectedReportType, setSelectedReportType] = useState<string>('Performance');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);

  const reportTypes = [
    { id: 'Performance', name: 'Student Performance Report', desc: 'Comprehensive marks, unit evaluations, and semester grade projections' },
    { id: 'Attendance', name: 'Attendance Compliance Audit', desc: 'Statutory 75% attendance audit, debarment warnings, and daily logs' },
    { id: 'AtRisk', name: 'At-Risk Intervention Dossier', desc: 'High-risk student profiles, root causes, and recommended counseling pathways' },
    { id: 'Analytics', name: 'Class Analytics & Benchmarks', desc: 'Cohort distributions, pass rates, and longitudinal academic trends' },
    { id: 'Prediction', name: 'AI Prediction Regression Report', desc: 'Model confidence indices, factor decompositions, and expected final grades' },
  ];

  const handleExportCSV = () => {
    let headers = 'Roll Number,Student Name,Department,Semester,Attendance %,Internal Marks %,Assignment Score %,Participation %,Predicted Final Score %,Risk Level\n';
    let rows = students.map(s => 
      `"${s.rollNumber}","${s.name}","${s.department}",${s.semester},${s.attendancePercent},${s.internalMarks},${s.assignmentScore},${s.participationScore},${s.predictedScore},"${s.riskLevel}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `EduPredict_${selectedReportType}_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast({
      type: 'success',
      title: 'CSV Export Generated',
      message: `Downloaded ${selectedReportType} dataset successfully.`,
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      {/* Header */}
      <div>
        <h1 className={`text-xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Institutional Academic Reports
        </h1>
        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Generate accredited reports for dean reviews, statutory compliance audits, and faculty evaluations
        </p>
      </div>

      {/* Report Type Selector Cards with subtle border gradients */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
        {reportTypes.map((item) => {
          const isSelected = selectedReportType === item.id;
          return (
            <div
              key={item.id}
              onClick={() => setSelectedReportType(item.id)}
              className={isSelected ? 'gradient-border-indigo' : (isDark ? 'gradient-border-wrapper' : 'gradient-border-light')}
            >
              <div
                className={`p-6 rounded-[calc(1.5rem-1px)] h-full cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-white shadow-md'
                    : (isDark ? 'bg-[#0E1526]/95 text-slate-300 hover:text-white' : 'bg-white text-slate-900 hover:shadow-xs')
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    isSelected ? 'bg-indigo-600 text-white shadow-sm' : (isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600')
                  }`}>
                    <FileText className="w-4 h-4" />
                  </div>
                  {isSelected && (
                    <span className="text-[9px] font-bold uppercase tracking-wider bg-indigo-500 text-white px-2 py-0.5 rounded-full shadow-xs">
                      Active
                    </span>
                  )}
                </div>
                <h3 className="text-xs font-bold text-white mt-1">{item.name}</h3>
                <p className={`text-[11px] mt-1.5 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Report Configuration and Action Bar with subtle border gradient wrapper */}
      <div className={isDark ? 'gradient-border-wrapper' : 'gradient-border-light'}>
        <div className={`p-6 md:p-8 rounded-[calc(1.5rem-1px)] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 ${
          isDark ? 'bg-[#0E1526]/95 text-white' : 'bg-white text-slate-900'
        }`}>
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Filter Department
            </label>
            <select
              value={selectedDept}
              onChange={e => setSelectedDept(e.target.value)}
              className={`text-xs rounded-xl px-3 py-2 font-semibold border focus:outline-none ${
                isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              <option value="All">All Departments</option>
              <option value="Computer Science & Engineering">CSE</option>
              <option value="Information Technology">IT</option>
              <option value="AI & Data Science">AI & DS</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Academic Term
            </label>
            <span className={`inline-block text-xs font-mono font-semibold rounded-xl px-3 py-2 border ${
              isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
            }`}>
              {settings.academicYear} • {settings.currentSemester}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start md:self-end">
          <button
            onClick={() => setIsPreviewOpen(true)}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors flex items-center gap-2 ${
              isDark ? 'bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Generate Preview</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => {
              setIsPreviewOpen(true);
              setTimeout(() => window.print(), 300);
            }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-indigo-600/30 transition-all active:scale-95"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Dossier</span>
          </button>
        </div>
        </div>
      </div>

      {/* Report Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Official Report Preview</h3>
                  <p className="text-xs text-slate-500">{settings.institutionName}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 flex items-center gap-1.5 shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Document</span>
                </button>
                <button
                  onClick={() => setIsPreviewOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Report Document */}
            <div className="p-8 space-y-6 text-slate-800" id="printable-report">
              <div className="border-b-2 border-slate-900 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black tracking-tight text-slate-900 uppercase">
                    {settings.institutionName}
                  </h2>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">
                    Office of Academic Dean & Student Analytics • {selectedReportType} Document
                  </p>
                </div>
                <div className="text-right text-xs text-slate-500 font-mono">
                  <p className="font-semibold text-slate-700">Date: {new Date().toLocaleDateString()}</p>
                  <p>Semester: {settings.currentSemester}</p>
                </div>
              </div>

              {/* Summary KPIs */}
              <div className="grid grid-cols-4 gap-4 bg-slate-50 p-4 rounded-2xl text-center">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Total Evaluated</span>
                  <p className="text-lg font-bold text-slate-900 font-mono">{students.length}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Class Attendance</span>
                  <p className="text-lg font-bold text-indigo-600 font-mono">82.6%</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Class Avg Marks</span>
                  <p className="text-lg font-bold text-purple-600 font-mono">76.4%</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold">High Risk Count</span>
                  <p className="text-lg font-bold text-rose-600 font-mono">
                    {students.filter(s => s.riskLevel === 'High').length}
                  </p>
                </div>
              </div>

              {/* Data Table */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-bold uppercase">
                    <tr>
                      <th className="p-3">Roll No</th>
                      <th className="p-3">Student Name</th>
                      <th className="p-3">Department</th>
                      <th className="p-3">Attendance</th>
                      <th className="p-3">Marks</th>
                      <th className="p-3">Predicted</th>
                      <th className="p-3 text-right">Risk Classification</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {students.slice(0, 15).map(s => (
                      <tr key={s.id}>
                        <td className="p-3 font-bold">{s.rollNumber}</td>
                        <td className="p-3 font-sans font-medium text-slate-900">{s.name}</td>
                        <td className="p-3 font-sans text-slate-500">{s.department.split(' ')[0]}</td>
                        <td className="p-3 font-semibold">{s.attendancePercent}%</td>
                        <td className="p-3 font-semibold">{s.internalMarks}%</td>
                        <td className="p-3 font-bold text-indigo-700">{s.predictedScore}% ({s.expectedGrade})</td>
                        <td className="p-3 text-right font-bold">
                          <span className={s.riskLevel === 'High' ? 'text-rose-600' : s.riskLevel === 'Medium' ? 'text-amber-600' : 'text-emerald-600'}>
                            {s.riskLevel}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Signatures */}
              <div className="pt-8 flex items-center justify-between text-xs text-slate-500 border-t border-slate-200">
                <div>
                  <p className="font-bold text-slate-800">Generated by EduPredict AI System</p>
                  <p className="font-mono">Model Engine: Neural Regression v4.2</p>
                </div>
                <div className="text-right">
                  <div className="w-36 border-b border-slate-400 mb-1"></div>
                  <p className="font-bold text-slate-800">Dr. Ananya Rao</p>
                  <p>Dean of Academic Affairs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
