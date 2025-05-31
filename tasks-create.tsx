import React from 'react';
import { CreateTaskForm } from '@/components/tasks/create-task-form';

export default function CreateTaskPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Create Compliance Task</h1>
        <p className="text-muted-foreground mt-1">Add a new compliance task to your Notion workspace</p>
      </div>
      
      <div className="mt-8">
        <CreateTaskForm />
      </div>
    </div>
  );
}