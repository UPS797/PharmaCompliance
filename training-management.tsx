import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Award, 
  Calendar, 
  Check,
  Download, 
  FileText, 
  Plus, 
  Search, 
  Upload,
  X,
  CalendarClock,
  Clock
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { useAuth } from "@/context/auth-context";

// Define training record form schema
const trainingRecordSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  trainingType: z.enum(["Initial", "Annual", "Special"]),
  chapterId: z.string().min(1, { message: "USP Chapter is required" }),
  completedDate: z.string().min(1, { message: "Completion date is required" }),
  expirationDate: z.string().min(1, { message: "Expiration date is required" }),
  assignedTo: z.string().optional(),
  certificateFile: z.any().optional()
});

type TrainingRecordFormValues = z.infer<typeof trainingRecordSchema>;

// Types
interface TrainingRecord {
  id: number;
  title: string;
  description: string;
  trainingType: "Initial" | "Annual" | "Special";
  chapterId: string;
  completedDate: string;
  expirationDate: string;
  status: "Active" | "Expired" | "Expiring Soon";
  assignedTo: string;
  verifiedBy: string;
  certificateUrl?: string;
}

export default function TrainingManagement() {
  const [selectedTrainingType, setSelectedTrainingType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();
  const { userInfo, isAdmin } = useAuth();
  
  const { data: trainingRecords, isLoading } = useQuery<TrainingRecord[]>({
    queryKey: ['/api/training-records'],
    // In a real application, this would fetch from an API
    queryFn: async () => {
      // For demo, return mock data
      return [
        {
          id: 1,
          title: "USP 797 Basic Training",
          description: "Initial training on sterile compounding procedures",
          trainingType: "Initial",
          chapterId: "797",
          completedDate: "2023-11-15",
          expirationDate: "2024-11-15", 
          status: "Active",
          assignedTo: "John Smith",
          verifiedBy: "Maria Chen"
        },
        {
          id: 2,
          title: "Hazardous Drug Handling",
          description: "Training on proper handling of hazardous drugs per USP 800",
          trainingType: "Initial",
          chapterId: "800",
          completedDate: "2023-11-20",
          expirationDate: "2024-11-20",
          status: "Active",
          assignedTo: "Sarah Johnson",
          verifiedBy: "Maria Chen",
          certificateUrl: "/certificates/hazardous-drug-handling.pdf"
        },
        {
          id: 3,
          title: "Non-sterile Compounding",
          description: "Training on non-sterile compounding procedures per USP 795",
          trainingType: "Annual",
          chapterId: "795",
          completedDate: "2023-05-10",
          expirationDate: "2024-05-10",
          status: "Expiring Soon",
          assignedTo: "Mark Wilson",
          verifiedBy: "Robert Johnson",
          certificateUrl: "/certificates/non-sterile-compounding.pdf"
        },
        {
          id: 4,
          title: "Media Fill Testing Competency",
          description: "Aseptic technique validation via media fill tests",
          trainingType: "Annual",
          chapterId: "797",
          completedDate: "2023-02-05",
          expirationDate: "2024-02-05",
          status: "Expired",
          assignedTo: "Jennifer Wu",
          verifiedBy: "Maria Chen",
          certificateUrl: "/certificates/media-fill-testing.pdf"
        },
        {
          id: 5,
          title: "Hand Hygiene and Garbing",
          description: "Proper hand hygiene and garbing procedures for sterile compounding",
          trainingType: "Annual",
          chapterId: "797",
          completedDate: "2023-08-22",
          expirationDate: "2024-08-22",
          status: "Active",
          assignedTo: "Sarah Johnson",
          verifiedBy: "Robert Johnson"
        },
        {
          id: 6,
          title: "USP 800 Competency Assessment",
          description: "Annual assessment of competency in hazardous drug handling",
          trainingType: "Annual",
          chapterId: "800",
          completedDate: "2023-04-15",
          expirationDate: "2024-04-15",
          status: "Expired",
          assignedTo: "Mark Wilson",
          verifiedBy: "Maria Chen",
          certificateUrl: "/certificates/usp800-competency.pdf"
        },
        {
          id: 7,
          title: "Cleaning and Disinfection",
          description: "Proper cleaning and disinfection procedures for compounding areas",
          trainingType: "Special",
          chapterId: "797",
          completedDate: "2023-10-30",
          expirationDate: "2024-10-30",
          status: "Active",
          assignedTo: "Jennifer Wu",
          verifiedBy: "Robert Johnson"
        },
        {
          id: 8,
          title: "Temperature Monitoring",
          description: "Procedures for monitoring and documenting temperatures",
          trainingType: "Special",
          chapterId: "795",
          completedDate: "2023-09-12",
          expirationDate: "2024-09-12",
          status: "Active",
          assignedTo: "John Smith",
          verifiedBy: "Maria Chen"
        }
      ];
    }
  });

  // Create training record form
  const form = useForm<TrainingRecordFormValues>({
    resolver: zodResolver(trainingRecordSchema),
    defaultValues: {
      title: "",
      description: "",
      trainingType: "Annual",
      chapterId: "",
      completedDate: "",
      expirationDate: "",
      assignedTo: "",
    },
  });

  // Filter training records based on selected filters and search query
  const filteredTrainingRecords = trainingRecords?.filter(record => {
    // Filter by training type
    if (selectedTrainingType !== "all" && record.trainingType !== selectedTrainingType) {
      return false;
    }
    
    // Filter by status
    if (selectedStatus !== "all" && record.status !== selectedStatus) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery && 
        !record.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !record.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !record.assignedTo.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // Group training records by status
  const activeRecords = filteredTrainingRecords?.filter(record => record.status === "Active") || [];
  const expiringSoonRecords = filteredTrainingRecords?.filter(record => record.status === "Expiring Soon") || [];
  const expiredRecords = filteredTrainingRecords?.filter(record => record.status === "Expired") || [];

  // Determine days until expiration
  const getDaysUntilExpiration = (expirationDate: string) => {
    const today = new Date();
    const expDate = new Date(expirationDate);
    const diffTime = expDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Handle training record creation
  const onSubmit = (data: TrainingRecordFormValues) => {
    console.log("Creating training record:", data);
    
    toast({
      title: "Training record created",
      description: "The training record has been successfully saved"
    });
    
    form.reset();
    setIsCreateDialogOpen(false);
  };

  // Calculate expiration date based on completion date (default to 1 year)
  const calculateExpirationDate = (completionDate: string) => {
    if (!completionDate) return "";
    
    const date = new Date(completionDate);
    date.setFullYear(date.getFullYear() + 1);
    return date.toISOString().split('T')[0];
  };

  // Handle completion date change to automatically set expiration date
  const handleCompletionDateChange = (completionDate: string) => {
    const expirationDate = calculateExpirationDate(completionDate);
    form.setValue("expirationDate", expirationDate);
  };

  // Get USP chapter details
  const getUspChapterDetails = (chapterId: string) => {
    switch (chapterId) {
      case "795":
        return {
          title: "Non-sterile Preparations",
          color: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
        };
      case "797":
        return {
          title: "Sterile Preparations",
          color: "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400"
        };
      case "800":
        return {
          title: "Hazardous Drugs",
          color: "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
        };
      default:
        return {
          title: "Other",
          color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
        };
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Staff Training & Competency</h1>
          <p className="text-muted-foreground">
            Manage training requirements and track certification status
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex gap-1">
              <Plus className="h-4 w-4" />
              Add Training
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Record Training Completion</DialogTitle>
              <DialogDescription>
                Add a new training record or certification
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Training Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter training title" {...field} />
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
                        <Input 
                          placeholder="Brief description of the training" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="trainingType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Training Type</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Initial">Initial</SelectItem>
                            <SelectItem value="Annual">Annual</SelectItem>
                            <SelectItem value="Special">Special</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="chapterId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>USP Chapter</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select chapter" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="795">USP 795</SelectItem>
                            <SelectItem value="797">USP 797</SelectItem>
                            <SelectItem value="800">USP 800</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="completedDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Completion Date</FormLabel>
                        <FormControl>
                          <Input 
                            type="date" 
                            onChange={(e) => {
                              field.onChange(e);
                              handleCompletionDateChange(e.target.value);
                            }}
                            value={field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="expirationDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expiration Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormDescription>
                          Default is 1 year from completion
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {isAdmin() && (
                  <FormField
                    control={form.control}
                    name="assignedTo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Assign To</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value || ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select staff member" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="John Smith">John Smith</SelectItem>
                            <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                            <SelectItem value="Mark Wilson">Mark Wilson</SelectItem>
                            <SelectItem value="Jennifer Wu">Jennifer Wu</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Leave blank to assign to current user
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                <FormField
                  control={form.control}
                  name="certificateFile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Upload Certificate (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          type="file" 
                          accept=".pdf,.jpg,.png" 
                          onChange={(e) => field.onChange(e.target.files?.[0])}
                        />
                      </FormControl>
                      <FormDescription>
                        Upload training certificate or competency assessment
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Save Training Record</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <DashboardCard 
          title="Active Certifications" 
          count={activeRecords.length} 
          icon={<Check className="h-5 w-5 text-green-600 dark:text-green-400" />}
          color="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
          textColor="text-green-600 dark:text-green-400"
        />
        
        <DashboardCard 
          title="Expiring Soon" 
          count={expiringSoonRecords.length} 
          icon={<CalendarClock className="h-5 w-5 text-amber-600 dark:text-amber-400" />}
          color="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800"
          textColor="text-amber-600 dark:text-amber-400"
        />
        
        <DashboardCard 
          title="Expired" 
          count={expiredRecords.length}
          icon={<X className="h-5 w-5 text-red-600 dark:text-red-400" />}
          color="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
          textColor="text-red-600 dark:text-red-400"
        />
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input
            placeholder="Search training records..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={selectedTrainingType} onValueChange={setSelectedTrainingType}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Training Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Initial">Initial</SelectItem>
              <SelectItem value="Annual">Annual</SelectItem>
              <SelectItem value="Special">Special</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Expiring Soon">Expiring Soon</SelectItem>
              <SelectItem value="Expired">Expired</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="px-3">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="active" className="mb-6">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="active" className="flex justify-center">
            Active
            <Badge variant="outline" className="ml-2 h-5 px-2">
              {activeRecords.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="expiring" className="flex justify-center">
            Expiring Soon
            <Badge variant="outline" className="ml-2 h-5 px-2 bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800">
              {expiringSoonRecords.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="expired" className="flex justify-center">
            Expired
            <Badge variant="outline" className="ml-2 h-5 px-2 bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
              {expiredRecords.length}
            </Badge>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="active">
          {isLoading ? (
            <TrainingLoadingSkeleton />
          ) : activeRecords.length === 0 ? (
            <EmptyState message="No active training records found" />
          ) : (
            <Card>
              <CardContent className="p-0">
                <TrainingTable records={activeRecords} getDaysUntilExpiration={getDaysUntilExpiration} getUspChapterDetails={getUspChapterDetails} />
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="expiring">
          {isLoading ? (
            <TrainingLoadingSkeleton />
          ) : expiringSoonRecords.length === 0 ? (
            <EmptyState message="No training records expiring soon" />
          ) : (
            <Card>
              <CardContent className="p-0">
                <TrainingTable records={expiringSoonRecords} getDaysUntilExpiration={getDaysUntilExpiration} getUspChapterDetails={getUspChapterDetails} />
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="expired">
          {isLoading ? (
            <TrainingLoadingSkeleton />
          ) : expiredRecords.length === 0 ? (
            <EmptyState message="No expired training records found" />
          ) : (
            <Card>
              <CardContent className="p-0">
                <TrainingTable records={expiredRecords} getDaysUntilExpiration={getDaysUntilExpiration} getUspChapterDetails={getUspChapterDetails} />
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </>
  );
}

interface DashboardCardProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  color: string;
  textColor: string;
}

function DashboardCard({ title, count, icon, color, textColor }: DashboardCardProps) {
  return (
    <Card className={`${color}`}>
      <CardContent className="p-4 flex justify-between items-center">
        <div>
          <h3 className={`text-lg font-semibold ${textColor}`}>{title}</h3>
          <p className="text-3xl font-bold mt-2">{count}</p>
        </div>
        <div className={`rounded-full p-3 ${color}`}>
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}

interface TrainingTableProps {
  records: TrainingRecord[];
  getDaysUntilExpiration: (expirationDate: string) => number;
  getUspChapterDetails: (chapterId: string) => { title: string; color: string };
}

function TrainingTable({ records, getDaysUntilExpiration, getUspChapterDetails }: TrainingTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Training</TableHead>
            <TableHead>Staff Member</TableHead>
            <TableHead>USP Chapter</TableHead>
            <TableHead>Completion Date</TableHead>
            <TableHead>Expiration</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Certificate</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => {
            const daysUntil = getDaysUntilExpiration(record.expirationDate);
            const uspDetails = getUspChapterDetails(record.chapterId);
            
            return (
              <TableRow key={record.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{record.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{record.description}</p>
                  </div>
                </TableCell>
                <TableCell>{record.assignedTo}</TableCell>
                <TableCell>
                  <Badge className={uspDetails.color}>
                    USP {record.chapterId}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(record.completedDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                    <span>{new Date(record.expirationDate).toLocaleDateString()}</span>
                    {record.status !== "Expired" && (
                      <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">
                        ({daysUntil} days)
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {record.status === "Active" ? (
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                      Active
                    </Badge>
                  ) : record.status === "Expiring Soon" ? (
                    <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
                      Expiring Soon
                    </Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400">
                      Expired
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {record.certificateUrl ? (
                    <Button variant="ghost" size="sm" className="flex items-center h-8 px-2">
                      <FileText className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" className="flex items-center h-8 px-2">
                      <Upload className="h-4 w-4 mr-1" />
                      Upload
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

function TrainingLoadingSkeleton() {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="space-y-1">
          <Skeleton className="h-10 w-full" />
          {Array(5).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <Card>
      <CardContent className="py-8 flex flex-col items-center justify-center text-center">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-4 mb-4">
          <Award className="h-8 w-8 text-gray-400" />
        </div>
        <CardTitle className="text-xl mb-2">{message}</CardTitle>
        <CardDescription>
          {message.includes("expiring") ? 
            "All good! No training records are expiring soon." : 
            "Add training records by clicking the 'Add Training' button."}
        </CardDescription>
      </CardContent>
    </Card>
  );
}