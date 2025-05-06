import { useEffect, useRef, useContext } from 'react';
import { createPortal } from 'react-dom';
import { ThemeContext } from '../contexts/ThemeContext';
import { FiX, FiAlertCircle, FiCheck } from 'react-icons/fi';
import '../styles/CheckoutModal.css';

const CheckoutModal = ({ visitor, onClose, onConfirm }) => {
  const { theme } = useContext(ThemeContext);
  const modalRef = useRef(null);
  const portalRoot = document.getElementById('root');
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = ''; // Re-enable scrolling
    };
  }, [onClose]);
  
  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  if (!visitor) return null;

  const modal = (
    <div className={`modal-backdrop ${theme}`} onClick={handleBackdropClick}>
      <div className="modal-container" ref={modalRef}>
        <div className="modal-header">
          <h3 className="modal-title">Visitor Checkout</h3>
          <button className="close-button" onClick={onClose}>
            <FiX />
          </button>
        </div>
        
        <div className="modal-content">
          <div className="visitor-preview">
            <img 
              src={visitor.photo} 
              alt={`${visitor.name} profile`} 
              className="visitor-photo-preview" 
            />
            <div className="visitor-details-preview">
              <h4 className="visitor-name-preview">{visitor.name}</h4>
              <p className="visitor-purpose-preview">{visitor.purpose}</p>
              <p className="visitor-time-preview">
                <span className="label">Check-in time:</span> {visitor.entryTime}
              </p>
            </div>
          </div>
          
          <div className="checkout-message">
            <FiAlertCircle className="alert-icon" />
            <p>Are you sure you want to check out this visitor?</p>
          </div>
        </div>
        
        <div className="modal-footer">
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button className="confirm-button" onClick={onConfirm}>
            <FiCheck className="confirm-icon" />
            Confirm Checkout
          </button>
        </div>
      </div>
    </div>
  );
  
  return createPortal(modal, portalRoot);
};

export default CheckoutModal;