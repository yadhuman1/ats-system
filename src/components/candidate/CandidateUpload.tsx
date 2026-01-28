import { useState, useRef } from 'react';
import { useAuth, HistoryEntry } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText, Sparkles, CheckCircle2, Target, Brain, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface AnalysisResult {
  role: string;
  score: number;
  confidence: number;
  jdMatch: number;
  techMatch: number;
  softSkills: number;
  matchedSkills: string[];
  missingSkills: string[];
  reasoning: string[];
}

export function CandidateUpload() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [uploadedId, setUploadedId] = useState<number | null>(null);
  const { user, addHistoryEntry, updateHistoryStatus } = useAuth();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFile(file);
      setAnalysis(null);
      setUploadedId(null);
    }
  };

  const handleUpload = () => {
    if (!resumeFile || !user) return;
    
    const id = addHistoryEntry({
      userId: user.id,
      filename: resumeFile.name,
      role: null,
      score: null,
      status: 'uploaded',
      uploadedAt: Date.now()
    });
    setUploadedId(id);
  };

  const analyzeResume = () => {
    if (!uploadedId) return;
    
    setAnalyzing(true);
    setTimeout(() => {
      const result: AnalysisResult = {
        role: 'Full Stack Developer',
        score: 87,
        confidence: 0.92,
        jdMatch: 85,
        techMatch: 92,
        softSkills: 75,
        matchedSkills: ['React', 'Node.js', 'TypeScript', 'AWS', 'PostgreSQL'],
        missingSkills: ['Docker', 'Kubernetes', 'GraphQL'],
        reasoning: [
          'Strong React and frontend experience (4+ years)',
          'Solid backend skills with Node.js ecosystem',
          'Education aligns with role requirements',
          'Previous experience at similar scale companies'
        ]
      };
      
      setAnalysis(result);
      updateHistoryStatus(uploadedId, 'analyzed', {
        role: result.role,
        score: result.score,
        jdMatch: result.jdMatch,
        confidence: result.confidence,
        matchedSkills: result.matchedSkills,
        missingSkills: result.missingSkills,
        reasoning: result.reasoning,
        analyzedAt: Date.now()
      });
      
      setAnalyzing(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Upload Resume</h1>
        <p className="text-muted-foreground">Submit your resume for AI-powered analysis</p>
      </div>

      <Card className="shadow-card">
        <CardContent className="p-6 space-y-6">
          <input 
            type="file" 
            ref={fileRef} 
            accept=".pdf,.doc,.docx" 
            className="hidden" 
            onChange={handleFileChange} 
          />
          
          <div 
            onClick={() => fileRef.current?.click()} 
            className={cn(
              "cursor-pointer border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200",
              resumeFile 
                ? "border-success bg-success/5" 
                : "border-muted-foreground/30 hover:border-accent hover:bg-accent/5"
            )}
          >
            {resumeFile ? (
              <>
                <CheckCircle2 className="w-12 h-12 mx-auto text-success mb-3" />
                <p className="font-semibold text-success">{resumeFile.name}</p>
                <p className="text-sm text-muted-foreground mt-1">Click to change file</p>
              </>
            ) : (
              <>
                <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="font-semibold">Drop your resume here or click to browse</p>
                <p className="text-sm text-muted-foreground mt-1">Supports PDF, DOC, DOCX</p>
              </>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button 
              onClick={handleUpload} 
              disabled={!resumeFile || !!uploadedId}
              variant="outline"
              className="h-12"
            >
              <Upload className="w-4 h-4 mr-2" />
              {uploadedId ? 'Uploaded' : 'Upload File'}
            </Button>
            <Button 
              onClick={analyzeResume} 
              disabled={analyzing || !uploadedId}
              className="h-12 gradient-accent text-primary hover:opacity-90"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {analyzing ? 'Analyzing...' : 'Analyze with AI'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {analysis && (
        <Card className="shadow-card animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent" />
              Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="gradient-success text-success-foreground rounded-xl p-4 text-center">
                <p className="text-xs opacity-80 font-medium">Overall Score</p>
                <p className="text-3xl font-bold mt-1">{analysis.score}%</p>
              </div>
              <div className="gradient-primary text-primary-foreground rounded-xl p-4 text-center">
                <p className="text-xs opacity-80 font-medium">Matched Role</p>
                <p className="text-sm font-bold mt-2">{analysis.role}</p>
              </div>
              <div className="gradient-accent text-primary rounded-xl p-4 text-center">
                <p className="text-xs opacity-80 font-medium">JD Match</p>
                <p className="text-3xl font-bold mt-1">{analysis.jdMatch}%</p>
              </div>
              <div className="gradient-warning text-warning-foreground rounded-xl p-4 text-center">
                <p className="text-xs opacity-80 font-medium">Confidence</p>
                <p className="text-3xl font-bold mt-1">{Math.round(analysis.confidence * 100)}%</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-success/5 border border-success/20 p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-4 h-4 text-success" />
                  <p className="font-semibold text-success">Matched Skills</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {analysis.matchedSkills.map((skill, i) => (
                    <Badge key={i} variant="outline" className="bg-success/10 text-success border-success/30">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="bg-destructive/5 border border-destructive/20 p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-4 h-4 text-destructive" />
                  <p className="font-semibold text-destructive">Skills to Develop</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {analysis.missingSkills.map((skill, i) => (
                    <Badge key={i} variant="outline" className="bg-destructive/10 text-destructive border-destructive/30">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-muted/50 p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <Brain className="w-4 h-4 text-accent" />
                <p className="font-semibold">AI Analysis</p>
              </div>
              <ul className="space-y-2">
                {analysis.reasoning.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
