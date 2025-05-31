import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Menu, Bell } from "lucide-react";
import { useAuth } from "@/context/auth-context";

interface HeaderNavigationBasicProps {
  toggleMobileMenu: () => void;
}

export default function HeaderNavigationBasic({ 
  toggleMobileMenu 
}: HeaderNavigationBasicProps) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const { userInfo } = useAuth();
  
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
            onClick={toggleMobileMenu}
            className="md:hidden text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-medium">Pharmacy Compliance System</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="relative p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary-500 rounded-full"></span>
          </button>
          
          <button onClick={toggleTheme} className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          
          <div className="w-0.5 h-6 bg-gray-200 dark:bg-gray-700"></div>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400 font-medium">
              {userInfo ? userInfo.name.charAt(0) : "U"}
            </div>
            <span className="hidden md:block text-sm">{userInfo ? userInfo.name : "User"}</span>
          </div>
        </div>
      </div>
    </header>
  );
}