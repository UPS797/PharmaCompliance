import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { PageHeader } from '@/components/shared/page-header';
import { ComplianceOverview } from '@/components/dashboard/compliance-overview';
import { UpcomingDeadlines } from '@/components/dashboard/upcoming-deadlines';
import { CriticalIssues } from '@/components/dashboard/critical-issues';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { ComplianceMetricCard } from '@/components/dashboard/compliance-metric-card';
import { ComplianceTrendChart } from '@/components/dashboard/compliance-trend-chart';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Activity, 
  AlertTriangle, 
  BadgeCheck, 
  Beaker, 
  Calendar, 
  Droplets, 
  Tablet, 
  Thermometer 
} from 'lucide-react';

export default function PharmacistDashboard() {
  const [, setLocation] = useLocation();
  const [pharmacyId, setPharmacyId] = useState('Central Pharmacy');

  const handlePharmacyChange = (value: string) => {
    setPharmacyId(value);
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <PageHeader
          heading="Pharmacist Dashboard"
          subheading="Real-time compliance monitoring for your pharmacy"
        />
        <Select value={pharmacyId} onValueChange={handlePharmacyChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select pharmacy" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Central Pharmacy">Central Pharmacy</SelectItem>
            <SelectItem value="North Branch">North Branch</SelectItem>
            <SelectItem value="South Branch">South Branch</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <ComplianceMetricCard
          title="USP 795"
          value={84}
          description="Non-sterile compounds"
          status="at-risk"
          trend="up"
          icon={<Beaker className="h-4 w-4 text-muted-foreground" />}
        />
        <ComplianceMetricCard
          title="USP 797"
          value={91}
          description="Sterile compounds"
          status="compliant"
          trend="stable"
          icon={<Droplets className="h-4 w-4 text-muted-foreground" />}
        />
        <ComplianceMetricCard
          title="USP 800"
          value={78}
          description="Hazardous drugs"
          status="at-risk"
          trend="down"
          icon={<AlertTriangle className="h-4 w-4 text-muted-foreground" />}
        />
        <ComplianceMetricCard
          title="USP 825"
          value={95}
          description="Radiopharmaceuticals"
          status="compliant"
          trend="up"
          icon={<Thermometer className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <ComplianceOverview pharmacyId={pharmacyId} />
        <div className="grid gap-4 col-span-1 lg:col-span-2">
          <CriticalIssues pharmacyId={pharmacyId} />
          <RecentActivity pharmacyId={pharmacyId} />
        </div>
      </div>

      {/* Trend Charts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <ComplianceTrendChart pharmacyId={pharmacyId} uspChapter="USP 795" period="month" />
        <ComplianceTrendChart pharmacyId={pharmacyId} uspChapter="USP 797" period="month" />
        <ComplianceTrendChart pharmacyId={pharmacyId} uspChapter="USP 800" period="month" />
        <ComplianceTrendChart pharmacyId={pharmacyId} uspChapter="USP 825" period="month" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <UpcomingDeadlines pharmacyId={pharmacyId} />
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Commonly used compliance tools</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="flex flex-col items-center justify-center h-24 space-y-2"
                onClick={() => setLocation('/tasks')}
              >
                <Calendar className="h-5 w-5" />
                <span>Tasks</span>
              </Button>
              <Button 
                variant="outline" 
                className="flex flex-col items-center justify-center h-24 space-y-2"
                onClick={() => setLocation('/documents')}
              >
                <Tablet className="h-5 w-5" />
                <span>Documents</span>
              </Button>
              <Button 
                variant="outline" 
                className="flex flex-col items-center justify-center h-24 space-y-2"
                onClick={() => setLocation('/audit')}
              >
                <Activity className="h-5 w-5" />
                <span>Audit Log</span>
              </Button>
              <Button 
                variant="outline" 
                className="flex flex-col items-center justify-center h-24 space-y-2"
                onClick={() => setLocation('/risk-assessment')}
              >
                <AlertTriangle className="h-5 w-5" />
                <span>Risk Assessment</span>
              </Button>
              <Button 
                variant="outline" 
                className="flex flex-col items-center justify-center h-24 space-y-2"
                onClick={() => setLocation('/training')}
              >
                <BadgeCheck className="h-5 w-5" />
                <span>Training</span>
              </Button>
              <Button 
                variant="outline" 
                className="flex flex-col items-center justify-center h-24 space-y-2"
                onClick={() => setLocation('/compliance')}
              >
                <Tablet className="h-5 w-5" />
                <span>USP Compliance</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";