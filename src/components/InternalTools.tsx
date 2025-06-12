
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Code, Database, Settings, Users, BarChart3, FileText, Calendar } from 'lucide-react';

const InternalTools = () => {
  // Mock data for internal tools - replace with your actual tools
  const tools = [
    {
      id: 1,
      name: 'Sahai Engineer',
      description: 'Internal tool for writing code',
      url: 'sahaiengineer.avaulti.net',
      category: 'AI Development',
      status: 'Active',
      icon: Code,
      access: 'All Engineers'
    },
    {
      id: 2,
      name: 'Data Analytics Dashboard',
      description: 'Real-time analytics and insights for company metrics',
      url: '#',
      category: 'Analytics',
      status: 'Active',
      icon: BarChart3,
      access: 'Managers, Data Team'
    },
    {
      id: 3,
      name: 'Internal Knowledge Base',
      description: 'Company documentation and technical knowledge repository',
      url: '#',
      category: 'Documentation',
      status: 'Active',
      icon: FileText,
      access: 'All Employees'
    },
    {
      id: 4,
      name: 'Resource Management System',
      description: 'Manage computational resources and cloud infrastructure',
      url: '#',
      category: 'Infrastructure',
      status: 'Active',
      icon: Database,
      access: 'DevOps, Engineers'
    },
    {
      id: 5,
      name: 'Client Project Tracker',
      description: 'Track progress on client AI implementation projects',
      url: '#',
      category: 'Project Management',
      status: 'Active',
      icon: BarChart3,
      access: 'Project Managers, Leadership'
    }
  ];

  const categories = ['All', 'AI Development', 'Analytics', 'Documentation', 'Infrastructure', 'Project Management'];
  const [selectedCategory, setSelectedCategory] = React.useState('All');

  const filteredTools = selectedCategory === 'All' 
    ? tools 
    : tools.filter(tool => tool.category === selectedCategory);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'default';
      case 'beta': return 'secondary';
      case 'maintenance': return 'destructive';
      default: return 'outline';
    }
  };

  const handleToolAccess = (toolUrl: string, toolName: string) => {
    console.log(`Accessing tool: ${toolName} at ${toolUrl}`);
    // In a real implementation, this would handle authentication and redirects
    if (toolUrl === '#') {
      alert(`${toolName} - This would redirect to the actual tool in a real implementation`);
    } else {
      window.open(toolUrl, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Internal Tools</h1>
          <p className="text-lg text-muted-foreground">Access your company's internal development and management tools</p>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => {
            const IconComponent = tool.icon;
            return (
              <Card key={tool.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{tool.name}</CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs">{tool.category}</Badge>
                          <Badge variant={getStatusColor(tool.status)} className="text-xs">{tool.status}</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  <CardDescription className="mt-2">{tool.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Access:</span>
                      <span className="font-medium">{tool.access}</span>
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={() => handleToolAccess(tool.url, tool.name)}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Open Tool
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredTools.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No tools found for the selected category.</p>
          </div>
        )}

        {/* Quick Access Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Quick Access</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Code className="h-6 w-6" />
              <span className="text-sm">Dev Portal</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Database className="h-6 w-6" />
              <span className="text-sm">DB Admin</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <BarChart3 className="h-6 w-6" />
              <span className="text-sm">Analytics</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Settings className="h-6 w-6" />
              <span className="text-sm">System Config</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternalTools;
