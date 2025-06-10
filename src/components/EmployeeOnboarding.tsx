
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { UserPlus, FileText, Briefcase } from 'lucide-react';

const EmployeeOnboarding = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: '',
    role: '',
    startDate: '',
    manager: '',
    bio: '',
    skills: ''
  });

  // Mock data for pending onboardings
  const pendingOnboardings = [
    { 
      id: 1, 
      name: 'Alice Cooper', 
      email: 'alice.cooper@techcorp.com', 
      department: 'Engineering', 
      role: 'Software Engineer',
      startDate: '2024-06-15',
      status: 'Pending'
    },
    { 
      id: 2, 
      name: 'Bob Miller', 
      email: 'bob.miller@techcorp.com', 
      department: 'Design', 
      role: 'UI/UX Designer',
      startDate: '2024-06-20',
      status: 'In Progress'
    }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Onboarding form submitted:', formData);
    // This will be implemented with Supabase
    
    // Reset form
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      department: '',
      role: '',
      startDate: '',
      manager: '',
      bio: '',
      skills: ''
    });
  };

  const handleStatusUpdate = (id: number, newStatus: string) => {
    console.log('Updating onboarding status:', id, newStatus);
    // This will be implemented with Supabase
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Employee Onboarding</h1>
          <p className="text-muted-foreground">Manage new employee onboarding and role assignments</p>
        </div>

        <Tabs defaultValue="new-employee" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="new-employee" className="flex items-center space-x-2">
              <UserPlus size={16} />
              <span>Add New Employee</span>
            </TabsTrigger>
            <TabsTrigger value="pending" className="flex items-center space-x-2">
              <FileText size={16} />
              <span>Pending Onboardings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="new-employee" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Briefcase size={20} />
                  <span>New Employee Information</span>
                </CardTitle>
                <CardDescription>
                  Add a new employee to the intranet system and assign their role
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        placeholder="Enter first name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        placeholder="Enter last name"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Company Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="employee@techcorp.com"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Select value={formData.department} onValueChange={(value) => handleInputChange('department', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="engineering">Engineering</SelectItem>
                          <SelectItem value="design">Design</SelectItem>
                          <SelectItem value="hr">Human Resources</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="sales">Sales</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Employee Role</Label>
                      <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Employee">Employee</SelectItem>
                          <SelectItem value="Senior Employee">Senior Employee</SelectItem>
                          <SelectItem value="Manager">Manager</SelectItem>
                          <SelectItem value="HR">HR</SelectItem>
                          <SelectItem value="CEO">CEO</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="manager">Reporting Manager</Label>
                      <Select value={formData.manager} onValueChange={(value) => handleInputChange('manager', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select manager" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mike-johnson">Mike Johnson</SelectItem>
                          <SelectItem value="sarah-wilson">Sarah Wilson</SelectItem>
                          <SelectItem value="david-chen">David Chen</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Employee Bio</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      placeholder="Brief description about the employee..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="skills">Skills & Expertise</Label>
                    <Textarea
                      id="skills"
                      value={formData.skills}
                      onChange={(e) => handleInputChange('skills', e.target.value)}
                      placeholder="List key skills and areas of expertise..."
                      rows={3}
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    <UserPlus size={16} className="mr-2" />
                    Add Employee to Intranet
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pending" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pending Onboardings</CardTitle>
                <CardDescription>
                  Track and manage employee onboarding progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingOnboardings.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell className="font-medium">{employee.name}</TableCell>
                        <TableCell>{employee.email}</TableCell>
                        <TableCell>{employee.department}</TableCell>
                        <TableCell>{employee.role}</TableCell>
                        <TableCell>{employee.startDate}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={employee.status === 'Pending' ? 'secondary' : 'default'}
                          >
                            {employee.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Select onValueChange={(value) => handleStatusUpdate(employee.id, value)}>
                            <SelectTrigger className="w-32">
                              <SelectValue placeholder="Update" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="In Progress">In Progress</SelectItem>
                              <SelectItem value="Completed">Completed</SelectItem>
                              <SelectItem value="On Hold">On Hold</SelectItem>
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
        </Tabs>
      </div>
    </div>
  );
};

export default EmployeeOnboarding;
