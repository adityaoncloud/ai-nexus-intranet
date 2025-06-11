
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, FileText, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const EmployeeDashboard = () => {
  const { user, userProfile } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user's leave requests
  const { data: leaveRequests } = useQuery({
    queryKey: ['leave-requests', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leave_requests')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  // Fetch user's onboarding progress
  const { data: onboardingProgress } = useQuery({
    queryKey: ['onboarding-progress', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_onboarding_progress')
        .select(`
          *,
          onboarding_tasks (*)
        `)
        .eq('user_id', user?.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  // Fetch all onboarding tasks
  const { data: allTasks } = useQuery({
    queryKey: ['onboarding-tasks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('onboarding_tasks')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');
      
      if (error) throw error;
      return data;
    }
  });

  // Complete onboarding task mutation
  const completeTaskMutation = useMutation({
    mutationFn: async (taskId: string) => {
      const { error } = await supabase
        .from('user_onboarding_progress')
        .upsert({
          user_id: user?.id,
          task_id: taskId,
          completed_at: new Date().toISOString()
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboarding-progress'] });
      toast({
        title: "Success",
        description: "Task marked as completed!"
      });
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
    }
  };

  const completedTaskIds = onboardingProgress?.map(p => p.task_id) || [];
  const completionRate = allTasks ? Math.round((completedTaskIds.length / allTasks.length) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">My Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {userProfile?.full_name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Profile Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Profile</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Name:</strong> {userProfile?.full_name}</p>
              <p><strong>Email:</strong> {userProfile?.email}</p>
              <p><strong>Role:</strong> <span className="capitalize">{userProfile?.role}</span></p>
              <p><strong>Department:</strong> {userProfile?.department || 'Not assigned'}</p>
              <p><strong>Position:</strong> {userProfile?.position || 'Not assigned'}</p>
              <p><strong>Join Date:</strong> {userProfile?.join_date ? new Date(userProfile.join_date).toLocaleDateString() : 'Not set'}</p>
            </div>
          </CardContent>
        </Card>

        {/* Leave Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Leave Requests</span>
            </CardTitle>
            <CardDescription>Your recent leave requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {leaveRequests?.slice(0, 3).map((request) => (
                <div key={request.id} className="border rounded p-3">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium capitalize">{request.leave_type}</span>
                    {getStatusBadge(request.status)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(request.start_date).toLocaleDateString()} - {new Date(request.end_date).toLocaleDateString()}
                  </p>
                  {request.reason && (
                    <p className="text-sm text-muted-foreground mt-1">{request.reason}</p>
                  )}
                </div>
              ))}
              {!leaveRequests?.length && (
                <p className="text-sm text-muted-foreground">No leave requests yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Onboarding Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Onboarding Progress</span>
            </CardTitle>
            <CardDescription>{completionRate}% Complete</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {allTasks?.slice(0, 4).map((task) => {
                const isCompleted = completedTaskIds.includes(task.id);
                return (
                  <div key={task.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {isCompleted ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <div className="h-4 w-4 border border-muted-foreground rounded-full" />
                      )}
                      <span className={`text-sm ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                        {task.title}
                      </span>
                    </div>
                    {!isCompleted && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => completeTaskMutation.mutate(task.id)}
                        disabled={completeTaskMutation.isPending}
                      >
                        Complete
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
