import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ComplianceCard from "@/components/dashboard/compliance-card";
import DeadlinesCard from "@/components/dashboard/deadlines-card";
import IssuesCard from "@/components/dashboard/issues-card";
import ComplianceStatusCard from "@/components/dashboard/compliance-status-card";
import ActivityCard from "@/components/dashboard/activity-card";
import DocumentsCard from "@/components/dashboard/documents-card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const [selectedPharmacy, setSelectedPharmacy] = useState("Central Pharmacy");
  
  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";
    return `${diff} days ago`;
  };
  
  const { data, isLoading, error } = useQuery({
    queryKey: [`/api/dashboard/${selectedPharmacy}`],
    refetchOnWindowFocus: false,
  });
  
  // Mock deadlines for the UI
  const deadlines = data?.upcomingDeadlines.map((task: any) => ({
    id: task.id,
    title: task.title,
    description: task.description,
    assignedTo: "Jennifer Wu, PharmD",
    dueInDays: 3,
    priority: task.priority,
  })) || [];
  
  // Convert critical issues to the format expected by the component
  const issues = data?.criticalIssues.map((issue: any) => ({
    id: issue.id,
    title: issue.requirement.title,
    description: issue.evidence,
    chapter: issue.requirement.chapterId,
    severity: issue.requirement.criticality,
    status: issue.status === "Met" ? "Resolved" : issue.status === "In Progress" ? "In Progress" : "Open",
  })) || [];
  
  // Format activities for the activity card
  const activities = data?.recentActivities.map((activity: any) => {
    let type = "document";
    if (activity.resourceType === "Compliance") type = "compliance";
    else if (activity.resourceType === "System") type = "alert";
    else if (activity.resourceType === "GapAnalysis") type = "analysis";
    
    return {
      id: activity.id,
      user: activity.userId ? "Jennifer Wu" : null,
      action: activity.details,
      timestamp: formatRelativeTime(new Date(activity.timestamp)),
      type,
    };
  }) || [];
  
  // Format documents for the documents card
  const documents = data?.recentDocuments.map((doc: any) => ({
    id: doc.id,
    filename: doc.filename,
    updatedAt: formatRelativeTime(new Date(doc.uploadedAt)),
    updatedBy: doc.uploadedBy === 1 ? "M. Chen" : doc.uploadedBy === 2 ? "J. Wu" : "R. Johnson",
  })) || [];
  
  if (isLoading) {
    return <DashboardSkeleton />;
  }
  
  if (error) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Error Loading Dashboard</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          There was a problem loading the dashboard data. Please try again.
        </p>
        <Button>Retry</Button>
      </div>
    );
  }
  
  return (
    <>
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Compliance Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Monitor and manage your pharmacy's USP compliance status</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Select defaultValue={selectedPharmacy} onValueChange={setSelectedPharmacy}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Select pharmacy" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Central Pharmacy">Central Pharmacy</SelectItem>
              <SelectItem value="Oncology Pharmacy">Oncology Pharmacy</SelectItem>
              <SelectItem value="Satellite Pharmacy">Satellite Pharmacy</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            className="cursor-pointer"
            onClick={() => window.location.href = "/tasks?new=true"}
          >
            <Plus className="mr-1 h-4 w-4" />
            <span>New Task</span>
          </Button>
        </div>
      </div>
      
      {/* USP Compliance Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {data?.complianceStatus.byChapter.map((chapter: any) => (
          <ComplianceCard
            key={chapter.id}
            chapter={chapter.chapter}
            title={chapter.chapter === "795" ? "Non-sterile Preparations" : 
                  chapter.chapter === "797" ? "Sterile Preparations" : "Hazardous Drugs"}
            percentage={chapter.percentage}
            status={chapter.status}
            meetCount={chapter.chapter === "795" ? 36 : chapter.chapter === "797" ? 31 : 25}
            totalCount={chapter.chapter === "795" ? 42 : chapter.chapter === "797" ? 43 : 39}
            lastUpdated={chapter.chapter === "795" ? "2 days ago" : chapter.chapter === "797" ? "5 days ago" : "1 day ago"}
            criticalIssues={chapter.chapter === "795" ? 1 : chapter.chapter === "797" ? 3 : 5}
            pendingTasks={chapter.chapter === "795" ? 3 : chapter.chapter === "797" ? 8 : 10}
          />
        ))}
      </div>
      
      {/* Main Content Area: Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Priority Tasks and Issues */}
        <div className="lg:col-span-2 space-y-6">
          <DeadlinesCard deadlines={deadlines} />
          <IssuesCard issues={issues} />
        </div>
        
        {/* Right Column - Status and Activity */}
        <div className="space-y-6">
          <ComplianceStatusCard 
            overall={data?.complianceStatus.overall || 0}
            chapters={data?.complianceStatus.byChapter.map((chapter: any) => ({
              id: chapter.id,
              chapter: chapter.chapter,
              percentage: chapter.percentage,
              status: chapter.status
            })) || []}
          />
          <ActivityCard activities={activities} />
          <DocumentsCard documents={documents} />
        </div>
      </div>
    </>
  );
}

function DashboardSkeleton() {
  return (
    <>
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
      
      {/* Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-6 w-48 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-6 w-48 mb-4" />
              <div className="space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-6 w-48 mb-4" />
              <div className="space-y-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-6 w-48 mb-4" />
              <Skeleton className="h-36 w-36 rounded-full mx-auto mb-4" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-6 w-48 mb-4" />
              <div className="space-y-3">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
