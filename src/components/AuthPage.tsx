
import React, { useEffect } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import PasswordReset from './PasswordReset';

const AuthPage = () => {
  const [showPasswordReset, setShowPasswordReset] = React.useState(false);
  const { user, signInWithMicrosoft } = useAuth();
  const [searchParams] = useSearchParams();

  // Check if user is redirected for password reset
  useEffect(() => {
    const mode = searchParams.get('mode');
    if (mode === 'reset') {
      setShowPasswordReset(true);
    }
  }, [searchParams]);

  // Redirect if already authenticated
  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleMicrosoftSignIn = async () => {
    await signInWithMicrosoft();
  };

  if (showPasswordReset) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 p-4">
        <PasswordReset onBackToLogin={() => setShowPasswordReset(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold">TC</span>
            </div>
            <span className="text-2xl font-bold">TechCorp</span>
          </div>
          <CardTitle>Welcome to TechCorp</CardTitle>
          <CardDescription>
            Sign in with your TechCorp Microsoft account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={handleMicrosoftSignIn}
            className="w-full"
            size="lg"
          >
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-5 h-5" viewBox="0 0 23 23" fill="none">
                <path fill="#f3f3f3" d="M0 0h23v23H0z"/>
                <path fill="#f35325" d="M1 1h10v10H1z"/>
                <path fill="#81bc06" d="M12 1h10v10H12z"/>
                <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                <path fill="#ffba08" d="M12 12h10v10H12z"/>
              </svg>
              <span>Sign in with Microsoft</span>
            </div>
          </Button>
          
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Only @techcorp.com email addresses are allowed
            </p>
          </div>
          
          <div className="mt-4 pt-4 border-t border-border text-center">
            <Button
              variant="link"
              onClick={() => setShowPasswordReset(true)}
              className="text-sm"
            >
              Need to reset your password?
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
