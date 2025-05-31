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

interface ComplianceMetricCardProps {
  title: string;
  value: number;
  description: string;
  status: 'compliant' | 'at-risk' | 'non-compliant';
  trend?: 'up' | 'down' | 'stable';
  icon?: React.ReactNode;
}

export function ComplianceMetricCard({
  title,
  value,
  description,
  status,
  trend,
  icon,
}: ComplianceMetricCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'compliant':
        return 'bg-green-500';
      case 'at-risk':
        return 'bg-yellow-500';
      case 'non-compliant':
        return 'bg-red-500';
    }
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    
    switch (trend) {
      case 'up':
        return <span className="text-green-500">↑</span>;
      case 'down':
        return <span className="text-red-500">↓</span>;
      case 'stable':
        return <span className="text-blue-500">→</span>;
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-base font-medium">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-2">
          {value}% {getTrendIcon()}
        </div>
        <Progress value={value} className="h-2 mb-2" />
        <div className="flex items-center justify-between mt-2">
          <Badge className={getStatusColor()}>
            {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
          </Badge>
          {trend && (
            <span className="text-xs text-muted-foreground">
              {trend === 'up' ? 'Improving' : trend === 'down' ? 'Declining' : 'Stable'}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}