import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Sparkles,
  HelpCircle,
  Info,
  BookOpen,
  CheckCircle,
  Settings,
  AlertTriangle,
  Thermometer,
  BarChart2,
  Clock,
  Users,
  ListChecks,
  Lightbulb,
  File,
  Sliders,
  PieChart,
  Download
} from "lucide-react";

export default function UserGuidePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">User Guide</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Comprehensive guide to using the Pharmacy Compliance Management System
          </p>
        </div>
        <Button variant="outline" className="mt-2 md:mt-0">
          <Download className="h-4 w-4 mr-2" /> Download PDF
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card className="sticky top-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Table of Contents</CardTitle>
            </CardHeader>
            <CardContent>
              <nav className="space-y-1">
                <button 
                  onClick={() => document.getElementById('introduction')?.scrollIntoView({ behavior: 'smooth' })}
                  className="flex items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 w-full text-left"
                >
                  <Info className="h-4 w-4 mr-2" />
                  <span>Introduction</span>
                </button>
                <button 
                  onClick={() => document.getElementById('dashboard')?.scrollIntoView({ behavior: 'smooth' })}
                  className="flex items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 w-full text-left"
                >
                  <BarChart2 className="h-4 w-4 mr-2" />
                  <span>Dashboard</span>
                </button>
                <button 
                  onClick={() => document.getElementById('compliance')?.scrollIntoView({ behavior: 'smooth' })}
                  className="flex items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 w-full text-left"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  <span>Compliance Management</span>
                </button>
                <button 
                  onClick={() => document.getElementById('tasks')?.scrollIntoView({ behavior: 'smooth' })}
                  className="flex items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 w-full text-left"
                >
                  <ListChecks className="h-4 w-4 mr-2" />
                  <span>Task Management</span>
                </button>
                <button 
                  onClick={() => document.getElementById('sop-templates')?.scrollIntoView({ behavior: 'smooth' })}
                  className="flex items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 w-full text-left"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  <span>SOP Templates</span>
                </button>
                <button 
                  onClick={() => document.getElementById('template-optimizer')?.scrollIntoView({ behavior: 'smooth' })}
                  className="flex items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 w-full text-left"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  <span>Template Optimizer</span>
                </button>
                <button 
                  onClick={() => document.getElementById('documents')?.scrollIntoView({ behavior: 'smooth' })}
                  className="flex items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 w-full text-left"
                >
                  <File className="h-4 w-4 mr-2" />
                  <span>Document Management</span>
                </button>
                <button 
                  onClick={() => document.getElementById('risk-assessment')?.scrollIntoView({ behavior: 'smooth' })}
                  className="flex items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 w-full text-left"
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  <span>Risk Assessment</span>
                </button>
                <button 
                  onClick={() => document.getElementById('help-center')?.scrollIntoView({ behavior: 'smooth' })}
                  className="flex items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 w-full text-left"
                >
                  <HelpCircle className="h-4 w-4 mr-2" />
                  <span>Help Center</span>
                </button>
              </nav>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2 space-y-8">
          {/* Introduction Section */}
          <section id="introduction">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Introduction to the Pharmacy Compliance Management System</CardTitle>
                <CardDescription>
                  Overview of the system and key features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose dark:prose-invert max-w-none">
                  <p>
                    Welcome to the Pharmacy Compliance Management System, a comprehensive solution designed to help pharmacies maintain compliance with USP (United States Pharmacopeia) chapters 795, 797, 800, and 825. This system provides tools for creating standardized operating procedures, managing compliance tasks, monitoring environmental conditions, conducting risk assessments, and generating compliance reports.
                  </p>
                  <p>
                    Our platform helps you:
                  </p>
                  <ul>
                    <li>Track compliance with USP requirements through a centralized dashboard</li>
                    <li>Create and customize standard operating procedures (SOPs) using templates</li>
                    <li>Manage tasks and deadlines for compliance-related activities</li>
                    <li>Document and monitor training for pharmacy staff</li>
                    <li>Conduct and track risk assessments</li>
                    <li>Generate reports for audits and inspections</li>
                  </ul>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                  <div className="flex">
                    <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-blue-700 dark:text-blue-300">Key Compliance Areas</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                        <div className="flex items-start space-x-2">
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">USP 795</Badge>
                          <p className="text-sm">Non-sterile compounding procedures</p>
                        </div>
                        <div className="flex items-start space-x-2">
                          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">USP 797</Badge>
                          <p className="text-sm">Sterile compounding procedures</p>
                        </div>
                        <div className="flex items-start space-x-2">
                          <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">USP 800</Badge>
                          <p className="text-sm">Handling of hazardous drugs</p>
                        </div>
                        <div className="flex items-start space-x-2">
                          <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">USP 825</Badge>
                          <p className="text-sm">Radiopharmaceutical preparation</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
          
          {/* Dashboard Section */}
          <section id="dashboard">
            <Card>
              <CardHeader>
                <div className="flex items-center">
                  <BarChart2 className="h-5 w-5 mr-2 text-blue-500" />
                  <CardTitle className="text-xl">Dashboard</CardTitle>
                </div>
                <CardDescription>
                  Monitoring your pharmacy's compliance at a glance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose dark:prose-invert max-w-none">
                  <p>
                    The dashboard provides a centralized view of your pharmacy's compliance status, upcoming tasks, critical issues, and recent activities. This is your starting point for managing and monitoring compliance.
                  </p>
                  <p>The dashboard includes:</p>
                  <ul>
                    <li><strong>Compliance Overview:</strong> Overall compliance percentage and breakdown by USP chapter</li>
                    <li><strong>Upcoming Tasks:</strong> Tasks that are due soon to help prioritize your work</li>
                    <li><strong>Critical Issues:</strong> High-priority compliance requirements that need attention</li>
                    <li><strong>Recent Activities:</strong> Chronological log of compliance-related actions</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </section>
          
          {/* Task Management Section */}
          <section id="tasks">
            <Card>
              <CardHeader>
                <div className="flex items-center">
                  <ListChecks className="h-5 w-5 mr-2 text-blue-500" />
                  <CardTitle className="text-xl">Task Management</CardTitle>
                </div>
                <CardDescription>
                  Tracking and managing compliance-related tasks and deadlines
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose dark:prose-invert max-w-none">
                  <p>
                    The Task Management module helps you organize, assign, and track compliance-related tasks across your pharmacy. This ensures that all required activities are completed on time and properly documented.
                  </p>
                  <p>Key features include:</p>
                  <ul>
                    <li><strong>Task Types:</strong> Environmental monitoring, cleaning verification, documentation review, staff training, equipment calibration, and risk assessment tasks</li>
                    <li><strong>Task Assignment:</strong> Assign tasks to specific staff members with due dates</li>
                    <li><strong>Task Completion:</strong> Document completion with detailed forms specific to each task type</li>
                    <li><strong>Recurring Tasks:</strong> Set up recurring tasks on daily, weekly, monthly, or quarterly schedules</li>
                    <li><strong>Reminders:</strong> Automated notifications for upcoming deadlines and overdue tasks</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* SOP Templates Section */}
          <section id="sop-templates">
            <Card>
              <CardHeader>
                <div className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-blue-500" />
                  <CardTitle className="text-xl">SOP Templates</CardTitle>
                </div>
                <CardDescription>
                  Creating and customizing Standard Operating Procedures
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose dark:prose-invert max-w-none">
                  <p>
                    The SOP Templates module provides pre-built templates for creating standardized operating procedures that comply with USP requirements. These templates can be customized to meet your pharmacy's specific needs while ensuring regulatory compliance.
                  </p>
                  <p>Key benefits:</p>
                  <ul>
                    <li><strong>Template Library:</strong> Access templates organized by USP chapters (795, 797, 800, 825)</li>
                    <li><strong>Customization:</strong> Tailor templates to your pharmacy's specific processes</li>
                    <li><strong>Version Control:</strong> Track changes and maintain history of all SOPs</li>
                    <li><strong>Compliance Assurance:</strong> Templates designed to meet current regulatory requirements</li>
                    <li><strong>Sharing:</strong> Distribute SOPs to staff with read receipts to verify review</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </section>
          
          {/* Template Optimizer Section */}
          <section id="template-optimizer">
            <Card>
              <CardHeader>
                <div className="flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-purple-500" />
                  <CardTitle className="text-xl">AI Template Optimizer</CardTitle>
                </div>
                <CardDescription>
                  Enhancing SOPs with AI-powered compliance suggestions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose dark:prose-invert max-w-none">
                  <p>
                    The AI Template Optimizer is an intelligent assistant that analyzes your SOP templates and provides targeted suggestions to improve compliance, clarity, and completeness. This feature helps ensure your SOPs meet regulatory requirements while being clear and comprehensive.
                  </p>
                  <p>Key features include:</p>
                  <ul>
                    <li>
                      <strong>Compliance Analysis:</strong> Ensures alignment with USP chapter requirements and regulatory standards
                    </li>
                    <li>
                      <strong>Clarity Improvements:</strong> Enhances readability and removes ambiguity from procedures
                    </li>
                    <li>
                      <strong>Completeness Check:</strong> Identifies missing information or sections that should be included
                    </li>
                    <li>
                      <strong>Priority-Based Suggestions:</strong> Provides high, medium, and low priority improvement recommendations
                    </li>
                    <li>
                      <strong>One-Click Application:</strong> Apply suggestions directly to your SOP with a single click
                    </li>
                  </ul>
                  <p>
                    To use the optimizer, simply navigate to any SOP template, click the "AI Optimizer" tab, and then click "Generate Optimization Suggestions." Review the suggestions provided and apply them as needed to improve your SOP content.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Document Management Section */}
          <section id="documents">
            <Card>
              <CardHeader>
                <div className="flex items-center">
                  <File className="h-5 w-5 mr-2 text-blue-500" />
                  <CardTitle className="text-xl">Document Management</CardTitle>
                </div>
                <CardDescription>
                  Organizing and controlling compliance documentation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose dark:prose-invert max-w-none">
                  <p>
                    The Document Management module provides a central repository for all compliance-related documentation, including SOPs, policies, training materials, and records. This ensures that all documentation is properly organized, version-controlled, and accessible to authorized personnel.
                  </p>
                  <p>Key features include:</p>
                  <ul>
                    <li><strong>Document Repository:</strong> Centralized storage organized by category and USP chapter</li>
                    <li><strong>Search and Filter:</strong> Quickly find documents by title, content, date, or category</li>
                    <li><strong>Preview:</strong> View documents in the browser without downloading</li>
                    <li><strong>Version Control:</strong> Track changes and maintain history of all documents</li>
                    <li><strong>Access Controls:</strong> Manage who can view, edit, or approve documents</li>
                    <li><strong>Review Cycles:</strong> Set review dates and receive notifications when reviews are due</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </section>
          
          {/* Risk Assessment Section */}
          <section id="risk-assessment">
            <Card>
              <CardHeader>
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
                  <CardTitle className="text-xl">Risk Assessment</CardTitle>
                </div>
                <CardDescription>
                  Identifying and mitigating compliance risks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose dark:prose-invert max-w-none">
                  <p>
                    The Risk Assessment module helps you identify, evaluate, and mitigate potential risks in your pharmacy operations. This proactive approach allows you to address issues before they become compliance problems or patient safety concerns.
                  </p>
                  <p>Key features include:</p>
                  <ul>
                    <li><strong>Risk Identification:</strong> Identify risks in processes, equipment, facilities, and personnel</li>
                    <li><strong>Risk Analysis:</strong> Evaluate risks based on likelihood, impact, and detection difficulty</li>
                    <li><strong>Risk Prioritization:</strong> Calculate Risk Priority Numbers (RPNs) to prioritize issues</li>
                    <li><strong>Mitigation Strategies:</strong> Develop and implement control measures for high-priority risks</li>
                    <li><strong>Monitoring:</strong> Track risk status and effectiveness of mitigation measures</li>
                    <li><strong>Reassessment:</strong> Regularly review and update risk assessments</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </section>
          
          {/* Help Center Section */}
          <section id="help-center">
            <Card>
              <CardHeader>
                <div className="flex items-center">
                  <HelpCircle className="h-5 w-5 mr-2 text-blue-500" />
                  <CardTitle className="text-xl">Help Center</CardTitle>
                </div>
                <CardDescription>
                  Support resources and assistance for system users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose dark:prose-invert max-w-none">
                  <p>
                    Our dedicated Help Center provides comprehensive support to ensure you get the most out of the Pharmacy Compliance Management System.
                  </p>

                  <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg border border-blue-100 dark:border-blue-800 my-4">
                    <h3 className="text-blue-700 dark:text-blue-300 font-medium flex items-center">
                      <HelpCircle className="h-4 w-4 mr-2" />
                      Contact Support
                    </h3>
                    <ul className="mt-2 space-y-2">
                      <li className="flex items-start">
                        <span className="font-semibold mr-2">Phone:</span>
                        <span>(800) 555-1234 (Available Mon-Fri, 8am-6pm ET)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="font-semibold mr-2">Email:</span>
                        <span>support@pharmacompliance.com (24/7, response within 24 hours)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="font-semibold mr-2">Live Chat:</span>
                        <span>Available through the Help icon (Mon-Fri, 8am-8pm ET)</span>
                      </li>
                    </ul>
                  </div>
                  
                  <h3>Training Resources</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    <div className="border rounded-md p-3">
                      <h4 className="font-medium">Video Tutorials</h4>
                      <p className="text-sm mt-2">
                        Step-by-step video guides demonstrating how to use each feature of the system effectively.
                      </p>
                      <button className="mt-2 text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">
                        Browse Video Library →
                      </button>
                    </div>
                    
                    <div className="border rounded-md p-3">
                      <h4 className="font-medium">Knowledge Base</h4>
                      <p className="text-sm mt-2">
                        Searchable database of articles, FAQs, and troubleshooting guides.
                      </p>
                      <button className="mt-2 text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">
                        Search Knowledge Base →
                      </button>
                    </div>
                    
                    <div className="border rounded-md p-3">
                      <h4 className="font-medium">Webinars</h4>
                      <p className="text-sm mt-2">
                        Live and recorded training sessions covering system features and compliance best practices.
                      </p>
                      <button className="mt-2 text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">
                        View Upcoming Sessions →
                      </button>
                    </div>
                    
                    <div className="border rounded-md p-3">
                      <h4 className="font-medium">Regulatory Resources</h4>
                      <p className="text-sm mt-2">
                        Access to USP chapters, FDA regulations, and industry best practices.
                      </p>
                      <button className="mt-2 text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">
                        Access Resources →
                      </button>
                    </div>
                  </div>
                  
                  <h3 className="mt-6">Frequently Asked Questions</h3>
                  <div className="mt-2">
                    <div className="border-b pb-2">
                      <h4 className="font-medium">How do I reset my password?</h4>
                      <p className="text-sm mt-1">
                        Click the "Forgot Password" link on the login screen. Enter your email address, and you'll receive instructions to reset your password.
                      </p>
                    </div>
                    <div className="border-b py-2">
                      <h4 className="font-medium">How often should I update my SOPs?</h4>
                      <p className="text-sm mt-1">
                        SOPs should be reviewed at least annually, or whenever there are changes to regulations, equipment, processes, or personnel roles.
                      </p>
                    </div>
                    <div className="border-b py-2">
                      <h4 className="font-medium">How do I prepare for an inspection?</h4>
                      <p className="text-sm mt-1">
                        Use the Inspection Prep module to access checklists, organize documentation, and conduct mock inspections before regulatory visits.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}