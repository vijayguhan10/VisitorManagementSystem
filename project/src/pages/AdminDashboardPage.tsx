import React from 'react';
import VisitorList from '../components/admin/VisitorList';

const AdminDashboardPage: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <VisitorList />
    </div>
  );
};

export default AdminDashboardPage;