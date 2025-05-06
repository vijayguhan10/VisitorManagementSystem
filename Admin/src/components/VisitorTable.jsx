import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import { FiLogOut } from 'react-icons/fi';
import '../styles/VisitorTable.css';

const VisitorTable = ({ visitors, onCheckout }) => {
  const { theme } = useContext(ThemeContext);
  
  return (
    <div className={`visitor-table-container ${theme}`}>
      <table className="visitor-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Photo</th>
            <th>Name</th>
            <th>Purpose</th>
            <th>Entry Time</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {visitors.length === 0 ? (
            <tr>
              <td colSpan="7" className="no-visitors">
                No visitors found
              </td>
            </tr>
          ) : (
            visitors.map(visitor => (
              <tr key={visitor.id} className={visitor.status}>
                <td className="visitor-id">{visitor.id}</td>
                <td className="visitor-photo">
                  <img src={visitor.photo} alt={`${visitor.name} profile`} />
                </td>
                <td className="visitor-name">{visitor.name}</td>
                <td className="visitor-purpose">{visitor.purpose}</td>
                <td className="visitor-entry-time">{visitor.entryTime}</td>
                <td className="visitor-status">
                  <span className={`status-badge ${visitor.status}`}>
                    {visitor.status === 'checked-in' ? 'Checked In' : 'Checked Out'}
                  </span>
                </td>
                <td className="visitor-actions">
                  {visitor.status === 'checked-in' ? (
                    <button
                      className="checkout-button"
                      onClick={() => onCheckout(visitor)}
                      disabled={visitor.status === 'checked-out'}
                    >
                      <FiLogOut className="checkout-icon" />
                      <span>Check Out</span>
                    </button>
                  ) : (
                    <span className="completed-status">Completed</span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default VisitorTable;