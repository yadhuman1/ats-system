import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Clock } from 'lucide-react';
import { timeAgo, cn } from '@/lib/utils';

const statusStyles = {
  uploaded: { label: 'Uploaded', class: 'bg-muted text-muted-foreground' },
  analyzed: { label: 'Analyzed', class: 'bg-accent/10 text-accent' },
  shortlisted: { label: 'Shortlisted', class: 'bg-success/10 text-success' },
  rejected: { label: 'Rejected', class: 'bg-destructive/10 text-destructive' }
};

export function HistoryPage() {
  const { user, getUserHistory } = useAuth();
  const history = user ? getUserHistory(user.id) : [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Resume History</h1>
        <p className="text-muted-foreground">Track all your submitted resumes and their status</p>
      </div>

      {history.length === 0 ? (
        <Card className="shadow-card">
          <CardContent className="py-16 text-center">
            <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-1">No uploads yet</h3>
            <p className="text-muted-foreground">Upload your first resume to get started</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {history.map((item) => {
            const status = statusStyles[item.status] || statusStyles.uploaded;
            
            return (
              <Card key={item.id} className="shadow-card hover:shadow-card-hover transition-shadow">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      <FileText className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold">{item.filename}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.role || 'Pending analysis'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    {item.score !== null && (
                      <div className="text-right">
                        <p className="text-2xl font-bold text-accent">{item.score}%</p>
                        <p className="text-xs text-muted-foreground">Score</p>
                      </div>
                    )}
                    
                    <Badge className={cn("font-medium", status.class)}>
                      {status.label}
                    </Badge>
                    
                    <div className="flex items-center gap-1 text-muted-foreground text-sm w-24 justify-end">
                      <Clock className="w-3 h-3" />
                      {timeAgo(item.uploadedAt)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
