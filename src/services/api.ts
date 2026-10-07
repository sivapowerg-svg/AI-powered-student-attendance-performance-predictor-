import { 
  Student, 
  PredictionResult, 
  Recommendation, 
  PredictionSettings, 
  AppNotification, 
  AttendanceRecord 
} from '../types';

export const api = {
  // Auth
  async login(email: string, password: string) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error((await res.json()).error || 'Login failed');
    return res.json();
  },

  async getCurrentUser() {
    const res = await fetch('/api/auth/me');
    return res.json();
  },

  // Students
  async getStudents(params: {
    search?: string;
    department?: string;
    semester?: string;
    risk?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}) {
    const query = new URLSearchParams();
    if (params.search) query.set('search', params.search);
    if (params.department) query.set('department', params.department);
    if (params.semester) query.set('semester', params.semester);
    if (params.risk) query.set('risk', params.risk);
    if (params.sortBy) query.set('sortBy', params.sortBy);
    if (params.sortOrder) query.set('sortOrder', params.sortOrder);

    const res = await fetch(`/api/students?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch students');
    return res.json();
  },

  async getStudentById(id: string) {
    const res = await fetch(`/api/students/${id}`);
    if (!res.ok) throw new Error('Student not found');
    return res.json();
  },

  async createStudent(data: Partial<Student>) {
    const res = await fetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create student');
    }
    return res.json();
  },

  async updateStudent(id: string, data: Partial<Student>) {
    const res = await fetch(`/api/students/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update student');
    return res.json();
  },

  async deleteStudent(id: string) {
    const res = await fetch(`/api/students/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete student');
    return res.json();
  },

  // Attendance
  async getAttendance(date?: string, subject?: string) {
    const query = new URLSearchParams();
    if (date) query.set('date', date);
    if (subject) query.set('subject', subject);
    const res = await fetch(`/api/attendance?${query.toString()}`);
    return res.json();
  },

  async recordAttendance(records: Partial<AttendanceRecord>[]) {
    const res = await fetch('/api/attendance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ records }),
    });
    return res.json();
  },

  // Performance
  async getPerformance() {
    const res = await fetch('/api/performance');
    return res.json();
  },

  async recordMarks(studentId: string, assessmentType: string, score: number) {
    const res = await fetch('/api/performance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, assessmentType, score }),
    });
    return res.json();
  },

  // Predictions
  async getPredictions() {
    const res = await fetch('/api/predictions');
    return res.json();
  },

  async generatePredictions() {
    const res = await fetch('/api/predictions/generate', { method: 'POST' });
    return res.json();
  },

  async getStudentPrediction(studentId: string) {
    const res = await fetch(`/api/predictions/student/${studentId}`);
    return res.json();
  },

  async explainPrediction(studentId: string) {
    const res = await fetch(`/api/ai/explain/${studentId}`, { method: 'POST' });
    return res.json();
  },

  // Recommendations
  async getRecommendations() {
    const res = await fetch('/api/recommendations');
    return res.json();
  },

  async getStudentRecommendations(studentId: string) {
    const res = await fetch(`/api/recommendations/student/${studentId}`);
    return res.json();
  },

  async updateRecommendationStatus(id: string, status: string) {
    const res = await fetch(`/api/recommendations/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return res.json();
  },

  // Analytics
  async getDashboardAnalytics() {
    const res = await fetch('/api/analytics/dashboard');
    return res.json();
  },

  async getRiskAnalytics() {
    const res = await fetch('/api/analytics/risk');
    return res.json();
  },

  // Reports
  async getReport(type: string) {
    const res = await fetch(`/api/reports?type=${type}`);
    return res.json();
  },

  // Settings
  async getSettings() {
    const res = await fetch('/api/settings');
    return res.json();
  },

  async updateSettings(settings: Partial<PredictionSettings>) {
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    return res.json();
  },

  // Notifications
  async getNotifications() {
    const res = await fetch('/api/notifications');
    return res.json();
  },

  async markNotificationRead(id: string) {
    const res = await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' });
    return res.json();
  },
};
