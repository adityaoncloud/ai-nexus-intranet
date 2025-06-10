
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarIcon, Mail, Video, Users, Clock, RefreshCw } from 'lucide-react';

interface Meeting {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  attendees: string[];
  location?: string;
  isOnline: boolean;
  status: 'upcoming' | 'ongoing' | 'completed';
}

interface Email {
  id: string;
  from: string;
  subject: string;
  preview: string;
  date: string;
  isImportant: boolean;
  isRead: boolean;
}

const EmployeeCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock data - replace with Microsoft Graph API calls
  const mockMeetings: Meeting[] = [
    {
      id: '1',
      title: 'Weekly Team Standup',
      startTime: '2024-06-10T09:00:00',
      endTime: '2024-06-10T09:30:00',
      attendees: ['john.doe@techcorp.com', 'jane.smith@techcorp.com'],
      isOnline: true,
      status: 'upcoming'
    },
    {
      id: '2',
      title: 'Project Review Meeting',
      startTime: '2024-06-10T14:00:00',
      endTime: '2024-06-10T15:00:00',
      attendees: ['mike.johnson@techcorp.com', 'sarah.wilson@techcorp.com'],
      location: 'Conference Room A',
      isOnline: false,
      status: 'upcoming'
    }
  ];

  const mockEmails: Email[] = [
    {
      id: '1',
      from: 'hr@techcorp.com',
      subject: 'Important: Updated Employee Handbook',
      preview: 'We have updated our employee handbook with new policies...',
      date: '2024-06-10T08:30:00',
      isImportant: true,
      isRead: false
    },
    {
      id: '2',
      from: 'ceo@techcorp.com',
      subject: 'Company Update - Q2 Results',
      preview: 'I am pleased to share our Q2 performance results...',
      date: '2024-06-09T16:00:00',
      isImportant: true,
      isRead: false
    }
  ];

  useEffect(() => {
    fetchCalendarData();
  }, [selectedDate]);

  const fetchCalendarData = async () => {
    setLoading(true);
    
    try {
      // TODO: Replace with Microsoft Graph API calls
      // const [meetingsResponse, emailsResponse] = await Promise.all([
      //   fetch('/api/microsoft/calendar/events'),
      //   fetch('/api/microsoft/mail/important')
      // ]);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMeetings(mockMeetings);
      setEmails(mockEmails);
      
      console.log('Calendar data fetched for date:', selectedDate);
    } catch (error) {
      console.error('Error fetching calendar data:', error);
    } finally {
      setLoading(false);
    }
  };

  const connectToMicrosoft = async () => {
    // TODO: Implement Microsoft OAuth flow
    // This would redirect to Microsoft login and request calendar/mail permissions
    console.log('Connecting to Microsoft services...');
    
    // Mock connection success
    alert('Microsoft services connected successfully! (Mock implementation)');
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'default';
      case 'ongoing': return 'destructive';
      case 'completed': return 'secondary';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">My Calendar</h2>
          <p className="text-muted-foreground">Meetings and important emails</p>
        </div>
        <Button onClick={connectToMicrosoft} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Connect Microsoft
        </Button>
      </div>

      <Tabs defaultValue="calendar" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="meetings">Today's Meetings</TabsTrigger>
          <TabsTrigger value="emails">Important Emails</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CalendarIcon className="h-5 w-5" />
                  <span>Calendar View</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>
                  {selectedDate?.toDateString() || 'Select a date'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <RefreshCw className="h-6 w-6 animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-3">
                    {meetings.length > 0 ? (
                      meetings.map((meeting) => (
                        <div key={meeting.id} className="border rounded-lg p-3">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium">{meeting.title}</h4>
                            <Badge variant={getStatusColor(meeting.status)}>
                              {meeting.status}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>{formatTime(meeting.startTime)} - {formatTime(meeting.endTime)}</span>
                            </div>
                            {meeting.isOnline ? (
                              <div className="flex items-center space-x-1">
                                <Video className="h-4 w-4" />
                                <span>Teams</span>
                              </div>
                            ) : (
                              <span>{meeting.location}</span>
                            )}
                          </div>
                          <div className="flex items-center space-x-1 mt-2 text-sm text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span>{meeting.attendees.length} attendees</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground py-4">
                        No meetings scheduled for this date
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="meetings">
          <Card>
            <CardHeader>
              <CardTitle>Today's Meetings</CardTitle>
              <CardDescription>All meetings scheduled for today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {meetings.map((meeting) => (
                  <div key={meeting.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{meeting.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {formatTime(meeting.startTime)} - {formatTime(meeting.endTime)}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        {meeting.isOnline ? (
                          <Badge variant="outline">
                            <Video className="h-3 w-3 mr-1" />
                            Teams Meeting
                          </Badge>
                        ) : (
                          <Badge variant="outline">{meeting.location}</Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      {meeting.isOnline && (
                        <Button size="sm">
                          <Video className="h-4 w-4 mr-2" />
                          Join
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emails">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Mail className="h-5 w-5" />
                <span>Important Emails</span>
              </CardTitle>
              <CardDescription>High priority emails from Outlook</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {emails.map((email) => (
                  <div key={email.id} className={`p-4 border rounded-lg ${!email.isRead ? 'bg-accent/20' : ''}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{email.subject}</h4>
                          {email.isImportant && (
                            <Badge variant="destructive" className="text-xs">Important</Badge>
                          )}
                          {!email.isRead && (
                            <Badge variant="default" className="text-xs">Unread</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{email.from}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(email.date)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{email.preview}</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Open in Outlook
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployeeCalendar;
