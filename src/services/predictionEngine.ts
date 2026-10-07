import { 
  Student, 
  PredictionResult, 
  PredictionSettings, 
  Grade, 
  RiskLevel, 
  Recommendation,
  PredictionFactor 
} from '../types';

export const DEFAULT_SETTINGS: PredictionSettings = {
  attendanceWeight: 30,
  marksWeight: 30,
  assignmentsWeight: 15,
  participationWeight: 10,
  previousPerformanceWeight: 15,
  riskThresholdLow: 30,
  riskThresholdHigh: 60,
  institutionName: 'Apex Institute of Technology & Science',
  academicYear: '2025-2026',
  currentSemester: 'Semester 4 - Spring',
};

export function calculateGrade(score: number): Grade {
  if (score >= 90) return 'A+';
  if (score >= 80) return 'A';
  if (score >= 70) return 'B+';
  if (score >= 60) return 'B';
  if (score >= 50) return 'C';
  if (score >= 40) return 'D';
  return 'F';
}

export function evaluateStudent(
  student: Student,
  settings: PredictionSettings = DEFAULT_SETTINGS,
  classAverageAttendance = 82.6,
  classAverageMarks = 76.4
): { prediction: PredictionResult; recommendations: Recommendation[] } {
  const wAtt = settings.attendanceWeight / 100;
  const wMarks = settings.marksWeight / 100;
  const wAsgn = settings.assignmentsWeight / 100;
  const wPart = settings.participationWeight / 100;
  const wPrev = settings.previousPerformanceWeight / 100;

  // Weighted composite score (0 - 100)
  const compositeScore = 
    (student.attendancePercent * wAtt) +
    (student.internalMarks * wMarks) +
    (student.assignmentScore * wAsgn) +
    (student.participationScore * wPart) +
    (student.previousSemesterScore * wPrev);

  // Inverted Risk Score calculation:
  // Low performance across weighted indicators generates high risk
  let rawRisk = 100 - compositeScore;

  // Academic regulatory penalty: if attendance is below statutory minimum (75%),
  // add a non-linear risk penalty because student is at risk of exam debarment
  if (student.attendancePercent < 75) {
    const attendanceDeficit = 75 - student.attendancePercent;
    rawRisk += Math.min(18, attendanceDeficit * 0.8);
  }

  // Clamped Risk Score (0 - 100)
  const riskScore = Math.max(0, Math.min(100, Math.round(rawRisk)));

  // Risk Classification
  let riskLevel: RiskLevel = 'Low';
  if (riskScore > settings.riskThresholdHigh) {
    riskLevel = 'High';
  } else if (riskScore > settings.riskThresholdLow) {
    riskLevel = 'Medium';
  }

  // Predicted Final Score:
  // Projects the student's expected final marks based on current trajectory and historical resilience
  const trendAdjustment = (student.internalMarks - student.previousSemesterScore) * 0.25;
  const predictedScore = Math.max(
    25,
    Math.min(99, Math.round(compositeScore + trendAdjustment * 0.5))
  );

  const expectedGrade = calculateGrade(predictedScore);

  // Confidence Calculation:
  // Confidence is high if data is coherent, slightly lower if high variance between attendance and exams
  const variance = Math.abs(student.attendancePercent - student.internalMarks);
  const confidence = Math.max(76, Math.min(96, Math.round(92 - variance * 0.3)));

  // Trend detection
  let trend: 'improving' | 'declining' | 'stable' = 'stable';
  if (student.internalMarks > student.previousSemesterScore + 3) {
    trend = 'improving';
  } else if (student.internalMarks < student.previousSemesterScore - 3) {
    trend = 'declining';
  }

  // Factors breakdown
  const factors: PredictionFactor[] = [
    {
      name: 'Attendance',
      score: student.attendancePercent,
      weight: settings.attendanceWeight,
      impact: student.attendancePercent >= 80 ? 'positive' : student.attendancePercent < 70 ? 'negative' : 'neutral',
      explanation: student.attendancePercent >= 80 
        ? `Consistent attendance (${student.attendancePercent}%) supports subject mastery.`
        : `Attendance (${student.attendancePercent}%) is below the institutional threshold of 75%.`,
    },
    {
      name: 'Internal Exam Marks',
      score: student.internalMarks,
      weight: settings.marksWeight,
      impact: student.internalMarks >= 75 ? 'positive' : student.internalMarks < 60 ? 'negative' : 'neutral',
      explanation: student.internalMarks >= 75
        ? `Solid internal assessment score (${student.internalMarks}%).`
        : `Internal marks (${student.internalMarks}%) indicate gaps in fundamental topics.`,
    },
    {
      name: 'Assignment Submissions',
      score: student.assignmentScore,
      weight: settings.assignmentsWeight,
      impact: student.assignmentScore >= 75 ? 'positive' : student.assignmentScore < 65 ? 'negative' : 'neutral',
      explanation: student.assignmentScore >= 75
        ? `High assignment completion rate (${student.assignmentScore}%).`
        : `Assignment submission consistency is sub-optimal (${student.assignmentScore}%).`,
    },
    {
      name: 'Class Participation',
      score: student.participationScore,
      weight: settings.participationWeight,
      impact: student.participationScore >= 70 ? 'positive' : student.participationScore < 50 ? 'negative' : 'neutral',
      explanation: student.participationScore >= 70
        ? `Engaged and active in classroom discussions (${student.participationScore}%).`
        : `Participation score is low (${student.participationScore}%); student rarely interacts in class.`,
    },
    {
      name: 'Previous Academic Performance',
      score: student.previousSemesterScore,
      weight: settings.previousPerformanceWeight,
      impact: student.previousSemesterScore >= 70 ? 'positive' : 'neutral',
      explanation: `Previous semester baseline was ${student.previousSemesterScore}%.`,
    },
  ];

  // Explainable AI Insights (Why this prediction?)
  const explanations: string[] = [];
  
  if (student.attendancePercent < classAverageAttendance) {
    const diff = (classAverageAttendance - student.attendancePercent).toFixed(1);
    explanations.push(`Attendance is ${diff}% below the class average of ${classAverageAttendance}%.`);
  } else {
    explanations.push(`Attendance is steady at ${student.attendancePercent}%, exceeding class benchmark.`);
  }

  if (student.assignmentScore < 70) {
    explanations.push('Recent assignment submissions show delays or incomplete technical deliverables.');
  } else {
    explanations.push('Assignment performance indicates diligent independent problem solving.');
  }

  if (trend === 'declining') {
    explanations.push(`Internal assessments show a decline compared to previous semester (${student.previousSemesterScore}% → ${student.internalMarks}%).`);
  } else if (trend === 'improving') {
    explanations.push(`Internal test scores demonstrate positive upward recovery (+${(student.internalMarks - student.previousSemesterScore).toFixed(0)}%).`);
  } else {
    explanations.push('Academic performance has maintained a consistent pattern across evaluation cycles.');
  }

  if (student.participationScore < 55) {
    explanations.push('Classroom participation is lower than recommended, signaling reduced engagement.');
  }

  if (student.previousSemesterScore >= 70 && student.internalMarks < 65) {
    explanations.push('Previous academic history proves student possesses underlying capability; current dip is addressable.');
  }

  // Generate Personalized Recommendations
  const recommendations: Recommendation[] = [];
  const now = new Date().toISOString();

  if (student.attendancePercent < 75) {
    recommendations.push({
      id: `rec-att-${student.id}`,
      studentId: student.id,
      studentName: student.name,
      rollNumber: student.rollNumber,
      type: 'ATTENDANCE',
      title: 'Attendance Alert & Counseling',
      message: `Attendance is currently ${student.attendancePercent}%. University guidelines require at least 75% to appear for final examinations.`,
      suggestedAction: 'Schedule an academic attendance review and send notification to student & guardian.',
      priority: student.attendancePercent < 65 ? 'HIGH' : 'MEDIUM',
      status: 'PENDING',
      createdAt: now,
    });
  }

  if (student.assignmentScore < 70) {
    recommendations.push({
      id: `rec-asgn-${student.id}`,
      studentId: student.id,
      studentName: student.name,
      rollNumber: student.rollNumber,
      type: 'ASSIGNMENT',
      title: 'Assignment Remediation Support',
      message: `Assignment completion score stands at ${student.assignmentScore}%. Delays noted in lab assignments.`,
      suggestedAction: 'Assign teaching assistant office hours for technical doubt clearing on pending submissions.',
      priority: 'MEDIUM',
      status: 'PENDING',
      createdAt: now,
    });
  }

  if (student.internalMarks < 60) {
    recommendations.push({
      id: `rec-sub-${student.id}`,
      studentId: student.id,
      studentName: student.name,
      rollNumber: student.rollNumber,
      type: 'SUBJECT_SUPPORT',
      title: 'Targeted Core Subject Tutoring',
      message: `Internal exam scores (${student.internalMarks}%) indicate conceptual hurdles in core technical topics.`,
      suggestedAction: 'Enroll student in weekly remedial problem-solving modules and provide revision problem sheets.',
      priority: 'HIGH',
      status: 'PENDING',
      createdAt: now,
    });
  }

  if (riskLevel === 'High') {
    recommendations.push({
      id: `rec-ment-${student.id}`,
      studentId: student.id,
      studentName: student.name,
      rollNumber: student.rollNumber,
      type: 'MENTORING',
      title: 'Faculty Advisor 1-on-1 Mentorship',
      message: 'Student exhibits compound risk factors across attendance, marks, and engagement.',
      suggestedAction: 'Conduct a personal 1-on-1 mentorship session with Dr. Ananya Rao to create a structured recovery plan.',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      createdAt: now,
    });
  } else if (trend === 'improving' && student.internalMarks >= 70) {
    recommendations.push({
      id: `rec-pos-${student.id}`,
      studentId: student.id,
      studentName: student.name,
      rollNumber: student.rollNumber,
      type: 'REINFORCEMENT',
      title: 'Academic Progress Commendation',
      message: `Scores improved notably over the previous period (+${(student.internalMarks - student.previousSemesterScore).toFixed(0)}%).`,
      suggestedAction: 'Provide positive faculty reinforcement and encourage participation in peer tutoring or advanced seminar topics.',
      priority: 'LOW',
      status: 'COMPLETED',
      createdAt: now,
    });
  }

  const prediction: PredictionResult = {
    id: `pred-${student.id}`,
    studentId: student.id,
    predictedScore,
    expectedGrade,
    confidence,
    riskScore,
    riskLevel,
    trend,
    explanations,
    factors,
    createdAt: now,
  };

  return { prediction, recommendations };
}
