import  type { FC } from 'react';
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../store/AuthContext";

const PrivateRoutes: FC = () => {
    const { user } = useAuth();

    return user ? <Outlet /> : <Navigate to="/login" />
}

export default PrivateRoutes;