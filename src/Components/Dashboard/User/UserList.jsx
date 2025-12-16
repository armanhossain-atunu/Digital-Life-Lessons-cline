import React, { useState, useMemo } from 'react';
import useUsers from '../../../Hooks/ShareAllApi/useUsers';
import axios from 'axios';

const UserList = () => {
    const { data: users = [], isLoading, refetch } = useUsers(); 
    const [sortOrder, setSortOrder] = useState('asc');
    const [showAll, setShowAll] = useState(false);
    const [deletingId, setDeletingId] = useState(null);


    const handleDeleteUser = async (userEmail) => {
        if (!window.confirm(`Are you sure you want to delete user: ${userEmail}?`)) {
            return;
        }
        setDeletingId(userEmail);
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/users/${userEmail}`);
            refetch();
        } catch (error) {
            alert("Failed to delete user. Please try again.");
            console.error(error);
        } finally {
            setDeletingId(null);
        }
    };

    // Sort users by role
    const sortedUsers = useMemo(() => {
        return [...users].sort((a, b) => {
            const roleA = a.role || 'user';
            const roleB = b.role || 'user';
            return sortOrder === 'asc'
                ? roleA.localeCompare(roleB)
                : roleB.localeCompare(roleA);
        });
    }, [users, sortOrder]);

    const displayedUsers = showAll ? sortedUsers : sortedUsers.slice(0, 5);
    const hasMore = sortedUsers.length > 5;

    const toggleSort = () => {
        setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    };

    if (isLoading) {
        return (
            <div className="p-6">
                <p className="text-center text-gray-600">Loading users...</p>
            </div>
        );
    }

    if (users.length === 0) {
        return (
            <div className="p-6">
                <p className="text-center text-gray-600">No users found.</p>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">All Users ({users.length})</h2>

            <div className="overflow-x-auto bg-white shadow rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                User
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Email
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onClick={toggleSort}
                            >
                                Role{' '}
                                <span className="inline-block ml-1">
                                    {sortOrder === 'asc' ? '↑' : '↓'}
                                </span>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Plan
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Joined
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {displayedUsers.map((user) => (
                            <tr key={user.email} className="hover:bg-gray-50 group">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={user.photoURL || '/default-avatar.png'}
                                            alt={user.displayName}
                                            className="w-10 h-10 rounded-full object-cover border"
                                            onError={(e) => (e.target.src = '/default-avatar.png')}
                                        />
                                        <div className="text-sm font-medium text-gray-900">
                                            {user.displayName || 'No Name'}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {user.email}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin'
                                            ? 'bg-purple-100 text-purple-800'
                                            : user.role === 'premium'
                                                ? 'bg-blue-100 text-blue-800'
                                                : 'bg-gray-100 text-gray-800'
                                            }`}
                                    >
                                        {user.role || 'user'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {user.plan || 'Free'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {user.createdAt
                                        ? new Date(user.createdAt).toLocaleDateString()
                                        : 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    {/* Delete button: visible only on hover */}
                                    <button
                                        onClick={() => handleDeleteUser(user.email)}
                                        disabled={deletingId === user.email}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                        title="Delete user"
                                    >
                                        {deletingId === user.email ? (
                                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                        ) : (
                                            <>
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                Delete
                                            </>
                                        )}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {hasMore && (
                <div className="mt-6 text-center">
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
                    >
                        {showAll ? 'Show Less' : `Show More (${sortedUsers.length - 5} remaining)`}
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserList;