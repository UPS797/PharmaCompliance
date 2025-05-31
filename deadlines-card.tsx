import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ChevronRight, Calendar, User } from "lucide-react";

interface Deadline {
  id: number;
  title: string;
  description: string;
  assignedTo: string;
  dueInDays: number;
  priority: "High" | "Medium" | "Low";
}

interface DeadlinesCardProps {
  deadlines: Deadline[];
}

export default function DeadlinesCard({ deadlines }: DeadlinesCardProps) {
  const getPriorityStyles = (priority: string) => {
    if (priority === "High") {
      return {
        bg: "bg-danger-100 dark:bg-danger-900/30",
        text: "text-danger-600 dark:text-danger-500",
        badge: "bg-danger-50 dark:bg-danger-900/50 text-danger-700 dark:text-danger-500"
      };
    } else if (priority === "Medium") {
      return {
        bg: "bg-warning-100 dark:bg-warning-900/30",
        text: "text-warning-600 dark:text-warning-500",
        badge: "bg-warning-50 dark:bg-warning-900/50 text-warning-700 dark:text-warning-500"
      };
    } else {
      return {
        bg: "bg-primary-100 dark:bg-primary-900/30",
        text: "text-primary-600 dark:text-primary-500",
        badge: "bg-primary-50 dark:bg-primary-900/50 text-primary-700 dark:text-primary-500"
      };
    }
  };

  return (
    <Card>
      <CardHeader className="px-5 py-4 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-semibold">Upcoming Deadlines</CardTitle>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </CardHeader>

      <CardContent className="p-0">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {deadlines.map((deadline) => {
            const styles = getPriorityStyles(deadline.priority);
            return (
              <div key={deadline.id} className="px-5 py-4 flex items-center justify-between">
                <div className="flex items-start space-x-4">
                  <div className={`w-10 h-10 rounded-full ${styles.bg} flex items-center justify-center ${styles.text}`}>
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">{deadline.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{deadline.description}</p>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-2">
                      <User className="h-3 w-3 mr-1" />
                      <span>Assigned to: {deadline.assignedTo}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles.badge}`}>
                    {deadline.dueInDays <= 3 
                      ? `Due in ${deadline.dueInDays} days` 
                      : `Due in ${deadline.dueInDays} days`}
                  </span>
                  <div className="mt-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 cursor-pointer"
                      onClick={() => window.location.href = `/tasks?task=${deadline.id}`}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>

      <CardFooter className="px-5 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 flex justify-center">
        <a href="/checklists" className="text-sm text-primary-600 dark:text-primary-500 font-medium hover:text-primary-700 dark:hover:text-primary-400">
          View All Deadlines
        </a>
      </CardFooter>
    </Card>
  );
}
