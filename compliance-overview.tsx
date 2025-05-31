import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useQuery } from '@tanstack/react-query';

interface ComplianceStatusData {
  overall: number;
  byChapter: Array<{
    id: number;
    chapter: string;
    percentage: number;
    status: string;
  }>;
}

interface ComplianceOverviewProps {
  pharmacyId: string;
}

export function ComplianceOverview({ pharmacyId }: ComplianceOverviewProps) {
  const { data, isLoading } = useQuery<any, unknown, any>({
    queryKey: ['/api/dashboard', pharmacyId],
    select: (data) => data.complianceStatus as ComplianceStatusData,
  });

  if (isLoading) {
    return (
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Compliance Overview</CardTitle>
          <CardDescription>Loading compliance data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">Overall Compliance</div>
              <div className="text-sm text-muted-foreground">Loading...</div>
            </div>
            <Progress value={0} className="h-2" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Compliance Overview</CardTitle>
          <CardDescription>No compliance data available</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'compliant':
        return 'bg-green-500';
      case 'at risk':
        return 'bg-yellow-500';
      case 'non-compliant':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Compliance Overview</CardTitle>
        <CardDescription>Real-time compliance status across USP chapters</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">Overall Compliance</div>
              <div className="text-sm text-muted-foreground">{data.overall}%</div>
            </div>
            <Progress value={data.overall} className="h-2" />
          </div>

          <div className="space-y-5">
            {data.byChapter.map((chapter: {
              id: number;
              chapter: string;
              percentage: number;
              status: string;
            }) => (
              <div key={chapter.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="text-sm font-medium">USP {chapter.chapter}</div>
                    <Badge className={getStatusColor(chapter.status)}>
                      {chapter.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">{chapter.percentage}%</div>
                </div>
                <Progress value={chapter.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}