import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'student' | 'teacher' | 'parent' | 'admin' | 'director';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
  email?: string;
  class?: string; // for students
  subject?: string; // for teachers
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  switchRole: (role: UserRole) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Demo users for different roles
const demoUsers: Record<UserRole, User> = {
  student: {
    id: '1',
    firstName: 'Aziz',
    lastName: 'Karimov',
    role: 'student',
    email: 'aziz.karimov@school.uz',
    class: '10-A'
  },
  teacher: {
    id: '2',
    firstName: 'Nilufar',
    lastName: 'Karimova',
    role: 'teacher',
    email: 'nilufar.karimova@school.uz',
    subject: 'Matematika'
  },
  parent: {
    id: '3',
    firstName: 'Rustam',
    lastName: 'Karimov',
    role: 'parent',
    email: 'rustam.karimov@email.uz'
  },
  admin: {
    id: '4',
    firstName: 'Oybek',
    lastName: 'Nazarov',
    role: 'admin',
    email: 'oybek.nazarov@school.uz'
  },
  director: {
    id: '5',
    firstName: 'Malika',
    lastName: 'Usmanova',
    role: 'director',
    email: 'malika.usmanova@school.uz'
  }
};

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(demoUsers.admin);

  const switchRole = (role: UserRole) => {
    setUser(demoUsers[role]);
  };

  return (
    <UserContext.Provider value={{ user, setUser, switchRole }}>
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