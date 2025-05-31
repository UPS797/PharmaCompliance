import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, CheckCircle, AlertTriangle, List } from "lucide-react";

interface Activity {
  id: number;
  user: string | null;
  action: string;
  timestamp: string;
  type: "document" | "compliance" | "alert" | "analysis";
}

interface ActivityCardProps {
  activities: Activity[];
}

export default function ActivityCard({ activities }: ActivityCardProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "document":
        return (
          <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-500">
            <FileText className="h-4 w-4" />
          </div>
        );
      case "compliance":
        return (
          <div className="w-8 h-8 rounded-full bg-success-100 dark:bg-success-900/30 flex items-center justify-center text-success-600 dark:text-success-500">
            <CheckCircle className="h-4 w-4" />
          </div>
        );
      case "alert":
        return (
          <div className="w-8 h-8 rounded-full bg-warning-100 dark:bg-warning-900/30 flex items-center justify-center text-warning-600 dark:text-warning-500">
            <AlertTriangle className="h-4 w-4" />
          </div>
        );
      case "analysis":
        return (
          <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-500">
            <List className="h-4 w-4" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader className="px-5 py-4">
        <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-80 overflow-y-auto">
          {activities.map((activity) => (
            <div key={activity.id} className="px-5 py-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {getActivityIcon(activity.type)}
                </div>
                <div>
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    {activity.user ? (
                      <span className="font-medium">{activity.user}</span>
                    ) : (
                      <span className="font-medium">System</span>
                    )}{" "}
                    {activity.action}
                  </p>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{activity.timestamp}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter className="px-5 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 flex justify-center">
        <a href="/audit" className="text-sm text-primary-600 dark:text-primary-500 font-medium hover:text-primary-700 dark:hover:text-primary-400">
          View All Activity
        </a>
      </CardFooter>
    </Card>
  );
}
