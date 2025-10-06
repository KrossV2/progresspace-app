import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { TopHeader } from "./TopHeader";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
        
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Header - Always visible */}
          <TopHeader />
          
          {/* Main Content */}
          <main className="flex-1 p-6 overflow-auto bg-gradient-to-br from-background via-secondary/20 to-accent/10">
            <div className="container mx-auto max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}