import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  User, 
  BookOpen, 
  Calendar, 
  FileText, 
  GraduationCap, 
  ChevronLeft,
  School,
  Users,
  UserCheck,
  BarChart3,
  Settings,
  Megaphone,
  ClipboardCheck,
  Baby,
  MapPin,
  Building
} from "lucide-react";
import { useUser, UserRole } from "@/contexts/UserContext";
import { useLanguage } from "@/contexts/LanguageContext";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter
} from "@/components/ui/sidebar";

// Role-based navigation items
const getRoleBasedItems = (role: UserRole, t: (key: string) => string) => {
  const commonItems = [
    { title: t('nav.profile'), url: "/profile", icon: User, group: "main" },
  ];

  const roleSpecificItems = {
    student: [
      { title: t('nav.attendance'), url: "/student/attendance", icon: ClipboardCheck, group: "academic" },
      { title: t('nav.grades'), url: "/student/grades", icon: GraduationCap, group: "academic" },
      { title: t('nav.homeworks'), url: "/student/homeworks", icon: FileText, group: "academic" },
      { title: t('nav.timetables'), url: "/student/timetables", icon: Calendar, group: "academic" },
      { title: t('nav.behaviors'), url: "/student/behaviors", icon: BarChart3, group: "academic" },
      { title: t('nav.notifications'), url: "/student/notifications", icon: Megaphone, group: "academic" },
    ],
    teacher: [
      { title: t('nav.homeworks'), url: "/teacher/homeworks", icon: FileText, group: "academic" },
      { title: t('nav.grades'), url: "/teacher/grades", icon: GraduationCap, group: "academic" },
      { title: t('nav.attendance'), url: "/teacher/attendance", icon: ClipboardCheck, group: "management" },
      { title: t('nav.students'), url: "/teacher/students", icon: Users, group: "management" },
      { title: t('nav.parents'), url: "/teacher/parents", icon: Baby, group: "management" },
    ],
    parent: [
      { title: t('nav.children'), url: "/parent/children", icon: Baby, group: "academic" },
      { title: t('nav.attendance'), url: "/parent/attendance", icon: ClipboardCheck, group: "academic" },
      { title: t('nav.behaviors'), url: "/parent/behaviors", icon: BarChart3, group: "academic" },
      { title: t('nav.grades'), url: "/parent/grades", icon: GraduationCap, group: "academic" },
      { title: t('nav.timetables'), url: "/parent/timetables", icon: Calendar, group: "academic" },
    ],
    admin: [
      { title: t('nav.regions'), url: "/admin/regions", icon: MapPin, group: "management" },
      { title: t('nav.cities'), url: "/admin/cities", icon: Building, group: "management" },
      { title: t('nav.schools'), url: "/admin/schools", icon: School, group: "management" },
      { title: t('nav.subjects'), url: "/admin/subjects", icon: BookOpen, group: "management" },
      { title: t('nav.users'), url: "/admin/users", icon: Users, group: "management" },
      { title: t('nav.directors'), url: "/admin/directors", icon: UserCheck, group: "management" },
    ],
    director: [
      { title: t('nav.classes'), url: "/director/classes", icon: School, group: "management" },
      { title: t('nav.teachers'), url: "/director/teachers", icon: UserCheck, group: "management" },
      { title: t('nav.timetables'), url: "/director/timetables", icon: Calendar, group: "management" },
      { title: t('nav.grade_requests'), url: "/director/grade-requests", icon: FileText, group: "management" },
      { title: t('nav.statistics'), url: "/director/statistics", icon: BarChart3, group: "management" },
    ],
  };

  return [...commonItems, ...roleSpecificItems[role]];
};

interface AppSidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export function AppSidebar({ collapsed = false, onToggle }: AppSidebarProps) {
  const location = useLocation();
  const currentPath = location.pathname;
  const { user } = useUser();
  const { t } = useLanguage();

  const isActive = (path: string) => currentPath === path || (path === "/" && currentPath === "/");
  
  if (!user) return null;
  
  const sidebarItems = getRoleBasedItems(user.role, t);
  const groupedItems = sidebarItems.reduce((acc, item) => {
    const group = item.group || 'main';
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {} as Record<string, typeof sidebarItems>);

  return (
    <Sidebar 
      className={`
        ${collapsed ? "w-16" : "w-72"} 
        transition-all duration-300 ease-in-out
        bg-gradient-card border-r border-border
        flex flex-col h-screen
      `}
      collapsible="icon"
    >
      {/* Sidebar Header */}
      <SidebarHeader className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground">
              <School className="h-6 w-6" />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <h1 className="font-bold text-lg text-gradient-primary">{t('app.name')}</h1>
                <p className="text-xs text-muted-foreground">{t('app.subtitle')}</p>
              </div>
            )}
          </div>
          {onToggle && (
            <button
              onClick={onToggle}
              className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
            >
              <ChevronLeft className={`h-4 w-4 transition-transform ${collapsed ? "rotate-180" : ""}`} />
            </button>
          )}
        </div>
      </SidebarHeader>

      {/* Sidebar Content */}
      <SidebarContent className="flex-1 px-4 py-6">
        {Object.entries(groupedItems).map(([groupName, items]) => (
          <SidebarGroup key={groupName} className="mb-6">
            <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
              {groupName === 'main' ? t('menu.main') : 
               groupName === 'management' ? t('menu.management') : 
               groupName === 'academic' ? t('menu.academic') : groupName}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group
                          ${isActive 
                            ? "bg-primary text-primary-foreground shadow-md" 
                            : "hover:bg-secondary hover:shadow-sm"
                          }
                          ${collapsed ? "justify-center" : ""}
                          `
                        }
                      >
                        <item.icon className={`h-5 w-5 ${collapsed ? "" : "group-hover:scale-110 transition-transform"}`} />
                        {!collapsed && (
                          <span className="font-medium truncate">{item.title}</span>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* Sidebar Footer */}
      <SidebarFooter className="p-4 border-t border-border">
        <div className={`flex items-center gap-3 p-3 rounded-xl bg-muted ${collapsed ? "justify-center" : ""}`}>
          <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-semibold text-sm">
            {user.firstName[0]}{user.lastName[0]}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-foreground truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {t(`role.${user.role}`)}
                {user.class && ` • ${user.class}`}
                {user.subject && ` • ${user.subject}`}
              </p>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}