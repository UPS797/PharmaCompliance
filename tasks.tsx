import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskList } from '@/components/tasks/task-list';
import { NotionTaskDashboard } from '@/components/tasks/notion-dashboard';

export default function TasksPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Compliance Tasks</h1>
        <p className="text-muted-foreground mt-1">Track and manage all your pharmacy compliance tasks</p>
      </div>
      
      <Tabs defaultValue="dashboard" className="mt-6">
        <TabsList className="grid grid-cols-2 w-[400px] mb-8">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="list">Task List</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="mt-0">
          <NotionTaskDashboard />
        </TabsContent>
        
        <TabsContent value="list" className="mt-0">
          <TaskList />
        </TabsContent>
      </Tabs>
    </div>
  );
}