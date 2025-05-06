import { useState, useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import { FiSearch, FiUserCheck, FiUserMinus } from 'react-icons/fi';
import VisitorTable from './VisitorTable';
import CheckoutModal from './CheckoutModal';
import '../styles/VisitorManagement.css';

const VisitorManagement = () => {
  const { theme } = useContext(ThemeContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  
  // Mock data - in a real app this would come from an API
  const [visitors, setVisitors] = useState([
    {
      id: 'IZLSUK',
      name: 'Vijay Guhan',
      photo: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      purpose: 'Meeting with HR',
      entryTime: '5/6/25, 6:17 PM',
      status: 'checked-in'
    }
  ]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  const filteredVisitors = visitors.filter(visitor => {
    // Apply search filter
    const matchesSearch = visitor.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          visitor.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          visitor.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Apply status filter
    const matchesStatus = activeFilter === 'all' || 
                          (activeFilter === 'checked-in' && visitor.status === 'checked-in') ||
                          (activeFilter === 'checked-out' && visitor.status === 'checked-out');
    
    return matchesSearch && matchesStatus;
  });

  const handleCheckout = (visitor) => {
    setSelectedVisitor(visitor);
    setShowCheckoutModal(true);
  };

  const confirmCheckout = () => {
    if (selectedVisitor) {
      // Update visitor status
      const updatedVisitors = visitors.map(visitor => 
        visitor.id === selectedVisitor.id ? {...visitor, status: 'checked-out'} : visitor
      );
      setVisitors(updatedVisitors);
      setShowCheckoutModal(false);
      setSelectedVisitor(null);
    }
  };

  return (
    <section className={`visitor-management ${theme}`}>
      <h2 className="section-title">Visitor Management</h2>
      
      <div className="visitor-controls">
        <div className="search-bar">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by name, purpose, or ID..."
            value={searchQuery}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
        
        <div className="filter-buttons">
          <button 
            className={`filter-button ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => handleFilterChange('all')}
          >
            All
          </button>
          <button 
            className={`filter-button ${activeFilter === 'checked-in' ? 'active' : ''}`}
            onClick={() => handleFilterChange('checked-in')}
          >
            <FiUserCheck className="filter-icon" />
            Checked In
          </button>
          <button 
            className={`filter-button ${activeFilter === 'checked-out' ? 'active' : ''}`}
            onClick={() => handleFilterChange('checked-out')}
          >
            <FiUserMinus className="filter-icon" />
            Checked Out
          </button>
        </div>
      </div>
      
      <VisitorTable 
        visitors={filteredVisitors} 
        onCheckout={handleCheckout} 
      />
      
      {showCheckoutModal && (
        <CheckoutModal 
          visitor={selectedVisitor}
          onClose={() => setShowCheckoutModal(false)}
          onConfirm={confirmCheckout}
        />
      )}
    </section>
  );
};

export default VisitorManagement;