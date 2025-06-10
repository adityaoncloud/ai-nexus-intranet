
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Users, UserCheck, MessageSquare, Settings } from 'lucide-react';

const AdminPanel = () => {
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState('');
  const [employeeRole, setEmployeeRole] = useState('');

  // Mock data - will be replaced with real data from Supabase
  const employees = [
    { id: 1, name: 'John Doe', role: 'Employee', department: 'Engineering', status: 'Active' },
    { id: 2, name: 'Jane Smith', role: 'Employee', department: 'Design', status: 'Active' },
    { id: 3, name: 'Mike Johnson', role: 'Manager', department: 'Engineering', status: 'Active' },
    { id: 4, name: 'Sarah Wilson', role: 'HR', department: 'Human Resources', status: 'Active' },
  ];

  const reviews = [
    { id: 1, employeeName: 'John Doe', reviewer: 'Mike Johnson', rating: 'Excellent', review: 'Outstanding performance this quarter', date: '2024-06-01' },
    { id: 2, employeeName: 'Jane Smith', reviewer: 'Sarah Wilson', rating: 'Good', review: 'Consistent work quality', date: '2024-06-05' },
  ];

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting review:', { selectedEmployee, reviewText, rating });
    // Reset form
    setSelectedEmployee('');
    setReviewText('');
    setRating('');
  };

  const handleRoleChange = (employeeId: number, newRole: string) => {
    console.log('Changing role for employee:', employeeId, 'to:', newRole);
    // This will be implemented with Supabase
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Panel</h1>
          <p className="text-muted-foreground">Manage employee reviews, roles, and authorities</p>
        </div>

        <Tabs defaultValue="reviews" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="reviews" className="flex items-center space-x-2">
              <MessageSquare size={16} />
              <span>Employee Reviews</span>
            </TabsTrigger>
            <TabsTrigger value="roles" className="flex items-center space-x-2">
              <UserCheck size={16} />
              <span>Role Management</span>
            </TabsTrigger>
            <TabsTrigger value="employees" className="flex items-center space-x-2">
              <Users size={16} />
              <span>Employee Overview</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reviews" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Add Employee Review</CardTitle>
                  <CardDescription>Submit a performance review for an employee</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="employee">Select Employee</Label>
                      <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose an employee" />
                        </SelectTrigger>
                        <SelectContent>
                          {employees.map((employee) => (
                            <SelectItem key={employee.id} value={employee.name}>
                              {employee.name} - {employee.department}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rating">Performance Rating</Label>
                      <Select value={rating} onValueChange={setRating}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select rating" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="excellent">Excellent</SelectItem>
                          <SelectItem value="good">Good</SelectItem>
                          <SelectItem value="satisfactory">Satisfactory</SelectItem>
                          <SelectItem value="needs-improvement">Needs Improvement</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="review">Review Comments</Label>
                      <Textarea
                        id="review"
                        placeholder="Enter your review comments..."
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        rows={4}
                      />
                    </div>
                    <Button type="submit" className="w-full">Submit Review</Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Reviews</CardTitle>
                  <CardDescription>Latest employee performance reviews</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{review.employeeName}</h4>
                          <Badge variant={review.rating === 'Excellent' ? 'default' : 'secondary'}>
                            {review.rating}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{review.review}</p>
                        <p className="text-xs text-muted-foreground">
                          By {review.reviewer} on {review.date}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="roles" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Employee Role Management</CardTitle>
                <CardDescription>Update employee roles and access permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee Name</TableHead>
                      <TableHead>Current Role</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell className="font-medium">{employee.name}</TableCell>
                        <TableCell>
                          <Badge variant={employee.role === 'Employee' ? 'secondary' : 'default'}>
                            {employee.role}
                          </Badge>
                        </TableCell>
                        <TableCell>{employee.department}</TableCell>
                        <TableCell>
                          <Select onValueChange={(value) => handleRoleChange(employee.id, value)}>
                            <SelectTrigger className="w-40">
                              <SelectValue placeholder="Change role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Employee">Employee</SelectItem>
                              <SelectItem value="Manager">Manager</SelectItem>
                              <SelectItem value="HR">HR</SelectItem>
                              <SelectItem value="CEO">CEO</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="employees" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Employee Overview</CardTitle>
                <CardDescription>Complete list of all employees and their details</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Admin Access</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell className="font-medium">{employee.name}</TableCell>
                        <TableCell>
                          <Badge variant={employee.role === 'Employee' ? 'secondary' : 'default'}>
                            {employee.role}
                          </Badge>
                        </TableCell>
                        <TableCell>{employee.department}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{employee.status}</Badge>
                        </TableCell>
                        <TableCell>
                          {['HR', 'Manager', 'CEO'].includes(employee.role) ? (
                            <Badge variant="default">Yes</Badge>
                          ) : (
                            <Badge variant="secondary">No</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
