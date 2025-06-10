
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User, LogOut, Home, Users, Calendar, FileText } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  
  // Mock user data - will be replaced with real authentication
  const user = {
    name: "John Doe",
    role: "Employee", // Employee, HR, Manager, CEO
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
  };

  const isActive = (path: string) => location.pathname === path;

  const navigationItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/dashboard', label: 'My Dashboard', icon: User },
    { path: '/holidays', label: 'Holidays', icon: Calendar },
  ];

  // Add admin routes for HR/Manager/CEO roles
  if (['HR', 'Manager', 'CEO'].includes(user.role)) {
    navigationItems.push(
      { path: '/admin', label: 'Admin Panel', icon: Users },
      { path: '/onboarding', label: 'Onboarding', icon: FileText }
    );
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Company Name */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">AI</span>
            </div>
            <span className="text-xl font-bold text-foreground">TechCorp</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full"
              />
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-foreground">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.role}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive hover:text-destructive-foreground">
              <LogOut size={16} />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
