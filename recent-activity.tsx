import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';
import { Audit } from '@shared/schema';

interface RecentActivityProps {
  pharmacyId: string;
}

export function RecentActivity({ pharmacyId }: RecentActivityProps) {
  const { data, isLoading } = useQuery<any, unknown, any>({
    queryKey: ['/api/dashboard', pharmacyId],
    select: (data) => data.recentActivities as Audit[],
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Loading activity data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Loading...</p>
                  <p className="text-sm text-muted-foreground">Loading...</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>No recent activity found</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[200px]">
            <p className="text-sm text-muted-foreground">No activity logged yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest compliance activities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {data.map((activity: Audit) => (
            <div key={activity.id} className="flex items-center">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{activity.action}</p>
                <p className="text-sm text-muted-foreground">
                  {activity.timestamp ? 
                    formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true }) : 
                    'Unknown date'
                  } by {activity.userId ? activity.userId : 'System'}
                </p>
                {activity.details && (
                  <p className="text-xs text-muted-foreground mt-1">{activity.details}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}