import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Lock, Mail, AlertCircle } from 'lucide-react';

export function LoginPage() {
  const [email, setEmail] = useState('candidate@example.com');
  const [password, setPassword] = useState('pass123');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const result = login(email, password);
    if (!result) {
      setError('Invalid email or password');
    }
  };

  const quickLogin = (userEmail: string) => {
    setEmail(userEmail);
    setPassword('pass123');
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent" />
      
      <Card className="w-full max-w-md shadow-xl animate-scale-in relative z-10 border-0">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-16 h-16 gradient-accent rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <Bot className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Smart ATS</CardTitle>
          <CardDescription>Enterprise AI Recruitment Platform</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="Email address"
                  className="pl-10 h-12"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="Password"
                  className="pl-10 h-12"
                />
              </div>
            </div>
            
            {error && (
              <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}
            
            <Button type="submit" className="w-full h-12 text-base font-semibold gradient-accent text-primary hover:opacity-90 transition-opacity">
              Sign In
            </Button>
          </form>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Demo Accounts</span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => quickLogin('candidate@example.com')}
              className="text-xs"
            >
              Candidate
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => quickLogin('hr@example.com')}
              className="text-xs"
            >
              HR
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => quickLogin('admin@example.com')}
              className="text-xs"
            >
              Admin
            </Button>
          </div>
          
          <p className="text-center text-xs text-muted-foreground">
            Password for all: <code className="bg-muted px-1 py-0.5 rounded">pass123</code>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
