import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'uz' | 'ru' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  uz: {
    // Navigation
    'nav.dashboard': 'Bosh sahifa',
    'nav.profile': 'Profil',
    'nav.subjects': 'Fanlar',
    'nav.schedule': 'Jadval',
    'nav.homework': 'Uy vazifalari',
    'nav.grades': 'Baholar',
    'nav.students': 'O\'quvchilar',
    'nav.teachers': 'O\'qituvchilar',
    'nav.classes': 'Sinflar',
    'nav.reports': 'Hisobotlar',
    'nav.settings': 'Sozlamalar',
    'nav.announcements': 'E\'lonlar',
    'nav.attendance': 'Davomat',
    'nav.children': 'Farzandlarim',
    'nav.regions': 'Viloyatlar',
    'nav.cities': 'Shaharlar',
    'nav.schools': 'Maktablar',
    'nav.users': 'Foydalanuvchilar',
    'nav.directors': 'Direktorlar',
    'nav.timetables': 'Dars jadvali',
    'nav.grade_requests': 'Baho so\'rovlari',
    'nav.statistics': 'Statistika',
    'nav.homeworks': 'Uy vazifalari',
    'nav.parents': 'Ota-onalar',
    'nav.behaviors': 'Xulq-atvor',
    'nav.notifications': 'Xabarlar',
    
    // User roles
    'role.student': 'O\'quvchi',
    'role.teacher': 'O\'qituvchi',
    'role.parent': 'Ota-ona',
    'role.admin': 'Administrator',
    'role.director': 'Direktor',
    
    // Common
    'app.name': 'EduSpace',
    'app.subtitle': 'Ta\'lim tizimi',
    'menu.main': 'Asosiy menyu',
    'menu.management': 'Boshqaruv',
    'menu.academic': 'Ta\'lim',
  },
  
  ru: {
    // Navigation
    'nav.dashboard': 'Главная',
    'nav.profile': 'Профиль',
    'nav.subjects': 'Предметы',
    'nav.schedule': 'Расписание',
    'nav.homework': 'Домашние задания',
    'nav.grades': 'Оценки',
    'nav.students': 'Ученики',
    'nav.teachers': 'Учителя',
    'nav.classes': 'Классы',
    'nav.reports': 'Отчеты',
    'nav.settings': 'Настройки',
    'nav.announcements': 'Объявления',
    'nav.attendance': 'Посещаемость',
    'nav.children': 'Мои дети',
    'nav.regions': 'Регионы',
    'nav.cities': 'Города',
    'nav.schools': 'Школы',
    'nav.users': 'Пользователи',
    'nav.directors': 'Директора',
    'nav.timetables': 'Расписание',
    'nav.grade_requests': 'Запросы оценок',
    'nav.statistics': 'Статистика',
    'nav.homeworks': 'Домашние задания',
    'nav.parents': 'Родители',
    'nav.behaviors': 'Поведение',
    'nav.notifications': 'Уведомления',
    
    // User roles
    'role.student': 'Ученик',
    'role.teacher': 'Учитель',
    'role.parent': 'Родитель',
    'role.admin': 'Администратор',
    'role.director': 'Директор',
    
    // Common
    'app.name': 'EduSpace',
    'app.subtitle': 'Система образования',
    'menu.main': 'Главное меню',
    'menu.management': 'Управление',
    'menu.academic': 'Образование',
  },
  
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.profile': 'Profile',
    'nav.subjects': 'Subjects',
    'nav.schedule': 'Schedule',
    'nav.homework': 'Homework',
    'nav.grades': 'Grades',
    'nav.students': 'Students',
    'nav.teachers': 'Teachers',
    'nav.classes': 'Classes',
    'nav.reports': 'Reports',
    'nav.settings': 'Settings',
    'nav.announcements': 'Announcements',
    'nav.attendance': 'Attendance',
    'nav.children': 'My Children',
    'nav.regions': 'Regions',
    'nav.cities': 'Cities',
    'nav.schools': 'Schools',
    'nav.users': 'Users',
    'nav.directors': 'Directors',
    'nav.timetables': 'Timetables',
    'nav.grade_requests': 'Grade Requests',
    'nav.statistics': 'Statistics',
    'nav.homeworks': 'Homeworks',
    'nav.parents': 'Parents',
    'nav.behaviors': 'Behaviors',
    'nav.notifications': 'Notifications',
    
    // User roles
    'role.student': 'Student',
    'role.teacher': 'Teacher',
    'role.parent': 'Parent',
    'role.admin': 'Administrator',
    'role.director': 'Director',
    
    // Common
    'app.name': 'EduSpace',
    'app.subtitle': 'Education System',
    'menu.main': 'Main Menu',
    'menu.management': 'Management',
    'menu.academic': 'Academic',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('uz');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}