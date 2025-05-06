import React from 'react';
import VisitorForm from '../components/visitor/VisitorForm';

const VisitorFormPage: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Visitor Check-In</h1>
      <VisitorForm />
    </div>
  );
};

export default VisitorFormPage;