import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { 
  Student, 
  PredictionResult, 
  Recommendation, 
  PredictionSettings, 
  AppNotification,
  AttendanceRecord,
  PerformanceRecord,
  AssessmentType
} from './src/types';
import { 
  DEFAULT_SETTINGS, 
  evaluateStudent 
} from './src/services/predictionEngine';
import { 
  getInitialStudents, 
  CURRENT_FACULTY, 
  ACADEMIC_TREND_SERIES, 
  INITIAL_NOTIFICATIONS,
  SUBJECTS_LIST 
} from './src/data/mockData';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// In-Memory Database Store
let studentsStore: Student[] = getInitialStudents();
let settingsStore: PredictionSettings = { ...DEFAULT_SETTINGS };
let notificationsStore: AppNotification[] = [...INITIAL_NOTIFICATIONS];

// Generate attendance records for past days
let attendanceStore: AttendanceRecord[] = [];
const today = new Date().toISOString().split('T')[0];
studentsStore.forEach((student, sIdx) => {
  // past 5 days
  for (let d = 0; d < 5; d++) {
    const dDate = new Date();
    dDate.setDate(dDate.getDate() - d);
    const dateStr = dDate.toISOString().split('T')[0];
    
    // determine status based on student attendance %
    const isPresent = Math.random() * 100 < student.attendancePercent;
    attendanceStore.push({
      id: `att-${student.id}-${d}`,
      studentId: student.id,
      studentName: student.name,
      rollNumber: student.rollNumber,
      subject: SUBJECTS_LIST[sIdx % SUBJECTS_LIST.length],
      date: dateStr,
      status: isPresent ? 'PRESENT' : (Math.random() > 0.7 ? 'LATE' : 'ABSENT'),
    });
  }
});

// Cache predictions & recommendations map
let predictionsMap = new Map<string, PredictionResult>();
let recommendationsMap = new Map<string, Recommendation[]>();

function refreshAllPredictions() {
  predictionsMap.clear();
  recommendationsMap.clear();

  studentsStore = studentsStore.map(student => {
    const { prediction, recommendations } = evaluateStudent(student, settingsStore);
    predictionsMap.set(student.id, prediction);
    recommendationsMap.set(student.id, recommendations);
    return {
      ...student,
      predictedScore: prediction.predictedScore,
      expectedGrade: prediction.expectedGrade,
      confidence: prediction.confidence,
      riskScore: prediction.riskScore,
      riskLevel: prediction.riskLevel,
      lastUpdated: new Date().toISOString().split('T')[0],
    };
  });
}

// Initial calculation
refreshAllPredictions();

// ---------------- REST API ROUTES ----------------

// Auth Endpoints
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // Support demo credentials or any valid email
  const isAdmin = email.toLowerCase().includes('admin');
  const user = {
    ...CURRENT_FACULTY,
    email,
    role: isAdmin ? 'Admin' : 'Faculty',
    name: isAdmin ? 'Administrator' : 'Dr. Ananya Rao',
  };

  return res.json({
    token: 'edu-session-jwt-token-7896',
    user,
  });
});

app.get('/api/auth/me', (_req: Request, res: Response) => {
  return res.json(CURRENT_FACULTY);
});

// Students Endpoints
app.get('/api/students', (req: Request, res: Response) => {
  let results = [...studentsStore];
  const { search, department, semester, risk, sortBy, sortOrder } = req.query;

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    results = results.filter(s => 
      s.name.toLowerCase().includes(q) || 
      s.rollNumber.toLowerCase().includes(q) || 
      s.email.toLowerCase().includes(q)
    );
  }

  if (department && department !== 'All') {
    results = results.filter(s => s.department === department);
  }

  if (semester && semester !== 'All') {
    results = results.filter(s => s.semester === Number(semester));
  }

  if (risk && risk !== 'All') {
    results = results.filter(s => s.riskLevel === risk);
  }

  if (sortBy && typeof sortBy === 'string') {
    const order = sortOrder === 'asc' ? 1 : -1;
    results.sort((a: any, b: any) => {
      const valA = a[sortBy] ?? 0;
      const valB = b[sortBy] ?? 0;
      if (typeof valA === 'string') {
        return valA.localeCompare(valB) * order;
      }
      return (valA - valB) * order;
    });
  }

  return res.json({
    total: results.length,
    students: results,
  });
});

