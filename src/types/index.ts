export type RiskLevel = 'Low' | 'Medium' | 'High';
export type AssessmentType = 'Quiz' | 'Unit 1' | 'Unit 2' | 'Midterm' | 'Unit 3' | 'Unit 4' | 'Final';
export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE';
export type Grade = 'A+' | 'A' | 'B+' | 'B' | 'C' | 'D' | 'F';

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  email: string;
  department: string;
  course: string;
  semester: number;
  section: string;
  phone: string;
  attendancePercent: number;
  internalMarks: number;
  assignmentScore: number;
  participationScore: number;
  previousSemesterScore: number;
  avatarUrl?: string;
  lastUpdated: string;
  // Computed fields:
  predictedScore?: number;
  expectedGrade?: Grade;
  confidence?: number;
  riskScore?: number;
  riskLevel?: RiskLevel;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName?: string;
  rollNumber?: string;
  subject: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
}

export interface PerformanceRecord {
  id: string;
  studentId: string;
  subject: string;
  assessmentType: AssessmentType;
  score: number;
  maxScore: number;
  date: string;
}

export interface AssignmentRecord {
  id: string;
  studentId: string;
  title: string;
  subject: string;
  score: number;
  maxScore: number;
  submissionStatus: 'ON_TIME' | 'LATE' | 'MISSED';
  submissionDate: string;
}

export interface ParticipationRecord {
  id: string;
  studentId: string;
  subject: string;
  score: number; // 0-100
  date: string;
}

export interface PredictionFactor {
  name: string;
  score: number;
  weight: number;
  impact: 'positive' | 'negative' | 'neutral';
  explanation: string;
}

export interface PredictionResult {
  id: string;
  studentId: string;
  predictedScore: number;
  expectedGrade: Grade;
  confidence: number;
  riskScore: number;
  riskLevel: RiskLevel;
  trend: 'improving' | 'declining' | 'stable';
  explanations: string[];
  factors: PredictionFactor[];
  aiAnalysisNarrative?: string;
  createdAt: string;
}

export type RecommendationType = 
  | 'ATTENDANCE' 
  | 'ASSIGNMENT' 
  | 'SUBJECT_SUPPORT' 
  | 'MENTORING' 
  | 'REINFORCEMENT';

export interface Recommendation {
  id: string;
  studentId: string;
  studentName?: string;
  rollNumber?: string;
  type: RecommendationType;
  title: string;
  message: string;
  suggestedAction: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  createdAt: string;
}

export interface PredictionSettings {
  attendanceWeight: number; // e.g. 30
  marksWeight: number; // e.g. 30
  assignmentsWeight: number; // e.g. 15
  participationWeight: number; // e.g. 10
  previousPerformanceWeight: number; // e.g. 15
  riskThresholdLow: number; // 30
  riskThresholdHigh: number; // 60
  institutionName: string;
  academicYear: string;
  currentSemester: string;
}

export interface FacultyUser {
  id: string;
  name: string;
  email: string;
  department: string;
  role: 'Admin' | 'Faculty' | 'Dean';
  avatarUrl: string;
}

export interface AppNotification {
  id: string;
  type: 'HIGH_RISK' | 'ATTENDANCE_DROP' | 'IMPROVEMENT' | 'NEW_PREDICTION';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  studentId?: string;
  targetView?: string;
}

export interface DashboardKPIs {
  totalStudents: number;
  totalStudentsTrend: string;
  averageAttendance: number;
  attendanceTrend: string;
  averagePerformance: number;
  performanceTrend: string;
  atRiskStudentsCount: number;
  atRiskStudentsTrend: string;
}
