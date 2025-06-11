
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Newspaper, FileText, Upload, Edit, Trash2, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const ContentManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [ceoUpdateTitle, setCeoUpdateTitle] = useState('');
  const [ceoUpdateContent, setCeoUpdateContent] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [hrPolicyTitle, setHrPolicyTitle] = useState('');
  const [hrPolicyContent, setHrPolicyContent] = useState('');
  const [hrPolicyCategory, setHrPolicyCategory] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Fetch CEO updates
  const { data: ceoUpdates } = useQuery({
    queryKey: ['admin-ceo-updates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ceo_updates')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch HR policies
  const { data: hrPolicies } = useQuery({
    queryKey: ['admin-hr-policies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hr_policies')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Add CEO update mutation
  const addCeoUpdateMutation = useMutation({
    mutationFn: async () => {
      if (!ceoUpdateTitle || !ceoUpdateContent) {
        throw new Error('Please fill in all fields');
      }

      const { error } = await supabase
        .from('ceo_updates')
        .insert({
          title: ceoUpdateTitle,
          content: ceoUpdateContent,
          is_featured: isFeatured,
          created_by: user?.id
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-ceo-updates'] });
      queryClient.invalidateQueries({ queryKey: ['ceo-updates'] }); // Refresh homepage data
      setCeoUpdateTitle('');
      setCeoUpdateContent('');
      setIsFeatured(false);
      toast({
        title: "Success",
        description: "CEO update published successfully!"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to publish CEO update",
        variant: "destructive"
      });
    }
  });

  // Add HR policy mutation
  const addHrPolicyMutation = useMutation({
    mutationFn: async () => {
      if (!hrPolicyTitle || !hrPolicyContent || !hrPolicyCategory) {
        throw new Error('Please fill in all fields');
      }

      const { error } = await supabase
        .from('hr_policies')
        .insert({
          title: hrPolicyTitle,
          content: hrPolicyContent,
          category: hrPolicyCategory,
          created_by: user?.id,
          is_active: true
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-hr-policies'] });
      queryClient.invalidateQueries({ queryKey: ['hr-policies'] }); // Refresh homepage data
      setHrPolicyTitle('');
      setHrPolicyContent('');
      setHrPolicyCategory('');
      setUploadedFile(null);
      toast({
        title: "Success",
        description: "HR policy created successfully!"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create HR policy",
        variant: "destructive"
      });
    }
  });

  // Delete content mutations
  const deleteCeoUpdateMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('ceo_updates')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-ceo-updates'] });
      queryClient.invalidateQueries({ queryKey: ['ceo-updates'] });
      toast({
        title: "Success",
        description: "CEO update deleted successfully!"
      });
    }
  });

  const deleteHrPolicyMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('hr_policies')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-hr-policies'] });
      queryClient.invalidateQueries({ queryKey: ['hr-policies'] });
      toast({
        title: "Success",
        description: "HR policy deleted successfully!"
      });
    }
  });

  const handleAddCeoUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    addCeoUpdateMutation.mutate();
  };

  const handleAddHrPolicy = (e: React.FormEvent) => {
    e.preventDefault();
    addHrPolicyMutation.mutate();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      // TODO: Implement actual file upload to Supabase Storage
      console.log('File uploaded:', file.name);
      toast({
        title: "Info",
        description: `File "${file.name}" selected. File upload functionality will be implemented soon.`
      });
    }
  };

  return (
    <Tabs defaultValue="ceo-updates" className="space-y-6">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="ceo-updates" className="flex items-center space-x-2">
          <Newspaper size={16} />
          <span>CEO Updates</span>
        </TabsTrigger>
        <TabsTrigger value="hr-policies" className="flex items-center space-x-2">
          <FileText size={16} />
          <span>HR Policies</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="ceo-updates" className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Publish CEO Update</CardTitle>
              <CardDescription>Share important updates from leadership</CardDescription>
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
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ceoContent">Update Content</Label>
                  <Textarea
                    id="ceoContent"
                    value={ceoUpdateContent}
                    onChange={(e) => setCeoUpdateContent(e.target.value)}
                    placeholder="Enter update content..."
                    rows={6}
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={isFeatured}
                    onCheckedChange={(checked) => setIsFeatured(checked as boolean)}
                  />
                  <Label htmlFor="featured">Mark as featured</Label>
                </div>
                <Button type="submit" className="w-full" disabled={addCeoUpdateMutation.isPending}>
                  <Newspaper className="mr-2 h-4 w-4" />
                  {addCeoUpdateMutation.isPending ? 'Publishing...' : 'Publish CEO Update'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent CEO Updates</CardTitle>
              <CardDescription>Published updates from leadership</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ceoUpdates?.slice(0, 3).map((update) => (
                  <div key={update.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{update.title}</h4>
                      <div className="flex items-center space-x-2">
                        {update.is_featured && <Badge variant="default">Featured</Badge>}
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => deleteCeoUpdateMutation.mutate(update.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      {update.content}
                    </p>
                    <div className="text-xs text-muted-foreground">
                      {new Date(update.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All CEO Updates</CardTitle>
            <CardDescription>Complete list of CEO communications</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ceoUpdates?.map((update) => (
                  <TableRow key={update.id}>
                    <TableCell className="font-medium">{update.title}</TableCell>
                    <TableCell>{new Date(update.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {update.is_featured ? (
                        <Badge variant="default">Yes</Badge>
                      ) : (
                        <Badge variant="secondary">No</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => deleteCeoUpdateMutation.mutate(update.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="hr-policies" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Add HR Policy</CardTitle>
            <CardDescription>Create and manage company policies</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddHrPolicy} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="policyTitle">Policy Title</Label>
                  <Input
                    id="policyTitle"
                    value={hrPolicyTitle}
                    onChange={(e) => setHrPolicyTitle(e.target.value)}
                    placeholder="Enter policy title"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="policyCategory">Category</Label>
                  <Input
                    id="policyCategory"
                    value={hrPolicyCategory}
                    onChange={(e) => setHrPolicyCategory(e.target.value)}
                    placeholder="e.g., Work Arrangements, Benefits"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="policyContent">Policy Content</Label>
                <Textarea
                  id="policyContent"
                  value={hrPolicyContent}
                  onChange={(e) => setHrPolicyContent(e.target.value)}
                  placeholder="Enter policy content..."
                  rows={6}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="policyFile">Upload Policy Document (Optional)</Label>
                <Input
                  id="policyFile"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                />
                {uploadedFile && (
                  <p className="text-sm text-muted-foreground">
                    Selected: {uploadedFile.name}
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={addHrPolicyMutation.isPending}>
                <Upload className="mr-2 h-4 w-4" />
                {addHrPolicyMutation.isPending ? 'Saving...' : 'Save HR Policy'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>HR Policy Directory</CardTitle>
            <CardDescription>All company policies and procedures</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hrPolicies?.map((policy) => (
                  <TableRow key={policy.id}>
                    <TableCell className="font-medium">{policy.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{policy.category}</Badge>
                    </TableCell>
                    <TableCell>{new Date(policy.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={policy.is_active ? 'default' : 'secondary'}>
                        {policy.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => deleteHrPolicyMutation.mutate(policy.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default ContentManagement;