app.get('/api/students/:id', (req: Request, res: Response) => {
  const student = studentsStore.find(s => s.id === req.params.id);
  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }

  const prediction = predictionsMap.get(student.id) || evaluateStudent(student, settingsStore).prediction;
  const recommendations = recommendationsMap.get(student.id) || evaluateStudent(student, settingsStore).recommendations;
  const attendanceHistory = attendanceStore.filter(a => a.studentId === student.id);

  // Performance history across assessment types
  const assessments: PerformanceRecord[] = [
    { id: `p-1-${student.id}`, studentId: student.id, subject: 'Core Curriculum', assessmentType: 'Unit 1', score: Math.round(student.internalMarks * 0.95), maxScore: 100, date: '2026-01-20' },
    { id: `p-2-${student.id}`, studentId: student.id, subject: 'Core Curriculum', assessmentType: 'Unit 2', score: Math.round(student.internalMarks * 1.02), maxScore: 100, date: '2026-02-15' },
    { id: `p-3-${student.id}`, studentId: student.id, subject: 'Core Curriculum', assessmentType: 'Midterm', score: student.internalMarks, maxScore: 100, date: '2026-03-05' },
    { id: `p-4-${student.id}`, studentId: student.id, subject: 'Core Curriculum', assessmentType: 'Unit 3', score: Math.round(student.internalMarks * 0.98), maxScore: 100, date: '2026-03-24' },
    { id: `p-5-${student.id}`, studentId: student.id, subject: 'Core Curriculum', assessmentType: 'Unit 4', score: Math.round(student.internalMarks * 1.05), maxScore: 100, date: '2026-04-02' },
  ];

  return res.json({
    student,
    prediction,
    recommendations,
    attendanceHistory,
    performanceHistory: assessments,
  });
});

app.post('/api/students', (req: Request, res: Response) => {
  const {
    name,
    rollNumber,
    email,
    department,
    course,
    semester,
    section,
    phone,
    attendancePercent,
    internalMarks,
    assignmentScore,
    participationScore,
    previousSemesterScore,
  } = req.body;

  // Validation
  if (!name || !rollNumber || !email) {
    return res.status(400).json({ error: 'Name, roll number, and email are mandatory' });
  }

  // Duplicate roll number check
  if (studentsStore.some(s => s.rollNumber.toLowerCase() === String(rollNumber).toLowerCase())) {
    return res.status(409).json({ error: `Student with roll number ${rollNumber} already exists` });
  }

  const newStudent: Student = {
    id: `s-${Date.now()}`,
    name,
    rollNumber,
    email,
    department: department || 'Computer Science & Engineering',
    course: course || 'B.Tech CSE',
    semester: Number(semester) || 4,
    section: section || 'A',
    phone: phone || '+91 98765 00000',
    attendancePercent: Number(attendancePercent) || 75,
    internalMarks: Number(internalMarks) || 70,
    assignmentScore: Number(assignmentScore) || 75,
    participationScore: Number(participationScore) || 70,
    previousSemesterScore: Number(previousSemesterScore) || 72,
    avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
    lastUpdated: new Date().toISOString().split('T')[0],
  };

  // Evaluate predictions
  const { prediction, recommendations } = evaluateStudent(newStudent, settingsStore);
  newStudent.predictedScore = prediction.predictedScore;
  newStudent.expectedGrade = prediction.expectedGrade;
  newStudent.confidence = prediction.confidence;
  newStudent.riskScore = prediction.riskScore;
  newStudent.riskLevel = prediction.riskLevel;

  studentsStore.unshift(newStudent);
  predictionsMap.set(newStudent.id, prediction);
  recommendationsMap.set(newStudent.id, recommendations);

  // If high risk, generate notification
  if (newStudent.riskLevel === 'High') {
    notificationsStore.unshift({
      id: `notif-${Date.now()}`,
      type: 'HIGH_RISK',
      title: `High-risk student enrolled: ${newStudent.name}`,
      message: `Risk score calculated at ${newStudent.riskScore}/100. Early academic advisor intervention suggested.`,
      timestamp: 'Just now',
      read: false,
      studentId: newStudent.id,
      targetView: 'students',
    });
  }

  return res.status(201).json({
    message: 'Student registered successfully',
    student: newStudent,
    prediction,
    recommendations,
  });
});

