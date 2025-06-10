
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Newspaper, RefreshCw, ExternalLink } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  snippet: string;
  source: string;
  date: string;
  url: string;
}

const NewsManager = () => {
  const [newsQuery, setNewsQuery] = useState('technology trends');
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock news data - replace with SERP API
  const mockNews: NewsItem[] = [
    {
      id: '1',
      title: 'AI Revolution in Enterprise Software',
      snippet: 'Latest developments in artificial intelligence are transforming how businesses operate...',
      source: 'TechCrunch',
      date: '2024-06-10',
      url: 'https://techcrunch.com/ai-enterprise'
    },
    {
      id: '2',
      title: 'Remote Work Best Practices for 2024',
      snippet: 'Companies are adapting new strategies for remote workforce management...',
      source: 'Harvard Business Review',
      date: '2024-06-09',
      url: 'https://hbr.org/remote-work'
    },
    {
      id: '3',
      title: 'Cybersecurity Trends Every Business Should Know',
      snippet: 'Emerging threats and protection strategies in the digital workplace...',
      source: 'Forbes',
      date: '2024-06-08',
      url: 'https://forbes.com/cybersecurity'
    }
  ];

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    
    try {
      // TODO: Replace with actual SERP API call
      // const response = await fetch(`/api/news?q=${encodeURIComponent(newsQuery)}`);
      // const data = await response.json();
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Use mock data for now
      setNewsData(mockNews);
      
      console.log('News fetched for query:', newsQuery);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshNews = () => {
    fetchNews();
  };

  const handleQuerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchNews();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Newspaper className="h-5 w-5" />
            <span>Industry News</span>
          </CardTitle>
          <CardDescription>Stay updated with latest industry trends</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleQuerySubmit} className="flex space-x-2 mb-4">
            <div className="flex-1">
              <Label htmlFor="newsQuery" className="sr-only">Search Query</Label>
              <Input
                id="newsQuery"
                value={newsQuery}
                onChange={(e) => setNewsQuery(e.target.value)}
                placeholder="Enter search terms..."
              />
            </div>
            <Button type="submit" disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Fetching...' : 'Refresh'}
            </Button>
          </form>
          
          <div className="space-y-4">
            {newsData.map((item) => (
              <div key={item.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-lg">{item.title}</h4>
                  <Badge variant="outline">{item.source}</Badge>
                </div>
                <p className="text-muted-foreground text-sm mb-3">{item.snippet}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">{item.date}</span>
                  <Button variant="outline" size="sm" asChild>
                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Read More
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          {newsData.length === 0 && !loading && (
            <div className="text-center py-8 text-muted-foreground">
              No news articles found. Try adjusting your search query.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NewsManager;
