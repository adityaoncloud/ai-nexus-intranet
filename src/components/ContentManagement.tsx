
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Newspaper, FileText, Upload, Edit, Trash2, Eye } from 'lucide-react';

interface CeoUpdate {
  id: string;
  title: string;
  content: string;
  author: string;
  publishDate: string;
  status: 'draft' | 'published';
}

interface HrPolicy {
  id: string;
  title: string;
  content: string;
  category: string;
  lastUpdated: string;
  version: string;
  documentUrl?: string;
}

const ContentManagement = () => {
  const [ceoUpdateTitle, setCeoUpdateTitle] = useState('');
  const [ceoUpdateContent, setCeoUpdateContent] = useState('');
  const [hrPolicyTitle, setHrPolicyTitle] = useState('');
  const [hrPolicyContent, setHrPolicyContent] = useState('');
  const [hrPolicyCategory, setHrPolicyCategory] = useState('');

  // Mock data - replace with API calls
  const [ceoUpdates, setCeoUpdates] = useState<CeoUpdate[]>([
    {
      id: '1',
      title: 'Q2 Performance and Vision for H2',
      content: 'Team, I am excited to share our outstanding Q2 results and outline our strategic vision for the second half of this year...',
      author: 'John Smith (CEO)',
      publishDate: '2024-06-01',
      status: 'published'
    },
    {
      id: '2',
      title: 'New Office Opening in Austin',
      content: 'We are thrilled to announce the opening of our new development center in Austin, Texas...',
      author: 'John Smith (CEO)',
      publishDate: '2024-05-15',
      status: 'published'
    }
  ]);

  const [hrPolicies, setHrPolicies] = useState<HrPolicy[]>([
    {
      id: '1',
      title: 'Remote Work Policy',
      content: 'This policy outlines the guidelines and expectations for remote work arrangements...',
      category: 'Work Arrangements',
      lastUpdated: '2024-05-20',
      version: '2.1'
    },
    {
      id: '2',
      title: 'Code of Conduct',
      content: 'Our code of conduct establishes the ethical standards and behavioral expectations...',
      category: 'Ethics & Compliance',
      lastUpdated: '2024-04-10',
      version: '1.5'
    }
  ]);

  const handleAddCeoUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!ceoUpdateTitle || !ceoUpdateContent) return;

    const newUpdate: CeoUpdate = {
      id: Date.now().toString(),
      title: ceoUpdateTitle,
      content: ceoUpdateContent,
      author: 'John Smith (CEO)', // This would come from auth context
      publishDate: new Date().toISOString().split('T')[0],
      status: 'published'
    };

    // TODO: Replace with API call
    // await createCeoUpdate(newUpdate);
    
    setCeoUpdates(prev => [newUpdate, ...prev]);
    
    setCeoUpdateTitle('');
    setCeoUpdateContent('');
    
    console.log('CEO update published:', newUpdate);
  };

  const handleAddHrPolicy = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!hrPolicyTitle || !hrPolicyContent || !hrPolicyCategory) return;

    const newPolicy: HrPolicy = {
      id: Date.now().toString(),
      title: hrPolicyTitle,
      content: hrPolicyContent,
      category: hrPolicyCategory,
      lastUpdated: new Date().toISOString().split('T')[0],
      version: '1.0'
    };

    // TODO: Replace with API call
    // await createHrPolicy(newPolicy);
    
    setHrPolicies(prev => [newPolicy, ...prev]);
    
    setHrPolicyTitle('');
    setHrPolicyContent('');
    setHrPolicyCategory('');
    
    console.log('HR policy created:', newPolicy);
  };

  const handleDeleteContent = (id: string, type: 'ceo' | 'hr') => {
    if (type === 'ceo') {
      // TODO: Replace with API call
      // await deleteCeoUpdate(id);
      setCeoUpdates(prev => prev.filter(update => update.id !== id));
    } else {
      // TODO: Replace with API call
      // await deleteHrPolicy(id);
      setHrPolicies(prev => prev.filter(policy => policy.id !== id));
    }
    console.log(`${type} content deleted:`, id);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // TODO: Implement file upload to storage
      // const uploadedUrl = await uploadFile(file);
      console.log('File uploaded:', file.name);
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
                <Button type="submit" className="w-full">
                  <Newspaper className="mr-2 h-4 w-4" />
                  Publish CEO Update
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
                {ceoUpdates.slice(0, 3).map((update) => (
                  <div key={update.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{update.title}</h4>
                      <Badge variant={update.status === 'published' ? 'default' : 'secondary'}>
                        {update.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      {update.content}
                    </p>
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>{update.publishDate}</span>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteContent(update.id, 'ceo')}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
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
                  <TableHead>Author</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ceoUpdates.map((update) => (
                  <TableRow key={update.id}>
                    <TableCell className="font-medium">{update.title}</TableCell>
                    <TableCell>{update.author}</TableCell>
                    <TableCell>{update.publishDate}</TableCell>
                    <TableCell>
                      <Badge variant={update.status === 'published' ? 'default' : 'secondary'}>
                        {update.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteContent(update.id, 'ceo')}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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
              </div>
              <Button type="submit" className="w-full">
                <Upload className="mr-2 h-4 w-4" />
                Save HR Policy
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
                  <TableHead>Version</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hrPolicies.map((policy) => (
                  <TableRow key={policy.id}>
                    <TableCell className="font-medium">{policy.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{policy.category}</Badge>
                    </TableCell>
                    <TableCell>{policy.version}</TableCell>
                    <TableCell>{policy.lastUpdated}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteContent(policy.id, 'hr')}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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
