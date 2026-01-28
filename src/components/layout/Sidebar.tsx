import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Upload, History, LayoutDashboard, Kanban, BarChart3, Users } from 'lucide-react';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

const menuItems = {
  candidate: [
    { id: 'upload', label: 'Upload Resume', icon: Upload },
    { id: 'history', label: 'My History', icon: History }
  ],
  hr: [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'pipeline', label: 'Pipeline', icon: Kanban }
  ],
  admin: [
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'users', label: 'User Management', icon: Users }
  ]
};

export function Sidebar({ currentView, setCurrentView }: SidebarProps) {
  const { user } = useAuth();
  const items = menuItems[user?.role || 'candidate'] || [];

  return (
    <aside className="w-56 bg-sidebar border-r border-sidebar-border min-h-[calc(100vh-4rem)] p-4">
      <nav className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md" 
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
