
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, User, FileText, CheckCircle, XCircle, Plus, Star, Award, TrendingUp } from 'lucide-react';
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
        description: "Leave request submitted successfully!"
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

  const handleLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitLeaveRequestMutation.mutate(leaveFormData);
  };

  const handleAvatarChange = (newAvatarUrl: string) => {
    queryClient.invalidateQueries({ queryKey: ['user-profile'] });
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

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="leaves">Leave Requests</TabsTrigger>
          <TabsTrigger value="reviews">Performance</TabsTrigger>
          <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Leaves</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{leaveRequests?.filter(req => req.status === 'pending').length || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Reviews</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{myReviews?.length || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Onboarding</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completionRate}%</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Department</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userProfile?.department || 'N/A'}</div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Leave Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leaveRequests?.slice(0, 3).map((request) => (
                    <div key={request.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium capitalize">{request.leave_type}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(request.start_date).toLocaleDateString()} - {new Date(request.end_date).toLocaleDateString()}
                        </p>
                      </div>
                      {getStatusBadge(request.status)}
                    </div>
                  ))}
                  {!leaveRequests?.length && (
                    <p className="text-sm text-muted-foreground">No leave requests yet</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Latest Performance Review</CardTitle>
              </CardHeader>
              <CardContent>
                {myReviews?.[0] ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Review {myReviews[0].review_period}</span>
                      {getRatingBadge(myReviews[0].rating)}
                    </div>
                    <p className="text-sm text-muted-foreground">{myReviews[0].feedback}</p>
                    <p className="text-xs text-muted-foreground">
                      By {myReviews[0].reviewer?.full_name || 'Unknown'} on {new Date(myReviews[0].created_at).toLocaleDateString()}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No performance reviews yet</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="profile" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Profile Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Full Name</Label>
                    <p className="text-sm text-muted-foreground">{userProfile?.full_name}</p>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <p className="text-sm text-muted-foreground">{userProfile?.email}</p>
                  </div>
                  <div>
                    <Label>Role</Label>
                    <p className="text-sm text-muted-foreground capitalize">{userProfile?.role}</p>
                  </div>
                  <div>
                    <Label>Department</Label>
                    <p className="text-sm text-muted-foreground">{userProfile?.department || 'Not assigned'}</p>
                  </div>
                  <div>
                    <Label>Position</Label>
                    <p className="text-sm text-muted-foreground">{userProfile?.position || 'Not assigned'}</p>
                  </div>
                  <div>
                    <Label>Join Date</Label>
                    <p className="text-sm text-muted-foreground">
                      {userProfile?.join_date ? new Date(userProfile.join_date).toLocaleDateString() : 'Not set'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <ProfilePictureUpload
              currentAvatar={userProfile?.avatar_url || '/placeholder.svg'}
              onAvatarChange={handleAvatarChange}
            />
          </div>
        </TabsContent>

        <TabsContent value="leaves" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Leave Requests</h2>
            <Dialog open={isLeaveDialogOpen} onOpenChange={setIsLeaveDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
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
          </div>

          <div className="grid gap-4">
            {leaveRequests?.map((request) => (
              <Card key={request.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center space-x-4">
                        <span className="font-medium capitalize">{request.leave_type}</span>
                        {getStatusBadge(request.status)}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Start Date:</span> {new Date(request.start_date).toLocaleDateString()}
                        </div>
                        <div>
                          <span className="font-medium">End Date:</span> {new Date(request.end_date).toLocaleDateString()}
                        </div>
                      </div>
                      {request.reason && (
                        <div>
                          <span className="font-medium">Reason:</span>
                          <p className="text-sm text-muted-foreground mt-1">{request.reason}</p>
                        </div>
                      )}
                      {request.reviewer_comments && (
                        <div>
                          <span className="font-medium">Review Comments:</span>
                          <p className="text-sm text-muted-foreground mt-1">{request.reviewer_comments}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {!leaveRequests?.length && (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">No leave requests yet</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-6">
          <h2 className="text-2xl font-bold">Performance Reviews</h2>
          <div className="grid gap-4">
            {myReviews?.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold">Review {review.review_period}</h3>
                      <p className="text-sm text-muted-foreground">
                        By {review.reviewer?.full_name || 'Unknown'} on {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {getRatingBadge(review.rating)}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Award className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Rating: {review.rating}/5.0</span>
                    </div>
                    <div>
                      <span className="font-medium">Feedback:</span>
                      <p className="text-sm text-muted-foreground mt-1">{review.feedback}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {!myReviews?.length && (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">No performance reviews yet</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="onboarding" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Onboarding Progress</h2>
            <Badge variant="secondary">{completionRate}% Complete</Badge>
          </div>
          <div className="grid gap-4">
            {allTasks?.map((task) => {
              const isCompleted = completedTaskIds.includes(task.id);
              return (
                <Card key={task.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        {isCompleted ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <div className="h-5 w-5 border-2 border-muted-foreground rounded-full" />
                        )}
                        <div className="flex-1">
                          <h3 className={`font-medium ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                            {task.title}
                          </h3>
                          {task.description && (
                            <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                          )}
                          <Badge variant="outline" className="mt-2">{task.category}</Badge>
                        </div>
                      </div>
                      {!isCompleted && (
                        <Button
                          variant="outline"
                          onClick={() => completeTaskMutation.mutate(task.id)}
                          disabled={completeTaskMutation.isPending}
                        >
                          {completeTaskMutation.isPending ? 'Completing...' : 'Mark Complete'}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployeeDashboard;
