import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { FileCheck, CheckCircle2, XCircle } from 'lucide-react';

export function HRPipeline() {
  const { history } = useAuth();
  
  const pipeline = {
    applied: history.filter(c => c.status === 'analyzed'),
    shortlisted: history.filter(c => c.status === 'shortlisted'),
    rejected: history.filter(c => c.status === 'rejected')
  };

  const columns = [
    { 
      id: 'applied', 
      title: 'Applied', 
      icon: FileCheck,
      items: pipeline.applied, 
      color: 'border-accent bg-accent/5'
    },
    { 
      id: 'shortlisted', 
      title: 'Shortlisted', 
      icon: CheckCircle2,
      items: pipeline.shortlisted, 
      color: 'border-success bg-success/5'
    },
    { 
      id: 'rejected', 
      title: 'Rejected', 
      icon: XCircle,
      items: pipeline.rejected, 
      color: 'border-destructive bg-destructive/5'
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Recruitment Pipeline</h1>
        <p className="text-muted-foreground">Track candidates through the hiring process</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map((column) => {
          const Icon = column.icon;
          return (
            <Card 
              key={column.id} 
              className={cn("min-h-[500px] border-t-4", column.color)}
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-base">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    {column.title}
                  </div>
                  <Badge variant="secondary">{column.items.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {column.items.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No candidates
                  </p>
                ) : (
                  column.items.map((c) => (
                    <div 
                      key={c.id} 
                      className="bg-card border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <p className="font-medium text-sm truncate">{c.filename}</p>
                      <p className="text-xs text-muted-foreground mt-1">{c.role}</p>
                      {c.score && (
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Score</span>
                          <span className="font-bold text-success">{c.score}%</span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
