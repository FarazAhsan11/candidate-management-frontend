import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/authContext';
import LoadingSpinner from '@/components/loading-spinner';
import type { ProtectedRouteProps } from '@/types';

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <LoadingSpinner fullScreen />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
