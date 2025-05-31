import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertTriangle, AlertCircle } from "lucide-react";

interface ComplianceCardProps {
  chapter: string;
  title: string;
  percentage: number;
  status: "Success" | "Warning" | "Danger";
  meetCount: number;
  totalCount: number;
  lastUpdated: string;
  criticalIssues: number;
  pendingTasks: number;
}

export default function ComplianceCard({
  chapter,
  title,
  percentage,
  status,
  meetCount,
  totalCount,
  lastUpdated,
  criticalIssues,
  pendingTasks
}: ComplianceCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
              USP <span className="font-bold">{chapter}</span>
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
          </div>
          {status === "Success" && (
            <div className="flex items-center px-2 py-1 rounded-md bg-success-50 dark:bg-success-900/30 text-success-700 dark:text-success-500">
              <CheckCircle className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">{percentage}% Compliant</span>
            </div>
          )}
          {status === "Warning" && (
            <div className="flex items-center px-2 py-1 rounded-md bg-warning-50 dark:bg-warning-900/30 text-warning-700 dark:text-warning-500">
              <AlertTriangle className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">{percentage}% Compliant</span>
            </div>
          )}
          {status === "Danger" && (
            <div className="flex items-center px-2 py-1 rounded-md bg-danger-50 dark:bg-danger-900/30 text-danger-700 dark:text-danger-500">
              <AlertCircle className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">{percentage}% Compliant</span>
            </div>
          )}
        </div>
        
        <div className="mt-4">
          <Progress 
            value={percentage} 
            className="h-2.5 w-full bg-gray-200 dark:bg-gray-700"
            indicatorClassName={
              status === "Success" 
                ? "bg-success-500" 
                : status === "Warning"
                  ? "bg-warning-500"
                  : "bg-danger-500"
            }
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>{meetCount}/{totalCount} Requirements Met</span>
            <span>Last Updated: {lastUpdated}</span>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="border border-gray-200 dark:border-gray-700 rounded p-2">
            <p className="text-xs text-gray-500 dark:text-gray-400">Critical Issues</p>
            <p className="text-lg font-semibold text-danger-600 dark:text-danger-500">{criticalIssues}</p>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded p-2">
            <p className="text-xs text-gray-500 dark:text-gray-400">Pending Tasks</p>
            <p className="text-lg font-semibold text-warning-600 dark:text-warning-500">{pendingTasks}</p>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="px-5 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 flex justify-between">
        <a href={`/compliance?chapter=${chapter}`} className="text-primary-600 dark:text-primary-500 text-sm font-medium hover:text-primary-700 dark:hover:text-primary-400 flex items-center">
          View Compliance Details
          <span className="material-icons text-sm ml-1">arrow_forward</span>
        </a>
        <button 
          onClick={() => {
            try {
              // Create report data
              const reportData = {
                usp_chapter: chapter,
                title: title,
                compliance_percentage: percentage,
                requirements_met: `${meetCount}/${totalCount}`,
                critical_issues: criticalIssues,
                pending_tasks: pendingTasks,
                last_updated: lastUpdated,
                export_date: new Date().toISOString()
              };
              
              // Create blob and URL
              const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              
              // Create and trigger download
              const downloadLink = document.createElement('a');
              downloadLink.href = url;
              downloadLink.download = `usp-${chapter}-compliance-report-${new Date().toISOString().split('T')[0]}.json`;
              document.body.appendChild(downloadLink);
              downloadLink.click();
              document.body.removeChild(downloadLink);
              URL.revokeObjectURL(url); // Clean up
              
              // Show success
              alert(`Export successful! File: usp-${chapter}-compliance-report-${new Date().toISOString().split('T')[0]}.json`);
            } catch (err) {
              console.error("Export failed:", err);
              alert("Export failed. Please try again.");
            }
          }}
          className="text-primary-600 dark:text-primary-500 text-sm font-medium hover:text-primary-700 dark:hover:text-primary-400 flex items-center cursor-pointer"
        >
          Export Report
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
        </button>
      </CardFooter>
    </Card>
  );
}
