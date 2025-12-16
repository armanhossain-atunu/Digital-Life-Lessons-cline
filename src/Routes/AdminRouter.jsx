import React from 'react';
import useAuth from '../Hooks/useAuth';
import useUsers from '../Hooks/ShareAllApi/useUsers';
import LoadingSpinner from '../Components/Shared/LoadingSpinner';
import { Navigate } from 'react-router';

const AdminRouter = ({ children }) => {
    const { user } = useAuth();
    const { data: userAdmin = [], isLoading } = useUsers(user?.email);
    if (isLoading) return <LoadingSpinner></LoadingSpinner>
    // logged in but NOT admin
    if (user && userAdmin?.role !== "admin") {
        return <Navigate to="/unauthorized"/>;
    }

    // admin allowed
    if (user && userAdmin?.role === "admin") {
        return children;
    }

    // not logged in
    return <Navigate to="/auth/login" replace />;
};

export default AdminRouter;