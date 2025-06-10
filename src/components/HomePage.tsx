
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Newspaper, FileText, User, TrendingUp } from 'lucide-react';

const HomePage = () => {
  // Mock data - will be replaced with real data from Supabase
  const aiNews = [
    {
      title: "OpenAI Releases GPT-4 Turbo with Enhanced Capabilities",
      summary: "New model shows significant improvements in reasoning and code generation.",
      date: "2024-06-08",
      source: "OpenAI Blog"
    },
    {
      title: "Google Announces Gemini 1.5 Pro with 2M Token Context",
      summary: "Revolutionary context length enables processing of entire codebases.",
      date: "2024-06-07",
      source: "Google AI"
    },
    {
      title: "Anthropic's Claude 3 Opus Shows Human-Level Performance",
      summary: "New benchmarks reveal unprecedented reasoning capabilities.",
      date: "2024-06-06",
      source: "Anthropic Research"
    }
  ];

  const ceoUpdates = [
    {
      title: "Q2 2024 Company Growth Update",
      content: "I'm excited to share that we've exceeded our Q2 targets with 40% growth in AI product adoption...",
      date: "2024-06-05",
      author: "Sarah Johnson, CEO"
    },
    {
      title: "New AI Research Initiative Launch",
      content: "We're launching a new research division focused on multimodal AI applications...",
      date: "2024-05-28",
      author: "Sarah Johnson, CEO"
    }
  ];

  const upcomingHolidays = [
    { name: "Independence Day", date: "2024-07-04", type: "National Holiday" },
    { name: "Labor Day", date: "2024-09-02", type: "National Holiday" },
    { name: "Company Anniversary", date: "2024-09-15", type: "Company Holiday" }
  ];

  const hrPolicies = [
    { title: "Remote Work Policy", updated: "2024-05-15" },
    { title: "AI Tool Usage Guidelines", updated: "2024-06-01" },
    { title: "Professional Development Budget", updated: "2024-04-20" },
    { title: "Code of Conduct", updated: "2024-03-10" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome to TechCorp Intranet</h1>
          <p className="text-lg text-muted-foreground">Your hub for AI innovation and company updates</p>
        </div>

        {/* Company Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>About TechCorp</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              TechCorp is a leading AI software development company specializing in cutting-edge artificial intelligence solutions. 
              Founded in 2020, we've grown to a team of 150+ engineers, researchers, and innovators working on the future of AI technology.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <div className="text-2xl font-bold text-primary">150+</div>
                <div className="text-sm text-muted-foreground">Employees</div>
              </div>
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <div className="text-2xl font-bold text-primary">50+</div>
                <div className="text-sm text-muted-foreground">AI Products</div>
              </div>
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <div className="text-2xl font-bold text-primary">4</div>
                <div className="text-sm text-muted-foreground">Years of Innovation</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Latest AI News */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Newspaper className="h-5 w-5" />
                <span>Latest AI News</span>
              </CardTitle>
              <CardDescription>Stay updated with the latest developments in AI</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {aiNews.map((news, index) => (
                <div key={index} className="border-l-4 border-primary pl-4 py-2">
                  <h4 className="font-semibold text-sm">{news.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{news.summary}</p>
                  <div className="flex justify-between items-center mt-2">
                    <Badge variant="secondary" className="text-xs">{news.source}</Badge>
                    <span className="text-xs text-muted-foreground">{news.date}</span>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">View All AI News</Button>
            </CardContent>
          </Card>

          {/* CEO Updates */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>CEO Updates</span>
              </CardTitle>
              <CardDescription>Latest messages from leadership</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {ceoUpdates.map((update, index) => (
                <div key={index} className="p-4 bg-accent/50 rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">{update.title}</h4>
                  <p className="text-xs text-muted-foreground mb-3">{update.content}</p>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">{update.author}</span>
                    <span className="text-muted-foreground">{update.date}</span>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">View All Updates</Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Upcoming Holidays */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Upcoming Holidays</span>
              </CardTitle>
              <CardDescription>Plan ahead with our holiday calendar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingHolidays.map((holiday, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-accent/30 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{holiday.name}</p>
                    <p className="text-xs text-muted-foreground">{holiday.type}</p>
                  </div>
                  <Badge variant="outline">{holiday.date}</Badge>
                </div>
              ))}
              <Button variant="outline" className="w-full">View Full Calendar</Button>
            </CardContent>
          </Card>

          {/* HR Policies */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>HR Policies</span>
              </CardTitle>
              <CardDescription>Important company policies and guidelines</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {hrPolicies.map((policy, index) => (
                <div key={index} className="flex justify-between items-center p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
                  <div>
                    <p className="font-medium text-sm">{policy.title}</p>
                    <p className="text-xs text-muted-foreground">Last updated: {policy.updated}</p>
                  </div>
                  <Button variant="ghost" size="sm">View</Button>
                </div>
              ))}
              <Button variant="outline" className="w-full">View All Policies</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
