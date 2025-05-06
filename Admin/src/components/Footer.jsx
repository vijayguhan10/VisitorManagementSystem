import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import '../styles/Footer.css';

const Footer = () => {
  const { theme } = useContext(ThemeContext);
  
  return (
    <footer className={`footer ${theme}`}>
      <div className="footer-content">
        <p className="copyright">© 2025 VisitTrack. All rights reserved.</p>
        
        <nav className="footer-links">
          <a href="#" className="footer-link">Privacy Policy</a>
          <a href="#" className="footer-link">Terms of Service</a>
          <a href="#" className="footer-link">Contact</a>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;