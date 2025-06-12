
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Plus, Trash2 } from 'lucide-react';

const HolidayManagement = () => {
  const queryClient = useQueryClient();
  const [holidayName, setHolidayName] = useState('');
  const [holidayDate, setHolidayDate] = useState<Date>();
  const [holidayType, setHolidayType] = useState('');
  const [holidayDescription, setHolidayDescription] = useState('');

  // Mock holidays data - replace with API call
  const { data: holidays = [], isLoading } = useQuery({
    queryKey: ['holidays-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('holidays')
        .select('*')
        .order('date', { ascending: true });
      if (error) throw error;
      return data;
    }
  });

  const addHolidayMutation = useMutation({
    mutationFn: async (newHoliday: any) => {
      const { error } = await supabase
        .from('holidays')
        .insert({
          name: newHoliday.name,
          date: newHoliday.date,
          description: newHoliday.description,
          is_company_wide: true, // or set based on your UI
          // created_by: user?.id, // If you have user context, add this
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['holidays-admin'] });
      setHolidayName('');
      setHolidayDate(undefined);
      setHolidayType('');
      setHolidayDescription('');
    }
  });

const deleteHolidayMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('holidays')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['holidays-admin'] });
    }
  });

  const handleAddHoliday = (e: React.FormEvent) => {
    e.preventDefault();
    if (!holidayName || !holidayDate) return;
    addHolidayMutation.mutate({
      name: holidayName,
      date: holidayDate.toISOString().split('T')[0],
      description: holidayDescription,
      // type: holidayType, // If you want to store type, add a column in DB
    });
  };

  const handleDeleteHoliday = (id: string) => {
    deleteHolidayMutation.mutate(id);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'National Holiday': return 'default';
      case 'Company Holiday': return 'secondary';
      case 'Optional Holiday': return 'outline';
      default: return 'secondary';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5" />
            <span>Add New Holiday</span>
          </CardTitle>
          <CardDescription>Add holidays to the company calendar</CardDescription>
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
                required
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
              <Select value={holidayType} onValueChange={setHolidayType} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select holiday type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="National Holiday">National Holiday</SelectItem>
                  <SelectItem value="Company Holiday">Company Holiday</SelectItem>
                  <SelectItem value="Optional Holiday">Optional Holiday</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="holidayDescription">Description (Optional)</Label>
              <Input
                id="holidayDescription"
                value={holidayDescription}
                onChange={(e) => setHolidayDescription(e.target.value)}
                placeholder="Enter holiday description"
              />
            </div>
            
            <Button type="submit" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Holiday
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Holiday Calendar</CardTitle>
          <CardDescription>All scheduled holidays</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {holidays.map((holiday) => (
                <TableRow key={holiday.id}>
                  <TableCell className="font-medium">{holiday.name}</TableCell>
                  <TableCell>{holiday.date}</TableCell>
                  <TableCell>
                    <Badge variant={getTypeColor(holiday.type)}>{holiday.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteHoliday(holiday.id)}
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
    </div>
  );
};

export default HolidayManagement;
