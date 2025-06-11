
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const EmployeeOnboarding = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: '',
    role: '',
    startDate: '',
    manager: '',
    bio: '',
    skills: '',
    password: ''
  });

  // Fetch existing employees to show as managers
  const { data: existingEmployees } = useQuery({
    queryKey: ['existing-employees'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, role')
        .in('role', ['manager', 'hr', 'ceo', 'admin']);
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch pending onboardings (newly created users without complete profiles)
  const { data: pendingOnboardings } = useQuery({
    queryKey: ['pending-onboardings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .is('department', null)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Create new employee mutation
  const createEmployeeMutation = useMutation({
    mutationFn: async (employeeData: any) => {
      // First, create the user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: employeeData.email,
        password: employeeData.password,
        email_confirm: true,
        user_metadata: {
          full_name: `${employeeData.firstName} ${employeeData.lastName}`
        }
      });

      if (authError) throw authError;

      // Then update the profile with additional information
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: `${employeeData.firstName} ${employeeData.lastName}`,
          department: employeeData.department,
          position: employeeData.role,
          role: 'employee', // Default role is employee (least rights)
          manager_id: employeeData.manager || null,
          join_date: employeeData.startDate
        })
        .eq('id', authData.user.id);

      if (profileError) throw profileError;

      return authData.user;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-onboardings'] });
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        department: '',
        role: '',
        startDate: '',
        manager: '',
        bio: '',
        skills: '',
        password: ''
      });
      toast({
        title: "Success",
        description: "New employee has been added to the system with employee access rights!"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create employee",
        variant: "destructive"
      });
    }
  });

  // Update onboarding status mutation
  const updateOnboardingMutation = useMutation({
    mutationFn: async ({ employeeId, department, position }: { employeeId: string, department: string, position: string }) => {
      const { error } = await supabase
        .from('profiles')
        .update({
          department,
          position
        })
        .eq('id', employeeId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-onboardings'] });
      toast({
        title: "Success",
        description: "Employee onboarding updated successfully!"
      });
    }
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.password) {
      toast({
        title: "Error",
        description: "Password is required",
        variant: "destructive"
      });
      return;
    }

    createEmployeeMutation.mutate(formData);
  };

  const handleStatusUpdate = (employeeId: string, department: string, position: string) => {
    updateOnboardingMutation.mutate({ employeeId, department, position });
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
                  Add a new employee to the intranet system with employee access rights
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

                  <div className="space-y-2">
                    <Label htmlFor="password">Temporary Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="Enter temporary password"
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
                          <SelectItem value="Engineering">Engineering</SelectItem>
                          <SelectItem value="Design">Design</SelectItem>
                          <SelectItem value="Human Resources">Human Resources</SelectItem>
                          <SelectItem value="Marketing">Marketing</SelectItem>
                          <SelectItem value="Sales">Sales</SelectItem>
                          <SelectItem value="Finance">Finance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Position</Label>
                      <Input
                        id="role"
                        value={formData.role}
                        onChange={(e) => handleInputChange('role', e.target.value)}
                        placeholder="e.g. Software Engineer, Designer"
                        required
                      />
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
                          {existingEmployees?.map((manager) => (
                            <SelectItem key={manager.id} value={manager.id}>
                              {manager.full_name} ({manager.role})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={createEmployeeMutation.isPending}>
                    <UserPlus size={16} className="mr-2" />
                    {createEmployeeMutation.isPending ? 'Adding Employee...' : 'Add Employee to Intranet'}
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
                  Employees who need department and position assignment
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pendingOnboardings?.length ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Join Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingOnboardings.map((employee) => (
                        <TableRow key={employee.id}>
                          <TableCell className="font-medium">{employee.full_name}</TableCell>
                          <TableCell>{employee.email}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{employee.role}</Badge>
                          </TableCell>
                          <TableCell>{employee.join_date ? new Date(employee.join_date).toLocaleDateString() : 'Not set'}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {employee.department ? 'Complete' : 'Pending Department Assignment'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No pending onboardings</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EmployeeOnboarding;
