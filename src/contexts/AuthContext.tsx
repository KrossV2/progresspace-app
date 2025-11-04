import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'student' | 'teacher' | 'parent' | 'admin' | 'director';

export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  class?: string;
  subject?: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  class?: string;
  subject?: string;
}

interface StoredUser extends User {
  password: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Создаем демо пользователей если их нет
    const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    if (existingUsers.length === 0) {
      const demoUsers: StoredUser[] = [
        {
          id: '1',
          email: 'teacher@school.uz',
          username: 'teacher',
          password: '123',
          firstName: 'Malika',
          lastName: 'Aliyeva',
          role: 'teacher',
          subject: 'Matematika',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          email: 'student@school.uz',
          username: 'student',
          password: '123',
          firstName: 'Aziz',
          lastName: 'Karimov',
          role: 'student',
          class: '10-A',
          createdAt: new Date().toISOString()
        },
        {
          id: '3',
          email: 'admin@school.uz',
          username: 'admin',
          password: '123',
          firstName: 'Admin',
          lastName: 'User',
          role: 'admin',
          createdAt: new Date().toISOString()
        }
      ];
      localStorage.setItem('registeredUsers', JSON.stringify(demoUsers));
    }
      // В AuthContext.tsx
const logout = () => {
  setUser(null);
  localStorage.removeItem('currentUser');
  localStorage.removeItem('authToken'); // если используете
  // Очищаем все связанные данные
  localStorage.removeItem('userData');
  localStorage.removeItem('userRole');
};
    // Проверяем, есть ли пользователь в localStorage при загрузке
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      // Имитация запроса к API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Получаем всех пользователей из localStorage
      const users: StoredUser[] = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      
      // Ищем пользователя по email или username
      const foundUser = users.find((u: StoredUser) => 
        (u.email === email || u.username === email) && u.password === password
      );

      if (foundUser) {
        const { password: _, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
        setLoading(false);
        return true;
      } else {
        setLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoading(false);
      return false;
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    setLoading(true);
    try {
      // Имитация запроса к API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Получаем существующих пользователей
      const existingUsers: StoredUser[] = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      
      // Проверяем, нет ли пользователя с таким email или username
      const userExists = existingUsers.some((u: StoredUser) => 
        u.email === userData.email || u.username === userData.username
      );

      if (userExists) {
        setLoading(false);
        return false;
      }

      // Создаем нового пользователя
      const newUser: StoredUser = {
        id: Date.now().toString(),
        ...userData,
        createdAt: new Date().toISOString()
      };

      // Сохраняем пользователя
      const updatedUsers = [...existingUsers, newUser];
      localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));

      // Автоматически логиним пользователя
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));

      setLoading(false);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};