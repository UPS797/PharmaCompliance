import { useAuth } from "@/context/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import MainLayout from "@/layouts/main-layout";
import { useLocation } from "wouter";

export default function Profile() {
  const { userInfo } = useAuth();
  const [, navigate] = useLocation();

  if (!userInfo) {
    return <div>Loading...</div>;
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">User Profile</h1>
          <Button variant="outline" onClick={() => navigate("/settings")}>
            Edit Profile
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Your personal details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="w-24 h-24 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400 text-4xl font-medium mb-4">
                    {userInfo.name.charAt(0)}
                  </div>
                  <h2 className="text-xl font-semibold">{userInfo.name}</h2>
                  <p className="text-gray-500 dark:text-gray-400">{userInfo.role}</p>
                </div>

                <Separator className="my-4" />

                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
                    <p className="text-gray-800 dark:text-gray-200">{userInfo.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Role</p>
                    <p className="text-gray-800 dark:text-gray-200">{userInfo.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Access Information</CardTitle>
                <CardDescription>Your system access details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-800 dark:text-white mb-2">Your Role Permissions</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                      {userInfo.role === 'admin' ? 
                        'As an administrator, you have full access to all system features including user management, pharmacy settings, and all compliance data.' : 
                        'As a pharmacist, you have access to compliance data, task management, and environmental monitoring for your assigned pharmacy.'}
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium text-gray-800 dark:text-white mb-2">Last Login</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium text-gray-800 dark:text-white mb-2">Security Recommendations</h3>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 text-sm space-y-2">
                      <li>Change your password regularly</li>
                      <li>Don't share your login credentials</li>
                      <li>Log out when you're not using the system</li>
                      <li>Report any suspicious activity to your system administrator</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}