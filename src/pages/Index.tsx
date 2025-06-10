
import React from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import HomePage from '../components/HomePage';
import LoginPage from '../components/LoginPage';

const Index = () => {
  const location = useLocation();
  const isAuthenticated = true; // Mock authentication - will be replaced with real auth

  if (!isAuthenticated && location.pathname !== '/login') {
    return (
      <Layout>
        <LoginPage />
      </Layout>
    );
  }

  return (
    <Layout>
      <HomePage />
    </Layout>
  );
};

export default Index;
