import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  User, 
  BookOpen, 
  Calendar, 
  FileText, 
  GraduationCap, 
  MessageCircle,
  ChevronLeft,
  School
} from "lucide-react";

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

// Sidebar navigation items
const sidebarItems = [
  { title: "Profil", url: "/profile", icon: User },
  { title: "Fanlar", url: "/subjects", icon: BookOpen },
  { title: "Jadvallar", url: "/schedule", icon: Calendar },
  { title: "Uy vazifalari", url: "/homework", icon: FileText },
  { title: "Baholar", url: "/grades", icon: GraduationCap },
  { title: "Xabarlar", url: "/messages", icon: MessageCircle },
];

interface AppSidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export function AppSidebar({ collapsed = false, onToggle }: AppSidebarProps) {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path || (path === "/" && currentPath === "/");

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
                <h1 className="font-bold text-lg text-gradient-primary">EduSpace</h1>
                <p className="text-xs text-muted-foreground">Ta'lim tizimi</p>
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
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            Asosiy menyu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {sidebarItems.map((item) => (
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
      </SidebarContent>

      {/* Sidebar Footer */}
      <SidebarFooter className="p-4 border-t border-border">
        <div className={`flex items-center gap-3 p-3 rounded-xl bg-muted ${collapsed ? "justify-center" : ""}`}>
          <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center">
            <User className="h-4 w-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-foreground truncate">Foydalanuvchi</p>
              <p className="text-xs text-muted-foreground truncate">O'quvchi</p>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}