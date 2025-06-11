
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Clock, User, FileText, CheckCircle, XCircle, Plus, Upload, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import ProfilePictureUpload from './ProfilePictureUpload';

const EmployeeDashboard = () => {
  const { user, userProfile } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [leaveFormData, setLeaveFormData] = useState({
    leave_type: '',
    start_date: '',
    end_date: '',
    reason: ''
  });
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);

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

  // Fetch user's performance reviews
  const { data: myReviews } = useQuery({
    queryKey: ['my-performance-reviews', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('performance_reviews')
        .select(`
          *,
          reviewer:profiles!performance_reviews_reviewer_id_fkey(full_name)
        `)
        .eq('employee_id', user?.id)
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

  // Submit leave request mutation
  const submitLeaveRequestMutation = useMutation({
    mutationFn: async (leaveData: any) => {
      // Validate leave dates
      const startDate = new Date(leaveData.start_date);
      const today = new Date();
      const diffDays = Math.ceil((startDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
      
      if (leaveData.leave_type !== 'sick' && diffDays < 5) {
        throw new Error('Leave requests must be submitted at least 5 days in advance, except for sick leave');
      }

      const { error } = await supabase
        .from('leave_requests')
        .insert({
          user_id: user?.id,
          leave_type: leaveData.leave_type,
          start_date: leaveData.start_date,
          end_date: leaveData.end_date,
          reason: leaveData.reason,
          status: 'pending'
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave-requests'] });
      setIsLeaveDialogOpen(false);
      setLeaveFormData({ leave_type: '', start_date: '', end_date: '', reason: '' });
      toast({
        title: "Success",
        description: "Leave request submitted successfully and notifications sent to management!"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit leave request",
        variant: "destructive"
      });
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

  // Update avatar mutation
  const updateAvatarMutation = useMutation({
    mutationFn: async (avatarUrl: string) => {
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: avatarUrl })
        .eq('id', user?.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      toast({
        title: "Success",
        description: "Profile picture updated successfully!"
      });
    }
  });

  const handleLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitLeaveRequestMutation.mutate(leaveFormData);
  };

  const handleAvatarChange = (newAvatarUrl: string) => {
    updateAvatarMutation.mutate(newAvatarUrl);
  };

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

  const getRatingBadge = (rating: number) => {
    if (rating >= 4.5) return <Badge className="bg-green-500">Excellent</Badge>;
    if (rating >= 3.5) return <Badge variant="default">Good</Badge>;
    if (rating >= 2.5) return <Badge variant="secondary">Satisfactory</Badge>;
    return <Badge variant="destructive">Needs Improvement</Badge>;
  };

  const completedTaskIds = onboardingProgress?.map(p => p.task_id) || [];
  const completionRate = allTasks ? Math.round((completedTaskIds.length / allTasks.length) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">My Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {userProfile?.full_name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Profile Summary */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Profile</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <img
                  src={userProfile?.avatar_url || '/placeholder.svg'}
                  alt="Profile"
                  className="w-16 h-16 rounded-full border-4 border-primary/20"
                />
                <div>
                  <h3 className="font-semibold">{userProfile?.full_name}</h3>
                  <p className="text-sm text-muted-foreground capitalize">{userProfile?.role}</p>
                </div>
              </div>
              <div className="space-y-2">
                <p><strong>Email:</strong> {userProfile?.email}</p>
                <p><strong>Department:</strong> {userProfile?.department || 'Not assigned'}</p>
                <p><strong>Position:</strong> {userProfile?.position || 'Not assigned'}</p>
                <p><strong>Join Date:</strong> {userProfile?.join_date ? new Date(userProfile.join_date).toLocaleDateString() : 'Not set'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Picture Upload */}
        <Card className="lg:col-span-2">
          <ProfilePictureUpload
            currentAvatar={userProfile?.avatar_url || '/placeholder.svg'}
            onAvatarChange={handleAvatarChange}
          />
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Leave Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Leave Requests</span>
            </CardTitle>
            <CardDescription className="flex items-center justify-between">
              <span>Your recent leave requests</span>
              <Dialog open={isLeaveDialogOpen} onOpenChange={setIsLeaveDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-1" />
                    Request Leave
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Submit Leave Request</DialogTitle>
                    <DialogDescription>
                      Fill out the form below to request time off. Leave requests must be submitted at least 5 days in advance (except for sick leave).
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleLeaveSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="leave_type">Leave Type</Label>
                      <Select value={leaveFormData.leave_type} onValueChange={(value) => setLeaveFormData(prev => ({ ...prev, leave_type: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select leave type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="vacation">Vacation</SelectItem>
                          <SelectItem value="sick">Sick Leave</SelectItem>
                          <SelectItem value="personal">Personal</SelectItem>
                          <SelectItem value="maternity">Maternity</SelectItem>
                          <SelectItem value="paternity">Paternity</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="start_date">Start Date</Label>
                        <Input
                          id="start_date"
                          type="date"
                          value={leaveFormData.start_date}
                          onChange={(e) => setLeaveFormData(prev => ({ ...prev, start_date: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="end_date">End Date</Label>
                        <Input
                          id="end_date"
                          type="date"
                          value={leaveFormData.end_date}
                          onChange={(e) => setLeaveFormData(prev => ({ ...prev, end_date: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reason">Reason</Label>
                      <Textarea
                        id="reason"
                        placeholder="Please provide a reason for your leave request"
                        value={leaveFormData.reason}
                        onChange={(e) => setLeaveFormData(prev => ({ ...prev, reason: e.target.value }))}
                        rows={3}
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={submitLeaveRequestMutation.isPending}>
                      {submitLeaveRequestMutation.isPending ? 'Submitting...' : 'Submit Request'}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </CardDescription>
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

        {/* Performance Reviews */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="h-5 w-5" />
              <span>My Performance Reviews</span>
            </CardTitle>
            <CardDescription>Latest performance feedback</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {myReviews?.slice(0, 3).map((review) => (
                <div key={review.id} className="border rounded p-3">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium">Review {review.review_period}</span>
                    {getRatingBadge(review.rating)}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{review.feedback}</p>
                  <p className="text-xs text-muted-foreground">
                    By {review.reviewer?.full_name || 'Unknown'} on {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
              {!myReviews?.length && (
                <p className="text-sm text-muted-foreground">No performance reviews yet</p>
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
