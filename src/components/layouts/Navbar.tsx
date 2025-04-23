
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Sun } from 'lucide-react';

const Navbar: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <nav className="bg-white shadow-sm py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Sun className="h-8 w-8 text-solar-yellow animate-pulse-slow" />
          <span className="text-2xl font-bold text-foreground">Ray Unity</span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-foreground hover:text-solar-orange transition-colors">
            Home
          </Link>
          <Link to="/about" className="text-foreground hover:text-solar-orange transition-colors">
            About
          </Link>
          <Link to="/how-it-works" className="text-foreground hover:text-solar-orange transition-colors">
            How It Works
          </Link>
        </div>
        
        <div className="flex items-center space-x-3">
          {currentUser ? (
            <>
              <Link to="/dashboard">
                <Button variant="outline" className="border-solar-yellow text-foreground hover:bg-solar-yellow hover:text-foreground">
                  Dashboard
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                onClick={handleLogout}
                className="text-foreground hover:bg-muted"
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" className="text-foreground hover:bg-muted">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-solar-yellow text-foreground hover:bg-solar-orange">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
