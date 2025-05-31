import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger, 
  DialogFooter, 
  DialogClose 
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Calendar, CheckCircle, Clock, Plus } from "lucide-react";
import { apiRequest } from '@/lib/queryClient';
import { formatDistanceToNow, format } from 'date-fns';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Define types for Notion task
interface NotionTask {
  notionId: string;
  title: string;
  description: string;
  section: string;
  isCompleted: boolean;
  dueDate: string | null;
  completedAt: string | null;
  priority: string | null;
  status: string;
  pharmacy: string;
}

// Schema for creating/updating tasks
const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  section: z.enum(["USP 795", "USP 797", "USP 800", "USP 825", "General"]),
  priority: z.enum(["High", "Medium", "Low"]),
  dueDate: z.string().optional(),
  pharmacy: z.string().default("Central Pharmacy"),
});

type TaskFormValues = z.infer<typeof taskSchema>;

export function NotionTaskList() {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null);
  const [showCompleted, setShowCompleted] = useState<boolean>(false);
  const queryClient = useQueryClient();

  // Fetch tasks from Notion
  const { data: tasks, isLoading, isError } = useQuery<NotionTask[]>({
    queryKey: ['/api/notion/tasks'],
  });

  // Create a new task
  const createTaskMutation = useMutation({
    mutationFn: async (data: TaskFormValues) => {
      const response = await apiRequest('/api/notion/tasks', {
        method: 'POST',
        data
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notion/tasks'] });
    }
  });

  // Update a task status
  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: Partial<NotionTask> }) => {
      const response = await apiRequest(`/api/notion/tasks/${id}`, {
        method: 'PATCH',
        data
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notion/tasks'] });
    }
  });

  // Filter tasks based on selected filters
  const filteredTasks = tasks?.filter(task => {
    // Filter by section
    if (selectedSection && task.section !== selectedSection) return false;
    
    // Filter by status
    if (selectedStatus && task.status !== selectedStatus) return false;
    
    // Filter by priority
    if (selectedPriority && task.priority !== selectedPriority) return false;
    
    // Filter by completion status
    if (!showCompleted && task.isCompleted) return false;
    
    return true;
  });

  // Handle marking a task as complete
  const handleCompleteTask = (task: NotionTask) => {
    updateTaskMutation.mutate({
      id: task.notionId,
      data: {
        isCompleted: !task.isCompleted,
        status: !task.isCompleted ? "Completed" : "To Do",
        completedAt: !task.isCompleted ? new Date().toISOString() : null
      }
    });
  };

  // Task creation form
  const TaskForm = () => {
    const form = useForm<TaskFormValues>({
      resolver: zodResolver(taskSchema),
      defaultValues: {
        title: "",
        description: "",
        section: "General",
        priority: "Medium",
        pharmacy: "Central Pharmacy"
      }
    });

    const onSubmit = (data: TaskFormValues) => {
      createTaskMutation.mutate(data);
      form.reset();
    };

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Task Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter task title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter task description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="section"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>USP Chapter</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select USP chapter" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="USP 795">USP 795</SelectItem>
                      <SelectItem value="USP 797">USP 797</SelectItem>
                      <SelectItem value="USP 800">USP 800</SelectItem>
                      <SelectItem value="USP 825">USP 825</SelectItem>
                      <SelectItem value="General">General</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Due Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="pharmacy"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pharmacy</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select pharmacy" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Central Pharmacy">Central Pharmacy</SelectItem>
                    <SelectItem value="North Branch">North Branch</SelectItem>
                    <SelectItem value="South Branch">South Branch</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button 
              type="submit" 
              disabled={createTaskMutation.isPending}
            >
              {createTaskMutation.isPending ? "Creating..." : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    );
  };
  
  // Function to get status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return <Badge className="bg-green-500">Completed</Badge>;
      case "In Progress":
        return <Badge className="bg-blue-500">In Progress</Badge>;
      case "Overdue":
        return <Badge className="bg-red-500">Overdue</Badge>;
      default:
        return <Badge className="bg-gray-500">To Do</Badge>;
    }
  };
  
  // Function to get priority badge styling
  const getPriorityBadge = (priority: string | null) => {
    if (!priority) return null;
    
    switch (priority) {
      case "High":
        return <Badge className="bg-red-500">High</Badge>;
      case "Medium":
        return <Badge className="bg-yellow-500">Medium</Badge>;
      case "Low":
        return <Badge className="bg-green-500">Low</Badge>;
      default:
        return null;
    }
  };
  
  // Function to get section badge styling
  const getSectionBadge = (section: string) => {
    switch (section) {
      case "USP 795":
        return <Badge className="bg-green-700">USP 795</Badge>;
      case "USP 797":
        return <Badge className="bg-blue-700">USP 797</Badge>;
      case "USP 800":
        return <Badge className="bg-red-700">USP 800</Badge>;
      case "USP 825":
        return <Badge className="bg-purple-700">USP 825</Badge>;
      default:
        return <Badge className="bg-gray-700">General</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Skeleton className="h-8 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
          <Skeleton className="h-10 w-[150px]" />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-10 w-[120px]" />
          ))}
        </div>
        
        <div className="border rounded-md">
          <div className="p-4 border-b">
            <Skeleton className="h-6 w-full" />
          </div>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="p-4 border-b">
              <div className="space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-[80px]" />
                  <Skeleton className="h-5 w-[80px]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-red-500">Error Loading Tasks</CardTitle>
          <CardDescription>
            There was a problem connecting to Notion. Please ensure your integration is properly set up.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-6">
            <AlertCircle className="h-12 w-12 text-red-500" />
            <p className="ml-4">Check your Notion integration settings and try again.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Notion USP Compliance Tasks</h2>
          <p className="text-muted-foreground">
            Manage pharmacy compliance tasks across USP chapters
          </p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Compliance Task</DialogTitle>
              <DialogDescription>
                Add a new task to track USP compliance activities
              </DialogDescription>
            </DialogHeader>
            <TaskForm />
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <Select onValueChange={(value) => setSelectedSection(value === "all" ? null : value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by USP Chapter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Chapters</SelectItem>
            <SelectItem value="USP 795">USP 795</SelectItem>
            <SelectItem value="USP 797">USP 797</SelectItem>
            <SelectItem value="USP 800">USP 800</SelectItem>
            <SelectItem value="USP 825">USP 825</SelectItem>
            <SelectItem value="General">General</SelectItem>
          </SelectContent>
        </Select>
        
        <Select onValueChange={(value) => setSelectedStatus(value === "all" ? null : value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="To Do">To Do</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
        
        <Select onValueChange={(value) => setSelectedPriority(value === "all" ? null : value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
          </SelectContent>
        </Select>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="showCompleted" 
            checked={showCompleted} 
            onCheckedChange={(checked) => setShowCompleted(checked as boolean)} 
          />
          <label 
            htmlFor="showCompleted" 
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Show Completed
          </label>
        </div>
      </div>
      
      {/* Tasks Table */}
      {filteredTasks && filteredTasks.length > 0 ? (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead>Task</TableHead>
                <TableHead>USP Chapter</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.map((task) => (
                <TableRow key={task.notionId} className={task.isCompleted ? "bg-gray-50 dark:bg-gray-800/50" : ""}>
                  <TableCell>
                    <Checkbox 
                      checked={task.isCompleted} 
                      onCheckedChange={() => handleCompleteTask(task)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{task.title}</div>
                    {task.description && (
                      <div className="text-sm text-muted-foreground line-clamp-1">
                        {task.description}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{getSectionBadge(task.section)}</TableCell>
                  <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                  <TableCell>{getStatusBadge(task.status)}</TableCell>
                  <TableCell>
                    {task.dueDate ? (
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>
                          {format(new Date(task.dueDate), 'MMM d, yyyy')}
                          <div className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })}
                          </div>
                        </span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">No due date</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="border rounded-md p-8 flex flex-col items-center justify-center text-center">
          <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-full mb-4">
            <CheckCircle className="h-6 w-6 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-medium">No tasks found</h3>
          <p className="text-muted-foreground mt-1">
            {selectedSection || selectedStatus || selectedPriority ? 
              "Try changing your filters or create a new task." : 
              "Create your first compliance task to get started."}
          </p>
        </div>
      )}
    </div>
  );
}