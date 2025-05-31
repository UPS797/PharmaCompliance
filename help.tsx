import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, HelpCircle, FileText, Video, MessageSquare, Book, Mail, Phone, Users, ExternalLink } from "lucide-react";

export default function Help() {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Help Center</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Find answers, tutorials, and support resources</p>
      </div>
      
      {/* Search Bar */}
      <div className="relative max-w-3xl mb-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 h-5 w-5" />
        <Input 
          className="pl-10 py-6 text-base"
          placeholder="Search for help on any topic..."
        />
        <Button className="absolute right-1 top-1/2 transform -translate-y-1/2 h-9">
          Search
        </Button>
      </div>
      
      {/* Help Categories */}
      <Tabs defaultValue="guides" className="mb-8">
        <TabsList className="grid grid-cols-4 w-full max-w-3xl">
          <TabsTrigger value="guides">Guides</TabsTrigger>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
          <TabsTrigger value="videos">Video Tutorials</TabsTrigger>
          <TabsTrigger value="contact">Contact Support</TabsTrigger>
        </TabsList>
        
        {/* Guides */}
        <TabsContent value="guides">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-500" />
                  Getting Started
                </CardTitle>
                <CardDescription>Basic guides to set up and use the system</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2 text-sm">
                  <li className="text-blue-600 dark:text-blue-400 hover:underline">
                    <a href="#" className="flex items-center">
                      <span className="mr-2">•</span> System Overview & Navigation
                    </a>
                  </li>
                  <li className="text-blue-600 dark:text-blue-400 hover:underline">
                    <a href="#" className="flex items-center">
                      <span className="mr-2">•</span> Setting Up Your Pharmacy Profile
                    </a>
                  </li>
                  <li className="text-blue-600 dark:text-blue-400 hover:underline">
                    <a href="#" className="flex items-center">
                      <span className="mr-2">•</span> User Roles & Permissions
                    </a>
                  </li>
                  <li className="text-blue-600 dark:text-blue-400 hover:underline">
                    <a href="#" className="flex items-center">
                      <span className="mr-2">•</span> First-Time Setup Checklist
                    </a>
                  </li>
                  <li className="text-blue-600 dark:text-blue-400 hover:underline">
                    <a href="#" className="flex items-center">
                      <span className="mr-2">•</span> Dashboard Overview
                    </a>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-500" />
                  USP Compliance
                </CardTitle>
                <CardDescription>Guides specific to USP chapters</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2 text-sm">
                  <li className="text-blue-600 dark:text-blue-400 hover:underline">
                    <a href="#" className="flex items-center">
                      <span className="mr-2">•</span> Understanding USP 795 Requirements
                    </a>
                  </li>
                  <li className="text-blue-600 dark:text-blue-400 hover:underline">
                    <a href="#" className="flex items-center">
                      <span className="mr-2">•</span> Understanding USP 797 Requirements
                    </a>
                  </li>
                  <li className="text-blue-600 dark:text-blue-400 hover:underline">
                    <a href="#" className="flex items-center">
                      <span className="mr-2">•</span> Understanding USP 800 Requirements
                    </a>
                  </li>
                  <li className="text-blue-600 dark:text-blue-400 hover:underline">
                    <a href="#" className="flex items-center">
                      <span className="mr-2">•</span> Setting Up Compliance Tracking
                    </a>
                  </li>
                  <li className="text-blue-600 dark:text-blue-400 hover:underline">
                    <a href="#" className="flex items-center">
                      <span className="mr-2">•</span> Gap Analysis Best Practices
                    </a>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-500" />
                  Reports & Documentation
                </CardTitle>
                <CardDescription>Documentation and reporting guides</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2 text-sm">
                  <li className="text-blue-600 dark:text-blue-400 hover:underline">
                    <a href="#" className="flex items-center">
                      <span className="mr-2">•</span> Creating & Managing Documents
                    </a>
                  </li>
                  <li className="text-blue-600 dark:text-blue-400 hover:underline">
                    <a href="#" className="flex items-center">
                      <span className="mr-2">•</span> Document Control & Versioning
                    </a>
                  </li>
                  <li className="text-blue-600 dark:text-blue-400 hover:underline">
                    <a href="#" className="flex items-center">
                      <span className="mr-2">•</span> Setting Up Custom Reports
                    </a>
                  </li>
                  <li className="text-blue-600 dark:text-blue-400 hover:underline">
                    <a href="#" className="flex items-center">
                      <span className="mr-2">•</span> Exporting & Sharing Reports
                    </a>
                  </li>
                  <li className="text-blue-600 dark:text-blue-400 hover:underline">
                    <a href="#" className="flex items-center">
                      <span className="mr-2">•</span> Audit Trail Management
                    </a>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-500" />
                  Inspections & Audits
                </CardTitle>
                <CardDescription>Preparing for regulatory oversight</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2 text-sm">
                  <li className="text-blue-600 dark:text-blue-400 hover:underline">
                    <a href="#" className="flex items-center">
                      <span className="mr-2">•</span> Preparing for State Board Inspections
                    </a>
                  </li>
                  <li className="text-blue-600 dark:text-blue-400 hover:underline">
                    <a href="#" className="flex items-center">
                      <span className="mr-2">•</span> Conducting Internal Audits
                    </a>
                  </li>
                  <li className="text-blue-600 dark:text-blue-400 hover:underline">
                    <a href="#" className="flex items-center">
                      <span className="mr-2">•</span> Creating Inspection Checklists
                    </a>
                  </li>
                  <li className="text-blue-600 dark:text-blue-400 hover:underline">
                    <a href="#" className="flex items-center">
                      <span className="mr-2">•</span> Managing Inspection Findings
                    </a>
                  </li>
                  <li className="text-blue-600 dark:text-blue-400 hover:underline">
                    <a href="#" className="flex items-center">
                      <span className="mr-2">•</span> Post-Inspection Remediation
                    </a>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-500" />
                  Training Management
                </CardTitle>
                <CardDescription>Staff training and competency tracking</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2 text-sm">
                  <li className="text-blue-600 dark:text-blue-400 hover:underline">
                    <a href="#" className="flex items-center">
                      <span className="mr-2">•</span> Setting Up Training Programs
                    </a>
                  </li>
                  <li className="text-blue-600 dark:text-blue-400 hover:underline">
                    <a href="#" className="flex items-center">
                      <span className="mr-2">•</span> Recording Training Completion
                    </a>
                  </li>
                  <li className="text-blue-600 dark:text-blue-400 hover:underline">
                    <a href="#" className="flex items-center">
                      <span className="mr-2">•</span> Managing Competency Assessments
                    </a>
                  </li>
                  <li className="text-blue-600 dark:text-blue-400 hover:underline">
                    <a href="#" className="flex items-center">
                      <span className="mr-2">•</span> Training Expiration Management
                    </a>
                  </li>
                  <li className="text-blue-600 dark:text-blue-400 hover:underline">
                    <a href="#" className="flex items-center">
                      <span className="mr-2">•</span> Training Reports & Analytics
                    </a>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-500" />
                  Advanced Features
                </CardTitle>
                <CardDescription>Power user and administration guides</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2 text-sm">
                  <li className="text-blue-600 dark:text-blue-400 hover:underline">
                    <a href="#" className="flex items-center">
                      <span className="mr-2">•</span> Multi-Pharmacy Management
                    </a>
                  </li>
                  <li className="text-blue-600 dark:text-blue-400 hover:underline">
                    <a href="#" className="flex items-center">
                      <span className="mr-2">•</span> Data Import & Export Tools
                    </a>
                  </li>
                  <li className="text-blue-600 dark:text-blue-400 hover:underline">
                    <a href="#" className="flex items-center">
                      <span className="mr-2">•</span> Custom Task & Workflow Creation
                    </a>
                  </li>
                  <li className="text-blue-600 dark:text-blue-400 hover:underline">
                    <a href="#" className="flex items-center">
                      <span className="mr-2">•</span> System Integration Options
                    </a>
                  </li>
                  <li className="text-blue-600 dark:text-blue-400 hover:underline">
                    <a href="#" className="flex items-center">
                      <span className="mr-2">•</span> Custom Fields & Templates
                    </a>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* FAQs */}
        <TabsContent value="faqs">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Common questions and answers about using the system</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>What is USP 795 and why is it important?</AccordionTrigger>
                  <AccordionContent>
                    <p>
                      USP Chapter 795 provides standards for non-sterile compounding in pharmacies. These standards are designed to ensure the quality, safety, and consistency of non-sterile compounded preparations. It's important because it helps minimize harm to patients that could result from 1) incorrect ingredients, 2) microbial contamination, 3) excessive bacterial endotoxins, 4) variability in intended strength, 5) physical and chemical incompatibilities, 6) chemical degradation, and 7) inadequate packaging and labeling.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>What is USP 797 and why is it important?</AccordionTrigger>
                  <AccordionContent>
                    <p>
                      USP Chapter 797 sets standards for compounded sterile preparations (CSPs) in all settings. It was created to prevent harm and fatality to patients that could result from microbial contamination, excessive bacterial endotoxins, variability in the intended strength of correct ingredients, unintended chemical and physical contaminants, and ingredients of inappropriate quality. Compliance with USP 797 is often required by state boards of pharmacy and other regulatory agencies.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>What is USP 800 and why is it important?</AccordionTrigger>
                  <AccordionContent>
                    <p>
                      USP Chapter 800 provides standards for handling hazardous drugs to minimize exposure to healthcare personnel, patients, and the environment. It addresses all healthcare settings where hazardous drugs are stored, prepared, and administered. The chapter focuses on processes, requirements, and responsibilities for maintaining safety when handling hazardous drugs, including standards for receiving, storing, compounding, dispensing, and administrating these substances.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>How can I track compliance status for different USP chapters?</AccordionTrigger>
                  <AccordionContent>
                    <p>
                      Our system provides a comprehensive compliance tracking dashboard that shows your pharmacy's compliance status for each USP chapter. You can:
                    </p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li>View overall compliance percentage for each chapter</li>
                      <li>Drill down to see specific requirements and their status</li>
                      <li>Track progress over time with historical compliance data</li>
                      <li>Identify high-priority gaps that need attention</li>
                      <li>Generate compliance reports for regulatory inspections</li>
                    </ul>
                    <p className="mt-2">
                      Navigate to the Compliance section from the main menu to access these features.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger>How do I prepare for a State Board of Pharmacy inspection?</AccordionTrigger>
                  <AccordionContent>
                    <p>
                      Our system provides several tools to help you prepare for regulatory inspections:
                    </p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li>Use the Inspection Preparation module to create a customized checklist</li>
                      <li>Run a Gap Analysis to identify areas needing attention before inspection</li>
                      <li>Generate compliance reports showing your current status</li>
                      <li>Organize and prepare required documentation for easy access</li>
                      <li>Conduct mock inspections using our internal audit templates</li>
                    </ul>
                    <p className="mt-2">
                      Go to the Inspections section and select "Schedule Inspection" to begin preparation.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-6">
                  <AccordionTrigger>Can I customize task reminders and deadlines?</AccordionTrigger>
                  <AccordionContent>
                    <p>
                      Yes, the system allows full customization of tasks, reminders, and deadlines:
                    </p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li>Create custom recurring tasks for routine compliance activities</li>
                      <li>Set up email notifications and in-app reminders</li>
                      <li>Assign tasks to specific team members</li>
                      <li>Prioritize tasks based on criticality and due dates</li>
                      <li>Customize notification timing (e.g., 7 days before, 3 days before, day of)</li>
                    </ul>
                    <p className="mt-2">
                      You can manage these settings in the Checklists section and under Settings → Notifications.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-7">
                  <AccordionTrigger>How do I add and manage users in the system?</AccordionTrigger>
                  <AccordionContent>
                    <p>
                      User management is available to administrators in the Settings section:
                    </p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li>Go to Settings → Users & Permissions</li>
                      <li>Click "Add User" to create a new user account</li>
                      <li>Assign appropriate roles (Admin, Manager, Staff, etc.)</li>
                      <li>Set permissions for each user based on their responsibilities</li>
                      <li>Manage password policies and account security settings</li>
                    </ul>
                    <p className="mt-2">
                      You can also bulk import users via CSV file if you need to add multiple users at once.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-8">
                  <AccordionTrigger>Is my data secure in the system?</AccordionTrigger>
                  <AccordionContent>
                    <p>
                      Yes, we take data security very seriously:
                    </p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li>All data is encrypted both in transit and at rest</li>
                      <li>We implement role-based access controls to restrict data access</li>
                      <li>Regular security audits and penetration testing</li>
                      <li>Compliance with healthcare data security standards</li>
                      <li>Comprehensive audit logs track all system access and changes</li>
                    </ul>
                    <p className="mt-2">
                      For more details, please review our Security Policy in the Help section.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Video Tutorials */}
        <TabsContent value="videos">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-0">
                <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center mb-3">
                  <Video className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                </div>
                <CardTitle className="text-base">Getting Started Guide</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  A complete walkthrough of system setup and basic navigation.
                </p>
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <span className="mr-3">8:24</span>
                  <span>Updated: May 1, 2024</span>
                </div>
                <Button className="mt-3 w-full" variant="outline">
                  Watch Video
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-0">
                <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center mb-3">
                  <Video className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                </div>
                <CardTitle className="text-base">USP 797 Compliance Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  Learn how to track and manage USP 797 compliance requirements.
                </p>
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <span className="mr-3">12:05</span>
                  <span>Updated: Apr 15, 2024</span>
                </div>
                <Button className="mt-3 w-full" variant="outline">
                  Watch Video
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-0">
                <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center mb-3">
                  <Video className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                </div>
                <CardTitle className="text-base">Document Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  How to upload, organize, and manage SOPs and policies.
                </p>
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <span className="mr-3">9:37</span>
                  <span>Updated: Mar 22, 2024</span>
                </div>
                <Button className="mt-3 w-full" variant="outline">
                  Watch Video
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-0">
                <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center mb-3">
                  <Video className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                </div>
                <CardTitle className="text-base">Inspection Preparation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  Steps to prepare for and successfully pass regulatory inspections.
                </p>
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <span className="mr-3">14:52</span>
                  <span>Updated: Apr 5, 2024</span>
                </div>
                <Button className="mt-3 w-full" variant="outline">
                  Watch Video
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-0">
                <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center mb-3">
                  <Video className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                </div>
                <CardTitle className="text-base">Gap Analysis Tutorial</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  How to conduct and interpret gap analyses for USP compliance.
                </p>
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <span className="mr-3">10:18</span>
                  <span>Updated: May 8, 2024</span>
                </div>
                <Button className="mt-3 w-full" variant="outline">
                  Watch Video
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-0">
                <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center mb-3">
                  <Video className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                </div>
                <CardTitle className="text-base">Reports & Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  Generate and customize reports for compliance tracking and audits.
                </p>
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <span className="mr-3">7:45</span>
                  <span>Updated: Apr 27, 2024</span>
                </div>
                <Button className="mt-3 w-full" variant="outline">
                  Watch Video
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Contact Support */}
        <TabsContent value="contact">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center mb-3">
                  <MessageSquare className="h-6 w-6 text-primary-600 dark:text-primary-500" />
                </div>
                <CardTitle>Live Chat Support</CardTitle>
                <CardDescription>Chat with our support team</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Available Monday-Friday, 8am-6pm ET for immediate assistance with your questions.
                </p>
                <Button className="w-full">
                  Start Chat
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center mb-3">
                  <Mail className="h-6 w-6 text-primary-600 dark:text-primary-500" />
                </div>
                <CardTitle>Email Support</CardTitle>
                <CardDescription>Send us an email</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Email us at support@pharmacysystem.com for assistance. We typically respond within 24 hours.
                </p>
                <Button className="w-full" variant="outline">
                  Send Email
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center mb-3">
                  <Phone className="h-6 w-6 text-primary-600 dark:text-primary-500" />
                </div>
                <CardTitle>Phone Support</CardTitle>
                <CardDescription>Call our support team</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Call us at (800) 555-1234 for urgent issues. Available Monday-Friday, 8am-6pm ET.
                </p>
                <Button className="w-full" variant="outline">
                  Call Support
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Send a Support Request</CardTitle>
              <CardDescription>We'll get back to you as soon as possible</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">Name</label>
                    <Input id="name" placeholder="Your name" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">Email</label>
                    <Input id="email" type="email" placeholder="Your email" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                  <Input id="subject" placeholder="Support request subject" />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">Message</label>
                  <textarea 
                    id="message" 
                    rows={5}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Describe your issue or question in detail..."
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="category" className="text-sm font-medium">Support Category</label>
                  <select 
                    id="category"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select a category</option>
                    <option value="technical">Technical Issue</option>
                    <option value="feature">Feature Question</option>
                    <option value="account">Account Management</option>
                    <option value="billing">Billing & Subscription</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="priority" className="text-sm font-medium">Priority</label>
                  <select 
                    id="priority"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select priority</option>
                    <option value="low">Low - General question</option>
                    <option value="medium">Medium - Issue affecting workflow</option>
                    <option value="high">High - Critical function unavailable</option>
                  </select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="attach-screenshots"
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="attach-screenshots" className="text-sm text-gray-700 dark:text-gray-300">
                    I'd like to attach screenshots or files to help explain my issue
                  </label>
                </div>
                
                <Button className="w-full mt-2">Submit Support Request</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Resources & Additional Links */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Book className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-500" />
            Additional Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">USP Resources</h3>
              <ul className="space-y-2 text-sm">
                <li className="text-blue-600 dark:text-blue-400 hover:underline">
                  <a href="https://www.usp.org" target="_blank" rel="noopener noreferrer" className="flex items-center">
                    <ExternalLink className="h-3 w-3 mr-1" /> Official USP Website
                  </a>
                </li>
                <li className="text-blue-600 dark:text-blue-400 hover:underline">
                  <a href="#" className="flex items-center">
                    <ExternalLink className="h-3 w-3 mr-1" /> USP 795 Guidelines (2023)
                  </a>
                </li>
                <li className="text-blue-600 dark:text-blue-400 hover:underline">
                  <a href="#" className="flex items-center">
                    <ExternalLink className="h-3 w-3 mr-1" /> USP 797 Guidelines (2023)
                  </a>
                </li>
                <li className="text-blue-600 dark:text-blue-400 hover:underline">
                  <a href="#" className="flex items-center">
                    <ExternalLink className="h-3 w-3 mr-1" /> USP 800 Guidelines (2023)
                  </a>
                </li>
                <li className="text-blue-600 dark:text-blue-400 hover:underline">
                  <a href="#" className="flex items-center">
                    <ExternalLink className="h-3 w-3 mr-1" /> USP Compounding FAQ
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Education & Training</h3>
              <ul className="space-y-2 text-sm">
                <li className="text-blue-600 dark:text-blue-400 hover:underline">
                  <a href="#" className="flex items-center">
                    <ExternalLink className="h-3 w-3 mr-1" /> Certification Programs
                  </a>
                </li>
                <li className="text-blue-600 dark:text-blue-400 hover:underline">
                  <a href="#" className="flex items-center">
                    <ExternalLink className="h-3 w-3 mr-1" /> Best Practices Webinars
                  </a>
                </li>
                <li className="text-blue-600 dark:text-blue-400 hover:underline">
                  <a href="#" className="flex items-center">
                    <ExternalLink className="h-3 w-3 mr-1" /> Compliance Workshops
                  </a>
                </li>
                <li className="text-blue-600 dark:text-blue-400 hover:underline">
                  <a href="#" className="flex items-center">
                    <ExternalLink className="h-3 w-3 mr-1" /> Annual Conference
                  </a>
                </li>
                <li className="text-blue-600 dark:text-blue-400 hover:underline">
                  <a href="#" className="flex items-center">
                    <ExternalLink className="h-3 w-3 mr-1" /> Continuing Education
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Community</h3>
              <ul className="space-y-2 text-sm">
                <li className="text-blue-600 dark:text-blue-400 hover:underline">
                  <a href="#" className="flex items-center">
                    <Users className="h-3 w-3 mr-1" /> User Forum
                  </a>
                </li>
                <li className="text-blue-600 dark:text-blue-400 hover:underline">
                  <a href="#" className="flex items-center">
                    <ExternalLink className="h-3 w-3 mr-1" /> Feature Requests
                  </a>
                </li>
                <li className="text-blue-600 dark:text-blue-400 hover:underline">
                  <a href="#" className="flex items-center">
                    <ExternalLink className="h-3 w-3 mr-1" /> Release Notes
                  </a>
                </li>
                <li className="text-blue-600 dark:text-blue-400 hover:underline">
                  <a href="#" className="flex items-center">
                    <ExternalLink className="h-3 w-3 mr-1" /> System Status
                  </a>
                </li>
                <li className="text-blue-600 dark:text-blue-400 hover:underline">
                  <a href="#" className="flex items-center">
                    <ExternalLink className="h-3 w-3 mr-1" /> Blog & Updates
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}