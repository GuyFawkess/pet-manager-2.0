import  type { FC } from 'react';
import { Outlet, Navigate } from "react-router-dom";
import { useAuthInit } from '../store/useAuthStore';

const PrivateRoutes: FC = () => {
    const { user, loading } = useAuthInit();

    if(loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-bars loading-xl"></span>
            </div>
        )
    }

    return user ? <Outlet /> : <Navigate to="/login" />
}

export default PrivateRoutes;