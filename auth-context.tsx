import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useLocation } from 'wouter';

interface UserInfo {
  email: string;
  name: string;
  role: string;
  isLoggedIn: boolean;
}

interface AuthContextType {
  userInfo: UserInfo | null;
  login: (email: string, password: string) => Promise<{ success: boolean; role: string }>;
  logout: () => void;
  isAdmin: () => boolean;
}

const initialUserInfo: UserInfo = {
  email: '',
  name: '',
  role: '',
  isLoggedIn: false
};

const AuthContext = createContext<AuthContextType>({
  userInfo: initialUserInfo,
  login: async () => ({ success: false, role: '' }),
  logout: () => {},
  isAdmin: () => false
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [, navigate] = useLocation();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      try {
        const parsedUserInfo = JSON.parse(storedUserInfo);
        setUserInfo(parsedUserInfo);
      } catch (error) {
        console.error('Failed to parse user info:', error);
        localStorage.removeItem('userInfo');
      }
    } else {
      // Auto login for development purposes
      const autoUserInfo = {
        email: 'admin@pharmcompliance.com',
        name: 'Admin User',
        role: 'admin',
        isLoggedIn: true
      };
      setUserInfo(autoUserInfo);
      localStorage.setItem('userInfo', JSON.stringify(autoUserInfo));
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; role: string }> => {
    try {
      // In a real application, this would validate with an API
      // For demo, we'll use hardcoded values
      const isValidCredentials = password === 'password123';
      
      if (!isValidCredentials) {
        return { success: false, role: '' };
      }
      
      const role = email.includes('admin') ? 'admin' : 'pharmacist';
      const name = email.split('@')[0];
      
      const user = {
        email,
        name,
        role,
        isLoggedIn: true
      };
      
      setUserInfo(user);
      localStorage.setItem('userInfo', JSON.stringify(user));
      
      return { success: true, role };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, role: '' };
    }
  };

  const logout = () => {
    setUserInfo(null);
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  const isAdmin = () => {
    return userInfo?.role === 'admin';
  };

  return (
    <AuthContext.Provider value={{ userInfo, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};