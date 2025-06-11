import type { FC } from 'react';
import { Outlet, Navigate } from "react-router-dom";
import { useAuthInit } from '../store/useAuthStore';
import { useLocation } from 'react-router-dom';

const PrivateRoutes: FC = () => {
    const { user, loading } = useAuthInit();
    const location = useLocation();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-bars loading-xl"></span>
            </div>
        )
    }

    if (user && location.pathname === '/login' || location.pathname === '/register') {
        return <Navigate to="/" />
    }
    return user ? <Outlet /> : <Navigate to="/login" />
}

export default PrivateRoutes;