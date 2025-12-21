import React, { useState, useMemo } from 'react';
import useUsers from '../../../Hooks/ShareAllApi/useUsers';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import toast from 'react-hot-toast';

const UserList = () => {
    const { data: users = [], isLoading, refetch } = useUsers();
    const axiosSecure = useAxiosSecure();

    const [sortOrder, setSortOrder] = useState('asc');
    const [showAll, setShowAll] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    /* ================= Delete Confirm Toast ================= */
    const showDeleteConfirmToast = (onConfirm) => {
        toast((t) => (
            <div className="bg-base-300 shadow-lg rounded-lg p-4 w-72">
                <h3 className="font-semibold text-red-600 text-lg">
                    Delete User?
                </h3>

                <p className="text-sm text-gray-600 mt-1">
                    This action cannot be undone.
                </p>

                <div className="flex justify-end gap-2 mt-4">
                    <button
                        className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                        onClick={() => toast.dismiss(t.id)}
                    >
                        Cancel
                    </button>

                    <button
                        className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                        onClick={() => {
                            toast.dismiss(t.id);
                            onConfirm();
                        }}
                    >
                        Delete
                    </button>
                </div>
            </div>
        ), { duration: Infinity });
    };

    /* ================= Delete User ================= */
    const handleDeleteUser = (user) => {
        if (user.role === 'admin') {
            toast.error("Admin user cannot be deleted");
            return;
        }

        showDeleteConfirmToast(async () => {
            const toastId = toast.loading("Deleting user...");
            setDeletingId(user.email);

            try {
                await axiosSecure.delete(
                    `${import.meta.env.VITE_API_URL}/users/${user.email}`
                );

                toast.success("User deleted successfully", { id: toastId });
                refetch();

            } catch (error) {
                toast.error("Failed to delete user", { id: toastId });
                console.error(error);
            } finally {
                setDeletingId(null);
            }
        });
    };

    /* ================= Sort Users By Role ================= */
    const sortedUsers = useMemo(() => {
        return [...users].sort((a, b) => {
            const roleA = String(a.role || 'user');
            const roleB = String(b.role || 'user');

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

    /* ================= Loading / Empty ================= */
    if (isLoading) {
        return (
            <div className="p-6 text-center text-gray-600">
                Loading users...
            </div>
        );
    }

    if (users.length === 0) {
        return (
            <div className="p-6 text-center text-gray-600">
                No users found.
            </div>
        );
    }

    /* ================= UI ================= */
    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">
                All Users ({users.length})
            </h2>

            <div className="overflow-x-auto bg-base-100 shadow rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-base-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                User
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Email
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase cursor-pointer"
                                onClick={toggleSort}
                            >
                                Role {sortOrder === 'asc' ? '↑' : '↓'}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Plan
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Joined
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody className="bg-base-300 divide-y divide-gray-200">
                        {displayedUsers.map((user) => (
                            <tr key={user._id || user.email} className="group hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={user.photoURL || '/default-avatar.png'}
                                            alt={user.name}
                                            className="w-10 h-10 rounded-full border object-cover"
                                            onError={(e) => e.target.src = '/default-avatar.png'}
                                        />
                                        <span className="font-medium">
                                            {user.name || user.displayName || 'Unknown'}
                                        </span>
                                    </div>
                                </td>

                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {user.email}
                                </td>

                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold
                                        ${user.role === 'admin'
                                            ? 'bg-purple-100 text-purple-800'
                                            : user.role === 'premium'
                                                ? 'bg-blue-100 text-blue-800'
                                                : 'bg-gray-100 text-gray-800'}
                                    `}>
                                        {user.role || 'user'}
                                    </span>
                                </td>

                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {user.plan || 'Free'}
                                </td>

                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {user.createdAt
                                        ? new Date(user.createdAt).toLocaleDateString()
                                        : 'N/A'}
                                </td>

                                <td className="px-6 py-4 text-right">
                                    <button
                                        disabled={deletingId === user.email || user.role === 'admin'}
                                        onClick={() => handleDeleteUser(user)}
                                        className="opacity-0 group-hover:opacity-100 transition inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded disabled:opacity-30"
                                    >
                                        {deletingId === user.email ? 'Deleting...' : 'Delete'}
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
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        {showAll ? 'Show Less' : `Show More (${sortedUsers.length - 5})`}
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserList;
