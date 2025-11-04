import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export type UserRole = 'student' | 'teacher' | 'parent' | 'admin' | 'director';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
  email: string;
  username: string;
  class?: string; // for students
  subject?: string; // for teachers
}

interface UserContextType {
  user: User | null;
  updateUser: (userData: Partial<User>) => void;
  switchRole: (role: UserRole) => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Demo users for different roles (резервные данные)
const demoUsers: Record<UserRole, User> = {
  student: {
    id: '1',
    firstName: 'Aziz',
    lastName: 'Karimov',
    role: 'student',
    email: 'student@school.uz',
    username: 'student',
    class: '10-A'
  },
  teacher: {
    id: '2',
    firstName: 'Nilufar',
    lastName: 'Karimova',
    role: 'teacher',
    email: 'teacher@school.uz',
    username: 'teacher',
    subject: 'Matematika'
  },
  parent: {
    id: '3',
    firstName: 'Rustam',
    lastName: 'Karimov',
    role: 'parent',
    email: 'parent@school.uz',
    username: 'parent'
  },
  admin: {
    id: '4',
    firstName: 'Oybek',
    lastName: 'Nazarov',
    role: 'admin',
    email: 'admin@school.uz',
    username: 'admin'
  },
  director: {
    id: '5',
    firstName: 'Malika',
    lastName: 'Usmanova',
    role: 'director',
    email: 'director@school.uz',
    username: 'director'
  }
};

export function UserProvider({ children }: { children: ReactNode }) {
  const { user: authUser, isAuthenticated } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && authUser) {
      // Используем данные из AuthContext
      const userData: User = {
        id: authUser.id,
        firstName: authUser.firstName,
        lastName: authUser.lastName,
        role: authUser.role,
        email: authUser.email,
        username: authUser.username,
        class: authUser.class,
        subject: authUser.subject
      };
      setUser(userData);
    } else {
      // Если не авторизован, сбрасываем пользователя
      setUser(null);
    }
    setIsLoading(false);
  }, [authUser, isAuthenticated]);

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      
      // Также обновляем в localStorage
      const currentUser = localStorage.getItem('currentUser');
      if (currentUser) {
        const userObj = JSON.parse(currentUser);
        const updatedUserObj = { ...userObj, ...userData };
        localStorage.setItem('currentUser', JSON.stringify(updatedUserObj));
      }
    }
  };

  const switchRole = (role: UserRole) => {
    // Для демо-режима переключаемся на демо пользователей
    // В реальном приложении это может быть не нужно
    if (process.env.NODE_ENV === 'development') {
      setUser(demoUsers[role]);
      
      // Сохраняем в localStorage для демо
      localStorage.setItem('currentUser', JSON.stringify(demoUsers[role]));
    }
  };

  const value: UserContextType = {
    user,
    updateUser,
    switchRole,
    isLoading
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}