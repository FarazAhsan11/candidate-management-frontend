import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/authContext';
import LoadingSpinner from '@/components/loading-spinner';
import type { AdminRouteProps } from '@/types';

const AdminRoute = ({ children }: AdminRouteProps) => {
    const { user, isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <LoadingSpinner fullScreen />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (user?.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default AdminRoute;
