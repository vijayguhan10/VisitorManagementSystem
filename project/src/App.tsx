import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/ui/LoadingSpinner';
import { useAuth } from './contexts/AuthContext';

// Lazy load pages for better performance
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const VisitorFormPage = lazy(() => import('./pages/VisitorFormPage'));
const VisitorConfirmationPage = lazy(() => import('./pages/VisitorConfirmationPage'));
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function App() {
  const { currentUser } = useAuth();

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={currentUser ? <Navigate to={currentUser.role === 'admin' ? '/admin' : '/visitor'} /> : <LoginPage />} />
          <Route path="login" element={!currentUser ? <LoginPage /> : <Navigate to={currentUser.role === 'admin' ? '/admin' : '/visitor'} />} />
          <Route path="signup" element={!currentUser ? <SignupPage /> : <Navigate to={currentUser.role === 'admin' ? '/admin' : '/visitor'} />} />
          
          {/* Visitor Routes */}
          <Route path="visitor" element={<ProtectedRoute allowedRoles={['visitor']} />}>
            <Route index element={<VisitorFormPage />} />
            <Route path="confirmation" element={<VisitorConfirmationPage />} />
          </Route>
          
          {/* Admin Routes */}
          <Route path="admin" element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route index element={<AdminDashboardPage />} />
          </Route>
          
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;