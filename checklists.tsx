import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Check, Clock, AlertTriangle, X, Filter, Search, Calendar, User } from "lucide-react";

export default function Checklists() {
  const [selectedPharmacy, setSelectedPharmacy] = useState("Central Pharmacy");
  const [activeTab, setActiveTab] = useState("upcoming");
  
  const { data: tasks, isLoading } = useQuery({
    queryKey: [`/api/tasks/${selectedPharmacy}`, { status: activeTab }],
  });
  
  const formatDueDate = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
    return `${diffDays} days`;
  };
  
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "High":
        return (
          <Badge variant="outline" className="bg-danger-100 dark:bg-danger-900/30 text-danger-700 dark:text-danger-500">
            High
          </Badge>
        );
      case "Medium":
        return (
          <Badge variant="outline" className="bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-500">
            Medium
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
            Low
          </Badge>
        );
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return (
          <Badge variant="outline" className="bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-500 flex items-center">
            <Check className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case "In Progress":
        return (
          <Badge variant="outline" className="bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-500 flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            In Progress
          </Badge>
        );
      case "Overdue":
        return (
          <Badge variant="outline" className="bg-danger-100 dark:bg-danger-900/30 text-danger-700 dark:text-danger-500 flex items-center">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Overdue
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            Open
          </Badge>
        );
    }
  };
  
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Compliance Checklists</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Track and manage compliance tasks and due dates</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={selectedPharmacy} onValueChange={setSelectedPharmacy}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Select pharmacy" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Central Pharmacy">Central Pharmacy</SelectItem>
              <SelectItem value="Oncology Pharmacy">Oncology Pharmacy</SelectItem>
              <SelectItem value="Satellite Pharmacy">Satellite Pharmacy</SelectItem>
            </SelectContent>
          </Select>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-1 h-4 w-4" />
                <span>New Task</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="title" className="text-sm font-medium">Task Title</label>
                  <Input id="title" placeholder="Enter task title" />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="description" className="text-sm font-medium">Description</label>
                  <textarea 
                    id="description" 
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
                    placeholder="Enter task description"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="dueDate" className="text-sm font-medium">Due Date</label>
                    <Input id="dueDate" type="date" />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="priority" className="text-sm font-medium">Priority</label>
                    <Select defaultValue="medium">
                      <SelectTrigger id="priority">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <label htmlFor="assignee" className="text-sm font-medium">Assign To</label>
                  <Select defaultValue="1">
                    <SelectTrigger id="assignee">
                      <SelectValue placeholder="Select assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Dr. Maria Chen</SelectItem>
                      <SelectItem value="2">Jennifer Wu</SelectItem>
                      <SelectItem value="3">Robert Johnson</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <label htmlFor="chapter" className="text-sm font-medium">USP Chapter</label>
                  <Select defaultValue="795">
                    <SelectTrigger id="chapter">
                      <SelectValue placeholder="Select USP chapter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="795">USP 795</SelectItem>
                      <SelectItem value="797">USP 797</SelectItem>
                      <SelectItem value="800">USP 800</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <DialogTrigger asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogTrigger>
                <Button type="submit">Create Task</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Task Overview</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-2.5 top-2.5 text-gray-500 dark:text-gray-400" />
                <Input 
                  placeholder="Search tasks..." 
                  className="pl-8 h-9 w-[200px] md:w-[300px]" 
                />
              </div>
              <Button variant="outline" size="sm" className="h-9">
                <Filter className="h-4 w-4 mr-1" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="in-progress">In Progress</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="overdue">Overdue</TabsTrigger>
            </TabsList>
            
            {["upcoming", "in-progress", "completed", "overdue"].map((tab) => (
              <TabsContent key={tab} value={tab} className="pt-4">
                {isLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">
                          <Checkbox />
                        </TableHead>
                        <TableHead>Task</TableHead>
                        <TableHead>Chapter</TableHead>
                        <TableHead>Assigned To</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tasks && tasks.map((task: any) => (
                        <TableRow key={task.id}>
                          <TableCell>
                            <Checkbox />
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{task.title}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{task.description}</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">USP {task.requirementId ? '797' : '795'}</Badge>
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-7 h-7 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-medium mr-2">
                                {task.assignedTo === 1 ? 'MC' : task.assignedTo === 2 ? 'JW' : 'RJ'}
                              </div>
                              <span>{task.assignedTo === 1 ? 'Dr. Chen' : task.assignedTo === 2 ? 'J. Wu' : 'R. Johnson'}</span>
                            </div>
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" />
                              {task.dueDate ? formatDueDate(task.dueDate) : 'No date'}
                            </div>
                          </TableCell>
                          <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                          <TableCell>{getStatusBadge(task.status)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <User className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-danger-600 hover:text-danger-700 dark:text-danger-500 dark:hover:text-danger-400">
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      
                      {/* Show empty state if no data */}
                      {(!tasks || tasks.length === 0) && (
                        <TableRow>
                          <TableCell colSpan={8} className="h-24 text-center">
                            <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                              <AlertTriangle className="h-8 w-8 mb-2" />
                              <p>No tasks found</p>
                              <Button variant="outline" size="sm" className="mt-2">
                                <Plus className="h-4 w-4 mr-1" />
                                Add a task
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                <>
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </>
              ) : (
                <>
                  <div className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-danger-100 dark:bg-danger-900/30 flex items-center justify-center text-danger-600 dark:text-danger-500 mr-4">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">USP 797 Sterile Room Certification Renewal</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Requires external vendor inspection and documentation</p>
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-2">
                        <User className="h-3 w-3 mr-1" />
                        <span>Assigned to: Jennifer Wu, PharmD</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-danger-50 dark:bg-danger-900/50 text-danger-700 dark:text-danger-500">Due in 3 days</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-warning-100 dark:bg-warning-900/30 flex items-center justify-center text-warning-600 dark:text-warning-500 mr-4">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">USP 800 Staff Competency Assessment</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Annual staff training on hazardous drug handling</p>
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-2">
                        <User className="h-3 w-3 mr-1" />
                        <span>Assigned to: Robert Johnson, Training Coord.</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-warning-50 dark:bg-warning-900/50 text-warning-700 dark:text-warning-500">Due in 8 days</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-500 mr-4">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">USP 795 SOP Review</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Quarterly review of non-sterile compounding procedures</p>
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-2">
                        <User className="h-3 w-3 mr-1" />
                        <span>Assigned to: Dr. Maria Chen</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary-50 dark:bg-primary-900/50 text-primary-700 dark:text-primary-500">Due in 14 days</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Task Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-success-100 dark:bg-success-900/30 flex items-center justify-center text-success-600 dark:text-success-500 mr-3">
                      <Check className="h-4 w-4" />
                    </div>
                    <span>Completed</span>
                  </div>
                  <div className="text-xl font-bold">12</div>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-warning-100 dark:bg-warning-900/30 flex items-center justify-center text-warning-600 dark:text-warning-500 mr-3">
                      <Clock className="h-4 w-4" />
                    </div>
                    <span>In Progress</span>
                  </div>
                  <div className="text-xl font-bold">8</div>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 mr-3">
                      <Clock className="h-4 w-4" />
                    </div>
                    <span>Upcoming</span>
                  </div>
                  <div className="text-xl font-bold">5</div>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-danger-100 dark:bg-danger-900/30 flex items-center justify-center text-danger-600 dark:text-danger-500 mr-3">
                      <AlertTriangle className="h-4 w-4" />
                    </div>
                    <span>Overdue</span>
                  </div>
                  <div className="text-xl font-bold">2</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
