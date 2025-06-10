
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, User, FileText, DollarSign, Star, Clock, Settings } from 'lucide-react';
import ProfilePictureUpload from './ProfilePictureUpload';
import EmployeeCalendar from './EmployeeCalendar';

const EmployeeDashboard = () => {
  // Mock employee data
  const [employee, setEmployee] = useState({
    name: "John Doe",
    id: "EMP001",
    email: "john.doe@techcorp.com",
    position: "Senior AI Engineer",
    department: "AI Research",
    joinDate: "2023-01-15",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    manager: "Sarah Smith",
    totalLeaves: 25,
    usedLeaves: 8,
    pendingLeaves: 2
  });

  const handleAvatarChange = (newAvatar: string) => {
    setEmployee(prev => ({ ...prev, avatar: newAvatar }));
  };

  const [leaveRequests] = useState([
    { id: 1, type: "Vacation", startDate: "2024-07-15", endDate: "2024-07-19", status: "Pending", days: 5 },
    { id: 2, type: "Sick Leave", startDate: "2024-06-20", endDate: "2024-06-20", status: "Approved", days: 1 },
    { id: 3, type: "Personal", startDate: "2024-05-10", endDate: "2024-05-10", status: "Approved", days: 0.5 }
  ]);

  const [reviews] = useState([
    {
      id: 1,
      reviewer: "Sarah Smith (Manager)",
      date: "2024-05-15",
      rating: 4.5,
      feedback: "Excellent work on the NLP project. John consistently delivers high-quality code and shows great initiative in research.",
      period: "Q1 2024"
    },
    {
      id: 2,
      reviewer: "Mike Johnson (HR)",
      date: "2024-02-28",
      rating: 4.2,
      feedback: "Strong team player with excellent technical skills. Great mentoring of junior developers.",
      period: "Annual Review 2023"
    }
  ]);

  const [salaryStatus] = useState({
    currentSalary: "$95,000",
    lastPaid: "2024-05-31",
    nextPayment: "2024-06-30",
    status: "Paid",
    bonuses: "$5,000"
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved': return 'default';
      case 'pending': return 'secondary';
      case 'rejected': return 'destructive';
      case 'paid': return 'default';
      default: return 'secondary';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Employee Profile Header */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
              <img
                src={employee.avatar}
                alt={employee.name}
                className="w-24 h-24 rounded-full border-4 border-primary/20"
              />
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-2xl font-bold text-foreground">{employee.name}</h1>
                <p className="text-lg text-muted-foreground">{employee.position}</p>
                <p className="text-sm text-muted-foreground">{employee.department}</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Employee ID: </span>
                    <span className="font-medium">{employee.id}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Manager: </span>
                    <span className="font-medium">{employee.manager}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Join Date: </span>
                    <span className="font-medium">{employee.joinDate}</span>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-primary">{employee.totalLeaves}</div>
                    <div className="text-xs text-muted-foreground">Total Leaves</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-orange-500">{employee.usedLeaves}</div>
                    <div className="text-xs text-muted-foreground">Used</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-500">{employee.pendingLeaves}</div>
                    <div className="text-xs text-muted-foreground">Pending</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dashboard Tabs */}
        <Tabs defaultValue="leaves" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="leaves">Leave Management</TabsTrigger>
            <TabsTrigger value="calendar">My Calendar</TabsTrigger>
            <TabsTrigger value="reviews">Performance Reviews</TabsTrigger>
            <TabsTrigger value="salary">Salary & Benefits</TabsTrigger>
            <TabsTrigger value="profile">Profile Settings</TabsTrigger>
          </TabsList>

          {/* Leave Management Tab */}
          <TabsContent value="leaves">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Request New Leave */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>Request Leave</span>
                  </CardTitle>
                  <CardDescription>Submit a new leave request</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Button className="w-full">Full Day Leave</Button>
                    <Button variant="outline" className="w-full">Half Day Leave</Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="w-full">Sick Leave</Button>
                    <Button variant="outline" className="w-full">Personal Leave</Button>
                  </div>
                  <Button variant="secondary" className="w-full">
                    <Clock className="h-4 w-4 mr-2" />
                    Advanced Request Form
                  </Button>
                </CardContent>
              </Card>

              {/* Leave Balance */}
              <Card>
                <CardHeader>
                  <CardTitle>Leave Balance Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-primary/5 rounded-lg">
                      <span className="font-medium">Annual Leave</span>
                      <span className="font-bold">{employee.totalLeaves - employee.usedLeaves} days remaining</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                      <span className="font-medium">Sick Leave</span>
                      <span className="font-bold">10 days remaining</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="font-medium">Personal Leave</span>
                      <span className="font-bold">5 days remaining</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Leave Requests */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Recent Leave Requests</CardTitle>
                  <CardDescription>Your leave request history</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {leaveRequests.map((request) => (
                      <div key={request.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <span className="font-medium">{request.type}</span>
                            <Badge variant={getStatusColor(request.status)}>{request.status}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {request.startDate} to {request.endDate} ({request.days} {request.days === 1 ? 'day' : 'days'})
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">View Details</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Calendar Tab */}
          <TabsContent value="calendar">
            <EmployeeCalendar />
          </TabsContent>

          {/* Performance Reviews Tab */}
          <TabsContent value="reviews">
            <div className="space-y-6">
              {reviews.map((review) => (
                <Card key={review.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center space-x-2">
                          <Star className="h-5 w-5" />
                          <span>Performance Review - {review.period}</span>
                        </CardTitle>
                        <CardDescription>Reviewed by {review.reviewer} on {review.date}</CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < Math.floor(review.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium">{review.rating}/5.0</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{review.feedback}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Salary & Benefits Tab */}
          <TabsContent value="salary">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5" />
                    <span>Salary Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-primary/5 rounded-lg">
                    <span className="font-medium">Current Salary</span>
                    <span className="font-bold text-lg">{salaryStatus.currentSalary}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="font-medium">Annual Bonus</span>
                    <span className="font-bold">{salaryStatus.bonuses}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Last Payment</span>
                      <span className="text-sm font-medium">{salaryStatus.lastPaid}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Next Payment</span>
                      <span className="text-sm font-medium">{salaryStatus.nextPayment}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <Badge variant={getStatusColor(salaryStatus.status)}>{salaryStatus.status}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Benefits Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 border border-border rounded-lg">
                      <span className="font-medium">Health Insurance</span>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 border border-border rounded-lg">
                      <span className="font-medium">401(k) Plan</span>
                      <Badge variant="default">Contributing 6%</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 border border-border rounded-lg">
                      <span className="font-medium">Dental Coverage</span>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 border border-border rounded-lg">
                      <span className="font-medium">Life Insurance</span>
                      <Badge variant="default">2x Salary</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Profile Settings Tab */}
          <TabsContent value="profile">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ProfilePictureUpload 
                currentAvatar={employee.avatar}
                onAvatarChange={handleAvatarChange}
              />
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="h-5 w-5" />
                    <span>Account Settings</span>
                  </CardTitle>
                  <CardDescription>Manage your account preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email Notifications</label>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm">Leave request updates</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm">Performance review notifications</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">Company announcements</span>
                      </label>
                    </div>
                  </div>
                  <Button className="w-full">Save Preferences</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
