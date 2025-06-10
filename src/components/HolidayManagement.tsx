
import React, { useState } from 'react';
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
  const [holidayName, setHolidayName] = useState('');
  const [holidayDate, setHolidayDate] = useState<Date>();
  const [holidayType, setHolidayType] = useState('');
  const [holidayDescription, setHolidayDescription] = useState('');

  // Mock holidays data - replace with API call
  const [holidays, setHolidays] = useState([
    { id: 1, name: 'New Year', date: '2024-01-01', type: 'National Holiday', description: 'New Year celebration' },
    { id: 2, name: 'Independence Day', date: '2024-07-04', type: 'National Holiday', description: 'National Independence Day' },
    { id: 3, name: 'Company Anniversary', date: '2024-09-15', type: 'Company Holiday', description: 'Annual company celebration' },
    { id: 4, name: 'Christmas', date: '2024-12-25', type: 'National Holiday', description: 'Christmas celebration' }
  ]);

  const handleAddHoliday = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!holidayName || !holidayDate || !holidayType) return;

    const newHoliday = {
      id: Date.now(),
      name: holidayName,
      date: holidayDate.toISOString().split('T')[0],
      type: holidayType,
      description: holidayDescription
    };

    // TODO: Replace with API call
    // await addHoliday(newHoliday);
    
    setHolidays(prev => [...prev, newHoliday]);
    
    // Reset form
    setHolidayName('');
    setHolidayDate(undefined);
    setHolidayType('');
    setHolidayDescription('');
    
    console.log('Holiday added:', newHoliday);
  };

  const handleDeleteHoliday = (id: number) => {
    // TODO: Replace with API call
    // await deleteHoliday(id);
    
    setHolidays(prev => prev.filter(holiday => holiday.id !== id));
    console.log('Holiday deleted:', id);
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
