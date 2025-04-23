
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define user types
export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  isSolarProvider: boolean;
  createdAt: string;
}

// Define the auth context interface
interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  register: (email: string, password: string, name: string, phone: string, isSolarProvider: boolean) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Create context with a default value
const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
  register: async () => {},
  login: async () => {},
  logout: async () => {}
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Mocked users for demonstration (this would be replaced with actual API calls)
const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'user@example.com',
    name: 'Demo User',
    phone: '9876543210',
    isSolarProvider: false,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    email: 'provider@example.com',
    name: 'Demo Provider',
    phone: '9876543211',
    isSolarProvider: true,
    createdAt: new Date().toISOString()
  }
];

// Provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Register function
  const register = async (email: string, password: string, name: string, phone: string, isSolarProvider: boolean) => {
    // This would be replaced with an actual API call to register the user
    // For now, we'll simulate a successful registration
    const newUser: User = {
      id: Math.random().toString(36).substring(2, 9), // Generate a random ID
      email,
      name,
      phone,
      isSolarProvider,
      createdAt: new Date().toISOString()
    };
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Store user in localStorage (this simulates being logged in after registration)
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    setCurrentUser(newUser);
  };

  // Login function
  const login = async (email: string, password: string) => {
    // This would be replaced with an actual API call to authenticate the user
    // For now, we'll check against our mock users
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = MOCK_USERS.find(u => u.email === email);
    
    if (user) {
      // Store user in localStorage
      localStorage.setItem('currentUser', JSON.stringify(user));
      setCurrentUser(user);
    } else {
      throw new Error('Invalid email or password');
    }
  };

  // Logout function
  const logout = async () => {
    // This would include any cleanup needed when logging out
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Remove user from localStorage
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    loading,
    register,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
