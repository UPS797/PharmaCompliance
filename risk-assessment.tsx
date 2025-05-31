import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Filter, 
  Plus, 
  Search, 
  SlidersHorizontal 
} from "lucide-react";

import { RiskMatrix } from "@/components/risk-assessment/risk-matrix";
import { RiskAssessmentForm, RiskAssessment } from "@/components/risk-assessment/risk-assessment-form";

// Types for the risk assessment data
type RiskStatus = "Not Started" | "In Progress" | "Implemented" | "Verified";

interface RiskItem {
  id: number;
  title: string;
  description: string;
  likelihood: number;
  impact: number;
  chapter: string; // "795", "797", "800"
  requirement: string;
  mitigationStatus: RiskStatus;
  owner?: string;
  dueDate?: string;
  detectionDifficulty: number;
  currentControls: string;
  mitigationPlan: string;
}

type ChapterFilter = "all" | "795" | "797" | "800";
type StatusFilter = "all" | RiskStatus;

interface RiskFilters {
  chapter: ChapterFilter;
  status: StatusFilter;
  search: string;
}

export default function RiskAssessmentPage() {
  const { userInfo } = useAuth();
  const [activeTab, setActiveTab] = useState("list");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedRisk, setSelectedRisk] = useState<RiskItem | null>(null);
  const [filters, setFilters] = useState<RiskFilters>({
    chapter: "all",
    status: "all",
    search: "",
  });
  
  const queryClient = useQueryClient();
  
  // Query to fetch all risk assessments
  const { data: risks, isLoading } = useQuery({
    queryKey: ['/api/risk-assessments', filters.chapter],
    queryFn: async () => {
      // Fetch risk assessments from API
      let url = `/api/risk-assessments/${userInfo?.pharmacy || 'Central Pharmacy'}`;
      
      // Add chapter filter if not 'all'
      if (filters.chapter !== 'all') {
        url += `?chapter=${filters.chapter}`;
      }
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch risk assessments');
      }
      return await response.json();
    }
  });
  
  // Mutation for saving risk assessments
  const saveMutation = useMutation({
    mutationFn: async (riskData: RiskAssessment) => {
      // Prepare the data for API
      const apiData = {
        ...riskData,
        pharmacyId: userInfo?.pharmacy || 'Central Pharmacy'
      };
      
      if (apiData.id) {
        // Update existing risk assessment
        return await apiRequest(`/api/risk-assessment/${apiData.id}`, {
          method: 'PATCH',
          body: JSON.stringify(apiData),
        });
      } else {
        // Create new risk assessment
        return await apiRequest('/api/risk-assessments', {
          method: 'POST',
          body: JSON.stringify(apiData),
        });
      }
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({
        queryKey: ['/api/risk-assessments'],
      });
      setIsFormOpen(false);
      setSelectedRisk(null);
    },
  });
  
  // Convert raw risk assessment to format used by RiskMatrix
  const prepareRisksForMatrix = (data: RiskAssessment[]): RiskItem[] => {
    if (!data) return [];
    return data.map(risk => ({
      id: risk.id || 0,
      title: risk.title,
      description: risk.description,
      likelihood: risk.likelihood,
      impact: risk.impact,
      chapter: risk.usp_chapter,
      requirement: "",  // Would come from the requirement details
      mitigationStatus: risk.mitigation_status,
      owner: risk.owner,
      dueDate: risk.due_date,
      detectionDifficulty: risk.detection_difficulty,
      currentControls: risk.current_controls,
      mitigationPlan: risk.mitigation_plan,
    }));
  };
  
  // Filter risks based on current filters
  const filteredRisks = (() => {
    if (!risks) return [];
    
    return risks.filter((risk) => {
      const matchesChapter = filters.chapter === "all" || risk.usp_chapter === filters.chapter;
      const matchesStatus = filters.status === "all" || risk.mitigation_status === filters.status;
      const matchesSearch = 
        filters.search === "" || 
        risk.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        risk.description.toLowerCase().includes(filters.search.toLowerCase());
      
      return matchesChapter && matchesStatus && matchesSearch;
    });
  })();
  
  // Handle form submission
  const handleSaveRisk = (riskData: RiskAssessment) => {
    saveMutation.mutate(riskData);
  };
  
  // Handle risk selection from matrix
  const handleRiskClick = (risk: RiskItem) => {
    // Find the original risk assessment data
    const originalRisk = risks?.find(r => r.id === risk.id);
    if (originalRisk) {
      setSelectedRisk(risk);
      setIsFormOpen(true);
    }
  };
  
  // Calculate risk counts for different categories
  const riskCounts = {
    total: filteredRisks.length,
    critical: filteredRisks.filter(risk => risk.likelihood * risk.impact >= 15).length,
    high: filteredRisks.filter(risk => risk.likelihood * risk.impact >= 8 && risk.likelihood * risk.impact < 15).length,
    moderate: filteredRisks.filter(risk => risk.likelihood * risk.impact >= 3 && risk.likelihood * risk.impact < 8).length,
    low: filteredRisks.filter(risk => risk.likelihood * risk.impact < 3).length,
  };
  
  // Mock risk data for example
  const mockRiskData: RiskAssessment[] = [
    {
      id: 1,
      title: "Insufficient Temperature Monitoring in Storage Areas",
      description: "Temperature excursions in drug storage areas may go undetected, potentially compromising drug stability and efficacy.",
      usp_chapter: "795",
      likelihood: 4,
      impact: 4,
      risk_level: 16,
      detection_difficulty: 3,
      current_controls: "Manual temperature checks once daily",
      mitigation_plan: "Implement automated temperature monitoring system with alerts for excursions",
      mitigation_status: "In Progress",
      owner: "Jane Smith",
      due_date: "2023-06-30"
    },
    {
      id: 2,
      title: "Cross-contamination in Compounding Area",
      description: "Risk of cross-contamination between different drug preparations due to inadequate cleaning procedures",
      usp_chapter: "797",
      likelihood: 3,
      impact: 5,
      risk_level: 15,
      detection_difficulty: 4,
      current_controls: "Basic cleaning procedures between compounding activities",
      mitigation_plan: "Implement robust cleaning validation protocol with surface sampling",
      mitigation_status: "Not Started",
      owner: "John Doe",
      due_date: "2023-07-15"
    },
    {
      id: 3,
      title: "Improper PPE Use for Hazardous Drugs",
      description: "Staff may be exposed to hazardous drugs due to inconsistent or improper PPE usage",
      usp_chapter: "800",
      likelihood: 4,
      impact: 4,
      risk_level: 16,
      detection_difficulty: 2,
      current_controls: "PPE requirements posted in compounding areas",
      mitigation_plan: "Implement comprehensive training program and regular compliance audits",
      mitigation_status: "In Progress",
      owner: "Maria Rodriguez",
      due_date: "2023-06-15"
    },
    {
      id: 4,
      title: "Inadequate Beyond-Use Dating Documentation",
      description: "Lack of consistent documentation for assigning beyond-use dates to compounded preparations",
      usp_chapter: "795",
      likelihood: 3,
      impact: 3,
      risk_level: 9,
      detection_difficulty: 3,
      current_controls: "General guidelines available to staff",
      mitigation_plan: "Develop detailed BUD assignment protocol and documentation forms",
      mitigation_status: "Implemented",
      owner: "Robert Johnson",
      due_date: "2023-05-30"
    },
    {
      id: 5,
      title: "Inadequate Environmental Monitoring",
      description: "Current environmental monitoring program may not detect contamination or environmental control failures",
      usp_chapter: "797",
      likelihood: 3,
      impact: 4,
      risk_level: 12,
      detection_difficulty: 4,
      current_controls: "Quarterly viable air sampling only",
      mitigation_plan: "Expand to monthly viable and non-viable monitoring with trending analysis",
      mitigation_status: "Not Started",
      owner: "Sarah Williams",
      due_date: "2023-08-15"
    },
    {
      id: 6,
      title: "Insufficient Training Documentation",
      description: "Staff training records are incomplete or not regularly updated",
      usp_chapter: "800",
      likelihood: 2,
      impact: 3,
      risk_level: 6,
      detection_difficulty: 2,
      current_controls: "Paper-based training logs",
      mitigation_plan: "Implement digital training management system with automatic reminders",
      mitigation_status: "Implemented",
      owner: "Michael Brown",
      due_date: "2023-04-30"
    }
  ];
  
  // Function to get status badge styling
  const getStatusBadge = (status: RiskStatus) => {
    switch(status) {
      case "Not Started":
        return <Badge variant="outline" className="bg-danger-100 dark:bg-danger-900/30 text-danger-800 dark:text-danger-500">Not Started</Badge>;
      case "In Progress":
        return <Badge variant="outline" className="bg-warning-100 dark:bg-warning-900/30 text-warning-800 dark:text-warning-500">In Progress</Badge>;
      case "Implemented":
        return <Badge variant="outline" className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-500">Implemented</Badge>;
      case "Verified":
        return <Badge variant="outline" className="bg-success-100 dark:bg-success-900/30 text-success-800 dark:text-success-500">Verified</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  // Function to get risk level badge styling
  const getRiskLevelBadge = (level: number) => {
    if (level >= 15) {
      return <Badge variant="outline" className="bg-danger-100 dark:bg-danger-900/30 text-danger-800 dark:text-danger-500">Critical ({level})</Badge>;
    } else if (level >= 8) {
      return <Badge variant="outline" className="bg-warning-100 dark:bg-warning-900/30 text-warning-800 dark:text-warning-500">High ({level})</Badge>;
    } else if (level >= 3) {
      return <Badge variant="outline" className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-500">Moderate ({level})</Badge>;
    } else {
      return <Badge variant="outline" className="bg-success-100 dark:bg-success-900/30 text-success-800 dark:text-success-500">Low ({level})</Badge>;
    }
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Risk Assessment</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Identify, evaluate, and mitigate compliance risks
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedRisk(null);
            setIsFormOpen(true);
          }}
          className="flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Risk Assessment</span>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">{riskCounts.total}</div>
              <SlidersHorizontal className="w-4 h-4 text-gray-500" />
            </div>
            <p className="text-sm text-gray-500 mt-1">Total Risks</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold text-danger-600 dark:text-danger-500">{riskCounts.critical}</div>
              <AlertTriangle className="w-4 h-4 text-danger-600 dark:text-danger-500" />
            </div>
            <p className="text-sm text-gray-500 mt-1">Critical Risks</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold text-warning-600 dark:text-warning-500">{riskCounts.high}</div>
              <AlertTriangle className="w-4 h-4 text-warning-600 dark:text-warning-500" />
            </div>
            <p className="text-sm text-gray-500 mt-1">High Risks</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold text-success-600 dark:text-success-500">
                {filteredRisks.filter(r => r.mitigation_status === "Verified").length}
              </div>
              <CheckCircle className="w-4 h-4 text-success-600 dark:text-success-500" />
            </div>
            <p className="text-sm text-gray-500 mt-1">Mitigated Risks</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 max-w-md">
          <TabsTrigger value="list" className="cursor-pointer">Risk List</TabsTrigger>
          <TabsTrigger value="matrix" className="cursor-pointer">Risk Matrix</TabsTrigger>
        </TabsList>
        
        <div className="my-4 flex flex-col sm:flex-row gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search risks..."
              className="pl-8"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
          
          <div className="flex gap-2">
            <Select
              value={filters.chapter}
              onValueChange={(value) => setFilters({ ...filters, chapter: value as ChapterFilter })}
            >
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center">
                  <Filter className="w-4 h-4 mr-2" />
                  <span>USP Chapter</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Chapters</SelectItem>
                <SelectItem value="795">USP 795</SelectItem>
                <SelectItem value="797">USP 797</SelectItem>
                <SelectItem value="800">USP 800</SelectItem>
              </SelectContent>
            </Select>
            
            <Select
              value={filters.status}
              onValueChange={(value) => setFilters({ ...filters, status: value as StatusFilter })}
            >
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center">
                  <Filter className="w-4 h-4 mr-2" />
                  <span>Status</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Not Started">Not Started</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Implemented">Implemented</SelectItem>
                <SelectItem value="Verified">Verified</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <TabsContent value="list" className="w-full">
          {isLoading ? (
            <div className="text-center py-10">Loading risk assessments...</div>
          ) : filteredRisks.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No risk assessments found. Try adjusting your filters or create a new assessment.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRisks.map((risk) => (
                <Card key={risk.id} className="cursor-pointer hover:shadow-md transition-shadow" 
                  onClick={() => {
                    const riskItem: RiskItem = {
                      id: risk.id || 0,
                      title: risk.title,
                      description: risk.description,
                      likelihood: risk.likelihood,
                      impact: risk.impact,
                      chapter: risk.usp_chapter,
                      requirement: "", // Would be populated from the backend
                      mitigationStatus: risk.mitigation_status,
                      owner: risk.owner,
                      dueDate: risk.due_date,
                      detectionDifficulty: risk.detection_difficulty,
                      currentControls: risk.current_controls,
                      mitigationPlan: risk.mitigation_plan,
                    };
                    setSelectedRisk(riskItem);
                    setIsFormOpen(true);
                  }}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <h3 className="text-lg font-semibold">{risk.title}</h3>
                        <div className="ml-3 text-sm text-gray-500 dark:text-gray-400">USP {risk.usp_chapter}</div>
                      </div>
                      {getRiskLevelBadge(risk.risk_level || 0)}
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                      {risk.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>{risk.due_date ? new Date(risk.due_date).toLocaleDateString() : "No due date"}</span>
                      </div>
                      
                      {risk.owner && (
                        <div className="flex items-center gap-1">
                          <span className="text-gray-600 dark:text-gray-400">Owner:</span>
                          <span>{risk.owner}</span>
                        </div>
                      )}
                      
                      {getStatusBadge(risk.mitigation_status)}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="matrix" className="w-full">
          <RiskMatrix 
            risks={prepareRisksForMatrix(filteredRisks)} 
            onRiskClick={handleRiskClick}
          />
        </TabsContent>
      </Tabs>
      
      {/* Risk Assessment Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedRisk ? "Edit Risk Assessment" : "New Risk Assessment"}
            </DialogTitle>
          </DialogHeader>
          
          <RiskAssessmentForm
            initialData={selectedRisk ? {
              id: selectedRisk.id,
              title: selectedRisk.title,
              description: selectedRisk.description,
              usp_chapter: selectedRisk.chapter,
              likelihood: selectedRisk.likelihood,
              impact: selectedRisk.impact,
              detection_difficulty: selectedRisk.detectionDifficulty,
              current_controls: selectedRisk.currentControls,
              mitigation_plan: selectedRisk.mitigationPlan,
              mitigation_status: selectedRisk.mitigationStatus,
              owner: selectedRisk.owner,
              due_date: selectedRisk.dueDate,
              risk_level: selectedRisk.likelihood * selectedRisk.impact
            } : undefined}
            onSave={handleSaveRisk}
            onCancel={() => setIsFormOpen(false)}
            isSubmitting={saveMutation.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}