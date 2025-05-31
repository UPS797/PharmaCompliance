import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
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
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Plus, 
  Calendar, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  ClipboardCheck, 
  FileDown,
  Search,
  User,
  Building,
  CalendarDays
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";

export default function Inspections() {
  const [selectedPharmacy, setSelectedPharmacy] = useState("Central Pharmacy");
  
  const { data: inspections, isLoading } = useQuery({
    queryKey: [`/api/inspections/${selectedPharmacy}`],
  });
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not scheduled";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return (
          <Badge variant="outline" className="bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-500 flex items-center">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case "Planned":
        return (
          <Badge variant="outline" className="bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-500 flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            Planned
          </Badge>
        );
      case "Canceled":
        return (
          <Badge variant="outline" className="bg-danger-100 dark:bg-danger-900/30 text-danger-700 dark:text-danger-500 flex items-center">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Canceled
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            Unknown
          </Badge>
        );
    }
  };

  const calculateDaysRemaining = (dateString: string) => {
    if (!dateString) return null;
    
    const date = new Date(dateString);
    const today = new Date();
    const timeDiff = date.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    return daysDiff;
  };
  
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Inspection Preparation</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Prepare for regulatory inspections and internal audits</p>
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
                <span>Schedule Inspection</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Schedule New Inspection</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="title" className="text-sm font-medium">Inspection Title</label>
                  <Input id="title" placeholder="Enter inspection title" />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="description" className="text-sm font-medium">Description</label>
                  <textarea 
                    id="description" 
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
                    placeholder="Enter inspection details"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="scheduled-date" className="text-sm font-medium">Scheduled Date</label>
                  <Input id="scheduled-date" type="date" />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="inspector" className="text-sm font-medium">Inspector Name</label>
                  <Input id="inspector" placeholder="Enter inspector's name" />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="inspector-org" className="text-sm font-medium">Inspector Organization</label>
                  <Select defaultValue="internal">
                    <SelectTrigger id="inspector-org">
                      <SelectValue placeholder="Select organization type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="internal">Internal Audit</SelectItem>
                      <SelectItem value="board">State Board of Pharmacy</SelectItem>
                      <SelectItem value="dea">DEA</SelectItem>
                      <SelectItem value="joint">Joint Commission</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button>Schedule Inspection</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {/* Upcoming Inspection Alert */}
      <Card className="bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800 mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start md:items-center gap-4">
              <div className="bg-primary-100 dark:bg-primary-800 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Upcoming State Board Inspection</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Prepare for the State Board of Pharmacy inspection scheduled for May 15, 2024</p>
              </div>
            </div>
            <div>
              <Badge className="bg-primary-600 text-white">
                21 days remaining
              </Badge>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Documentation Ready</span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">75%</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
            <div className="p-3 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Facility Preparation</span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">60%</span>
              </div>
              <Progress value={60} className="h-2" />
            </div>
            <div className="p-3 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Staff Training</span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">90%</span>
              </div>
              <Progress value={90} className="h-2" />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button>
              View Preparation Checklist
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Inspection History */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <CardTitle>Inspection History</CardTitle>
            <div className="flex items-center space-x-2 mt-2 md:mt-0">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-2.5 top-2.5 text-gray-500 dark:text-gray-400" />
                <Input 
                  placeholder="Search inspections..." 
                  className="pl-8 h-9 w-[200px] md:w-[300px]" 
                />
              </div>
              <Button variant="outline" size="sm" className="h-9">
                <FileDown className="h-4 w-4 mr-1" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All Inspections</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="pt-4">
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
                      <TableHead>Inspection</TableHead>
                      <TableHead>Inspector</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Findings</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Display actual inspections if available */}
                    {inspections && inspections.length > 0 ? (
                      inspections.map((inspection: any) => (
                        <TableRow key={inspection.id}>
                          <TableCell>
                            <div className="font-medium">{inspection.title}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{inspection.description}</div>
                          </TableCell>
                          <TableCell>{inspection.inspectorName || "Not assigned"}</TableCell>
                          <TableCell>{formatDate(inspection.scheduledDate)}</TableCell>
                          <TableCell>{getStatusBadge(inspection.status)}</TableCell>
                          <TableCell>
                            {inspection.findings ? (
                              <Badge className="bg-warning-600 text-white">
                                {typeof inspection.findings === 'string' 
                                  ? JSON.parse(inspection.findings).count || 0 
                                  : inspection.findings.count || 0} Issues
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-gray-100 dark:bg-gray-800">
                                No Data
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">View</Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      // Fallback example data in case no inspections are returned
                      [
                        { id: 1, title: "State Board of Pharmacy Inspection", description: "Annual inspection for USP compliance", inspector: "Jane Smith", date: "2023-04-18", status: "Completed", findings: 4 },
                        { id: 2, title: "Joint Commission Survey", description: "Triennial accreditation survey", inspector: "Mark Johnson", date: "2023-08-22", status: "Completed", findings: 2 },
                        { id: 3, title: "Internal USP 797 Audit", description: "Quarterly internal audit", inspector: "Dr. Maria Chen", date: "2023-12-10", status: "Completed", findings: 0 },
                        { id: 4, title: "State Board of Pharmacy Inspection", description: "Annual inspection for USP compliance", inspector: "To Be Determined", date: "2024-05-15", status: "Planned", findings: null },
                      ].map(inspection => (
                        <TableRow key={inspection.id}>
                          <TableCell>
                            <div className="font-medium">{inspection.title}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{inspection.description}</div>
                          </TableCell>
                          <TableCell>{inspection.inspector}</TableCell>
                          <TableCell>{inspection.date}</TableCell>
                          <TableCell>{getStatusBadge(inspection.status)}</TableCell>
                          <TableCell>
                            {inspection.findings !== null ? (
                              <Badge className="bg-warning-600 text-white">
                                {inspection.findings} Issues
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-gray-100 dark:bg-gray-800">
                                No Data
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">View</Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </TabsContent>

            <TabsContent value="upcoming" className="pt-4">
              {/* Upcoming inspections filtered from the same data */}
            </TabsContent>
            
            <TabsContent value="completed" className="pt-4">
              {/* Completed inspections filtered from the same data */}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Preparation Checklist */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Inspection Preparation Checklist</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-gray-100">Documentation</h3>
                <div className="space-y-3">
                  <div className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-md">
                    <Checkbox id="policy-sop" className="mr-3" />
                    <label htmlFor="policy-sop" className="flex-1 cursor-pointer">
                      <div className="font-medium text-gray-900 dark:text-gray-100">Policies and SOPs</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Ensure all policies and SOPs are current and available</div>
                    </label>
                    <Badge variant="outline" className="bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-500">
                      Complete
                    </Badge>
                  </div>
                  
                  <div className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-md">
                    <Checkbox id="training" className="mr-3" />
                    <label htmlFor="training" className="flex-1 cursor-pointer">
                      <div className="font-medium text-gray-900 dark:text-gray-100">Training Records</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Compile staff training documentation and competency assessments</div>
                    </label>
                    <Badge variant="outline" className="bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-500">
                      In Progress
                    </Badge>
                  </div>
                  
                  <div className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-md">
                    <Checkbox id="env-monitor" className="mr-3" />
                    <label htmlFor="env-monitor" className="flex-1 cursor-pointer">
                      <div className="font-medium text-gray-900 dark:text-gray-100">Environmental Monitoring Records</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Gather all environmental monitoring data for the past 12 months</div>
                    </label>
                    <Badge variant="outline" className="bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-500">
                      In Progress
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-gray-100">Facility</h3>
                <div className="space-y-3">
                  <div className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-md">
                    <Checkbox id="clean-room" className="mr-3" />
                    <label htmlFor="clean-room" className="flex-1 cursor-pointer">
                      <div className="font-medium text-gray-900 dark:text-gray-100">Clean Room Certification</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Verify clean room certification is current</div>
                    </label>
                    <Badge variant="outline" className="bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-500">
                      Complete
                    </Badge>
                  </div>
                  
                  <div className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-md">
                    <Checkbox id="equipment" className="mr-3" />
                    <label htmlFor="equipment" className="flex-1 cursor-pointer">
                      <div className="font-medium text-gray-900 dark:text-gray-100">Equipment Calibration</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Ensure all equipment calibration is up to date</div>
                    </label>
                    <Badge variant="outline" className="bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-500">
                      In Progress
                    </Badge>
                  </div>
                  
                  <div className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-md">
                    <Checkbox id="hazardous" className="mr-3" />
                    <label htmlFor="hazardous" className="flex-1 cursor-pointer">
                      <div className="font-medium text-gray-900 dark:text-gray-100">Hazardous Drug Handling</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Review hazardous drug handling procedures and containment</div>
                    </label>
                    <Badge variant="outline" className="bg-danger-100 dark:bg-danger-900/30 text-danger-700 dark:text-danger-500">
                      Not Started
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-gray-100">Staff Preparation</h3>
                <div className="space-y-3">
                  <div className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-md">
                    <Checkbox id="interview" className="mr-3" />
                    <label htmlFor="interview" className="flex-1 cursor-pointer">
                      <div className="font-medium text-gray-900 dark:text-gray-100">Mock Interviews</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Conduct mock interviews with staff</div>
                    </label>
                    <Badge variant="outline" className="bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-500">
                      Complete
                    </Badge>
                  </div>
                  
                  <div className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-md">
                    <Checkbox id="process-review" className="mr-3" />
                    <label htmlFor="process-review" className="flex-1 cursor-pointer">
                      <div className="font-medium text-gray-900 dark:text-gray-100">Process Reviews</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Review key processes with all staff members</div>
                    </label>
                    <Badge variant="outline" className="bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-500">
                      Complete
                    </Badge>
                  </div>
                  
                  <div className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-md">
                    <Checkbox id="emergency" className="mr-3" />
                    <label htmlFor="emergency" className="flex-1 cursor-pointer">
                      <div className="font-medium text-gray-900 dark:text-gray-100">Emergency Procedures</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Review emergency and spill procedures</div>
                    </label>
                    <Badge variant="outline" className="bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-500">
                      In Progress
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <Button>
                <ClipboardCheck className="mr-2 h-4 w-4" />
                Complete Checklist
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Inspection Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center mb-2">
                  <Building className="h-5 w-5 text-primary-600 dark:text-primary-500 mr-2" />
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">State Board Requirements</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Official state requirements for pharmacy compounding inspections.
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  View Document
                </Button>
              </div>
              
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center mb-2">
                  <CalendarDays className="h-5 w-5 text-primary-600 dark:text-primary-500 mr-2" />
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">Inspection History</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Previous inspection findings and corrective actions.
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  View History
                </Button>
              </div>
              
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center mb-2">
                  <User className="h-5 w-5 text-primary-600 dark:text-primary-500 mr-2" />
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">Inspector Profiles</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Information about common inspectors and their focus areas.
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  View Profiles
                </Button>
              </div>
              
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center mb-2">
                  <ClipboardCheck className="h-5 w-5 text-primary-600 dark:text-primary-500 mr-2" />
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">Mock Inspection Guide</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Guide for conducting internal mock inspections.
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Download Guide
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
