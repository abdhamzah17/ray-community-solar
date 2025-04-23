
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Define user types
export interface User {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  isSolarProvider: boolean;
  createdAt: string | null;
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

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Helper: fetch profile from the 'profiles' table
  const fetchProfile = async (id: string, email?: string) => {
    // Always search by id
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (!profile) return null;
    return {
      id: profile.id,
      email: profile.email,
      name: profile.name ?? "",
      phone: profile.phone ?? "",
      isSolarProvider: !!profile.is_solar_provider,
      createdAt: profile.created_at
    };
  };

  useEffect(() => {
    // Set up supabase.auth.onAuthStateChange FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          fetchProfile(session.user.id, session.user.email)
            .then(profile => profile && setCurrentUser(profile))
            .finally(() => setLoading(false));
        } else {
          setCurrentUser(null);
          setLoading(false);
        }
      }
    );
    // THEN check current session
    supabase.auth.getSession()
      .then(async ({ data: { session } }) => {
        if (session?.user) {
          const profile = await fetchProfile(session.user.id, session.user.email);
          if (profile) setCurrentUser(profile);
        }
      })
      .finally(() => setLoading(false));

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Register function
  const register = async (email: string, password: string, name: string, phone: string, isSolarProvider: boolean) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // Store in raw_user_meta_data so our trigger fires correctly
          data: {
            name,
            phone,
            isSolarProvider
          }
        }
      });
      if (error) throw new Error(error.message ?? "Registration error");

      // After registration, the user MUST confirm email before auth session is set
      toast({
        title: "Registration successful",
        description: "Your account has been created. Please check your email to confirm your address before signing in.",
      });

    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error?.message ?? "Something went wrong.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw new Error(error.message ?? "Login error");

      toast({
        title: "Login successful",
        description: "Welcome back!",
      });

      // The profile will be updated onAuthStateChange automatically

    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error?.message ?? "Something went wrong.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw new Error(error.message ?? "Logout error");

      setCurrentUser(null);
      toast({
        title: "Logged out",
        description: "You have been signed out successfully.",
      });

    } catch (error: any) {
      toast({
        title: "Logout failed",
        description: error?.message ?? "Something went wrong.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
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
