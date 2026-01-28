import { useAuth } from '@/contexts/AuthContext';
import { KPICard } from '@/components/ui/KPICard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, FileCheck, CheckCircle2, XCircle, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export function HRDashboard() {
  const { history, updateHistoryStatus } = useAuth();

  const stats = {
    uploaded: history.filter(c => c.status === 'uploaded').length,
    analyzed: history.filter(c => c.status === 'analyzed').length,
    shortlisted: history.filter(c => c.status === 'shortlisted').length,
    rejected: history.filter(c => c.status === 'rejected').length
  };

  const analyzedCandidates = history.filter(c => c.status === 'analyzed');

  const handleAction = (id: number, action: 'shortlisted' | 'rejected') => {
    updateHistoryStatus(id, action, { hrActionAt: Date.now() });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">HR Dashboard</h1>
        <p className="text-muted-foreground">Review and manage candidate applications</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Uploaded" value={stats.uploaded} icon={Upload} variant="default" />
        <KPICard title="Analyzed" value={stats.analyzed} icon={FileCheck} variant="accent" />
        <KPICard title="Shortlisted" value={stats.shortlisted} icon={CheckCircle2} variant="success" />
        <KPICard title="Rejected" value={stats.rejected} icon={XCircle} variant="destructive" />
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Candidates to Review</CardTitle>
        </CardHeader>
        <CardContent>
          {analyzedCandidates.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileCheck className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No candidates pending review</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Resume</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-center">Score</TableHead>
                  <TableHead className="text-center">JD Match</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analyzedCandidates.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.filename}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{c.role}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-bold text-success">{c.score}%</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-bold text-accent">{c.jdMatch || 85}%</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-2">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          className="text-success hover:text-success hover:bg-success/10"
                          onClick={() => handleAction(c.id, 'shortlisted')}
                        >
                          <ThumbsUp className="w-4 h-4 mr-1" />
                          Shortlist
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleAction(c.id, 'rejected')}
                        >
                          <ThumbsDown className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
