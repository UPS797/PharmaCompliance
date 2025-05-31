import React from 'react';
import { useLocation, Link } from 'wouter';
import { cn } from '@/lib/utils';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Book,
  Calendar,
  CheckSquare,
  ClipboardList,
  FileText,
  HelpCircle,
  Home,
  LineChart,
  List,
  ListChecks,
  Package,
  Settings,
  Tablet,
  Thermometer,
  UploadCloud,
  User,
  Dna,
  LayoutDashboard,
  Puzzle
} from 'lucide-react';

type SidebarItem = {
  title: string;
  href: string;
  icon: React.ReactNode;
  variant: 'default' | 'ghost';
};

export function SidebarNavigation() {
  const [location] = useLocation();

  const sidebarItems: SidebarItem[] = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: <Home className="h-5 w-5" />,
      variant: location === '/dashboard' ? 'default' : 'ghost',
    },
    {
      title: 'Pharmacist Dashboard',
      href: '/pharmacist-dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
      variant: location === '/pharmacist-dashboard' ? 'default' : 'ghost',
    },
    {
      title: 'Compliance',
      href: '/compliance',
      icon: <CheckSquare className="h-5 w-5" />,
      variant: location === '/compliance' ? 'default' : 'ghost',
    },
    {
      title: 'Tasks',
      href: '/tasks',
      icon: <Calendar className="h-5 w-5" />,
      variant: location === '/tasks' ? 'default' : 'ghost',
    },
    {
      title: 'Documents',
      href: '/documents',
      icon: <FileText className="h-5 w-5" />,
      variant: location === '/documents' ? 'default' : 'ghost',
    },
    {
      title: 'Risk Assessment',
      href: '/risk-assessment',
      icon: <AlertTriangle className="h-5 w-5" />,
      variant: location === '/risk-assessment' ? 'default' : 'ghost',
    },
    {
      title: 'Gap Analysis',
      href: '/gap-analysis',
      icon: <BarChart3 className="h-5 w-5" />,
      variant: location === '/gap-analysis' ? 'default' : 'ghost',
    },
    {
      title: 'Training',
      href: '/training',
      icon: <Book className="h-5 w-5" />,
      variant: location === '/training' ? 'default' : 'ghost',
    },
    {
      title: 'Training Management',
      href: '/training-management',
      icon: <ClipboardList className="h-5 w-5" />,
      variant: location === '/training-management' ? 'default' : 'ghost',
    },
    {
      title: 'Inspections',
      href: '/inspections',
      icon: <ListChecks className="h-5 w-5" />,
      variant: location === '/inspections' ? 'default' : 'ghost',
    },
    {
      title: 'Monitoring',
      href: '/monitoring',
      icon: <Thermometer className="h-5 w-5" />,
      variant: location === '/monitoring' ? 'default' : 'ghost',
    },
    {
      title: 'SOP Templates',
      href: '/sop-templates',
      icon: <Tablet className="h-5 w-5" />,
      variant: location === '/sop-templates' ? 'default' : 'ghost',
    },
    {
      title: 'Checklists',
      href: '/checklists',
      icon: <List className="h-5 w-5" />,
      variant: location === '/checklists' ? 'default' : 'ghost',
    },
    {
      title: 'Reports',
      href: '/reports',
      icon: <LineChart className="h-5 w-5" />,
      variant: location === '/reports' ? 'default' : 'ghost',
    },
    {
      title: 'Audit',
      href: '/audit',
      icon: <Activity className="h-5 w-5" />,
      variant: location === '/audit' ? 'default' : 'ghost',
    },
    {
      title: 'User Guide',
      href: '/user-guide',
      icon: <HelpCircle className="h-5 w-5" />,
      variant: location === '/user-guide' ? 'default' : 'ghost',
    },
    {
      title: 'Profile',
      href: '/profile',
      icon: <User className="h-5 w-5" />,
      variant: location === '/profile' ? 'default' : 'ghost',
    },
    {
      title: 'Settings',
      href: '/settings',
      icon: <Settings className="h-5 w-5" />,
      variant: location === '/settings' ? 'default' : 'ghost',
    },
    {
      title: 'Mystery Editor',
      href: '/level-editor',
      icon: <Puzzle className="h-5 w-5" />,
      variant: location === '/level-editor' ? 'default' : 'ghost',
    },
  ];

  return (
    <div className="flex flex-col gap-2">
      {sidebarItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary',
            item.variant === 'default'
              ? 'bg-muted font-medium text-primary'
              : 'text-muted-foreground'
          )}
        >
          {item.icon}
          {item.title}
        </Link>
      ))}
    </div>
  );
}