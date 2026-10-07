import React, { useState, useEffect } from 'react';
import { 
  X, 
  GraduationCap, 
  Save, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Student } from '../types';

export const AddStudentModal: React.FC = () => {
  const { 
    isAddStudentModalOpen, 
    setIsAddStudentModalOpen, 
    editingStudent, 
    setEditingStudent, 
    fetchStudents, 
    students,
    addToast,
    theme 
  } = useApp();

  const isDark = theme === 'dark';

  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    email: '',
    department: 'Computer Science & Engineering',
    course: 'B.Tech CSE',
    semester: 4,
    section: 'A',
    phone: '+91 98765 00000',
    attendancePercent: 80,
    internalMarks: 75,
    assignmentScore: 78,
    participationScore: 70,
    previousSemesterScore: 74,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingStudent) {
      setFormData({
        name: editingStudent.name,
        rollNumber: editingStudent.rollNumber,
        email: editingStudent.email,
        department: editingStudent.department,
        course: editingStudent.course,
        semester: editingStudent.semester,
        section: editingStudent.section,
        phone: editingStudent.phone,
        attendancePercent: editingStudent.attendancePercent,
        internalMarks: editingStudent.internalMarks,
        assignmentScore: editingStudent.assignmentScore,
        participationScore: editingStudent.participationScore,
        previousSemesterScore: editingStudent.previousSemesterScore,
      });
    } else {
      setFormData({
        name: '',
        rollNumber: '',
        email: '',
        department: 'Computer Science & Engineering',
        course: 'B.Tech CSE',
        semester: 4,
        section: 'A',
        phone: '+91 98765 00000',
        attendancePercent: 80,
        internalMarks: 75,
        assignmentScore: 78,
        participationScore: 70,
        previousSemesterScore: 74,
      });
    }
    setErrors({});
  }, [editingStudent, isAddStudentModalOpen]);

  if (!isAddStudentModalOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Student name is required';
    if (!formData.rollNumber.trim()) newErrors.rollNumber = 'Roll number is required';

    const duplicate = students.find(
      s => s.rollNumber.toLowerCase() === formData.rollNumber.trim().toLowerCase() && s.id !== editingStudent?.id
    );
    if (duplicate) {
      newErrors.rollNumber = `Roll number ${formData.rollNumber} is already registered to ${duplicate.name}`;
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      newErrors.email = 'Valid institutional email address is required';
    }

    const checkRange = (key: string, label: string) => {
      const val = Number((formData as any)[key]);
      if (isNaN(val) || val < 0 || val > 100) {
        newErrors[key] = `${label} must be a number between 0 and 100`;
      }
    };

    checkRange('attendancePercent', 'Attendance %');
    checkRange('internalMarks', 'Internal Marks %');
    checkRange('assignmentScore', 'Assignment Score %');
    checkRange('participationScore', 'Participation Score %');
    checkRange('previousSemesterScore', 'Previous Semester Score %');

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      if (editingStudent) {
        await api.updateStudent(editingStudent.id, formData);
        addToast({
          type: 'success',
          title: 'Student Profile Updated',
          message: `Recalculated predictions for ${formData.name}.`,
        });
      } else {
        await api.createStudent(formData);
        addToast({
          type: 'success',
          title: 'Student Enrolled',
          message: `Created profile for ${formData.name} and generated risk indices.`,
        });
      }
      await fetchStudents();
      setIsAddStudentModalOpen(false);
      setEditingStudent(null);
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Action Failed',
        message: err?.message || 'Failed to save student profile',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className={`${isDark ? 'gradient-border-wrapper' : 'gradient-border-light'} max-w-2xl w-full max-h-[92vh]`}>
        <div className={`rounded-[calc(1.5rem-1px)] w-full max-h-[92vh] overflow-y-auto shadow-2xl transition-colors ${
          isDark ? 'bg-[#0E1526] text-white' : 'bg-white text-slate-900'
        }`}>
        <div className={`p-6 border-b flex items-center justify-between sticky top-0 backdrop-blur z-10 ${
          isDark ? 'bg-[#0E1526]/95 border-slate-800' : 'bg-white/95 border-slate-100'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">
                {editingStudent ? 'Edit Student Record' : 'Register New Student Profile'}
              </h2>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Values will immediately feed into EduPredict's AI prediction engine
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsAddStudentModalOpen(false);
              setEditingStudent(null);
            }}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Identity & Department */}
          <div>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">
              1. Identity & Department Info
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Full Student Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                  className={`w-full text-xs rounded-xl px-3 py-2 border font-medium focus:outline-none ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
                {errors.name && <p className="text-[11px] text-rose-400 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Roll Number / ID *</label>
                <input
                  type="text"
                  required
                  value={formData.rollNumber}
                  onChange={e => setFormData({ ...formData, rollNumber: e.target.value })}
                  placeholder="e.g. 22CS104"
                  className={`w-full text-xs rounded-xl px-3 py-2 border font-mono font-bold focus:outline-none ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
                {errors.rollNumber && <p className="text-[11px] text-rose-400 mt-1">{errors.rollNumber}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Institutional Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="rahul@apex.edu"
                  className={`w-full text-xs rounded-xl px-3 py-2 border font-medium focus:outline-none ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
                {errors.email && <p className="text-[11px] text-rose-400 mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Department</label>
                <select
                  value={formData.department}
                  onChange={e => setFormData({ ...formData, department: e.target.value })}
                  className={`w-full text-xs rounded-xl px-3 py-2 border font-medium focus:outline-none ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                >
                  <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="AI & Data Science">AI & Data Science</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Semester & Section</label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={formData.semester}
                    onChange={e => setFormData({ ...formData, semester: Number(e.target.value) })}
                    className={`w-full text-xs rounded-xl px-3 py-2 border font-medium focus:outline-none ${
                      isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  >
                    <option value={3}>Semester 3</option>
                    <option value={4}>Semester 4</option>
                    <option value={5}>Semester 5</option>
                  </select>
                  <select
                    value={formData.section}
                    onChange={e => setFormData({ ...formData, section: e.target.value })}
                    className={`w-full text-xs rounded-xl px-3 py-2 border font-medium focus:outline-none ${
                      isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  >
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Phone Number</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 00000"
                  className={`w-full text-xs rounded-xl px-3 py-2 border font-medium focus:outline-none ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Academic Metric Predictor Inputs */}
          <div className={`pt-4 border-t ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">
              2. Academic Predictor Metrics (0 - 100%)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Attendance % (Statutory 75%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.attendancePercent}
                  onChange={e => setFormData({ ...formData, attendancePercent: Number(e.target.value) })}
                  className={`w-full text-xs rounded-xl px-3 py-2 border font-bold font-mono focus:outline-none ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
                {errors.attendancePercent && <p className="text-[11px] text-rose-400 mt-1">{errors.attendancePercent}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Internal Exam Marks %</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.internalMarks}
                  onChange={e => setFormData({ ...formData, internalMarks: Number(e.target.value) })}
                  className={`w-full text-xs rounded-xl px-3 py-2 border font-bold font-mono focus:outline-none ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
                {errors.internalMarks && <p className="text-[11px] text-rose-400 mt-1">{errors.internalMarks}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Assignment Score %</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.assignmentScore}
                  onChange={e => setFormData({ ...formData, assignmentScore: Number(e.target.value) })}
                  className={`w-full text-xs rounded-xl px-3 py-2 border font-bold font-mono focus:outline-none ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
                {errors.assignmentScore && <p className="text-[11px] text-rose-400 mt-1">{errors.assignmentScore}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Class Participation Score %</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.participationScore}
                  onChange={e => setFormData({ ...formData, participationScore: Number(e.target.value) })}
                  className={`w-full text-xs rounded-xl px-3 py-2 border font-bold font-mono focus:outline-none ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
                {errors.participationScore && <p className="text-[11px] text-rose-400 mt-1">{errors.participationScore}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold mb-1">Previous Semester GPA / Score %</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.previousSemesterScore}
                  onChange={e => setFormData({ ...formData, previousSemesterScore: Number(e.target.value) })}
                  className={`w-full text-xs rounded-xl px-3 py-2 border font-bold font-mono focus:outline-none ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
                {errors.previousSemesterScore && <p className="text-[11px] text-rose-400 mt-1">{errors.previousSemesterScore}</p>}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={`pt-4 border-t flex items-center justify-end gap-3 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
            <button
              type="button"
              onClick={() => {
                setIsAddStudentModalOpen(false);
                setEditingStudent(null);
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center gap-2 transition-all disabled:opacity-75"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Evaluating...' : editingStudent ? 'Update & Recalculate' : 'Save & Calculate Predictions'}</span>
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
};
