import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ChevronDown, 
  ChevronUp, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Building, 
  BookOpen,
  MoveRight 
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from 'wouter';

// Task type definition based on our Notion data
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

// Component to display tasks organized by USP chapter
export function NotionTaskDashboard() {
  // State for filters
  const [pharmacyFilter, setPharmacyFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  
  // Fetch tasks from Notion
  const { data: tasks, isLoading, error } = useQuery<NotionTask[]>({ 
    queryKey: ['/api/notion/tasks'], 
    staleTime: 60000 // 1 minute
  });

  // Count tasks by chapter for the badge counts
  const getChapterCount = (chapter: string) => {
    if (!tasks) return 0;
    return tasks.filter(task => task.section === chapter).length;
  };

  // Calculate completion percentage for progress bars
  const getCompletionPercentage = (chapter: string) => {
    if (!tasks) return 0;
    const chapterTasks = tasks.filter(task => task.section === chapter);
    if (chapterTasks.length === 0) return 0;
    
    const completedTasks = chapterTasks.filter(task => task.isCompleted);
    return Math.round((completedTasks.length / chapterTasks.length) * 100);
  };
  
  // Filter tasks by pharmacy, priority, and status
  const getFilteredTasks = (chapter: string) => {
    if (!tasks) return [];
    
    return tasks.filter(task => {
      // Filter by chapter
      if (task.section !== chapter) return false;
      
      // Filter by pharmacy
      if (pharmacyFilter !== 'All' && task.pharmacy !== pharmacyFilter) return false;
      
      // Filter by priority
      if (priorityFilter !== 'All' && task.priority !== priorityFilter) return false;
      
      // Filter by status
      if (statusFilter !== 'All' && task.status !== statusFilter) return false;
      
      return true;
    });
  };
  
  // Sort tasks by priority and due date
  const getSortedTasks = (tasks: NotionTask[]) => {
    return [...tasks].sort((a, b) => {
      // First by completion status
      if (a.isCompleted !== b.isCompleted) {
        return a.isCompleted ? 1 : -1;
      }
      
      // Then by priority (High > Medium > Low)
      const priorityOrder = { High: 0, Medium: 1, Low: 2 };
      const priorityDiff = 
        (priorityOrder[a.priority as keyof typeof priorityOrder] || 999) - 
        (priorityOrder[b.priority as keyof typeof priorityOrder] || 999);
      
      if (priorityDiff !== 0) return priorityDiff;
      
      // Then by due date (if available)
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      } else if (a.dueDate) {
        return -1;
      } else if (b.dueDate) {
        return 1;
      }
      
      // Lastly by title alphabetically
      return a.title.localeCompare(b.title);
    });
  };

  // Get unique pharmacy locations for the filter
  const getUniquePharmacies = () => {
    if (!tasks) return [];
    const pharmacies = new Set(tasks.map(task => task.pharmacy));
    return Array.from(pharmacies).sort();
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>USP Compliance Tasks</CardTitle>
          <CardDescription>Loading task data from Notion...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>USP Compliance Tasks</CardTitle>
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
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-bold">USP Compliance Tasks</CardTitle>
            <CardDescription>
              Track and manage pharmacy compliance tasks across all USP chapters
            </CardDescription>
          </div>
          <Link href="/tasks">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              View All Tasks <MoveRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Filters Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="text-sm font-medium mb-1 block">Pharmacy Location</label>
            <Select value={pharmacyFilter} onValueChange={setPharmacyFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Pharmacies" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Pharmacies</SelectItem>
                {getUniquePharmacies().map(pharmacy => (
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
        
        {/* Tasks Tabs by USP Chapter */}
        <Tabs defaultValue="USP 797">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="USP 795" className="relative">
              <span>USP 795</span>
              <Badge variant="secondary" className="ml-2">{getChapterCount('USP 795')}</Badge>
            </TabsTrigger>
            <TabsTrigger value="USP 797" className="relative">
              <span>USP 797</span>
              <Badge variant="secondary" className="ml-2">{getChapterCount('USP 797')}</Badge>
            </TabsTrigger>
            <TabsTrigger value="USP 800" className="relative">
              <span>USP 800</span>
              <Badge variant="secondary" className="ml-2">{getChapterCount('USP 800')}</Badge>
            </TabsTrigger>
            <TabsTrigger value="USP 825" className="relative">
              <span>USP 825</span>
              <Badge variant="secondary" className="ml-2">{getChapterCount('USP 825')}</Badge>
            </TabsTrigger>
          </TabsList>
          
          {/* USP 795 Tab Content */}
          <TabsContent value="USP 795" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">USP 795 - Non-sterile Preparations</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Completion: </span>
                <Progress value={getCompletionPercentage('USP 795')} className="w-40 h-2" />
                <span className="text-sm font-medium">{getCompletionPercentage('USP 795')}%</span>
              </div>
            </div>
            <Separator />
            
            {getSortedTasks(getFilteredTasks('USP 795')).length > 0 ? (
              <div className="space-y-4">
                {getSortedTasks(getFilteredTasks('USP 795')).map(task => (
                  <TaskCard key={task.notionId} task={task} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <BookOpen className="mx-auto h-12 w-12 mb-3 opacity-20" />
                <h3 className="text-lg font-medium mb-1">No tasks found</h3>
                <p className="text-sm">Try adjusting your filters or create a new USP 795 task.</p>
              </div>
            )}
          </TabsContent>
          
          {/* USP 797 Tab Content */}
          <TabsContent value="USP 797" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">USP 797 - Sterile Preparations</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Completion: </span>
                <Progress value={getCompletionPercentage('USP 797')} className="w-40 h-2" />
                <span className="text-sm font-medium">{getCompletionPercentage('USP 797')}%</span>
              </div>
            </div>
            <Separator />
            
            {getSortedTasks(getFilteredTasks('USP 797')).length > 0 ? (
              <div className="space-y-4">
                {getSortedTasks(getFilteredTasks('USP 797')).map(task => (
                  <TaskCard key={task.notionId} task={task} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <BookOpen className="mx-auto h-12 w-12 mb-3 opacity-20" />
                <h3 className="text-lg font-medium mb-1">No tasks found</h3>
                <p className="text-sm">Try adjusting your filters or create a new USP 797 task.</p>
              </div>
            )}
          </TabsContent>
          
          {/* USP 800 Tab Content */}
          <TabsContent value="USP 800" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">USP 800 - Hazardous Drugs</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Completion: </span>
                <Progress value={getCompletionPercentage('USP 800')} className="w-40 h-2" />
                <span className="text-sm font-medium">{getCompletionPercentage('USP 800')}%</span>
              </div>
            </div>
            <Separator />
            
            {getSortedTasks(getFilteredTasks('USP 800')).length > 0 ? (
              <div className="space-y-4">
                {getSortedTasks(getFilteredTasks('USP 800')).map(task => (
                  <TaskCard key={task.notionId} task={task} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <BookOpen className="mx-auto h-12 w-12 mb-3 opacity-20" />
                <h3 className="text-lg font-medium mb-1">No tasks found</h3>
                <p className="text-sm">Try adjusting your filters or create a new USP 800 task.</p>
              </div>
            )}
          </TabsContent>
          
          {/* USP 825 Tab Content */}
          <TabsContent value="USP 825" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">USP 825 - Radiopharmaceuticals</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Completion: </span>
                <Progress value={getCompletionPercentage('USP 825')} className="w-40 h-2" />
                <span className="text-sm font-medium">{getCompletionPercentage('USP 825')}%</span>
              </div>
            </div>
            <Separator />
            
            {getSortedTasks(getFilteredTasks('USP 825')).length > 0 ? (
              <div className="space-y-4">
                {getSortedTasks(getFilteredTasks('USP 825')).map(task => (
                  <TaskCard key={task.notionId} task={task} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <BookOpen className="mx-auto h-12 w-12 mb-3 opacity-20" />
                <h3 className="text-lg font-medium mb-1">No tasks found</h3>
                <p className="text-sm">Try adjusting your filters or create a new USP 825 task.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

// Individual task card component
function TaskCard({ task }: { task: NotionTask }) {
  const [expanded, setExpanded] = useState(false);
  
  // Format date to readable format
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  // Get priority badge color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };
  
  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Done': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'In Progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'Blocked': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'; // To Do
    }
  };
  
  return (
    <div className={`border rounded-lg p-4 ${task.isCompleted ? 'bg-muted/50' : 'bg-card'}`}>
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-3">
          {task.isCompleted ? (
            <CheckCircle2 className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
          ) : (
            <Clock className="h-5 w-5 text-amber-500 mt-1 flex-shrink-0" />
          )}
          
          <div>
            <h4 className={`font-medium text-base ${task.isCompleted ? 'text-muted-foreground line-through' : ''}`}>
              {task.title}
            </h4>
            
            <div className="flex flex-wrap gap-2 mt-2">
              <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                {task.priority} Priority
              </span>
              
              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(task.status)}`}>
                {task.status}
              </span>
              
              {task.dueDate && (
                <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(task.dueDate)}
                </span>
              )}
              
              <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 flex items-center gap-1">
                <Building className="h-3 w-3" />
                {task.pharmacy}
              </span>
            </div>
          </div>
        </div>
        
        <button 
          onClick={() => setExpanded(!expanded)}
          className="text-muted-foreground hover:text-foreground"
        >
          {expanded ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>
      </div>
      
      {expanded && (
        <div className="mt-4 text-sm text-muted-foreground">
          <p>{task.description || 'No description provided.'}</p>
          
          {task.completedAt && (
            <div className="mt-2 text-xs flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3 text-green-500" />
              <span>Completed on {formatDate(task.completedAt)}</span>
            </div>
          )}
          
          <div className="mt-3 flex gap-2">
            <Link href={`/tasks/edit/${task.notionId}`}>
              <Button variant="outline" size="sm">
                Edit Task
              </Button>
            </Link>
            
            {!task.isCompleted && (
              <Link href={`/tasks/complete/${task.notionId}`}>
                <Button size="sm" variant="default">
                  Mark Complete
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}