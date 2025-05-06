import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from './AuthContext';

const VisitorContext = createContext(undefined);

export const useVisitor = () => {
  const context = useContext(VisitorContext);
  if (context === undefined) {
    throw new Error('useVisitor must be used within a VisitorProvider');
  }
  return context;
};

export const VisitorProvider = ({ children }) => {
  const [visitors, setVisitors] = useState([]);
  const [currentVisit, setCurrentVisit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const storedVisitors = localStorage.getItem('visitors');
    if (storedVisitors) {
      setVisitors(JSON.parse(storedVisitors));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('visitors', JSON.stringify(visitors));
    }
  }, [visitors, loading]);

  const createVisit = async (formData) => {
    if (!currentUser) {
      throw new Error('User must be logged in to create a visit');
    }

    setLoading(true);
    setError(null);

    try {
      const visitorId = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      const newVisit = {
        id: uuidv4(),
        visitorId,
        name: formData.name,
        address: formData.address,
        purpose: formData.purpose,
        image: formData.image,
        entryTime: new Date().toISOString(),
        exitTime: null,
        status: 'checked-in',
        userId: currentUser.id
      };

      setVisitors(prev => [...prev, newVisit]);
      setCurrentVisit(newVisit);
      return newVisit;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const checkoutVisitor = async (visitorId) => {
    setLoading(true);
    setError(null);

    try {
      setVisitors(prev => 
        prev.map(visitor => 
          visitor.visitorId === visitorId
            ? {
                ...visitor,
                exitTime: new Date().toISOString(),
                status: 'checked-out'
              }
            : visitor
        )
      );
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getVisitorById = (id) => {
    return visitors.find(visitor => visitor.id === id || visitor.visitorId === id);
  };

  const value = {
    visitors,
    currentVisit,
    loading,
    error,
    createVisit,
    checkoutVisitor,
    getVisitorById
  };

  return <VisitorContext.Provider value={value}>{children}</VisitorContext.Provider>;
};