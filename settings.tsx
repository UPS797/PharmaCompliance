import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  User, 
  Lock, 
  Bell, 
  Globe, 
  Shield, 
  Palette, 
  Save,
  Building
} from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [selectedPharmacy, setSelectedPharmacy] = useState("Central Pharmacy");
  
  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your settings have been updated successfully.",
      variant: "default",
    });
  };
  
  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your application preferences and configurations</p>
      </div>
      
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid grid-cols-6 w-full max-w-3xl">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="pharmacy">Pharmacy</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Manage general application settings and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="language" className="text-base">Language</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Select your preferred language for the application</p>
                  </div>
                  <Select defaultValue="en">
                    <SelectTrigger id="language" className="w-[180px]">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="timezone" className="text-base">Timezone</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Set your local timezone for accurate scheduling</p>
                  </div>
                  <Select defaultValue="america_new_york">
                    <SelectTrigger id="timezone" className="w-[180px]">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="america_new_york">America/New York</SelectItem>
                      <SelectItem value="america_chicago">America/Chicago</SelectItem>
                      <SelectItem value="america_denver">America/Denver</SelectItem>
                      <SelectItem value="america_los_angeles">America/Los Angeles</SelectItem>
                      <SelectItem value="europe_london">Europe/London</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="date-format" className="text-base">Date Format</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Choose how dates are displayed throughout the application</p>
                  </div>
                  <Select defaultValue="mdy">
                    <SelectTrigger id="date-format" className="w-[180px]">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="ymd">YYYY/MM/DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-save" className="text-base">Auto-save</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Automatically save form data as you type</p>
                  </div>
                  <Switch id="auto-save" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="analytics" className="text-base">Usage Analytics</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Allow anonymous usage data collection to improve the application</p>
                  </div>
                  <Switch id="analytics" defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Pharmacy Settings */}
        <TabsContent value="pharmacy">
          <Card>
            <CardHeader>
              <CardTitle>Pharmacy Settings</CardTitle>
              <CardDescription>Manage your pharmacy information and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Select value={selectedPharmacy} onValueChange={setSelectedPharmacy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select pharmacy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Central Pharmacy">Central Pharmacy</SelectItem>
                    <SelectItem value="Oncology Pharmacy">Oncology Pharmacy</SelectItem>
                    <SelectItem value="Satellite Pharmacy">Satellite Pharmacy</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="grid gap-4 pt-4">
                  <div className="grid gap-2">
                    <Label htmlFor="pharmacy-name">Pharmacy Name</Label>
                    <Input id="pharmacy-name" value={selectedPharmacy} />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="pharmacy-license">License Number</Label>
                    <Input id="pharmacy-license" placeholder="Enter pharmacy license number" />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="pharmacy-address">Address</Label>
                    <Input id="pharmacy-address" placeholder="Enter pharmacy address" />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="pharmacy-phone">Phone Number</Label>
                    <Input id="pharmacy-phone" placeholder="Enter pharmacy phone number" />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="pharmacy-email">Email</Label>
                    <Input id="pharmacy-email" type="email" placeholder="Enter pharmacy email" />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="pharmacy-pic">Pharmacist-in-Charge</Label>
                    <Input id="pharmacy-pic" placeholder="Enter name of PIC" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="usp795" className="text-base">USP 795 Compliance</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Enable USP 795 compliance features</p>
                  </div>
                  <Switch id="usp795" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="usp797" className="text-base">USP 797 Compliance</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Enable USP 797 compliance features</p>
                  </div>
                  <Switch id="usp797" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="usp800" className="text-base">USP 800 Compliance</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Enable USP 800 compliance features</p>
                  </div>
                  <Switch id="usp800" defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Account Settings */}
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account information and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <User className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Dr. Maria Chen</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Pharmacy Director</p>
                </div>
              </div>
              
              <div className="grid gap-4 pt-4">
                <div className="grid gap-2">
                  <Label htmlFor="full-name">Full Name</Label>
                  <Input id="full-name" value="Dr. Maria Chen" />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value="maria.chen@hospital.org" />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="role">Role</Label>
                  <Select defaultValue="director">
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="director">Pharmacy Director</SelectItem>
                      <SelectItem value="manager">Pharmacy Manager</SelectItem>
                      <SelectItem value="pharmacist">Pharmacist</SelectItem>
                      <SelectItem value="technician">Pharmacy Technician</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="Enter phone number" />
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <Button variant="outline" className="w-full">Change Password</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Notifications Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Manage how you receive alerts and notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Email Notifications</h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-compliance" className="text-base">Compliance Alerts</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Receive emails about compliance issues and updates</p>
                  </div>
                  <Switch id="email-compliance" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-tasks" className="text-base">Task Reminders</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Receive reminders about upcoming and overdue tasks</p>
                  </div>
                  <Switch id="email-tasks" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-documents" className="text-base">Document Updates</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Notifications when documents are updated or added</p>
                  </div>
                  <Switch id="email-documents" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-inspections" className="text-base">Inspection Alerts</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Receive notifications about upcoming inspections</p>
                  </div>
                  <Switch id="email-inspections" defaultChecked />
                </div>
              </div>
              
              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-medium">In-App Notifications</h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="app-updates" className="text-base">System Updates</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Receive notifications about system updates</p>
                  </div>
                  <Switch id="app-updates" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="app-reminders" className="text-base">Daily Reminders</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Receive daily task reminders</p>
                  </div>
                  <Switch id="app-reminders" defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Appearance Settings */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>Customize the look and feel of the application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="theme-mode" className="text-base">Theme Mode</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Switch between light and dark mode</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant={theme === "light" ? "default" : "outline"} 
                      className="px-3"
                      onClick={() => setTheme("light")}
                    >
                      Light
                    </Button>
                    <Button 
                      variant={theme === "dark" ? "default" : "outline"} 
                      className="px-3"
                      onClick={() => setTheme("dark")}
                    >
                      Dark
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="font-size" className="text-base">Font Size</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Adjust the text size throughout the application</p>
                  </div>
                  <Select defaultValue="medium">
                    <SelectTrigger id="font-size" className="w-[120px]">
                      <SelectValue placeholder="Font Size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="compact-view" className="text-base">Compact View</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Use more compact layout with less spacing</p>
                  </div>
                  <Switch id="compact-view" />
                </div>
              </div>
              
              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-medium">Dashboard Settings</h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="show-welcome" className="text-base">Welcome Message</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Show welcome message on dashboard</p>
                  </div>
                  <Switch id="show-welcome" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="show-recent" className="text-base">Recent Activities</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Show recent activities section</p>
                  </div>
                  <Switch id="show-recent" defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Security Settings */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage security preferences and access controls</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="2fa" className="text-base">Two-Factor Authentication</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Add an extra layer of security to your account</p>
                  </div>
                  <Switch id="2fa" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="session-timeout" className="text-base">Session Timeout</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Automatically log out after period of inactivity</p>
                  </div>
                  <Select defaultValue="30">
                    <SelectTrigger id="session-timeout" className="w-[140px]">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="password-change" className="text-base">Password Change</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Require password change every 90 days</p>
                  </div>
                  <Switch id="password-change" defaultChecked />
                </div>
              </div>
              
              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-medium">Login History</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Last login: May 19, 2024 at 3:45 PM from 192.168.1.105
                </p>
                
                <Button variant="outline" className="w-full">View Login History</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end mt-6 mb-10">
        <Button variant="outline" className="mr-2">Cancel</Button>
        <Button onClick={handleSaveSettings}>
          <Save className="mr-2 h-4 w-4" />
          Save Settings
        </Button>
      </div>
    </>
  );
}