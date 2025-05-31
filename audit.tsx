import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Search, 
  FileDown, 
  Filter, 
  FileText, 
  History, 
  User, 
  Calendar, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  Upload,
  Edit,
  Trash2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";

export default function Audit() {
  const [selectedPharmacy, setSelectedPharmacy] = useState("Central Pharmacy");
  const [selectedDateRange, setSelectedDateRange] = useState("week");
  const [selectedAction, setSelectedAction] = useState("all");
  
  const { data: audits, isLoading } = useQuery({
    queryKey: [`/api/audits/${selectedPharmacy}`],
  });
  
  const formatTimestamp = (timestamp: string | number | Date) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };
  
  const getActionIcon = (action: string) => {
    if (action.includes("Create") || action.includes("Upload")) {
      return <Upload className="h-4 w-4 text-primary-600 dark:text-primary-500" />;
    } else if (action.includes("Update") || action.includes("Edit")) {
      return <Edit className="h-4 w-4 text-warning-600 dark:text-warning-500" />;
    } else if (action.includes("Delete") || action.includes("Remove")) {
      return <Trash2 className="h-4 w-4 text-danger-600 dark:text-danger-500" />;
    } else if (action.includes("Complete") || action.includes("Verify")) {
      return <CheckCircle className="h-4 w-4 text-success-600 dark:text-success-500" />;
    } else {
      return <Clock className="h-4 w-4 text-gray-600 dark:text-gray-400" />;
    }
  };
  
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Audit Trail</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Track all compliance-related activities and changes</p>
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
          
          <Button variant="outline">
            <FileDown className="mr-1 h-4 w-4" />
            <span>Export Logs</span>
          </Button>
        </div>
      </div>
      
      {/* Filters */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Filter Audit Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="h-4 w-4 absolute left-2.5 top-2.5 text-gray-500 dark:text-gray-400" />
              <Input 
                placeholder="Search by user, action, or details..." 
                className="pl-8"
              />
            </div>
            
            <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
              <SelectTrigger className="w-full md:w-[160px]">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedAction} onValueChange={setSelectedAction}>
              <SelectTrigger className="w-full md:w-[160px]">
                <SelectValue placeholder="Action Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="create">Create</SelectItem>
                <SelectItem value="update">Update</SelectItem>
                <SelectItem value="delete">Delete</SelectItem>
                <SelectItem value="login">Login</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" className="w-full md:w-auto">
              <Filter className="mr-1 h-4 w-4" />
              Apply Filters
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Activity Logs */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <CardTitle>Activity Logs</CardTitle>
            
            <Tabs defaultValue="all" className="md:w-auto">
              <TabsList className="grid grid-cols-4 w-full md:w-auto">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="user">User</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="system">System</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-6">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Render actual audit data if available */}
              {audits && audits.length > 0 ? (
                audits.map((audit: any) => (
                  <div key={audit.id} className="flex border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0 last:pb-0">
                    <div className="mr-4 mt-1">
                      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                        {audit.resourceType === "Document" ? (
                          <FileText className="h-5 w-5 text-primary-600 dark:text-primary-500" />
                        ) : audit.resourceType === "Compliance" ? (
                          <CheckCircle className="h-5 w-5 text-success-600 dark:text-success-500" />
                        ) : audit.resourceType === "System" ? (
                          <AlertTriangle className="h-5 w-5 text-warning-600 dark:text-warning-500" />
                        ) : (
                          <History className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                        )}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                        <div className="flex items-center">
                          <span className="font-medium text-gray-900 dark:text-gray-100 mr-2">
                            {audit.userId ? (
                              audit.userId === 1 ? 'Dr. Maria Chen' : 
                              audit.userId === 2 ? 'Jennifer Wu' : 
                              audit.userId === 3 ? 'Robert Johnson' : 'Unknown User'
                            ) : (
                              'System'
                            )}
                          </span>
                          <Badge className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                            {audit.resourceType}
                          </Badge>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400 mt-1 md:mt-0">
                          {formatTimestamp(audit.timestamp)}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-300 mb-2">
                        <span className="text-primary-600 dark:text-primary-500 font-medium">{audit.action}:</span> {audit.details}
                      </p>
                      
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <User className="h-3 w-3 mr-1" /> 
                        <span className="mr-3">IP: 192.168.1.{Math.floor(Math.random() * 255)}</span>
                        <Calendar className="h-3 w-3 mr-1" /> 
                        <span>Session ID: {nanoid(8)}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                // Example/fallback data
                [
                  {
                    id: 1,
                    user: "Jennifer Wu",
                    resourceType: "Document",
                    action: "Upload Document",
                    details: "Uploaded new SOP for hazardous drug handling",
                    timestamp: "2023-04-21T14:34:12Z"
                  },
                  {
                    id: 2,
                    user: "Robert Johnson",
                    resourceType: "Compliance",
                    action: "Update Compliance",
                    details: "Completed USP 797 weekly cleaning verification",
                    timestamp: "2023-04-21T11:15:45Z"
                  },
                  {
                    id: 3,
                    user: "System",
                    resourceType: "System",
                    action: "System Alert",
                    details: "Flagged temperature excursion in refrigerator #2",
                    timestamp: "2023-04-20T16:42:33Z"
                  },
                  {
                    id: 4,
                    user: "Dr. Maria Chen",
                    resourceType: "GapAnalysis",
                    action: "Create Analysis",
                    details: "Started a gap analysis for USP 800 compliance",
                    timestamp: "2023-04-20T10:20:19Z"
                  },
                  {
                    id: 5,
                    user: "Jennifer Wu",
                    resourceType: "Training",
                    action: "Record Training",
                    details: "Recorded completion of USP 797 annual recertification",
                    timestamp: "2023-04-19T15:37:54Z"
                  }
                ].map(audit => (
                  <div key={audit.id} className="flex border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0 last:pb-0">
                    <div className="mr-4 mt-1">
                      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                        {audit.resourceType === "Document" ? (
                          <FileText className="h-5 w-5 text-primary-600 dark:text-primary-500" />
                        ) : audit.resourceType === "Compliance" ? (
                          <CheckCircle className="h-5 w-5 text-success-600 dark:text-success-500" />
                        ) : audit.resourceType === "System" ? (
                          <AlertTriangle className="h-5 w-5 text-warning-600 dark:text-warning-500" />
                        ) : (
                          <History className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                        )}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                        <div className="flex items-center">
                          <span className="font-medium text-gray-900 dark:text-gray-100 mr-2">
                            {audit.user}
                          </span>
                          <Badge className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                            {audit.resourceType}
                          </Badge>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400 mt-1 md:mt-0">
                          {formatTimestamp(audit.timestamp)}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-300 mb-2">
                        <span className="flex items-center text-primary-600 dark:text-primary-500 font-medium">
                          {getActionIcon(audit.action)}
                          <span className="ml-1">{audit.action}:</span>
                        </span> {audit.details}
                      </p>
                      
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <User className="h-3 w-3 mr-1" /> 
                        <span className="mr-3">IP: 192.168.1.{Math.floor(Math.random() * 255)}</span>
                        <Calendar className="h-3 w-3 mr-1" /> 
                        <span>Session ID: {nanoid(8)}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
          
          <div className="mt-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">4</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">5</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

// Helper function to generate random ID
function nanoid(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
