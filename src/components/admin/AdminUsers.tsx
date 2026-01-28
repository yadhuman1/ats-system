import { useAuth } from '@/contexts/AuthContext';
import { KPICard } from '@/components/ui/KPICard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, UserCheck, UserX } from 'lucide-react';
import { timeAgo, getPresenceStatus } from '@/lib/utils';

export function AdminUsers() {
  const { users } = useAuth();

  const stats = {
    total: users.length,
    online: users.filter(u => getPresenceStatus(u.lastAction).status === 'online').length,
    offline: users.filter(u => getPresenceStatus(u.lastAction).status !== 'online').length
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-destructive/10 text-destructive';
      case 'hr': return 'bg-accent/10 text-accent';
      default: return 'bg-success/10 text-success';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">User Management</h1>
        <p className="text-muted-foreground">Monitor and manage system users</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <KPICard title="Total Users" value={stats.total} icon={Users} variant="accent" />
        <KPICard title="Online" value={stats.online} icon={UserCheck} variant="success" />
        <KPICard title="Offline" value={stats.offline} icon={UserX} variant="default" />
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-center">Role</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Last Login</TableHead>
                <TableHead className="text-center">Sessions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => {
                const presence = getPresenceStatus(u.lastAction);
                return (
                  <TableRow key={u.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-semibold">
                          {u.name.charAt(0)}
                        </div>
                        <span className="font-medium">{u.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{u.email}</TableCell>
                    <TableCell className="text-center">
                      <Badge className={getRoleBadgeClass(u.role)}>
                        {u.role.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${presence.color}`} />
                        <span className="text-sm capitalize">{presence.status}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center text-sm text-muted-foreground">
                      {timeAgo(u.lastLogin)}
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {u.totalSessions}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
