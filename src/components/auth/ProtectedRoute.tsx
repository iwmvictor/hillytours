import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/lib/store';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: ('client' | 'provider' | 'admin')[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, loading, isAdmin, isProvider, isClient } = useAuthStore();
  
  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    toast.error('Please sign in to access this page');
    return <Navigate to="/" replace />;
  }

  const userRole = user.user_metadata.role;
  
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    toast.error('You do not have permission to access this page');
    return <Navigate to="/" replace />;
  }

  // Additional role verification using store methods
  const hasValidRole = (
    (allowedRoles?.includes('admin') && isAdmin()) ||
    (allowedRoles?.includes('provider') && isProvider()) ||
    (allowedRoles?.includes('client') && isClient()) ||
    !allowedRoles // If no roles specified, allow authenticated access
  );

  if (!hasValidRole) {
    toast.error('Invalid role configuration');
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}