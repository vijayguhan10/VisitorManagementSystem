import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from './AuthContext';

export interface VisitorEntry {
  id: string;
  visitorId: string;
  name: string;
  address: string;
  purpose: string;
  image: string; // Base64 encoded image
  entryTime: string;
  exitTime: string | null;
  status: 'checked-in' | 'checked-out';
  userId: string;
}

export interface VisitorFormData {
  name: string;
  address: string;
  purpose: string;
  image: string;
}

interface VisitorContextType {
  visitors: VisitorEntry[];
  currentVisit: VisitorEntry | null;
  loading: boolean;
  error: string | null;
  createVisit: (formData: VisitorFormData) => Promise<VisitorEntry>;
  checkoutVisitor: (visitorId: string) => Promise<void>;
  getVisitorById: (id: string) => VisitorEntry | undefined;
}

const VisitorContext = createContext<VisitorContextType | undefined>(undefined);

export const useVisitor = () => {
  const context = useContext(VisitorContext);
  if (context === undefined) {
    throw new Error('useVisitor must be used within a VisitorProvider');
  }
  return context;
};

export const VisitorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [visitors, setVisitors] = useState<VisitorEntry[]>([]);
  const [currentVisit, setCurrentVisit] = useState<VisitorEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    // Load visitors from localStorage
    const storedVisitors = localStorage.getItem('visitors');
    if (storedVisitors) {
      setVisitors(JSON.parse(storedVisitors));
    }
    setLoading(false);
  }, []);

  // Save visitors to localStorage whenever it changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('visitors', JSON.stringify(visitors));
    }
  }, [visitors, loading]);

  const createVisit = async (formData: VisitorFormData): Promise<VisitorEntry> => {
    if (!currentUser) {
      throw new Error('User must be logged in to create a visit');
    }

    setLoading(true);
    setError(null);

    try {
      // Generate a unique visitor ID (6 characters)
      const visitorId = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      const newVisit: VisitorEntry = {
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
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const checkoutVisitor = async (visitorId: string): Promise<void> => {
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
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getVisitorById = (id: string): VisitorEntry | undefined => {
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