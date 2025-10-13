// contexts/app-data-context.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface AttendanceRecord {
  id: number;
  studentId: number;
  studentName: string;
  date: string;
  subject: string;
  teacher: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  time?: string;
  notes?: string;
}

export interface GradeRecord {
  id: number;
  studentId: number;
  studentName: string;
  date: string;
  subject: string;
  teacher: string;
  grade: number;
  type: 'test' | 'homework' | 'classwork' | 'exam';
  topic: string;
  notes?: string;
}

export interface BehaviorRecord {
  id: number;
  studentId: number;
  studentName: string;
  date: string;
  type: 'positive' | 'negative' | 'neutral';
  category: string;
  teacher: string;
  description: string;
  points: number;
  subject?: string;
}

interface AppDataContextType {
  // Attendance
  attendanceRecords: AttendanceRecord[];
  addAttendanceRecord: (record: Omit<AttendanceRecord, 'id'>) => void;
  updateAttendanceRecord: (id: number, record: Partial<AttendanceRecord>) => void;
  deleteAttendanceRecord: (id: number) => void;
  
  // Grades
  gradeRecords: GradeRecord[];
  addGradeRecord: (record: Omit<GradeRecord, 'id'>) => void;
  updateGradeRecord: (id: number, record: Partial<GradeRecord>) => void;
  deleteGradeRecord: (id: number) => void;
  
  // Behavior
  behaviorRecords: BehaviorRecord[];
  addBehaviorRecord: (record: Omit<BehaviorRecord, 'id'>) => void;
  updateBehaviorRecord: (id: number, record: Partial<BehaviorRecord>) => void;
  deleteBehaviorRecord: (id: number) => void;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export const AppDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [gradeRecords, setGradeRecords] = useState<GradeRecord[]>([]);
  const [behaviorRecords, setBehaviorRecords] = useState<BehaviorRecord[]>([]);

  // Attendance methods
  const addAttendanceRecord = (record: Omit<AttendanceRecord, 'id'>) => {
    const newRecord: AttendanceRecord = {
      ...record,
      id: Date.now(),
    };
    setAttendanceRecords(prev => [...prev, newRecord]);
  };

  const updateAttendanceRecord = (id: number, record: Partial<AttendanceRecord>) => {
    setAttendanceRecords(prev => 
      prev.map(item => item.id === id ? { ...item, ...record } : item)
    );
  };

  const deleteAttendanceRecord = (id: number) => {
    setAttendanceRecords(prev => prev.filter(item => item.id !== id));
  };

  // Grades methods
  const addGradeRecord = (record: Omit<GradeRecord, 'id'>) => {
    const newRecord: GradeRecord = {
      ...record,
      id: Date.now(),
    };
    setGradeRecords(prev => [...prev, newRecord]);
  };

  const updateGradeRecord = (id: number, record: Partial<GradeRecord>) => {
    setGradeRecords(prev => 
      prev.map(item => item.id === id ? { ...item, ...record } : item)
    );
  };

  const deleteGradeRecord = (id: number) => {
    setGradeRecords(prev => prev.filter(item => item.id !== id));
  };

  // Behavior methods
  const addBehaviorRecord = (record: Omit<BehaviorRecord, 'id'>) => {
    const newRecord: BehaviorRecord = {
      ...record,
      id: Date.now(),
    };
    setBehaviorRecords(prev => [...prev, newRecord]);
  };

  const updateBehaviorRecord = (id: number, record: Partial<BehaviorRecord>) => {
    setBehaviorRecords(prev => 
      prev.map(item => item.id === id ? { ...item, ...record } : item)
    );
  };

  const deleteBehaviorRecord = (id: number) => {
    setBehaviorRecords(prev => prev.filter(item => item.id !== id));
  };

  return (
    <AppDataContext.Provider value={{
      attendanceRecords,
      addAttendanceRecord,
      updateAttendanceRecord,
      deleteAttendanceRecord,
      gradeRecords,
      addGradeRecord,
      updateGradeRecord,
      deleteGradeRecord,
      behaviorRecords,
      addBehaviorRecord,
      updateBehaviorRecord,
      deleteBehaviorRecord,
    }}>
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (context === undefined) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return context;
};