app.put('/api/students/:id', (req: Request, res: Response) => {
  const index = studentsStore.findIndex(s => s.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Student not found' });
  }

  const existing = studentsStore[index];
  const updatedStudent: Student = {
    ...existing,
    ...req.body,
    id: existing.id,
    lastUpdated: new Date().toISOString().split('T')[0],
  };

  const { prediction, recommendations } = evaluateStudent(updatedStudent, settingsStore);
  updatedStudent.predictedScore = prediction.predictedScore;
  updatedStudent.expectedGrade = prediction.expectedGrade;
  updatedStudent.confidence = prediction.confidence;
  updatedStudent.riskScore = prediction.riskScore;
  updatedStudent.riskLevel = prediction.riskLevel;

  studentsStore[index] = updatedStudent;
  predictionsMap.set(updatedStudent.id, prediction);
  recommendationsMap.set(updatedStudent.id, recommendations);

  return res.json({
    message: 'Student updated successfully',
    student: updatedStudent,
    prediction,
    recommendations,
  });
});

app.delete('/api/students/:id', (req: Request, res: Response) => {
  const index = studentsStore.findIndex(s => s.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Student not found' });
  }

  const removed = studentsStore.splice(index, 1)[0];
  predictionsMap.delete(removed.id);
  recommendationsMap.delete(removed.id);

  return res.json({ message: 'Student removed successfully', id: req.params.id });
});

// Attendance Endpoints
app.get('/api/attendance', (req: Request, res: Response) => {
  const { date, subject, department } = req.query;
  let records = [...attendanceStore];

  if (date) {
    records = records.filter(a => a.date === date);
  }
  if (subject && subject !== 'All') {
    records = records.filter(a => a.subject === subject);
  }

  const presentCount = records.filter(r => r.status === 'PRESENT').length;
  const absentCount = records.filter(r => r.status === 'ABSENT').length;
  const lateCount = records.filter(r => r.status === 'LATE').length;
  const total = records.length || 1;
  const attendanceRate = Math.round(((presentCount + lateCount * 0.5) / total) * 100);

  return res.json({
    date: date || today,
    subject: subject || 'All',
    records,
    summary: {
      totalRecords: records.length,
      presentCount,
      absentCount,
      lateCount,
      attendanceRate,
    },
  });
});

