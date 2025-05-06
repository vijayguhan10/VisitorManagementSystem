import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, Moon, Sun, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const Header: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-primary text-primary-foreground shadow-md transition-colors duration-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Users className="h-6 w-6" />
            <span className="text-xl font-bold">VisitTrack</span>
          </Link>

          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-primary-foreground/10 transition-colors"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            {currentUser ? (
              <div className="flex items-center space-x-4">
                <span className="hidden md:inline-block text-sm">
                  {currentUser.name} ({currentUser.role})
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-md bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link 
                  to="/login"
                  className="px-3 py-1.5 text-sm rounded-md hover:bg-primary-foreground/10 transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/signup"
                  className="px-3 py-1.5 text-sm rounded-md bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
                >
                  Signup
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;