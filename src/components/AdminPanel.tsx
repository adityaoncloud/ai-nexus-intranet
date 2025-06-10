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
import { Calendar } from '@/components/ui/calendar';
import { Users, UserCheck, MessageSquare, Settings, Calendar as CalendarIcon, FileText, Newspaper, Upload } from 'lucide-react';

const AdminPanel = () => {
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState('');
  const [holidayName, setHolidayName] = useState('');
  const [holidayDate, setHolidayDate] = useState<Date>();
  const [holidayType, setHolidayType] = useState('');
  const [ceoUpdateTitle, setCeoUpdateTitle] = useState('');
  const [ceoUpdateContent, setCeoUpdateContent] = useState('');
  const [hrPolicyTitle, setHrPolicyTitle] = useState('');
  const [hrPolicyContent, setHrPolicyContent] = useState('');

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

  const holidays = [
    { id: 1, name: 'Independence Day', date: '2024-07-04', type: 'National Holiday' },
    { id: 2, name: 'Labor Day', date: '2024-09-02', type: 'National Holiday' },
    { id: 3, name: 'Company Anniversary', date: '2024-09-15', type: 'Company Holiday' }
  ];

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting review:', { selectedEmployee, reviewText, rating });
    setSelectedEmployee('');
    setReviewText('');
    setRating('');
  };

  const handleAddHoliday = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Adding holiday:', { holidayName, holidayDate, holidayType });
    setHolidayName('');
    setHolidayDate(undefined);
    setHolidayType('');
  };

  const handleAddCeoUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Adding CEO update:', { ceoUpdateTitle, ceoUpdateContent });
    setCeoUpdateTitle('');
    setCeoUpdateContent('');
  };

  const handleAddHrPolicy = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Adding HR policy:', { hrPolicyTitle, hrPolicyContent });
    setHrPolicyTitle('');
    setHrPolicyContent('');
  };

  const handleRoleChange = (employeeId: number, newRole: string) => {
    console.log('Changing role for employee:', employeeId, 'to:', newRole);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Panel</h1>
          <p className="text-muted-foreground">Manage employee reviews, roles, holidays, and company content</p>
        </div>

        <Tabs defaultValue="reviews" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="reviews" className="flex items-center space-x-2">
              <MessageSquare size={16} />
              <span>Reviews</span>
            </TabsTrigger>
            <TabsTrigger value="roles" className="flex items-center space-x-2">
              <UserCheck size={16} />
              <span>Roles</span>
            </TabsTrigger>
            <TabsTrigger value="employees" className="flex items-center space-x-2">
              <Users size={16} />
              <span>Employees</span>
            </TabsTrigger>
            <TabsTrigger value="holidays" className="flex items-center space-x-2">
              <CalendarIcon size={16} />
              <span>Holidays</span>
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center space-x-2">
              <Newspaper size={16} />
              <span>Content</span>
            </TabsTrigger>
            <TabsTrigger value="policies" className="flex items-center space-x-2">
              <FileText size={16} />
              <span>HR Policies</span>
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

          <TabsContent value="holidays" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Add Holiday</CardTitle>
                  <CardDescription>Add new company holidays to the calendar</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddHoliday} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="holidayName">Holiday Name</Label>
                      <Input
                        id="holidayName"
                        value={holidayName}
                        onChange={(e) => setHolidayName(e.target.value)}
                        placeholder="Enter holiday name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Holiday Date</Label>
                      <Calendar
                        mode="single"
                        selected={holidayDate}
                        onSelect={setHolidayDate}
                        className="rounded-md border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="holidayType">Holiday Type</Label>
                      <Select value={holidayType} onValueChange={setHolidayType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select holiday type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="national">National Holiday</SelectItem>
                          <SelectItem value="company">Company Holiday</SelectItem>
                          <SelectItem value="optional">Optional Holiday</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="submit" className="w-full">Add Holiday</Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Holiday List</CardTitle>
                  <CardDescription>All scheduled holidays</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {holidays.map((holiday) => (
                      <div key={holiday.id} className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{holiday.name}</p>
                          <p className="text-sm text-muted-foreground">{holiday.date}</p>
                        </div>
                        <Badge variant="outline">{holiday.type}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>CEO Updates</CardTitle>
                <CardDescription>Add updates from leadership that appear on the homepage</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddCeoUpdate} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="ceoTitle">Update Title</Label>
                    <Input
                      id="ceoTitle"
                      value={ceoUpdateTitle}
                      onChange={(e) => setCeoUpdateTitle(e.target.value)}
                      placeholder="Enter update title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ceoContent">Update Content</Label>
                    <Textarea
                      id="ceoContent"
                      value={ceoUpdateContent}
                      onChange={(e) => setCeoUpdateContent(e.target.value)}
                      placeholder="Enter update content..."
                      rows={4}
                    />
                  </div>
                  <Button type="submit" className="w-full">Publish CEO Update</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="policies" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>HR Policy Management</CardTitle>
                <CardDescription>Upload and manage HR policies visible on the homepage</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddHrPolicy} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="policyTitle">Policy Title</Label>
                    <Input
                      id="policyTitle"
                      value={hrPolicyTitle}
                      onChange={(e) => setHrPolicyTitle(e.target.value)}
                      placeholder="Enter policy title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="policyContent">Policy Content</Label>
                    <Textarea
                      id="policyContent"
                      value={hrPolicyContent}
                      onChange={(e) => setHrPolicyContent(e.target.value)}
                      placeholder="Enter policy content..."
                      rows={6}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="policyFile">Upload Policy Document (Optional)</Label>
                    <Input
                      id="policyFile"
                      type="file"
                      accept=".pdf,.doc,.docx"
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    <Upload className="mr-2 h-4 w-4" />
                    Save HR Policy
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