app.post('/api/attendance', (req: Request, res: Response) => {
  const { records } = req.body;
  if (!Array.isArray(records)) {
    return res.status(400).json({ error: 'Array of attendance records required' });
  }

  records.forEach((rec: Partial<AttendanceRecord>) => {
    if (!rec.studentId) return;
    const existingIdx = attendanceStore.findIndex(
      a => a.studentId === rec.studentId && a.date === (rec.date || today) && a.subject === rec.subject
    );
    if (existingIdx >= 0) {
      attendanceStore[existingIdx].status = rec.status || 'PRESENT';
    } else {
      const student = studentsStore.find(s => s.id === rec.studentId);
      attendanceStore.push({
        id: `att-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        studentId: rec.studentId,
        studentName: student?.name || 'Student',
        rollNumber: student?.rollNumber || '',
        subject: rec.subject || 'Data Structures',
        date: rec.date || today,
        status: rec.status || 'PRESENT',
      });
    }
  });

  return res.json({ message: 'Attendance recorded successfully', count: records.length });
});

// Performance Endpoints
app.get('/api/performance', (_req: Request, res: Response) => {
  const avgInternal = Math.round(
    studentsStore.reduce((acc, s) => acc + s.internalMarks, 0) / studentsStore.length
  );
  const highest = Math.max(...studentsStore.map(s => s.internalMarks));
  const lowest = Math.min(...studentsStore.map(s => s.internalMarks));

  // Grade breakdown
  const gradeDistribution = {
    'A+': studentsStore.filter(s => (s.predictedScore ?? 0) >= 90).length,
    'A': studentsStore.filter(s => (s.predictedScore ?? 0) >= 80 && (s.predictedScore ?? 0) < 90).length,
    'B+': studentsStore.filter(s => (s.predictedScore ?? 0) >= 70 && (s.predictedScore ?? 0) < 80).length,
    'B': studentsStore.filter(s => (s.predictedScore ?? 0) >= 60 && (s.predictedScore ?? 0) < 70).length,
    'C': studentsStore.filter(s => (s.predictedScore ?? 0) >= 50 && (s.predictedScore ?? 0) < 60).length,
    'D': studentsStore.filter(s => (s.predictedScore ?? 0) >= 40 && (s.predictedScore ?? 0) < 50).length,
    'F': studentsStore.filter(s => (s.predictedScore ?? 0) < 40).length,
  };

  return res.json({
    metrics: {
      averageScore: avgInternal,
      highestScore: highest,
      lowestScore: lowest,
      classAverage: avgInternal,
      passingRate: Math.round((studentsStore.filter(s => s.internalMarks >= 40).length / studentsStore.length) * 100),
    },
    gradeDistribution,
    assessmentTrends: ACADEMIC_TREND_SERIES,
  });
});

app.post('/api/performance', (req: Request, res: Response) => {
  const { studentId, assessmentType, score } = req.body;
  if (!studentId || score === undefined) {
    return res.status(400).json({ error: 'studentId and score are required' });
  }

  const student = studentsStore.find(s => s.id === studentId);
  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }

  // Update internal marks if applicable
  student.internalMarks = Number(score);
  const { prediction, recommendations } = evaluateStudent(student, settingsStore);
  student.predictedScore = prediction.predictedScore;
  student.expectedGrade = prediction.expectedGrade;
  student.confidence = prediction.confidence;
  student.riskScore = prediction.riskScore;
  student.riskLevel = prediction.riskLevel;

  predictionsMap.set(student.id, prediction);
  recommendationsMap.set(student.id, recommendations);

  return res.json({ message: 'Performance record logged', student, prediction });
});

// Predictions Endpoints
app.get('/api/predictions', (_req: Request, res: Response) => {
  const allPredictions = Array.from(predictionsMap.values());
  const highRisk = allPredictions.filter(p => p.riskLevel === 'High').length;
  const mediumRisk = allPredictions.filter(p => p.riskLevel === 'Medium').length;
  const lowRisk = allPredictions.filter(p => p.riskLevel === 'Low').length;
  const avgPredicted = Math.round(
    allPredictions.reduce((acc, p) => acc + p.predictedScore, 0) / (allPredictions.length || 1)
  );

  return res.json({
    summary: {
      totalPredictions: allPredictions.length,
      highRiskCount: highRisk,
      mediumRiskCount: mediumRisk,
      lowRiskCount: lowRisk,
      averagePredictedScore: avgPredicted,
    },
    predictions: allPredictions.map(p => {
      const student = studentsStore.find(s => s.id === p.studentId);
      const recs = recommendationsMap.get(p.studentId) || [];
      return {
        ...p,
        studentName: student?.name,
        rollNumber: student?.rollNumber,
        department: student?.department,
        currentScore: student?.internalMarks,
        topRecommendation: recs[0]?.title || 'Maintain current trajectory',
      };
    }),
  });
});

app.post('/api/predictions/generate', (_req: Request, res: Response) => {
  refreshAllPredictions();

  // Add notification
  notificationsStore.unshift({
    id: `notif-${Date.now()}`,
    type: 'NEW_PREDICTION',
    title: 'Batch prediction simulation completed',
    message: `Updated analytics across all ${studentsStore.length} enrolled student profiles.`,
    timestamp: 'Just now',
    read: false,
    targetView: 'predictions',
  });

  const allPredictions = Array.from(predictionsMap.values());
  return res.json({
    message: 'AI predictions successfully re-calculated',
    totalProcessed: studentsStore.length,
    highRiskCount: allPredictions.filter(p => p.riskLevel === 'High').length,
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/predictions/student/:studentId', (req: Request, res: Response) => {
  const prediction = predictionsMap.get(req.params.studentId);
  if (!prediction) {
    return res.status(404).json({ error: 'Prediction not found for student' });
  }
  return res.json(prediction);
});

// Explainable AI Endpoint (Calls Gemini SDK if GEMINI_API_KEY is present, with robust fallback)
app.post('/api/ai/explain/:studentId', async (req: Request, res: Response) => {
  const student = studentsStore.find(s => s.id === req.params.studentId);
  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }

  const prediction = predictionsMap.get(student.id) || evaluateStudent(student, settingsStore).prediction;

  // Check if GEMINI_API_KEY is configured
  if (process.env.GEMINI_API_KEY) {
    try {
      const ai = new GoogleGenAI({});
      const prompt = `You are EduPredict AI, an expert academic advisor for university faculty.
Analyze the following student data and provide an explainable AI diagnostic synthesis and 3 concrete intervention recommendations:
Student Name: ${student.name}
Roll Number: ${student.rollNumber}
Department: ${student.department}
Attendance: ${student.attendancePercent}% (Institutional minimum is 75%)
Internal Marks: ${student.internalMarks}%
Assignment Score: ${student.assignmentScore}%
Class Participation: ${student.participationScore}%
Previous Semester Score: ${student.previousSemesterScore}%
Model Predicted Final Score: ${prediction.predictedScore}% (Expected Grade: ${prediction.expectedGrade})
Computed Risk Level: ${prediction.riskLevel} (Risk Score: ${prediction.riskScore}/100)

Provide a concise, professional diagnostic for faculty (max 180 words), highlighting key underlying causal factors and positive growth pathways.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      if (response.text) {
        return res.json({
          narrative: response.text,
          explanations: prediction.explanations,
          factors: prediction.factors,
          source: 'Gemini 2.5 Flash Academic Engine',
        });
      }
    } catch (err: any) {
      console.warn('Gemini API call skipped/fallback:', err?.message || err);
    }
  }

  // Transparent Rule-Based Explainable Synthesis
  const summaryNarrative = `${student.name}'s risk score of ${prediction.riskScore}/100 is primarily driven by ${
    student.attendancePercent < 75 
      ? `attendance deficits (${student.attendancePercent}% vs 75% cutoff)` 
      : `internal assessment gaps (${student.internalMarks}%)`
  }. With an assignment completion index of ${student.assignmentScore}%, early faculty mentorship and targeted remedial sessions in core technical modules can yield up to a +12% trajectory improvement before the semester final examinations.`;

  return res.json({
    narrative: summaryNarrative,
    explanations: prediction.explanations,
    factors: prediction.factors,
    source: 'EduPredict Deterministic Explainable AI Engine',
  });
});

// Recommendations Endpoints
app.get('/api/recommendations', (_req: Request, res: Response) => {
  const allRecs: Recommendation[] = [];
  recommendationsMap.forEach(recs => allRecs.push(...recs));
  return res.json(allRecs);
});

app.get('/api/recommendations/student/:studentId', (req: Request, res: Response) => {
  const recs = recommendationsMap.get(req.params.studentId) || [];
  return res.json(recs);
});

app.patch('/api/recommendations/:id/status', (req: Request, res: Response) => {
  const { status } = req.body;
  const { id } = req.params;

  let found = false;
  recommendationsMap.forEach((recs, sId) => {
    const r = recs.find(item => item.id === id);
    if (r) {
      r.status = status;
      found = true;
    }
  });

  if (!found) {
    return res.status(404).json({ error: 'Recommendation not found' });
  }

  return res.json({ message: 'Recommendation updated', id, status });
});

// Analytics Endpoints
app.get('/api/analytics/dashboard', (_req: Request, res: Response) => {
  const total = studentsStore.length;
  const avgAtt = Number((studentsStore.reduce((a, s) => a + s.attendancePercent, 0) / total).toFixed(1));
  const avgPerf = Number((studentsStore.reduce((a, s) => a + s.internalMarks, 0) / total).toFixed(1));
  const atRisk = studentsStore.filter(s => s.riskLevel === 'High').length;

  // Scatter plot data: Attendance vs Performance
  const scatterData = studentsStore.map(s => ({
    id: s.id,
    name: s.name,
    rollNumber: s.rollNumber,
    attendance: s.attendancePercent,
    marks: s.internalMarks,
    riskLevel: s.riskLevel,
    riskScore: s.riskScore,
  }));

  return res.json({
    kpis: {
      totalStudents: 248, // display institutional scale benchmark
      totalStudentsTrend: '+8% from previous semester',
      averageAttendance: avgAtt,
      attendanceTrend: '↑ 3.2% vs last month',
      averagePerformance: avgPerf,
      performanceTrend: '↑ 5.8% vs last month',
      atRiskStudentsCount: atRisk,
      atRiskStudentsTrend: '↓ 12% following early intervention',
    },
    scatterData,
    assessmentTrends: ACADEMIC_TREND_SERIES,
  });
});

app.get('/api/analytics/risk', (_req: Request, res: Response) => {
  const high = studentsStore.filter(s => s.riskLevel === 'High');
  const medium = studentsStore.filter(s => s.riskLevel === 'Medium');
  const low = studentsStore.filter(s => s.riskLevel === 'Low');

  // Correlations
  const correlations = [
    { factor: 'Attendance ↔ Performance', correlationScore: 0.84, impactLevel: 'Very High', note: 'Strongest predictor of semester final grades' },
    { factor: 'Assignments ↔ Performance', correlationScore: 0.72, impactLevel: 'High', note: 'Regular submissions directly boost internal test scores' },
    { factor: 'Class Participation ↔ Performance', correlationScore: 0.58, impactLevel: 'Moderate', note: 'Correlates with conceptual grasp in lab exams' },
  ];

  return res.json({
    breakdown: {
      highCount: high.length,
      mediumCount: medium.length,
      lowCount: low.length,
      highPercentage: Math.round((high.length / studentsStore.length) * 100),
      mediumPercentage: Math.round((medium.length / studentsStore.length) * 100),
      lowPercentage: Math.round((low.length / studentsStore.length) * 100),
    },
    correlations,
  });
});

// Reports Endpoints
app.get('/api/reports', (req: Request, res: Response) => {
  const { type = 'performance' } = req.query;

  // Format CSV rows
  let csvContent = 'Roll Number,Student Name,Department,Attendance %,Marks %,Predicted Score %,Risk Level\n';
  studentsStore.forEach(s => {
    csvContent += `"${s.rollNumber}","${s.name}","${s.department}",${s.attendancePercent},${s.internalMarks},${s.predictedScore},"${s.riskLevel}"\n`;
  });

  return res.json({
    reportType: type,
    generatedAt: new Date().toLocaleString(),
    institution: settingsStore.institutionName,
    academicYear: settingsStore.academicYear,
    totalStudents: studentsStore.length,
    highRiskCount: studentsStore.filter(s => s.riskLevel === 'High').length,
    csvData: csvContent,
  });
});

// Settings Endpoints
app.get('/api/settings', (_req: Request, res: Response) => {
  return res.json(settingsStore);
});

app.put('/api/settings', (req: Request, res: Response) => {
  settingsStore = {
    ...settingsStore,
    ...req.body,
  };
  refreshAllPredictions();
  return res.json({
    message: 'Settings updated and prediction models recalibrated',
    settings: settingsStore,
  });
});

// Notifications Endpoints
app.get('/api/notifications', (_req: Request, res: Response) => {
  return res.json(notificationsStore);
});

app.patch('/api/notifications/:id/read', (req: Request, res: Response) => {
  const notif = notificationsStore.find(n => n.id === req.params.id);
  if (notif) {
    notif.read = true;
  }
  return res.json({ message: 'Marked as read', id: req.params.id });
});

// Mount Vite or serve static
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  const PORT = process.env.PORT || 3000;
  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`EduPredict AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
