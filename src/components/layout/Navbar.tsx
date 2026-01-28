import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Bot, LogOut } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function Navbar() {
  const { user, logout } = useAuth();

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'hr': return 'default';
      default: return 'secondary';
    }
  };

  return (
    <header className="h-16 gradient-primary border-b border-sidebar-border flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 gradient-accent rounded-lg flex items-center justify-center">
          <Bot className="w-5 h-5 text-primary" />
        </div>
        <span className="text-lg font-bold text-primary-foreground">Smart ATS</span>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-primary-foreground">{user?.name}</p>
            <Badge variant={getRoleBadgeVariant(user?.role || '')} className="text-[10px] uppercase">
              {user?.role}
            </Badge>
          </div>
          <div className="w-9 h-9 rounded-full bg-sidebar-accent flex items-center justify-center text-primary-foreground font-semibold text-sm">
            {user?.name?.charAt(0)}
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={logout}
          className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-sidebar-accent"
        >
          <LogOut className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </header>
  );
}
