import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

interface ComplianceTrendChartProps {
  pharmacyId: string;
  uspChapter: string;
  period?: 'week' | 'month' | 'quarter' | 'year';
}

export function ComplianceTrendChart({ 
  pharmacyId, 
  uspChapter,
  period = 'month' 
}: ComplianceTrendChartProps) {
  // This would be a real API call in production
  const data = generateComplianceData(uspChapter, period);
  
  const getChapterColor = (chapter: string) => {
    switch (chapter) {
      case 'USP 795':
        return '#22c55e'; // Green
      case 'USP 797':
        return '#3b82f6'; // Blue
      case 'USP 800':
        return '#ef4444'; // Red
      case 'USP 825':
        return '#a855f7'; // Purple
      default:
        return '#94a3b8'; // Gray
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{uspChapter} Compliance Trend</CardTitle>
        <CardDescription>
          {period === 'week' && 'Weekly'}
          {period === 'month' && 'Monthly'}
          {period === 'quarter' && 'Quarterly'}
          {period === 'year' && 'Yearly'} 
          compliance percentage
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis 
                dataKey="name" 
                stroke="#94a3b8" 
                fontSize={12}
              />
              <YAxis 
                stroke="#94a3b8" 
                fontSize={12}
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip 
                formatter={(value) => [`${value}%`, 'Compliance']}
                contentStyle={{ 
                  backgroundColor: 'rgba(30, 41, 59, 0.8)',
                  borderColor: 'rgba(148, 163, 184, 0.2)',
                  borderRadius: '6px',
                  color: '#f8fafc'
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="compliance"
                stroke={getChapterColor(uspChapter)}
                activeDot={{ r: 8 }}
                strokeWidth={2}
                dot={{ stroke: getChapterColor(uspChapter), strokeWidth: 2, r: 4, fill: 'white' }}
              />
              <Line
                type="monotone"
                dataKey="target"
                stroke="#94a3b8"
                strokeDasharray="5 5"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

// This function simulates compliance data - would be replaced with real API data
function generateComplianceData(uspChapter: string, period: 'week' | 'month' | 'quarter' | 'year') {
  const data = [];
  let baseCompliance = 0;
  
  // Set different base compliance levels for different USP chapters
  switch (uspChapter) {
    case 'USP 795':
      baseCompliance = 84;
      break;
    case 'USP 797':
      baseCompliance = 91;
      break;
    case 'USP 800':
      baseCompliance = 78;
      break;
    case 'USP 825':
      baseCompliance = 95;
      break;
    default:
      baseCompliance = 85;
  }
  
  // Set time points based on period
  let timePoints: string[] = [];
  let pointCount = 0;
  
  switch (period) {
    case 'week':
      timePoints = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      pointCount = 7;
      break;
    case 'month':
      timePoints = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
      pointCount = 4;
      break;
    case 'quarter':
      timePoints = ['Jan', 'Feb', 'Mar'];
      pointCount = 3;
      break;
    case 'year':
      timePoints = ['Q1', 'Q2', 'Q3', 'Q4'];
      pointCount = 4;
      break;
  }
  
  // Generate data with slight variations
  for (let i = 0; i < pointCount; i++) {
    const variation = Math.floor(Math.random() * 15) - 7; // -7 to +7 variation
    data.push({
      name: timePoints[i],
      compliance: Math.max(50, Math.min(100, baseCompliance + variation)),
      target: 90, // Target compliance level
    });
  }
  
  return data;
}