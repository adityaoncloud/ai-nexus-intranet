
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CheckCircle, XCircle, Calendar, User, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

type LeaveStatus = 'pending' | 'approved' | 'rejected';

interface LeaveRequestWithProfile {
  id: string;
  user_id: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  reason: string | null;
  status: LeaveStatus;
  created_at: string;
  reviewer_comments: string | null;
  reviewed_at: string | null;
  approved_by: string | null;
  approved_at: string | null;
  profiles: {
    full_name: string;
    email: string;
    department: string | null;
  } | null;
}

const LeaveApproval = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [reviewComments, setReviewComments] = useState('');
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);

  // Fetch all leave requests with profile information
  const { data: leaveRequests, isLoading } = useQuery({
    queryKey: ['all-leave-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leave_requests')
        .select(`
          *,
          profiles (
            full_name,
            email,
            department
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as LeaveRequestWithProfile[];
    }
  });

  // Approve/Reject leave request mutation
  const reviewLeaveRequestMutation = useMutation({
    mutationFn: async ({ requestId, status, comments }: { requestId: string; status: LeaveStatus; comments: string }) => {
      const { error } = await supabase
        .from('leave_requests')
        .update({
          status,
          approved_by: user?.id,
          approved_at: new Date().toISOString(),
          reviewed_at: new Date().toISOString(),
          reviewer_comments: comments
        })
        .eq('id', requestId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-leave-requests'] });
      setIsReviewDialogOpen(false);
      setSelectedRequest(null);
      setReviewComments('');
      toast({
        title: "Success",
        description: "Leave request has been reviewed successfully!"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to review leave request",
        variant: "destructive"
      });
    }
  });

  const getStatusBadge = (status: LeaveStatus) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  const handleReview = (request: LeaveRequestWithProfile, status: LeaveStatus) => {
    setSelectedRequest({ ...request, reviewStatus: status });
    setIsReviewDialogOpen(true);
  };

  const submitReview = () => {
    if (selectedRequest) {
      reviewLeaveRequestMutation.mutate({
        requestId: selectedRequest.id,
        status: selectedRequest.reviewStatus,
        comments: reviewComments
      });
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Loading leave requests...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Leave Approval</h2>
        <Badge variant="secondary">{leaveRequests?.filter(req => req.status === 'pending').length || 0} Pending</Badge>
      </div>

      <div className="grid gap-4">
        {leaveRequests?.map((request) => (
          <Card key={request.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{request.profiles?.full_name || 'Unknown User'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground capitalize">{request.leave_type}</span>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Employee:</span> {request.profiles?.full_name || 'Unknown User'}
                    </div>
                    <div>
                      <span className="font-medium">Department:</span> {request.profiles?.department || 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium">Email:</span> {request.profiles?.email || 'N/A'}
                    </div>
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

                {request.status === 'pending' && (
                  <div className="flex space-x-2 ml-4">
                    <Button
                      size="sm"
                      className="bg-green-500 hover:bg-green-600"
                      onClick={() => handleReview(request, 'approved')}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleReview(request, 'rejected')}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {!leaveRequests?.length && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No leave requests found</p>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedRequest?.reviewStatus === 'approved' ? 'Approve' : 'Reject'} Leave Request
            </DialogTitle>
            <DialogDescription>
              {selectedRequest?.reviewStatus === 'approved' 
                ? 'Approving this leave request. Add any comments below.'
                : 'Rejecting this leave request. Please provide a reason below.'
              }
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="comments">Comments {selectedRequest?.reviewStatus === 'rejected' && '*'}</Label>
              <Textarea
                id="comments"
                placeholder={selectedRequest?.reviewStatus === 'approved' 
                  ? "Optional comments..." 
                  : "Please provide a reason for rejection..."
                }
                value={reviewComments}
                onChange={(e) => setReviewComments(e.target.value)}
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsReviewDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={submitReview}
                disabled={selectedRequest?.reviewStatus === 'rejected' && !reviewComments.trim()}
                className={selectedRequest?.reviewStatus === 'approved' ? 'bg-green-500 hover:bg-green-600' : ''}
                variant={selectedRequest?.reviewStatus === 'approved' ? 'default' : 'destructive'}
              >
                {selectedRequest?.reviewStatus === 'approved' ? 'Approve' : 'Reject'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeaveApproval;
