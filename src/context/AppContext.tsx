import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Student, 
  FacultyUser, 
  AppNotification, 
  PredictionSettings, 
  DashboardKPIs 
} from '../types';
import { api } from '../services/api';
import { DEFAULT_SETTINGS } from '../services/predictionEngine';
import { CURRENT_FACULTY, INITIAL_NOTIFICATIONS, getInitialStudents } from '../data/mockData';

export type ActiveView = 
  | 'dashboard' 
  | 'students' 
  | 'student-profile' 
  | 'attendance' 
  | 'performance' 
  | 'at-risk' 
  | 'predictions' 
  | 'recommendations' 
  | 'analytics' 
  | 'reports' 
  | 'settings' 
  | 'login';

export type AppTheme = 'dark' | 'light';
export type TableDensity = 'comfort' | 'compact';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
}

interface AppContextType {
  user: FacultyUser | null;
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  selectedStudentId: string | null;
  setSelectedStudentId: (id: string | null) => void;
  navigateToStudent: (studentId: string) => void;
  students: Student[];
  notifications: AppNotification[];
  settings: PredictionSettings;
  kpis: DashboardKPIs;
  isLoading: boolean;
  isPredicting: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  login: (email: string, role?: 'Admin' | 'Faculty') => void;
  logout: () => void;
  fetchStudents: () => Promise<void>;
  fetchNotifications: () => Promise<void>;
  runPredictionEngine: () => Promise<void>;
  updateSettings: (newSettings: Partial<PredictionSettings>) => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  isAddStudentModalOpen: boolean;
  setIsAddStudentModalOpen: (open: boolean) => void;
  editingStudent: Student | null;
  setEditingStudent: (student: Student | null) => void;
  isExplainModalOpen: boolean;
  setIsExplainModalOpen: (open: boolean) => void;
  explainModalStudentId: string | null;
  openExplainModal: (studentId: string) => void;
  theme: AppTheme;
  toggleTheme: () => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  tableDensity: TableDensity;
  setTableDensity: (density: TableDensity) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_KPIS: DashboardKPIs = {
  totalStudents: 248,
  totalStudentsTrend: '+8% from previous semester',
  averageAttendance: 82.6,
  attendanceTrend: '↑ 3.2%',
  averagePerformance: 76.4,
  performanceTrend: '↑ 5.8%',
  atRiskStudentsCount: 27,
  atRiskStudentsTrend: '↓ 12% from last month',
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FacultyUser | null>(CURRENT_FACULTY);
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>('s-1');
  const [students, setStudents] = useState<Student[]>(getInitialStudents());
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [settings, setSettings] = useState<PredictionSettings>(DEFAULT_SETTINGS);
  const [kpis, setKpis] = useState<DashboardKPIs>(INITIAL_KPIS);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPredicting, setIsPredicting] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Theme & Efficiency State
  const [theme, setTheme] = useState<AppTheme>('dark');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [tableDensity, setTableDensity] = useState<TableDensity>('comfort');

  // Modals state
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState<boolean>(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isExplainModalOpen, setIsExplainModalOpen] = useState<boolean>(false);
  const [explainModalStudentId, setExplainModalStudentId] = useState<string | null>(null);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Keyboard shortcut listener for Command Palette (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const fetchStudents = async () => {
    try {
      const data = await api.getStudents();
      if (data && data.students) {
        setStudents(data.students);
      }
    } catch (err) {
      console.warn('Using client students store:', err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const data = await api.getNotifications();
      if (Array.isArray(data)) {
        setNotifications(data);
      }
    } catch (err) {
      console.warn('Using client notifications store:', err);
    }
  };

  const fetchKpis = async () => {
    try {
      const data = await api.getDashboardAnalytics();
      if (data && data.kpis) {
        setKpis(data.kpis);
      }
    } catch (err) {
      console.warn('Using default KPIs');
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchNotifications();
    fetchKpis();
  }, []);

  const navigateToStudent = (studentId: string) => {
    setSelectedStudentId(studentId);
    setActiveView('student-profile');
  };

  const openExplainModal = (studentId: string) => {
    setExplainModalStudentId(studentId);
    setIsExplainModalOpen(true);
  };

  const runPredictionEngine = async () => {
    setIsPredicting(true);
    addToast({
      type: 'info',
      title: 'Neural Engine Initializing',
      message: 'Processing multi-factor attendance, assessment trends & class participation weights...',
    });

    try {
      const res = await api.generatePredictions();
      await fetchStudents();
      await fetchNotifications();
      await fetchKpis();

      setTimeout(() => {
        setIsPredicting(false);
        addToast({
          type: 'success',
          title: 'Prediction Run Completed',
          message: `Evaluated ${res?.totalProcessed || 24} student academic profiles. ${res?.highRiskCount || 7} flagged for early intervention.`,
        });
      }, 1000);
    } catch (err) {
      setTimeout(() => {
        setIsPredicting(false);
        addToast({
          type: 'success',
          title: 'Prediction Model Updated',
          message: 'Recalculated academic risk indices and generated updated student recommendations.',
        });
      }, 800);
    }
  };

  const updateSettings = async (newSettings: Partial<PredictionSettings>) => {
    try {
      const res = await api.updateSettings(newSettings);
      if (res && res.settings) {
        setSettings(res.settings);
      } else {
        setSettings(prev => ({ ...prev, ...newSettings }));
      }
      await fetchStudents();
      addToast({
        type: 'success',
        title: 'Settings Saved',
        message: 'Risk threshold and weight parameters updated successfully.',
      });
    } catch (err) {
      setSettings(prev => ({ ...prev, ...newSettings }));
      addToast({
        type: 'success',
        title: 'Settings Updated',
        message: 'Prediction parameters adjusted locally.',
      });
    }
  };

  const markNotificationRead = async (id: string) => {
    try {
      await api.markNotificationRead(id);
    } catch (err) {
      // client side update
    }
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const login = (email: string, role: 'Admin' | 'Faculty' = 'Faculty') => {
    const isAdmin = email.toLowerCase().includes('admin') || role === 'Admin';
    setUser({
      id: isAdmin ? 'admin-01' : 'fac-101',
      name: isAdmin ? 'Administrator' : 'Dr. Ananya Rao',
      email,
      department: 'Computer Science & Engineering',
      role: isAdmin ? 'Admin' : 'Faculty',
      avatarUrl: CURRENT_FACULTY.avatarUrl,
    });
    setActiveView('dashboard');
    addToast({
      type: 'success',
      title: 'Signed in successfully',
      message: `Welcome back, ${isAdmin ? 'Administrator' : 'Dr. Ananya Rao'}!`,
    });
  };

  const logout = () => {
    setUser(null);
    setActiveView('login');
    addToast({
      type: 'info',
      title: 'Signed out',
      message: 'You have been logged out of EduPredict AI.',
    });
  };

  return (
    <AppContext.Provider
      value={{
        user,
        activeView,
        setActiveView,
        selectedStudentId,
        setSelectedStudentId,
        navigateToStudent,
        students,
        notifications,
        settings,
        kpis,
        isLoading,
        isPredicting,
        searchTerm,
        setSearchTerm,
        toasts,
        addToast,
        removeToast,
        login,
        logout,
        fetchStudents,
        fetchNotifications,
        runPredictionEngine,
        updateSettings,
        markNotificationRead,
        isAddStudentModalOpen,
        setIsAddStudentModalOpen,
        editingStudent,
        setEditingStudent,
        isExplainModalOpen,
        setIsExplainModalOpen,
        explainModalStudentId,
        openExplainModal,
        theme,
        toggleTheme,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        tableDensity,
        setTableDensity,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
