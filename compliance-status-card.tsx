import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface ComplianceStatus {
  id: number;
  chapter: string;
  percentage: number;
  status: "Success" | "Warning" | "Danger";
}

interface ComplianceStatusCardProps {
  overall: number;
  chapters: ComplianceStatus[];
}

export default function ComplianceStatusCard({ overall, chapters }: ComplianceStatusCardProps) {
  const getStatusColor = (status: string) => {
    if (status === "Success") return "bg-success-500 dark:bg-success-600";
    if (status === "Warning") return "bg-warning-500 dark:bg-warning-600";
    return "bg-danger-500 dark:bg-danger-600";
  };

  return (
    <Card>
      <CardHeader className="px-5 py-4">
        <CardTitle className="text-base font-semibold">Overall Compliance Status</CardTitle>
      </CardHeader>

      <CardContent className="p-5">
        <div className="flex items-center justify-center mb-6">
          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* Circular progress indicator - simplified for this implementation */}
            <div className="absolute inset-0 rounded-full border-8 border-gray-200 dark:border-gray-700"></div>
            <div 
              className="absolute inset-0 rounded-full border-8 border-warning-500 dark:border-warning-600" 
              style={{ 
                clipPath: `polygon(0 0, 50% 0, 50% 50%, 0 50%)`,
                transform: `rotate(${overall * 3.6}deg)`
              }}
            ></div>
            <div className="text-center">
              <span className="block text-3xl font-bold text-gray-900 dark:text-gray-100">{overall}%</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">Overall Score</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          {chapters.map((chapter) => (
            <div key={chapter.id}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">USP {chapter.chapter}</span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{chapter.percentage}%</span>
              </div>
              <Progress 
                value={chapter.percentage} 
                className="h-2 w-full bg-gray-200 dark:bg-gray-700"
                indicatorClassName={getStatusColor(chapter.status)}
              />
            </div>
          ))}
        </div>
        
        <div className="mt-6 flex justify-center">
          <Button 
            className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-800 text-white cursor-pointer"
            onClick={() => window.location.href = "/reports"}
          >
            View Detailed Report
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
