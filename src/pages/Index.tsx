
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import Layout from '../components/Layout';
import HomePage from '../components/HomePage';
import AuthPage from '../components/AuthPage';

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <Layout>
      <HomePage />
    </Layout>
  );
};

export default Index;
