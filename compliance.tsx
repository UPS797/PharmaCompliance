import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
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
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { 
  FileCheck, 
  AlertCircle, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Filter, 
  ChevronDown,
  Download
} from "lucide-react";

export default function Compliance() {
  const [selectedChapter, setSelectedChapter] = useState("795");
  const [selectedPharmacy, setSelectedPharmacy] = useState("Central Pharmacy");
  
  const { data, isLoading } = useQuery({
    queryKey: [`/api/compliance/${selectedPharmacy}/chapter/${selectedChapter}`],
  });
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Met":
        return (
          <Badge variant="outline" className="bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-500 flex items-center">
            <CheckCircle className="h-3 w-3 mr-1" />
            Met
          </Badge>
        );
      case "Not Met":
        return (
          <Badge variant="outline" className="bg-danger-100 dark:bg-danger-900/30 text-danger-700 dark:text-danger-500 flex items-center">
            <AlertCircle className="h-3 w-3 mr-1" />
            Not Met
          </Badge>
        );
      case "In Progress":
        return (
          <Badge variant="outline" className="bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-500 flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            In Progress
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 flex items-center">
            Not Applicable
          </Badge>
        );
    }
  };
  
  const getCriticalityBadge = (criticality: string) => {
    switch (criticality) {
      case "Critical":
        return (
          <Badge variant="outline" className="bg-danger-100 dark:bg-danger-900/30 text-danger-700 dark:text-danger-500">
            Critical
          </Badge>
        );
      case "Major":
        return (
          <Badge variant="outline" className="bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-500">
            Major
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
            Minor
          </Badge>
        );
    }
  };
  
  // Mock summary data until we have real data
  const complianceSummary = {
    "795": {
      total: 42,
      met: 36,
      notMet: 1,
      inProgress: 3,
      notApplicable: 2,
      percentage: 85,
    },
    "797": {
      total: 43,
      met: 31,
      notMet: 3,
      inProgress: 7,
      notApplicable: 2,
      percentage: 72,
    },
    "800": {
      total: 39,
      met: 25,
      notMet: 5,
      inProgress: 7,
      notApplicable: 2,
      percentage: 64,
    },
  };
  
  const summary = complianceSummary[selectedChapter as keyof typeof complianceSummary];
  
  const statusColor = (percentage: number) => {
    if (percentage >= 80) return "bg-success-500 dark:bg-success-600";
    if (percentage >= 70) return "bg-warning-500 dark:bg-warning-600";
    return "bg-danger-500 dark:bg-danger-600";
  };
  
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">USP Compliance</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Track and manage compliance with USP Chapters</p>
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
          
          <Button>
            <Download className="mr-1 h-4 w-4" />
            <span>Export Report</span>
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="795" value={selectedChapter} onValueChange={setSelectedChapter}>
        <TabsList className="mb-6">
          <TabsTrigger value="795" className="px-4 py-2 cursor-pointer">USP 795</TabsTrigger>
          <TabsTrigger value="797" className="px-4 py-2 cursor-pointer">USP 797</TabsTrigger>
          <TabsTrigger value="800" className="px-4 py-2 cursor-pointer">USP 800</TabsTrigger>
        </TabsList>
        
        {["795", "797", "800"].map((chapter) => (
          <TabsContent key={chapter} value={chapter} className="space-y-6">
            {/* Compliance Summary Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">
                  {chapter === "795" ? "Non-sterile Preparations Compliance" :
                   chapter === "797" ? "Sterile Preparations Compliance" : "Hazardous Drugs Compliance"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center justify-center mb-4">
                      <div className="relative w-32 h-32 flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full border-8 border-gray-200 dark:border-gray-700"></div>
                        <div 
                          className={`absolute inset-0 rounded-full border-8 ${statusColor(summary.percentage)}`} 
                          style={{ 
                            clipPath: `polygon(0 0, 50% 0, 50% 50%, 0 50%)`,
                            transform: `rotate(${summary.percentage * 3.6}deg)`
                          }}
                        ></div>
                        <div className="text-center">
                          <span className="block text-3xl font-bold text-gray-900 dark:text-gray-100">{summary.percentage}%</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">Compliant</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{summary.met}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Requirements Met</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                        <div className="text-2xl font-bold text-danger-600 dark:text-danger-500">{summary.notMet}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Not Met</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                        <div className="text-2xl font-bold text-warning-600 dark:text-warning-500">{summary.inProgress}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">In Progress</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                        <div className="text-2xl font-bold text-gray-500 dark:text-gray-400">{summary.notApplicable}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Not Applicable</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center">
                    <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">Compliance Breakdown</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium flex items-center">
                            <span className="h-3 w-3 rounded-full bg-success-500 dark:bg-success-600 mr-2"></span>
                            Met
                          </span>
                          <span className="text-sm font-medium">{Math.round((summary.met / summary.total) * 100)}%</span>
                        </div>
                        <Progress value={(summary.met / summary.total) * 100} className="h-2 bg-gray-200 dark:bg-gray-700" indicatorClassName="bg-success-500 dark:bg-success-600" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium flex items-center">
                            <span className="h-3 w-3 rounded-full bg-danger-500 dark:bg-danger-600 mr-2"></span>
                            Not Met
                          </span>
                          <span className="text-sm font-medium">{Math.round((summary.notMet / summary.total) * 100)}%</span>
                        </div>
                        <Progress value={(summary.notMet / summary.total) * 100} className="h-2 bg-gray-200 dark:bg-gray-700" indicatorClassName="bg-danger-500 dark:bg-danger-600" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium flex items-center">
                            <span className="h-3 w-3 rounded-full bg-warning-500 dark:bg-warning-600 mr-2"></span>
                            In Progress
                          </span>
                          <span className="text-sm font-medium">{Math.round((summary.inProgress / summary.total) * 100)}%</span>
                        </div>
                        <Progress value={(summary.inProgress / summary.total) * 100} className="h-2 bg-gray-200 dark:bg-gray-700" indicatorClassName="bg-warning-500 dark:bg-warning-600" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium flex items-center">
                            <span className="h-3 w-3 rounded-full bg-gray-400 dark:bg-gray-500 mr-2"></span>
                            Not Applicable
                          </span>
                          <span className="text-sm font-medium">{Math.round((summary.notApplicable / summary.total) * 100)}%</span>
                        </div>
                        <Progress value={(summary.notApplicable / summary.total) * 100} className="h-2 bg-gray-200 dark:bg-gray-700" indicatorClassName="bg-gray-400 dark:bg-gray-500" />
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <Button variant="outline" className="w-full">
                        <FileCheck className="mr-2 h-4 w-4" />
                        Run Gap Analysis
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Requirements Table */}
            <Card>
              <CardHeader className="pb-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <CardTitle className="text-lg">Requirements Detail</CardTitle>
                  <div className="flex items-center space-x-2 mt-2 md:mt-0">
                    <Button variant="outline" size="sm" className="h-8">
                      <Filter className="mr-1 h-4 w-4" />
                      Filter
                    </Button>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[130px] h-8">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="met">Met</SelectItem>
                        <SelectItem value="not-met">Not Met</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="not-applicable">Not Applicable</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Section</TableHead>
                        <TableHead>Requirement</TableHead>
                        <TableHead>Criticality</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Evidence</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data && data.map((item: any) => (
                        <TableRow key={item.requirement.id}>
                          <TableCell className="font-medium">{item.requirement.section}</TableCell>
                          <TableCell>
                            <div className="font-medium">{item.requirement.title}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{item.requirement.description}</div>
                          </TableCell>
                          <TableCell>{getCriticalityBadge(item.requirement.criticality)}</TableCell>
                          <TableCell>{getStatusBadge(item.status)}</TableCell>
                          <TableCell className="max-w-[200px] truncate">{item.evidence}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      
                      {/* Show empty state if no data */}
                      {(!data || data.length === 0) && (
                        <TableRow>
                          <TableCell colSpan={6} className="h-24 text-center">
                            <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                              <AlertTriangle className="h-8 w-8 mb-2" />
                              <p>No compliance data available</p>
                              <p className="text-sm">Please select a different chapter or pharmacy</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </>
  );
}
