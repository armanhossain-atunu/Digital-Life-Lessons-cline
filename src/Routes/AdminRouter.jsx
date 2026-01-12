import React from 'react';
import useAuth from '../Hooks/useAuth';
import useUsers from '../Hooks/ShareAllApi/useUsers';
import LoadingSpinner from '../Components/Shared/LoadingSpinner';
import { Navigate } from 'react-router';

const AdminRouter = ({ children }) => {
    const { user } = useAuth();
const { data: users = [], isLoading } = useUsers(); 

// current user details
const currentUser = users.find(u => u.email === user?.email);

if (isLoading) return <LoadingSpinner />;

// not logged in
if (!user) {
  return <Navigate to="/auth/login" replace />;
}

// admin allowed
if (currentUser?.role?.toLowerCase() === "admin" || currentUser?.role?.toLowerCase() === "demoAdmin") {
  return children;
}

// logged in but NOT admin
return <Navigate to="/unauthorized" />;

};

export default AdminRouter;
