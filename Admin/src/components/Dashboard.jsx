import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import { FiUsers, FiCheck, FiLogOut } from 'react-icons/fi';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { theme } = useContext(ThemeContext);
  
  const stats = {
    totalVisitors: 1,
    checkedIn: 1,
    checkedOut: 0
  };

  return (
    <section className={`dashboard ${theme}`}>
      <h2 className="dashboard-title">Admin Dashboard</h2>
      
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-icon-container total">
            <FiUsers className="stat-icon" />
          </div>
          <div className="stat-info">
            <h3 className="stat-label">Total Visitors</h3>
            <p className="stat-value">{stats.totalVisitors}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon-container checked-in">
            <FiCheck className="stat-icon" />
          </div>
          <div className="stat-info">
            <h3 className="stat-label">Currently Checked In</h3>
            <p className="stat-value">{stats.checkedIn}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon-container checked-out">
            <FiLogOut className="stat-icon" />
          </div>
          <div className="stat-info">
            <h3 className="stat-label">Checked Out</h3>
            <p className="stat-value">{stats.checkedOut}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;