import React from "react";
import { Switch, Route, Redirect, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import MainLayout from "@/layouts/main-layout";
import Dashboard from "@/pages/dashboard";
import Compliance from "@/pages/compliance";
import Checklists from "@/pages/checklists";
import Documents from "@/pages/documents";
import GapAnalysis from "@/pages/gap-analysis";
import Training from "@/pages/training";
import Inspections from "@/pages/inspections";
import Reports from "@/pages/reports";
import Audit from "@/pages/audit";
import Settings from "@/pages/settings";
import Help from "@/pages/help";
import Login from "@/pages/login";
import { AuthProvider } from "./context/auth-context";
import { ThemeProvider } from "./hooks/use-theme";
import { useEffect } from "react";
import Tasks from "@/pages/tasks";
import Monitoring from "@/pages/monitoring";
import TrainingManagement from "@/pages/training-management";
import Profile from "@/pages/profile";
import RiskAssessment from "@/pages/risk-assessment";
import SOPTemplates from "@/pages/sop-templates";
import UserGuide from "@/pages/user-guide";
import PharmacistDashboard from "@/pages/pharmacist-dashboard";
import LevelEditor from "@/pages/level-editor";

// Protected route component
function ProtectedRoute({ component: Component, ...rest }: { component: React.ComponentType<any>, path?: string }) {
  const isAuthenticated = localStorage.getItem('userInfo') !== null;
  
  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }
  
  return <Component {...rest} />;
}

function Router() {
  const [location] = useLocation();
  
  useEffect(() => {
    // Redirect to login if not authenticated
    const isAuthenticated = localStorage.getItem('userInfo') !== null;
    const isLoginPage = location === '/login';
    
    if (!isAuthenticated && !isLoginPage && location !== '/') {
      window.location.href = '/login';
    }
    
    // Redirect to dashboard if authenticated and on login page
    if (isAuthenticated && isLoginPage) {
      window.location.href = '/dashboard';
    }
  }, [location]);
  
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/">
        {() => <Redirect to="/dashboard" />}
      </Route>
      <Route path="/dashboard">
        {() => <ProtectedRoute component={Dashboard} />}
      </Route>
      <Route path="/pharmacist-dashboard">
        {() => <ProtectedRoute component={PharmacistDashboard} />}
      </Route>
      <Route path="/compliance">
        {() => <ProtectedRoute component={Compliance} />}
      </Route>
      <Route path="/checklists">
        {() => <ProtectedRoute component={Checklists} />}
      </Route>
      <Route path="/documents">
        {() => <ProtectedRoute component={Documents} />}
      </Route>
      <Route path="/gap-analysis">
        {() => <ProtectedRoute component={GapAnalysis} />}
      </Route>
      <Route path="/training">
        {() => <ProtectedRoute component={Training} />}
      </Route>
      <Route path="/inspections">
        {() => <ProtectedRoute component={Inspections} />}
      </Route>
      <Route path="/reports">
        {() => <ProtectedRoute component={Reports} />}
      </Route>
      <Route path="/audit">
        {() => <ProtectedRoute component={Audit} />}
      </Route>
      <Route path="/settings">
        {() => <ProtectedRoute component={Settings} />}
      </Route>
      <Route path="/help">
        {() => <ProtectedRoute component={Help} />}
      </Route>
      <Route path="/tasks">
        {() => <ProtectedRoute component={Tasks} />}
      </Route>
      <Route path="/tasks/create">
        {() => {
          const CreateTask = React.lazy(() => import("./pages/create-task"));
          return <ProtectedRoute component={CreateTask} />;
        }}
      </Route>
      <Route path="/monitoring">
        {() => <ProtectedRoute component={Monitoring} />}
      </Route>
      <Route path="/training-management">
        {() => <ProtectedRoute component={TrainingManagement} />}
      </Route>
      <Route path="/profile">
        {() => <ProtectedRoute component={Profile} />}
      </Route>
      <Route path="/user-management">
        {() => {
          const UserManagementPage = React.lazy(() => import("./pages/user-management"));
          return <ProtectedRoute component={UserManagementPage} />;
        }}
      </Route>
      <Route path="/risk-assessment">
        {() => <ProtectedRoute component={RiskAssessment} />}
      </Route>
      <Route path="/sop-templates">
        {() => <ProtectedRoute component={SOPTemplates} />}
      </Route>
      <Route path="/user-guide">
        {() => <ProtectedRoute component={UserGuide} />}
      </Route>
      <Route path="/level-editor">
        {() => <ProtectedRoute component={LevelEditor} />}
      </Route>
      <Route>
        {() => <NotFound />}
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <AuthProvider>
            <Toaster />
            <Switch>
              <Route path="/login" component={Login} />
              <Route>
                {() => (
                  <MainLayout>
                    <Router />
                  </MainLayout>
                )}
              </Route>
            </Switch>
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
