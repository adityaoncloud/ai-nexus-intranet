
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Calendar, FileText, TrendingUp, Star, ChevronRight, Newspaper } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const HomePage = () => {
  const { userProfile } = useAuth();

  // Fetch CEO updates
  const { data: ceoUpdates } = useQuery({
    queryKey: ['ceo-updates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ceo_updates')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch upcoming holidays
  const { data: holidays } = useQuery({
    queryKey: ['holidays'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('holidays')
        .select('*')
        .gte('date', today)
        .order('date', { ascending: true })
        .limit(3);
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch HR policies
  const { data: hrPolicies } = useQuery({
    queryKey: ['hr-policies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hr_policies')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch news (placeholder for future implementation)
  const { data: news } = useQuery({
    queryKey: ['company-news'],
    queryFn: async () => {
      // This will be implemented later with actual news data
      return [
        {
          id: 1,
          title: "Company Quarterly Results",
          excerpt: "We exceeded our Q2 targets by 15%...",
          date: "2024-06-10"
        },
        {
          id: 2,
          title: "New Partnership Announcement",
          excerpt: "Strategic partnership with Tech Leaders Inc...",
          date: "2024-06-08"
        }
      ];
    }
  });

  const quickActions = [
    {
      title: 'My Dashboard',
      description: 'View your personal dashboard',
      icon: Users,
      href: '/dashboard',
      color: 'bg-blue-500'
    },
    {
      title: 'Calendar',
      description: 'Check your schedule',
      icon: Calendar,
      href: '/calendar',
      color: 'bg-green-500'
    },
    {
      title: 'Internal Tools',
      description: 'Access company tools',
      icon: FileText,
      href: '/tools',
      color: 'bg-purple-500'
    }
  ];

  // Add admin actions for admin users
  if (['admin', 'hr', 'manager', 'ceo'].includes(userProfile?.role)) {
    quickActions.push({
      title: 'Admin Panel',
      description: 'Manage company settings',
      icon: TrendingUp,
      href: '/admin',
      color: 'bg-red-500'
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {userProfile?.full_name}! 👋
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening at TechCorp today.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link key={index} to={action.href}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${action.color}`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{action.title}</h3>
                        <p className="text-sm text-muted-foreground">{action.description}</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* CEO Updates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>CEO Updates</span>
              </CardTitle>
              <CardDescription>Latest updates from leadership</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ceoUpdates?.map((update) => (
                  <div key={update.id} className="border-l-4 border-primary pl-4">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium">{update.title}</h4>
                      {update.is_featured && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {update.content}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(update.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
                {!ceoUpdates?.length && (
                  <p className="text-sm text-muted-foreground">No updates available</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Holidays */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Upcoming Holidays</span>
              </CardTitle>
              <CardDescription>Company holidays and events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {holidays?.map((holiday) => (
                  <div key={holiday.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{holiday.name}</p>
                      <p className="text-sm text-muted-foreground">{holiday.description}</p>
                    </div>
                    <Badge variant="outline">
                      {new Date(holiday.date).toLocaleDateString()}
                    </Badge>
                  </div>
                ))}
                {!holidays?.length && (
                  <p className="text-sm text-muted-foreground">No upcoming holidays</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* HR Policies */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>HR Policies</span>
              </CardTitle>
              <CardDescription>Important company policies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {hrPolicies?.map((policy) => (
                  <div key={policy.id} className="border rounded p-3">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-medium">{policy.title}</h4>
                      <Badge variant="secondary">{policy.category}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {policy.content}
                    </p>
                  </div>
                ))}
                {!hrPolicies?.length && (
                  <p className="text-sm text-muted-foreground">No policies available</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Company News */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Newspaper className="h-5 w-5" />
                <span>Company News</span>
              </CardTitle>
              <CardDescription>Latest company announcements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {news?.map((item) => (
                  <div key={item.id} className="border rounded p-3">
                    <h4 className="font-medium mb-1">{item.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {item.excerpt}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(item.date).toLocaleDateString()}
                    </p>
                  </div>
                ))}
                {!news?.length && (
                  <p className="text-sm text-muted-foreground">No news available</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
