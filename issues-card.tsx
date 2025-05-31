import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, FilterX } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CriticalIssue {
  id: number;
  title: string;
  description: string;
  chapter: string;
  severity: "Critical" | "Major" | "Minor";
  status: "Open" | "In Progress" | "Resolved";
}

interface IssuesCardProps {
  issues: CriticalIssue[];
}

export default function IssuesCard({ issues }: IssuesCardProps) {
  const getSeverityBadgeClass = (severity: string) => {
    if (severity === "Critical") {
      return "bg-danger-100 dark:bg-danger-900/30 text-danger-800 dark:text-danger-500";
    } else if (severity === "Major") {
      return "bg-warning-100 dark:bg-warning-900/30 text-warning-800 dark:text-warning-500";
    } else {
      return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-500";
    }
  };

  const getStatusBadgeClass = (status: string) => {
    if (status === "Open") {
      return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-500";
    } else if (status === "In Progress") {
      return "bg-warning-100 dark:bg-warning-900/30 text-warning-800 dark:text-warning-500";
    } else {
      return "bg-success-100 dark:bg-success-900/30 text-success-800 dark:text-success-500";
    }
  };

  return (
    <Card>
      <CardHeader className="px-5 py-4 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-semibold">Critical Issues</CardTitle>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="h-8 px-3 text-gray-700 dark:text-gray-300">
            <FilterX className="h-4 w-4 mr-1" />
            <span>Filter</span>
          </Button>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Issue</th>
                <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">USP Chapter</th>
                <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Severity</th>
                <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
              {issues.map((issue) => (
                <tr key={issue.id}>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{issue.title}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{issue.description}</div>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <Badge variant="outline" className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300">
                      USP {issue.chapter}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <Badge variant="outline" className={getSeverityBadgeClass(issue.severity)}>
                      {issue.severity}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <Badge variant="outline" className={getStatusBadgeClass(issue.status)}>
                      {issue.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-sm">
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-primary-600 dark:text-primary-500 hover:text-primary-800 dark:hover:text-primary-400 cursor-pointer"
                      onClick={() => window.location.href = `/compliance?issue=${issue.id}`}
                    >
                      Manage
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>

      <CardFooter className="px-5 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <span className="text-sm text-gray-700 dark:text-gray-300">
          Showing <span className="font-medium">{issues.length}</span> of <span className="font-medium">9</span> issues
        </span>
        <a href="/compliance" className="text-sm text-primary-600 dark:text-primary-500 font-medium hover:text-primary-700 dark:hover:text-primary-400">
          View All Issues
        </a>
      </CardFooter>
    </Card>
  );
}
