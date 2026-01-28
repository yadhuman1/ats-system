import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LoginPage } from '@/components/LoginPage';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { CandidateUpload } from '@/components/candidate/CandidateUpload';
import { HistoryPage } from '@/components/candidate/HistoryPage';
import { HRDashboard } from '@/components/hr/HRDashboard';
import { HRPipeline } from '@/components/hr/HRPipeline';
import { AdminAnalytics } from '@/components/admin/AdminAnalytics';
import { AdminUsers } from '@/components/admin/AdminUsers';

const defaultViews: Record<string, string> = {
  candidate: 'upload',
  hr: 'dashboard',
  admin: 'analytics'
};

const Index = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState('upload');

  useEffect(() => {
    if (user) {
      setCurrentView(defaultViews[user.role] || 'upload');
    }
  }, [user]);

  if (!user) {
    return <LoginPage />;
  }

  const renderContent = () => {
    const { role } = user;
    
    if (role === 'candidate') {
      if (currentView === 'upload') return <CandidateUpload />;
      if (currentView === 'history') return <HistoryPage />;
    }
    
    if (role === 'hr') {
      if (currentView === 'dashboard') return <HRDashboard />;
      if (currentView === 'pipeline') return <HRPipeline />;
    }
    
    if (role === 'admin') {
      if (currentView === 'analytics') return <AdminAnalytics />;
      if (currentView === 'users') return <AdminUsers />;
    }
    
    return null;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Index;
