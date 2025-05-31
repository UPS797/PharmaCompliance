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
  BarChart, 
  PieChart, 
  LineChart, 
  FileDown, 
  Calendar, 
  Printer, 
  Share2, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  Plus
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function Reports() {
  const [selectedPharmacy, setSelectedPharmacy] = useState("Central Pharmacy");
  const [selectedDateRange, setSelectedDateRange] = useState("quarter");
  const [selectedChapter, setSelectedChapter] = useState("all");
  
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: [`/api/dashboard/${selectedPharmacy}`],
    queryFn: async () => {
      const res = await fetch(`/api/dashboard/${selectedPharmacy}`);
      if (!res.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      return res.json();
    }
  });
  
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Compliance Reports</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">View and export compliance data and analytics</p>
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
          
          <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
            <SelectTrigger className="w-full md:w-[150px]">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="quarter">Last Quarter</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Report Type Tabs */}
      <Tabs defaultValue="compliance" className="mb-6">
        <TabsList className="grid grid-cols-4 w-full mb-4">
          <TabsTrigger value="compliance" className="cursor-pointer">Compliance Status</TabsTrigger>
          <TabsTrigger value="issues" className="cursor-pointer">Issues & Gaps</TabsTrigger>
          <TabsTrigger value="training" className="cursor-pointer">Training</TabsTrigger>
          <TabsTrigger value="inspections" className="cursor-pointer">Inspections</TabsTrigger>
        </TabsList>
        
        {/* Compliance Status Report */}
        <TabsContent value="compliance">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="col-span-2">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg">Overall Compliance Trend</CardTitle>
                <Select value={selectedChapter} onValueChange={setSelectedChapter}>
                  <SelectTrigger className="w-[140px] h-8">
                    <SelectValue placeholder="USP Chapter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Chapters</SelectItem>
                    <SelectItem value="795">USP 795</SelectItem>
                    <SelectItem value="797">USP 797</SelectItem>
                    <SelectItem value="800">USP 800</SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-[300px] w-full" />
                ) : (
                  <div className="aspect-[4/3] flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-md p-4">
                    <div className="flex flex-col items-center gap-2 text-center">
                      <LineChart className="h-16 w-16 text-gray-400 dark:text-gray-500" />
                      <p className="text-gray-500 dark:text-gray-400">Compliance trend line chart would appear here</p>
                      <p className="text-sm text-gray-400 dark:text-gray-500">Historical compliance data by month/quarter</p>
                    </div>
                  </div>
                )}
                
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex gap-1 cursor-pointer"
                    onClick={() => {
                      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
                        pharmacy: selectedPharmacy,
                        dateRange: selectedDateRange,
                        chapter: selectedChapter,
                        exportDate: new Date().toISOString(),
                        data: dashboardData && 'complianceStatus' in dashboardData ? dashboardData.complianceStatus : {}
                      }));
                      const downloadAnchorNode = document.createElement('a');
                      downloadAnchorNode.setAttribute("href", dataStr);
                      downloadAnchorNode.setAttribute("download", `compliance-report-${selectedPharmacy}-${new Date().toISOString().split('T')[0]}.json`);
                      document.body.appendChild(downloadAnchorNode);
                      downloadAnchorNode.click();
                      downloadAnchorNode.remove();
                    }}
                  >
                    <FileDown className="h-4 w-4" />
                    Export
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex gap-1 cursor-pointer"
                    onClick={() => window.print()}
                  >
                    <Printer className="h-4 w-4" />
                    Print
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex gap-1 cursor-pointer"
                    onClick={() => {
                      alert("Share functionality will be implemented in a future update.");
                    }}
                  >
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Chapter Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-[300px] w-full" />
                ) : (
                  <div className="space-y-6">
                    <div className="aspect-square flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-md mb-4">
                      <div className="flex flex-col items-center gap-2 text-center">
                        <PieChart className="h-16 w-16 text-gray-400 dark:text-gray-500" />
                        <p className="text-gray-500 dark:text-gray-400">Compliance distribution by chapter</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">USP 795</span>
                          <span className="text-sm">85%</span>
                        </div>
                        <Progress value={85} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">USP 797</span>
                          <span className="text-sm">72%</span>
                        </div>
                        <Progress value={72} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">USP 800</span>
                          <span className="text-sm">64%</span>
                        </div>
                        <Progress value={64} className="h-2" />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Recent Changes</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  <div className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-success-100 dark:bg-success-900/30 p-2 rounded-full">
                        <CheckCircle className="h-5 w-5 text-success-600 dark:text-success-500" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">HEPA Filter Certification</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Completed and documented all clean room HEPA filter certifications.</p>
                        <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          <span>3 days ago</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-warning-100 dark:bg-warning-900/30 p-2 rounded-full">
                        <AlertTriangle className="h-5 w-5 text-warning-600 dark:text-warning-500" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">Staff Training Updates</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">3 staff members require USP 800 annual retraining in the next 30 days.</p>
                        <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          <span>5 days ago</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary-100 dark:bg-primary-900/30 p-2 rounded-full">
                        <FileText className="h-5 w-5 text-primary-600 dark:text-primary-500" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">SOP Updates</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Updated 5 Standard Operating Procedures to reflect recent USP revisions.</p>
                        <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          <span>1 week ago</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Key Compliance Findings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-success-600 dark:text-success-500 mt-0.5 mr-3" />
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">Clean Room Certification</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        All clean rooms have been certified within the required 6-month timeframe.
                      </p>
                      <div className="mt-2 flex justify-between items-center">
                        <Badge variant="outline" className="bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300">
                          USP 797
                        </Badge>
                        <Badge variant="outline" className="bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-500">
                          Compliant
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-warning-600 dark:text-warning-500 mt-0.5 mr-3" />
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">Temperature Monitoring</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Two refrigeration units showed temperature excursions in the past month that were not properly documented.
                      </p>
                      <div className="mt-2 flex justify-between items-center">
                        <Badge variant="outline" className="bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300">
                          USP 795
                        </Badge>
                        <Badge variant="outline" className="bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-500">
                          Needs Attention
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-warning-600 dark:text-warning-500 mt-0.5 mr-3" />
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">Training Documentation</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Two staff members had incomplete documentation for annual USP 800 handling requirements.
                      </p>
                      <div className="mt-2 flex justify-between items-center">
                        <Badge variant="outline" className="bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300">
                          USP 800
                        </Badge>
                        <Badge variant="outline" className="bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-500">
                          In Progress
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <Button className="cursor-pointer">View All Findings</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Issues & Gaps Tab Content */}
        <TabsContent value="issues">
          <Card>
            <CardHeader>
              <CardTitle>Issues & Gaps Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">Analyze and track identified compliance issues and gaps</p>
              
              <div className="flex items-center justify-end mb-4 gap-2">
                <Button variant="outline" className="cursor-pointer">
                  <FileDown className="mr-2 h-4 w-4" />
                  Export Report
                </Button>
                <Button className="cursor-pointer">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Finding
                </Button>
              </div>
              
              <div className="space-y-6">
                {/* Placeholder content */}
                <div className="flex justify-center items-center py-12">
                  <div className="text-center">
                    <BarChart className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Issues breakdown would appear here</h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md">
                      This section would display a detailed breakdown of compliance issues, gaps, and remediation progress.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Training Tab Content */}
        <TabsContent value="training">
          <Card>
            <CardHeader>
              <CardTitle>Training Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">Analyze staff training compliance and certification status</p>
              
              <div className="flex items-center justify-end mb-4 gap-2">
                <Button variant="outline" className="cursor-pointer">
                  <FileDown className="mr-2 h-4 w-4" />
                  Export Training Report
                </Button>
              </div>
              
              <div className="space-y-6">
                {/* Placeholder content */}
                <div className="flex justify-center items-center py-12">
                  <div className="text-center">
                    <BarChart className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Training reports would appear here</h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md">
                      This section would display staff training records, upcoming certification needs, and compliance statistics.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Inspections Tab Content */}
        <TabsContent value="inspections">
          <Card>
            <CardHeader>
              <CardTitle>Inspection Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">View and analyze inspection results and findings</p>
              
              <div className="flex items-center justify-end mb-4 gap-2">
                <Button variant="outline" className="cursor-pointer">
                  <FileDown className="mr-2 h-4 w-4" />
                  Export Inspection Report
                </Button>
                <Button className="cursor-pointer">
                  <Plus className="mr-2 h-4 w-4" />
                  New Inspection
                </Button>
              </div>
              
              <div className="space-y-6">
                {/* Placeholder content */}
                <div className="flex justify-center items-center py-12">
                  <div className="text-center">
                    <Clock className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Inspection history would appear here</h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md">
                      This section would display a history of inspections, findings, and remediation status.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Card className="bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Need Custom Reports?</h3>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Customize reports for regulatory submissions, board presentations, or internal reviews.
              </p>
            </div>
            <div className="md:ml-auto">
              <Button 
                onClick={() => {
                  alert("Custom Report Creator will be available in the next update. Please try the Export buttons on the individual reports for now.");
                }}
                className="cursor-pointer"
              >
                Create Custom Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}