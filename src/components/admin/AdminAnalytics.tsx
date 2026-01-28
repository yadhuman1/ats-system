import { useAuth } from '@/contexts/AuthContext';
import { KPICard } from '@/components/ui/KPICard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Users, CheckCircle2, XCircle, Star, Target, UserCheck, UserX, Briefcase, Clock } from 'lucide-react';
import { timeAgo, getPresenceStatus } from '@/lib/utils';

export function AdminAnalytics() {
  const { history, users, activityLog } = useAuth();

  const stats = {
    totalCandidates: history.length,
    totalShortlisted: history.filter(c => c.status === 'shortlisted').length,
    totalRejected: history.filter(c => c.status === 'rejected').length,
    avgScore: history.filter(c => c.score).length > 0 
      ? Math.round(history.filter(c => c.score).reduce((a, b) => a + (b.score || 0), 0) / history.filter(c => c.score).length)
      : 0,
    onlineUsers: users.filter(u => getPresenceStatus(u.lastAction).status === 'online').length,
    hrUsers: users.filter(u => u.role === 'hr').length,
    admins: users.filter(u => u.role === 'admin').length
  };

  const scoreDistribution = {
    excellent: history.filter(c => (c.score || 0) >= 80).length,
    average: history.filter(c => (c.score || 0) >= 60 && (c.score || 0) < 80).length,
    poor: history.filter(c => c.score !== null && (c.score || 0) < 60).length
  };

  const applied = history.filter(c => c.status === 'analyzed').length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        <p className="text-muted-foreground">Enterprise-wide recruitment metrics and insights</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Candidates" value={stats.totalCandidates} icon={Users} variant="accent" />
        <KPICard title="Shortlisted" value={stats.totalShortlisted} icon={CheckCircle2} variant="success" />
        <KPICard title="Rejected" value={stats.totalRejected} icon={XCircle} variant="destructive" />
        <KPICard title="Average Score" value={`${stats.avgScore}%`} icon={Star} variant="warning" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Avg JD Match" value="83%" icon={Target} variant="accent" />
        <KPICard title="Online Users" value={stats.onlineUsers} icon={UserCheck} variant="success" />
        <KPICard title="Inactive" value={users.length - stats.onlineUsers} icon={UserX} variant="default" />
        <KPICard title="HR Users" value={stats.hrUsers} icon={Briefcase} variant="accent" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Score Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Excellent (80%+)</span>
                <span className="font-bold text-success">{scoreDistribution.excellent}</span>
              </div>
              <Progress 
                value={stats.totalCandidates ? (scoreDistribution.excellent / stats.totalCandidates) * 100 : 0} 
                className="h-2 bg-muted [&>div]:bg-success"
              />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Average (60-80%)</span>
                <span className="font-bold text-warning">{scoreDistribution.average}</span>
              </div>
              <Progress 
                value={stats.totalCandidates ? (scoreDistribution.average / stats.totalCandidates) * 100 : 0} 
                className="h-2 bg-muted [&>div]:bg-warning"
              />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Poor (&lt;60%)</span>
                <span className="font-bold text-destructive">{scoreDistribution.poor}</span>
              </div>
              <Progress 
                value={stats.totalCandidates ? (scoreDistribution.poor / stats.totalCandidates) * 100 : 0} 
                className="h-2 bg-muted [&>div]:bg-destructive"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Conversion Funnel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Applied</span>
                <span className="font-bold">{applied}</span>
              </div>
              <Progress value={100} className="h-2 bg-muted [&>div]:bg-accent" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Shortlisted</span>
                <span className="font-bold text-success">{stats.totalShortlisted}</span>
              </div>
              <Progress 
                value={applied ? (stats.totalShortlisted / applied) * 100 : 0} 
                className="h-2 bg-muted [&>div]:bg-success"
              />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Rejected</span>
                <span className="font-bold text-destructive">{stats.totalRejected}</span>
              </div>
              <Progress 
                value={applied ? (stats.totalRejected / applied) * 100 : 0} 
                className="h-2 bg-muted [&>div]:bg-destructive"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">User Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-accent/5 rounded-lg">
              <span className="text-sm font-medium">Total Users</span>
              <span className="font-bold text-accent">{users.length}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-success/5 rounded-lg">
              <span className="text-sm font-medium">Online Now</span>
              <span className="font-bold text-success">{stats.onlineUsers}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">HR Users</span>
              <span className="font-bold">{stats.hrUsers}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-warning/5 rounded-lg">
              <span className="text-sm font-medium">Admins</span>
              <span className="font-bold text-warning">{stats.admins}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Latest Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {activityLog.slice(0, 10).map((log) => (
              <div key={log.id} className="flex items-start gap-3 pb-3 border-b last:border-0">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold">
                  {log.user.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{log.user}</p>
                  <p className="text-xs text-muted-foreground">{log.action}</p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {timeAgo(log.timestamp)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
