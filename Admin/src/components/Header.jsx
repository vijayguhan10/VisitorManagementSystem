import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import { FiLogOut, FiUser, FiMoon, FiSun } from 'react-icons/fi';
import '../styles/Header.css';

const Header = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  
  return (
    <header className={`header ${theme}`}>
      <div className="logo-container">
        <FiUser className="logo-icon" />
        <h1 className="logo-text">VisitTrack</h1>
      </div>
      
      <div className="header-actions">
        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'light' ? <FiMoon /> : <FiSun />}
        </button>
        
        <div className="user-info">
          <span className="username">saravana (admin)</span>
        </div>
        
        <button className="logout-button">
          <FiLogOut />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Header;