import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Filter, 
  PlusCircle,
  CalendarClock,
  Layers,
  Building,
  ArrowUpDown,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Task interface matching our Notion data
interface NotionTask {
  notionId: string;
  title: string;
  description: string;
  section: string;
  isCompleted: boolean;
  dueDate: string | null;
  completedAt: string | null;
  priority: string;
  status: string;
  pharmacy: string;
}

export function TaskList() {
  // State for filters and sorting
  const [sectionFilter, setSectionFilter] = useState<string>('All');
  const [pharmacyFilter, setPharmacyFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortField, setSortField] = useState<string>('dueDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Fetch tasks from Notion
  const { data: tasks, isLoading, error } = useQuery<NotionTask[]>({
    queryKey: ['/api/notion/tasks'],
    staleTime: 60000, // 1 minute
  });
  
  // Filter tasks based on all criteria
  const getFilteredTasks = () => {
    if (!tasks) return [];
    
    return tasks.filter(task => {
      // Search query filter
      if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !task.description.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Section filter
      if (sectionFilter !== 'All' && task.section !== sectionFilter) {
        return false;
      }
      
      // Pharmacy filter
      if (pharmacyFilter !== 'All' && task.pharmacy !== pharmacyFilter) {
        return false;
      }
      
      // Priority filter
      if (priorityFilter !== 'All' && task.priority !== priorityFilter) {
        return false;
      }
      
      // Status filter
      if (statusFilter !== 'All' && task.status !== statusFilter) {
        return false;
      }
      
      return true;
    });
  };
  
  // Sort tasks based on field and direction
  const getSortedTasks = (filteredTasks: NotionTask[]) => {
    return [...filteredTasks].sort((a, b) => {
      let aValue, bValue;
      
      switch (sortField) {
        case 'title':
          aValue = a.title;
          bValue = b.title;
          break;
        case 'priority':
          // Custom order for priority
          const priorityOrder = { High: 0, Medium: 1, Low: 2 };
          aValue = priorityOrder[a.priority as keyof typeof priorityOrder] || 999;
          bValue = priorityOrder[b.priority as keyof typeof priorityOrder] || 999;
          break;
        case 'dueDate':
          // Handle null dates
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return sortDirection === 'asc' ? 1 : -1;
          if (!b.dueDate) return sortDirection === 'asc' ? -1 : 1;
          
          aValue = new Date(a.dueDate).getTime();
          bValue = new Date(b.dueDate).getTime();
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'section':
          aValue = a.section;
          bValue = b.section;
          break;
        case 'pharmacy':
          aValue = a.pharmacy;
          bValue = b.pharmacy;
          break;
        default:
          aValue = a.title;
          bValue = b.title;
      }
      
      // Handle string comparisons
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }
      
      // Handle numeric comparisons
      return sortDirection === 'asc' ? (aValue - bValue) : (bValue - aValue);
    });
  };
  
  // Function to toggle sort direction or change sort field
  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Extract unique values for filters
  const getUniqueValues = (field: keyof NotionTask) => {
    if (!tasks) return [];
    const uniqueValues = new Set(tasks.map(task => task[field]));
    return Array.from(uniqueValues).sort();
  };
  
  // Format date to readable format
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };
  
  // Get priority badge based on priority level
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'High':
        return <Badge variant="destructive">High</Badge>;
      case 'Medium':
        return <Badge variant="secondary">Medium</Badge>;
      case 'Low':
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };
  
  // Get status indicator based on status
  const getStatusIndicator = (status: string, isCompleted: boolean) => {
    if (isCompleted) {
      return <div className="flex items-center"><CheckCircle2 className="h-4 w-4 text-green-500 mr-1" /> Done</div>;
    }
    
    switch (status) {
      case 'In Progress':
        return <div className="flex items-center"><Clock className="h-4 w-4 text-blue-500 mr-1" /> In Progress</div>;
      case 'Blocked':
        return <div className="flex items-center"><AlertCircle className="h-4 w-4 text-red-500 mr-1" /> Blocked</div>;
      default:
        return <div className="flex items-center"><Clock className="h-4 w-4 text-slate-400 mr-1" /> To Do</div>;
    }
  };
  
  // Get filtered and sorted tasks
  const filteredTasks = getFilteredTasks();
  const sortedTasks = getSortedTasks(filteredTasks);
  
  // Loading state
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Compliance Tasks</CardTitle>
          <CardDescription>Loading tasks from Notion...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Error state
  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Compliance Tasks</CardTitle>
          <CardDescription>Error loading tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-destructive/10 p-4 rounded-md text-destructive">
            <AlertCircle className="h-5 w-5 inline-block mr-2" />
            Failed to load tasks from Notion. Please check your connection and try again.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Compliance Tasks</CardTitle>
          <CardDescription>
            Manage all pharmacy compliance tasks
          </CardDescription>
        </div>
        <Link href="/tasks/create">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Task
          </Button>
        </Link>
      </CardHeader>
      
      <CardContent>
        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">USP Chapter</label>
              <Select value={sectionFilter} onValueChange={setSectionFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Chapters" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Chapters</SelectItem>
                  <SelectItem value="USP 795">USP 795</SelectItem>
                  <SelectItem value="USP 797">USP 797</SelectItem>
                  <SelectItem value="USP 800">USP 800</SelectItem>
                  <SelectItem value="USP 825">USP 825</SelectItem>
                  <SelectItem value="General">General</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Pharmacy</label>
              <Select value={pharmacyFilter} onValueChange={setPharmacyFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Pharmacies" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Pharmacies</SelectItem>
                  {getUniqueValues('pharmacy').map((pharmacy) => (
                    <SelectItem key={pharmacy} value={pharmacy}>{pharmacy}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Priority</label>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Priorities</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="To Do">To Do</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Done">Done</SelectItem>
                  <SelectItem value="Blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        {/* Task Count Summary */}
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {sortedTasks.length} of {tasks?.length || 0} tasks
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSectionFilter('All');
                setPharmacyFilter('All');
                setPriorityFilter('All');
                setStatusFilter('All');
                setSearchQuery('');
              }}
            >
              <Filter className="mr-1 h-4 w-4" /> Clear Filters
            </Button>
          </div>
        </div>
        
        {/* Tasks Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[30%]">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleSort('title')}
                    className="flex items-center gap-1 font-medium"
                  >
                    Task
                    {sortField === 'title' && (
                      <ArrowUpDown className="h-3 w-3" />
                    )}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleSort('section')}
                    className="flex items-center gap-1 font-medium"
                  >
                    <Layers className="h-3.5 w-3.5 mr-1" />
                    USP Chapter
                    {sortField === 'section' && (
                      <ArrowUpDown className="h-3 w-3" />
                    )}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleSort('pharmacy')}
                    className="flex items-center gap-1 font-medium"
                  >
                    <Building className="h-3.5 w-3.5 mr-1" />
                    Pharmacy
                    {sortField === 'pharmacy' && (
                      <ArrowUpDown className="h-3 w-3" />
                    )}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleSort('priority')}
                    className="flex items-center gap-1 font-medium"
                  >
                    Priority
                    {sortField === 'priority' && (
                      <ArrowUpDown className="h-3 w-3" />
                    )}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleSort('status')}
                    className="flex items-center gap-1 font-medium"
                  >
                    Status
                    {sortField === 'status' && (
                      <ArrowUpDown className="h-3 w-3" />
                    )}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleSort('dueDate')}
                    className="flex items-center gap-1 font-medium"
                  >
                    <CalendarClock className="h-3.5 w-3.5 mr-1" />
                    Due Date
                    {sortField === 'dueDate' && (
                      <ArrowUpDown className="h-3 w-3" />
                    )}
                  </Button>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedTasks.length > 0 ? (
                sortedTasks.map((task) => (
                  <TableRow key={task.notionId}>
                    <TableCell className="font-medium">
                      <Link href={`/tasks/${task.notionId}`} className="hover:underline">
                        {task.title}
                      </Link>
                    </TableCell>
                    <TableCell>{task.section}</TableCell>
                    <TableCell>{task.pharmacy}</TableCell>
                    <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                    <TableCell>{getStatusIndicator(task.status, task.isCompleted)}</TableCell>
                    <TableCell>{formatDate(task.dueDate)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/tasks/edit/${task.notionId}`}>
                          <Button variant="outline" size="sm">Edit</Button>
                        </Link>
                        {!task.isCompleted && (
                          <Link href={`/tasks/complete/${task.notionId}`}>
                            <Button size="sm">Complete</Button>
                          </Link>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No tasks found. Try adjusting your filters or create a new task.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}