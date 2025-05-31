import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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
  BarChart,
  ClipboardList,
  Plus,
  FileDown,
  CalendarClock,
  CheckCircle2,
  Clock,
  BarChart3,
  AlertCircle,
  FileText,
  User
} from "lucide-react";
import { Input } from "@/components/ui/input";

export default function GapAnalysis() {
  const [selectedPharmacy, setSelectedPharmacy] = useState("Central Pharmacy");
  
  const { data: gapAnalyses, isLoading } = useQuery({
    queryKey: [`/api/gap-analysis/${selectedPharmacy}`],
  });
  
  const formatDate = (dateString: string) => {
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
            <CheckCircle2 className="h-3 w-3 mr-1" />
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
      default:
        return (
          <Badge variant="outline" className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            Draft
          </Badge>
        );
    }
  };
  
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Gap Analysis</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Identify and address compliance gaps for USP chapters</p>
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
                <span>New Analysis</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Start New Gap Analysis</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="title" className="text-sm font-medium">Analysis Title</label>
                  <Input id="title" placeholder="Enter analysis title" />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="description" className="text-sm font-medium">Description</label>
                  <textarea 
                    id="description" 
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
                    placeholder="Enter analysis description"
                  />
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
                <Button>Start Analysis</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {/* Gap Analysis Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="bg-primary-100 dark:bg-primary-900/30 p-3 rounded-full mr-4">
                <ClipboardList className="h-6 w-6 text-primary-600 dark:text-primary-500" />
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Total Analyses</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">8</div>
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
                <div className="text-sm text-gray-500 dark:text-gray-400">In Progress</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">3</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="bg-success-100 dark:bg-success-900/30 p-3 rounded-full mr-4">
                <CheckCircle2 className="h-6 w-6 text-success-600 dark:text-success-500" />
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Completed</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">5</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Gap Analyses */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <CardTitle>Recent Gap Analyses</CardTitle>
            <div className="flex items-center space-x-2 mt-2 md:mt-0">
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8"
                onClick={() => {
                  alert("Exporting gap analysis report...");
                  // In a real implementation, this would generate and download a PDF/Excel report
                }}
              >
                <FileDown className="mr-1 h-4 w-4" />
                Export
              </Button>
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
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>USP Chapter</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Gaps Found</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {gapAnalyses ? (
                  gapAnalyses.map((analysis: any) => (
                    <TableRow key={analysis.id}>
                      <TableCell className="font-medium">{analysis.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-gray-100 dark:bg-gray-800">
                          USP {analysis.chapterId}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <CalendarClock className="h-3 w-3 mr-2 text-gray-500 dark:text-gray-400" />
                          {formatDate(analysis.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(analysis.status)}</TableCell>
                      <TableCell>
                        {analysis.findings ? (
                          <Badge className="bg-danger-600 text-white">{
                            typeof analysis.findings === 'string' 
                              ? JSON.parse(analysis.findings).gaps || 0 
                              : analysis.findings.gaps || 0
                          }</Badge>
                        ) : (
                          <Badge className="bg-gray-400 dark:bg-gray-600 text-white">N/A</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="link" className="h-8 p-0">View Details</Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  // Mock data while waiting for API implementation
                  [
                    { id: 1, title: "USP 797 Clean Room Analysis", chapterId: "797", createdAt: "2023-05-15", status: "Completed", findings: JSON.stringify({ gaps: 5 }) },
                    { id: 2, title: "USP 800 Hazardous Drug Compliance", chapterId: "800", createdAt: "2023-06-22", status: "In Progress", findings: JSON.stringify({ gaps: 12 }) },
                    { id: 3, title: "USP 795 Quarterly Review", chapterId: "795", createdAt: "2023-07-10", status: "Completed", findings: JSON.stringify({ gaps: 3 }) },
                  ].map((analysis) => (
                    <TableRow key={analysis.id}>
                      <TableCell className="font-medium">{analysis.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-gray-100 dark:bg-gray-800">
                          USP {analysis.chapterId}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <CalendarClock className="h-3 w-3 mr-2 text-gray-500 dark:text-gray-400" />
                          {formatDate(analysis.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(analysis.status)}</TableCell>
                      <TableCell>
                        <Badge className="bg-danger-600 text-white">{
                          typeof analysis.findings === 'string' 
                            ? JSON.parse(analysis.findings).gaps 
                            : analysis.findings.gaps
                        }</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="link" className="h-8 p-0">View Details</Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      {/* Featured Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Featured Analysis: USP 797 Clean Room Compliance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-gray-100">Analysis Summary</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Comprehensive evaluation of USP 797 compliance for sterile compounding areas, focusing on facility design, environmental monitoring, and cleaning procedures.
                </p>
                
                <div className="flex items-center mb-2">
                  <User className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Conducted by: Dr. Maria Chen</span>
                </div>
                <div className="flex items-center mb-2">
                  <CalendarClock className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Completed on: May 15, 2023</span>
                </div>
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">43 requirements evaluated</span>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-gray-100">Key Findings</h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Met Requirements</span>
                      <span className="text-sm font-medium">31/43 (72%)</span>
                    </div>
                    <Progress value={72} className="h-2" indicatorClassName="bg-success-500 dark:bg-success-600" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Critical Gaps</span>
                      <span className="text-sm font-medium">3/43 (7%)</span>
                    </div>
                    <Progress value={7} className="h-2" indicatorClassName="bg-danger-500 dark:bg-danger-600" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">In Progress</span>
                      <span className="text-sm font-medium">7/43 (16%)</span>
                    </div>
                    <Progress value={16} className="h-2" indicatorClassName="bg-warning-500 dark:bg-warning-600" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Not Applicable</span>
                      <span className="text-sm font-medium">2/43 (5%)</span>
                    </div>
                    <Progress value={5} className="h-2" indicatorClassName="bg-gray-400 dark:bg-gray-500" />
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">Critical Issues Identified</h3>
              
              <div className="space-y-4">
                <div className="bg-danger-50 dark:bg-danger-900/10 border border-danger-200 dark:border-danger-900/20 rounded-md p-4">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-danger-600 dark:text-danger-500 mt-0.5 mr-3" />
                    <div>
                      <h4 className="font-medium text-danger-800 dark:text-danger-400">HEPA Filter Certification Expired</h4>
                      <p className="text-sm text-danger-700 dark:text-danger-300 mt-1">
                        HEPA filters in the primary engineering controls have not been certified within the last 6 months as required by USP 797 section 5.3.
                      </p>
                      <div className="mt-3">
                        <Badge variant="outline" className="bg-danger-100 dark:bg-danger-900/30 text-danger-700 dark:text-danger-500 border-danger-200 dark:border-danger-800">
                          High Priority
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-danger-50 dark:bg-danger-900/10 border border-danger-200 dark:border-danger-900/20 rounded-md p-4">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-danger-600 dark:text-danger-500 mt-0.5 mr-3" />
                    <div>
                      <h4 className="font-medium text-danger-800 dark:text-danger-400">Environmental Monitoring Frequency</h4>
                      <p className="text-sm text-danger-700 dark:text-danger-300 mt-1">
                        The facility is not conducting environmental monitoring at the required frequency according to USP 797 section 6.2.
                      </p>
                      <div className="mt-3">
                        <Badge variant="outline" className="bg-danger-100 dark:bg-danger-900/30 text-danger-700 dark:text-danger-500 border-danger-200 dark:border-danger-800">
                          High Priority
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-danger-50 dark:bg-danger-900/10 border border-danger-200 dark:border-danger-900/20 rounded-md p-4">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-danger-600 dark:text-danger-500 mt-0.5 mr-3" />
                    <div>
                      <h4 className="font-medium text-danger-800 dark:text-danger-400">Personnel Competency Documentation</h4>
                      <p className="text-sm text-danger-700 dark:text-danger-300 mt-1">
                        Competency documentation for compounding personnel is incomplete or expired for 3 staff members.
                      </p>
                      <div className="mt-3">
                        <Badge variant="outline" className="bg-danger-100 dark:bg-danger-900/30 text-danger-700 dark:text-danger-500 border-danger-200 dark:border-danger-800">
                          High Priority
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <Button className="flex items-center" variant="outline">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View Full Report
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-gray-50 dark:bg-gray-800/50 border-t">
          <div className="flex flex-col sm:flex-row sm:justify-between w-full gap-3">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <BarChart className="h-4 w-4 mr-1" />
              <span>Analysis score: </span>
              <span className="font-medium ml-1">72% Compliant</span>
            </div>
            <div>
              <Button size="sm">
                Generate Action Plan
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </>
  );
}
