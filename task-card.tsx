import { useState } from "react";
import { 
  Calendar, 
  CheckCircle, 
  Clock, 
  Sliders, 
  XCircle,
  ClipboardList
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  status: "Pending" | "Completed" | "Overdue";
  priority: "High" | "Medium" | "Low";
  taskType: "Daily" | "Weekly" | "Monthly" | "Quarterly" | "Special";
  assignedTo: string;
  lastUpdated: string;
}

interface TaskCardProps {
  task: Task;
  onStatusChange: (taskId: number, newStatus: "Pending" | "Completed" | "Overdue") => void;
  canComplete: boolean;
}

export function TaskCard({ task, onStatusChange, canComplete }: TaskCardProps) {
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const { toast } = useToast();
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-900/20 dark:border-red-800";
      case "Medium":
        return "text-amber-600 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-900/20 dark:border-amber-800";
      case "Low":
        return "text-green-600 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-900/20 dark:border-green-800";
      default:
        return "text-blue-600 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-900/20 dark:border-blue-800";
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "text-green-600 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-900/20 dark:border-green-800";
      case "Overdue":
        return "text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-900/20 dark:border-red-800";
      default:
        return "text-blue-600 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-900/20 dark:border-blue-800";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  return (
    <>
      <Card className="overflow-hidden mb-4">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row">
            <div className="flex-1 p-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">{task.title}</h3>
                  <Badge className={`${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </Badge>
                  <Badge variant="outline">
                    {task.taskType}
                  </Badge>
                </div>
                <Badge className={`${getStatusColor(task.status)}`}>
                  {task.status}
                </Badge>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {task.description}
              </p>
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Due: {formatDate(task.dueDate)}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  Updated: {new Date(task.lastUpdated).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <Sliders className="h-4 w-4 mr-1" />
                  Assigned to: {task.assignedTo === "admin" ? "Admin" : 
                                task.assignedTo === "pharmacist" ? "Pharmacist" : 
                                "Pharmacy Technician"}
                </div>
              </div>
            </div>
            
            {canComplete && (
              <div className="flex md:flex-col justify-center items-center p-4 bg-gray-50 dark:bg-gray-800 gap-2">
                <Button 
                  variant="outline"
                  className="flex items-center gap-1 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                  onClick={() => setShowTaskDialog(true)}
                >
                  <ClipboardList className="h-4 w-4" />
                  Perform Task
                </Button>
                <Button 
                  variant="outline"
                  className="flex items-center gap-1"
                  onClick={() => {
                    onStatusChange(task.id, "Completed");
                    toast({
                      title: "Task completed",
                      description: "Task has been marked as complete",
                    });
                  }}
                >
                  <CheckCircle className="h-4 w-4" />
                  Complete
                </Button>
                {task.status !== "Overdue" && (
                  <Button 
                    variant="ghost"
                    className="text-gray-500 hover:text-gray-700 flex items-center gap-1"
                    onClick={() => {
                      onStatusChange(task.id, "Overdue");
                    }}
                  >
                    <XCircle className="h-4 w-4" />
                    Mark Overdue
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showTaskDialog} onOpenChange={setShowTaskDialog}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Perform Task: {task.title}</DialogTitle>
            <DialogDescription>
              Complete the required steps for this task
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
              <h3 className="font-medium text-lg mb-2">Task Details</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-3">{task.description}</p>
              <div className="flex flex-wrap gap-2 text-sm">
                <Badge className={`${getPriorityColor(task.priority)}`}>{task.priority} Priority</Badge>
                <Badge variant="outline">Due: {formatDate(task.dueDate)}</Badge>
              </div>
            </div>
            
            {/* Temperature Monitoring */}
            {task.taskType === "Daily" && task.title.includes("temperature") && (
              <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4">
                <h3 className="font-medium mb-3">Record Temperature Readings</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Refrigerator 1 (°C)</label>
                    <Input type="number" placeholder="Enter temperature" step="0.1" />
                    <div className="text-xs text-gray-500">Acceptable range: 2°C - 8°C</div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Refrigerator 2 (°C)</label>
                    <Input type="number" placeholder="Enter temperature" step="0.1" />
                    <div className="text-xs text-gray-500">Acceptable range: 2°C - 8°C</div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Freezer (°C)</label>
                    <Input type="number" placeholder="Enter temperature" step="0.1" />
                    <div className="text-xs text-gray-500">Acceptable range: -25°C to -10°C</div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Room Temperature (°C)</label>
                    <Input type="number" placeholder="Enter temperature" step="0.1" />
                    <div className="text-xs text-gray-500">Acceptable range: 20°C - 25°C</div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Cleaning Verification */}
            {task.taskType === "Daily" && task.title.includes("cleaning") && (
              <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4">
                <h3 className="font-medium mb-3">Cleaning Verification</h3>
                <div className="grid gap-3">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="counters" className="h-4 w-4 rounded border-gray-300" />
                    <label htmlFor="counters" className="text-sm font-medium">Clean and sanitize all countertops</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="equipment" className="h-4 w-4 rounded border-gray-300" />
                    <label htmlFor="equipment" className="text-sm font-medium">Clean all compounding equipment</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="floors" className="h-4 w-4 rounded border-gray-300" />
                    <label htmlFor="floors" className="text-sm font-medium">Clean floors in compounding area</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="waste" className="h-4 w-4 rounded border-gray-300" />
                    <label htmlFor="waste" className="text-sm font-medium">Empty waste containers</label>
                  </div>
                  <div className="mt-2">
                    <label className="text-sm font-medium">Cleaning Agent Used</label>
                    <Input placeholder="Enter cleaning product name" className="mt-1" />
                  </div>
                </div>
              </div>
            )}
            
            {/* Equipment Calibration */}
            {task.taskType === "Weekly" && task.title.includes("calibration") && (
              <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4">
                <h3 className="font-medium mb-3">Equipment Calibration</h3>
                <div className="grid gap-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Balance/Scale ID</label>
                    <Input placeholder="Enter equipment ID" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Standard Weight Used (g)</label>
                      <Input type="number" placeholder="Enter weight" step="0.001" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Measured Weight (g)</label>
                      <Input type="number" placeholder="Enter actual reading" step="0.001" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Calibration Result</label>
                    <select className="w-full rounded-md border border-gray-300 p-2">
                      <option value="pass">Pass</option>
                      <option value="fail">Fail - Requires Service</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
            
            {/* Monthly HEPA Filter & Air Exchange Inspection */}
            {task.taskType === "Monthly" && task.title.includes("HEPA") && (
              <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4">
                <h3 className="font-medium mb-3">HEPA Filter & Air Exchange Inspection</h3>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Primary Engineering Control (PEC) ID</label>
                    <Input placeholder="Enter PEC identifier" />
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">Inspection Checklist</h4>
                    <div className="grid gap-2">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="prefilters" className="h-4 w-4 rounded border-gray-300 cursor-pointer" />
                        <label htmlFor="prefilters" className="text-sm cursor-pointer">Pre-filters checked and replaced if needed</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="hepa" className="h-4 w-4 rounded border-gray-300 cursor-pointer" />
                        <label htmlFor="hepa" className="text-sm cursor-pointer">HEPA filter inspected with no visible damage</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="airflow" className="h-4 w-4 rounded border-gray-300 cursor-pointer" />
                        <label htmlFor="airflow" className="text-sm cursor-pointer">Airflow patterns verified</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="pressure" className="h-4 w-4 rounded border-gray-300 cursor-pointer" />
                        <label htmlFor="pressure" className="text-sm cursor-pointer">Room pressure differential verified</label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Room Pressure Reading (Pa)</label>
                      <Input type="number" placeholder="Enter pressure reading" step="0.1" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Air Changes Per Hour</label>
                      <Input type="number" placeholder="Enter ACPH value" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Certification Status</label>
                    <select className="w-full rounded-md border border-gray-300 p-2">
                      <option value="compliant">Compliant - No Action</option>
                      <option value="minor">Minor Issues - Schedule Maintenance</option>
                      <option value="critical">Critical Issues - Immediate Action Required</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
            
            {/* Quarterly Staff Assessment */}
            {task.taskType === "Quarterly" && task.title.includes("assessment") && (
              <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4">
                <h3 className="font-medium mb-3">Staff Competency Assessment</h3>
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Staff Member Name</label>
                      <Input placeholder="Enter name" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Position/Role</label>
                      <Input placeholder="Enter position" />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">Assessment Areas</h4>
                    <div className="grid gap-3">
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <label className="text-sm">Hand Hygiene Technique</label>
                          <div className="flex gap-2">
                            <div className="flex items-center">
                              <input id="hand-hygiene-pass" type="radio" name="hand-hygiene" className="mr-1 cursor-pointer" value="pass" /> 
                              <label htmlFor="hand-hygiene-pass" className="text-xs cursor-pointer">Pass</label>
                            </div>
                            <div className="flex items-center">
                              <input id="hand-hygiene-fail" type="radio" name="hand-hygiene" className="mr-1 cursor-pointer" value="fail" /> 
                              <label htmlFor="hand-hygiene-fail" className="text-xs cursor-pointer">Fail</label>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <label className="text-sm">Garbing Procedure</label>
                          <div className="flex gap-2">
                            <div className="flex items-center">
                              <input id="garbing-pass" type="radio" name="garbing" className="mr-1 cursor-pointer" value="pass" /> 
                              <label htmlFor="garbing-pass" className="text-xs cursor-pointer">Pass</label>
                            </div>
                            <div className="flex items-center">
                              <input id="garbing-fail" type="radio" name="garbing" className="mr-1 cursor-pointer" value="fail" /> 
                              <label htmlFor="garbing-fail" className="text-xs cursor-pointer">Fail</label>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <label className="text-sm">Aseptic Technique</label>
                          <div className="flex gap-2">
                            <div className="flex items-center">
                              <input id="aseptic-pass" type="radio" name="aseptic" className="mr-1 cursor-pointer" value="pass" /> 
                              <label htmlFor="aseptic-pass" className="text-xs cursor-pointer">Pass</label>
                            </div>
                            <div className="flex items-center">
                              <input id="aseptic-fail" type="radio" name="aseptic" className="mr-1 cursor-pointer" value="fail" /> 
                              <label htmlFor="aseptic-fail" className="text-xs cursor-pointer">Fail</label>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <label className="text-sm">Documentation Practices</label>
                          <div className="flex gap-2">
                            <div className="flex items-center">
                              <input id="documentation-pass" type="radio" name="documentation" className="mr-1 cursor-pointer" value="pass" /> 
                              <label htmlFor="documentation-pass" className="text-xs cursor-pointer">Pass</label>
                            </div>
                            <div className="flex items-center">
                              <input id="documentation-fail" type="radio" name="documentation" className="mr-1 cursor-pointer" value="fail" /> 
                              <label htmlFor="documentation-fail" className="text-xs cursor-pointer">Fail</label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Remediation Plan (if needed)</label>
                    <Textarea placeholder="Enter details of any required training or remediation" />
                  </div>
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Additional Notes</label>
              <Textarea placeholder="Enter any observations or notes about this task" />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTaskDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                onStatusChange(task.id, "Completed");
                setShowTaskDialog(false);
                toast({
                  title: "Task completed",
                  description: "Task has been performed and marked as complete",
                });
              }}
            >
              Complete Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}