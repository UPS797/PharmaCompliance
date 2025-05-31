import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";
import { useQuery } from '@tanstack/react-query';

interface CriticalIssue {
  id: number;
  requirementId: number;
  status: string;
  notes: string;
  lastUpdated: string;
  requirement: {
    id: number;
    chapterId: number;
    text: string;
    category: string;
  };
}

interface CriticalIssuesProps {
  pharmacyId: string;
}

export function CriticalIssues({ pharmacyId }: CriticalIssuesProps) {
  const { data, isLoading } = useQuery<any, unknown, any>({
    queryKey: ['/api/dashboard', pharmacyId],
    select: (data) => data.criticalIssues as CriticalIssue[],
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-base font-medium">Critical Issues</CardTitle>
            <CardDescription>Non-compliant items requiring immediate attention</CardDescription>
          </div>
          <AlertTriangle className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="h-[220px] flex items-center justify-center">
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-base font-medium">Critical Issues</CardTitle>
            <CardDescription>Non-compliant items requiring immediate attention</CardDescription>
          </div>
          <AlertTriangle className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="h-[220px] flex flex-col items-center justify-center">
            <p className="text-sm text-muted-foreground">No critical issues found</p>
            <p className="text-xs text-muted-foreground mt-1">All compliance requirements are being met</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-base font-medium">Critical Issues</CardTitle>
          <CardDescription>Non-compliant items requiring immediate attention</CardDescription>
        </div>
        <AlertTriangle className="h-4 w-4 text-amber-500" />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Requirement</TableHead>
              <TableHead>USP Chapter</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((issue: CriticalIssue) => (
              <TableRow key={issue.id}>
                <TableCell className="font-medium">{issue.requirement.text}</TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {issue.requirement.category}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className="bg-red-500">
                    {issue.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}