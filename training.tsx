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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  FileDown, 
  Search, 
  Filter,
  School,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  User,
  FileText
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

export default function Training() {
  const [selectedPharmacy, setSelectedPharmacy] = useState("Central Pharmacy");
  const [activeTab, setActiveTab] = useState("upcoming");
  
  const { data: trainingRecords, isLoading } = useQuery({
    queryKey: [`/api/training/${selectedPharmacy}`],
  });
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
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
      case "Pending":
        return (
          <Badge variant="outline" className="bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-500 flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "Expired":
        return (
          <Badge variant="outline" className="bg-danger-100 dark:bg-danger-900/30 text-danger-700 dark:text-danger-500 flex items-center">
            <XCircle className="h-3 w-3 mr-1" />
            Expired
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 flex items-center">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Unknown
          </Badge>
        );
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Training Records</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage staff training for USP compliance</p>
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
                <span>Record Training</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Record Training Completion</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="staff" className="text-sm font-medium">Staff Member</label>
                  <Select defaultValue="2">
                    <SelectTrigger id="staff">
                      <SelectValue placeholder="Select staff member" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Dr. Maria Chen</SelectItem>
                      <SelectItem value="2">Jennifer Wu</SelectItem>
                      <SelectItem value="3">Robert Johnson</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <label htmlFor="training-title" className="text-sm font-medium">Training Title</label>
                  <Input id="training-title" placeholder="Enter training title" />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="description" className="text-sm font-medium">Description</label>
                  <textarea 
                    id="description" 
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
                    placeholder="Enter training description"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="completed-date" className="text-sm font-medium">Completion Date</label>
                    <Input id="completed-date" type="date" />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="expiration-date" className="text-sm font-medium">Expiration Date</label>
                    <Input id="expiration-date" type="date" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <label htmlFor="chapter" className="text-sm font-medium">USP Chapter</label>
                  <Select defaultValue="797">
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
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button>Record Training</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {/* Training Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="bg-primary-100 dark:bg-primary-900/30 p-3 rounded-full mr-4">
                <School className="h-6 w-6 text-primary-600 dark:text-primary-500" />
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Total Training Records</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">24</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="bg-success-100 dark:bg-success-900/30 p-3 rounded-full mr-4">
                <CheckCircle className="h-6 w-6 text-success-600 dark:text-success-500" />
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Current Compliance</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">92%</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="bg-warning-100 dark:bg-warning-900/30 p-3 rounded-full mr-4">
                <Clock className="h-6 w-6 text-warning-600 dark:text-warning-500" />
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Expiring Soon</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">3</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Training Records Table */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <CardTitle>Training Records</CardTitle>
            <div className="flex items-center space-x-2 mt-2 md:mt-0">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-2.5 top-2.5 text-gray-500 dark:text-gray-400" />
                <Input 
                  placeholder="Search records..." 
                  className="pl-8 h-9 w-[200px] md:w-[300px]" 
                />
              </div>
              <Button variant="outline" size="sm" className="h-9">
                <Filter className="h-4 w-4 mr-1" />
                Filter
              </Button>
              <Button variant="outline" size="sm" className="h-9">
                <FileDown className="h-4 w-4 mr-1" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All Records</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="expired">Expired</TabsTrigger>
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
                      <TableHead>Staff Member</TableHead>
                      <TableHead>Training</TableHead>
                      <TableHead>USP Chapter</TableHead>
                      <TableHead>Completed</TableHead>
                      <TableHead>Expires</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Display actual training records if available */}
                    {trainingRecords && trainingRecords.length > 0 ? (
                      trainingRecords.map((record: any) => (
                        <TableRow key={record.id}>
                          <TableCell>
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-medium mr-2">
                                {record.userId === 1 ? 'MC' : record.userId === 2 ? 'JW' : 'RJ'}
                              </div>
                              <span>{record.userId === 1 ? 'Dr. Maria Chen' : record.userId === 2 ? 'Jennifer Wu' : 'Robert Johnson'}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{record.title}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{record.description}</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-gray-100 dark:bg-gray-800">
                              USP {record.chapterId}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(record.completedAt)}</TableCell>
                          <TableCell>{formatDate(record.expiresAt)}</TableCell>
                          <TableCell>{getStatusBadge(record.status)}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">View</Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      // Fallback example data in case no records are returned
                      [
                        { id: 1, name: "Jennifer Wu", title: "USP 797 Sterile Compounding", description: "Initial training", chapter: "797", completed: "2023-03-15", expires: "2024-03-15", status: "Completed" },
                        { id: 2, name: "Robert Johnson", title: "Hazardous Drug Handling", description: "Annual certification", chapter: "800", completed: "2023-04-10", expires: "2024-04-10", status: "Completed" },
                        { id: 3, name: "Dr. Maria Chen", title: "Beyond-Use Dating", description: "Refresher course", chapter: "795", completed: "2023-05-22", expires: "2024-05-22", status: "Completed" },
                        { id: 4, name: "Jennifer Wu", title: "Environmental Monitoring", description: "Competency assessment", chapter: "797", completed: null, expires: null, status: "Pending" },
                        { id: 5, name: "Robert Johnson", title: "Cleaning Procedures", description: "Annual review", chapter: "797", completed: "2022-02-18", expires: "2023-02-18", status: "Expired" }
                      ].map(record => (
                        <TableRow key={record.id}>
                          <TableCell>
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-medium mr-2">
                                {record.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <span>{record.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{record.title}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{record.description}</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-gray-100 dark:bg-gray-800">
                              USP {record.chapter}
                            </Badge>
                          </TableCell>
                          <TableCell>{record.completed || "Not completed"}</TableCell>
                          <TableCell>{record.expires || "N/A"}</TableCell>
                          <TableCell>{getStatusBadge(record.status)}</TableCell>
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

            {/* Other tab contents will filter from the same data */}
            <TabsContent value="completed" className="pt-4">
              {/* Completed training records */}
            </TabsContent>
            <TabsContent value="pending" className="pt-4">
              {/* Pending training records */}
            </TabsContent>
            <TabsContent value="expired" className="pt-4">
              {/* Expired training records */}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Training Compliance by Chapter */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Staff Training Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-medium mr-3">
                      MC
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">Dr. Maria Chen</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Pharmacy Director</p>
                    </div>
                  </div>
                  <div>
                    <Badge className="bg-success-600 text-white">100% Compliant</Badge>
                  </div>
                </div>
                <div className="space-y-2 mt-4">
                  <div>
                    <div className="flex justify-between items-center mb-1 text-sm">
                      <span>USP 795</span>
                      <span>2/2 Complete</span>
                    </div>
                    <Progress value={100} className="h-2" indicatorClassName="bg-success-500 dark:bg-success-600" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1 text-sm">
                      <span>USP 797</span>
                      <span>3/3 Complete</span>
                    </div>
                    <Progress value={100} className="h-2" indicatorClassName="bg-success-500 dark:bg-success-600" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1 text-sm">
                      <span>USP 800</span>
                      <span>1/1 Complete</span>
                    </div>
                    <Progress value={100} className="h-2" indicatorClassName="bg-success-500 dark:bg-success-600" />
                  </div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-medium mr-3">
                      JW
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">Jennifer Wu</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">PharmD</p>
                    </div>
                  </div>
                  <div>
                    <Badge className="bg-warning-600 text-white">83% Compliant</Badge>
                  </div>
                </div>
                <div className="space-y-2 mt-4">
                  <div>
                    <div className="flex justify-between items-center mb-1 text-sm">
                      <span>USP 795</span>
                      <span>1/1 Complete</span>
                    </div>
                    <Progress value={100} className="h-2" indicatorClassName="bg-success-500 dark:bg-success-600" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1 text-sm">
                      <span>USP 797</span>
                      <span>2/3 Complete</span>
                    </div>
                    <Progress value={66} className="h-2" indicatorClassName="bg-warning-500 dark:bg-warning-600" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1 text-sm">
                      <span>USP 800</span>
                      <span>2/2 Complete</span>
                    </div>
                    <Progress value={100} className="h-2" indicatorClassName="bg-success-500 dark:bg-success-600" />
                  </div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-medium mr-3">
                      RJ
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">Robert Johnson</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Training Coordinator</p>
                    </div>
                  </div>
                  <div>
                    <Badge className="bg-danger-600 text-white">75% Compliant</Badge>
                  </div>
                </div>
                <div className="space-y-2 mt-4">
                  <div>
                    <div className="flex justify-between items-center mb-1 text-sm">
                      <span>USP 795</span>
                      <span>1/2 Complete</span>
                    </div>
                    <Progress value={50} className="h-2" indicatorClassName="bg-warning-500 dark:bg-warning-600" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1 text-sm">
                      <span>USP 797</span>
                      <span>1/1 Complete</span>
                    </div>
                    <Progress value={100} className="h-2" indicatorClassName="bg-success-500 dark:bg-success-600" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1 text-sm">
                      <span>USP 800</span>
                      <span>1/2 Complete</span>
                    </div>
                    <Progress value={50} className="h-2" indicatorClassName="bg-warning-500 dark:bg-warning-600" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Required Trainings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center mb-2">
                  <School className="h-5 w-5 text-primary-600 dark:text-primary-500 mr-2" />
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">USP 797 Annual Recertification</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Annual competency assessment for all staff involved in sterile compounding.
                </p>
                <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Due by June 30, 2024
                  </span>
                  <Badge variant="outline" className="bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-500">
                    Required
                  </Badge>
                </div>
              </div>
              
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center mb-2">
                  <School className="h-5 w-5 text-primary-600 dark:text-primary-500 mr-2" />
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">USP 800 Hazardous Drug Handling</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Required training for handling hazardous drugs and proper PPE usage.
                </p>
                <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Due by July 15, 2024
                  </span>
                  <Badge variant="outline" className="bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-500">
                    Required
                  </Badge>
                </div>
              </div>
              
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center mb-2">
                  <School className="h-5 w-5 text-primary-600 dark:text-primary-500 mr-2" />
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">USP 795 Beyond-Use Dating</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Training on establishing beyond-use dates for non-sterile preparations.
                </p>
                <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Due by August 1, 2024
                  </span>
                  <Badge variant="outline" className="bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-500">
                    Required
                  </Badge>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <Button variant="outline" className="w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  View All Required Trainings
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
