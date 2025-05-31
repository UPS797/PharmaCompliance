import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Sun, Moon, Search, Menu, Bell, Clock, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useLocation } from "wouter";

interface HeaderNavigationProps {
  toggleSidebar: () => void;
  toggleMobileMenu: () => void;
}

export default function HeaderNavigation({ 
  toggleSidebar, 
  toggleMobileMenu 
}: HeaderNavigationProps) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [pharmacy, setPharmacy] = useState("Central Pharmacy");
  const { userInfo, logout } = useAuth();
  const [, navigate] = useLocation();
  
  useEffect(() => {
    // Check if theme is stored in localStorage
    const storedTheme = localStorage.getItem("theme") as "light" | "dark";
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, []);
  
  const toggleTheme = () => {
    // Check current theme based on class on document element
    const root = document.documentElement;
    const isDark = root.classList.contains("dark");
    const newTheme = isDark ? "light" : "dark";
    
    // Update state
    setTheme(newTheme);
    
    // Store in localStorage
    localStorage.setItem("theme", newTheme);
    
    // Update class on document element
    if (newTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm z-10">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleSidebar}
            className="hidden md:flex text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <button 
            onClick={toggleMobileMenu}
            className="md:hidden text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center border rounded-md px-3 py-2 bg-gray-50 dark:bg-gray-700 w-64">
            <Search className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-2" />
            <Input 
              type="text" 
              placeholder="Search compliance items..." 
              className="bg-transparent border-none focus:outline-none text-sm w-full h-5 p-0"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-primary-500 rounded-full"></span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-[300px] overflow-y-auto">
                  <DropdownMenuItem className="cursor-pointer py-3">
                    <div className="flex items-start">
                      <div className="bg-warning-100 dark:bg-warning-900/30 p-2 rounded-full mr-3">
                        <Clock className="h-4 w-4 text-warning-600 dark:text-warning-500" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Task Deadline Approaching</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Monthly certification of compounding area due in 2 days</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">15 minutes ago</p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem className="cursor-pointer py-3">
                    <div className="flex items-start">
                      <div className="bg-danger-100 dark:bg-danger-900/30 p-2 rounded-full mr-3">
                        <Bell className="h-4 w-4 text-danger-600 dark:text-danger-500" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Environmental Alert</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Pressure differential out of range in ISO 7 room</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">1 hour ago</p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem className="cursor-pointer py-3">
                    <div className="flex items-start">
                      <div className="bg-success-100 dark:bg-success-900/30 p-2 rounded-full mr-3">
                        <CheckCircle2 className="h-4 w-4 text-success-600 dark:text-success-500" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Training Completed</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">John Smith completed USP 800 training module</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Yesterday</p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex justify-center cursor-pointer">
                  <Button variant="ghost" size="sm" className="w-full">View All Notifications</Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <button onClick={toggleTheme} className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          
          <div className="w-0.5 h-6 bg-gray-200 dark:bg-gray-700"></div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 focus:outline-none">
                <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400 font-medium">
                  {userInfo ? userInfo.name.charAt(0) : "U"}
                </div>
                <span className="hidden md:block text-sm">{userInfo ? userInfo.name : "User"}</span>
                <span className="material-icons text-gray-400 text-sm">arrow_drop_down</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/profile")}>
                <span className="material-icons mr-2 text-sm">person</span>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/settings")}>
                <span className="material-icons mr-2 text-sm">settings</span>
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <span className="material-icons mr-2 text-sm">logout</span>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
