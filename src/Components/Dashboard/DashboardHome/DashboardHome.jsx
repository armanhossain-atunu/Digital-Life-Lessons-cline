import Container from '../../Shared/Container';
import TotalUsers from './DashboardHomeShared/TotalUsers';
import useAuth from '../../../Hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from '../../Shared/LoadingSpinner';
import { FaRegBookmark, FaRegFileAlt, FaStar } from 'react-icons/fa';
import { Link } from 'react-router';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { MdMenuBook } from "react-icons/md";
import useLessons from '../../../Hooks/ShareAllApi/useLessons';
import useFavoriteLessons from '../../../Hooks/ShareAllApi/useFavoriteLessons';
import UserList from '../User/UserList';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import TotalFavorite from './DashboardHomeShared/TotalFavorite';
import TotalFreePremiumUser from '../User/TotalFreePremiumUser';
import useUserRole from '../../../Hooks/ShareAllApi/useUserRole';
import Pagination from '../../Shared/Pagination';
import { useState } from 'react';
import toast from 'react-hot-toast';

const DashboardHome = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Fetch all lessons
    const { data: allLessons = [], refetch: fetchLessons } = useLessons();

    // User role
    const { data: userData = [] } = useUserRole(user?.email);

    // Fetch my lessons
    const { data: lessons = [], isLoading: lessonsLoading } = useQuery({
        queryKey: ["myLessons", user?.email],
        queryFn: async () =>
            (await axiosSecure.get(`${import.meta.env.VITE_API_URL}/lessons?email=${user?.email}`)).data,
        enabled: !!user?.email
    });

    // Fetch favorite lessons
    const { favoriteLessons, isLoading: favLoading } = useFavoriteLessons();
    const isLoading = lessonsLoading || favLoading;

    // Fetch total number of premium lessons
    const { data: premiumData } = useQuery({
        queryKey: ["premiumLessonsCount"],
        queryFn: async () => {
            const res = await axiosSecure.get(`${import.meta.env.VITE_API_URL}/premiumLessonsCount`);
            return res.data;
        }
    });

    // Fetch total number of free lessons
    const { data: free = [] } = useQuery({
        queryKey: ["freeLessonsCount"],
        queryFn: async () => {
            const res = await axiosSecure.get(`${import.meta.env.VITE_API_URL}/freeLessonsCount`);
            return res.data;
        }
    });

    if (isLoading) return <LoadingSpinner />;

    // Prepare chart data
    const chartData = lessons.map(lesson => ({
        date: new Date(lesson.createdAt).toLocaleDateString(),
        count: 1
    })).reduce((acc, cur) => {
        const existing = acc.find(item => item.date === cur.date);
        if (existing) existing.count += 1;
        else acc.push(cur);
        return acc;
    }, []);

    // Pagination
    const totalPages = Math.ceil(allLessons.length / itemsPerPage);
    const displayedLessons = allLessons.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Access Level update handler
    const handleAccessLevelChange = async (lessonId, level) => {
        try {
            await axiosSecure.patch(`/admin/lessons/${lessonId}/access-level`, { accessLevel: level });
            toast.success(`Access Level updated to ${level}`);
            fetchLessons();
        } catch (err) {
            toast.error("Failed to update Access Level" + err.message);
        }
    };

    return (
        <Container>
            <h1 className="text-2xl text-center font-semibold mt-20 mb-6">Dashboard Home</h1>

            {/* Total Users */}
            <div className="flex flex-wrap justify-center gap-6 items-center">
                <TotalUsers />
                <TotalFreePremiumUser />
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                <div className="bg-indigo-50 p-6 rounded-xl flex justify-center items-center gap-4 shadow hover:shadow-lg transition">
                    <FaRegFileAlt className="text-4xl text-indigo-600" />
                    <div>
                        <h4 className="text-lg font-semibold text-base-800">Admin Lessons</h4>
                        <p className="text-2xl text-center font-bold text-indigo-700">{lessons.length}</p>
                    </div>
                </div>
                <div className="bg-purple-50 p-6 rounded-xl flex justify-center items-center gap-4 shadow hover:shadow-lg transition">
                    <MdMenuBook className="text-4xl text-purple-600" />
                    <div>
                        <h4 className="text-lg font-semibold text-base-800">Total Lessons</h4>
                        <p className="text-2xl text-center font-bold text-purple-700">{allLessons.length}</p>
                    </div>
                </div>
                <TotalFavorite />
                <div className="bg-green-50 p-6 rounded-xl flex justify-center items-center gap-4 shadow hover:shadow-lg transition">
                    <FaRegFileAlt className="text-4xl text-green-600" />
                    <div>
                        <h4 className="text-lg font-semibold text-base-800">Recent Lessons</h4>
                        <p className="text-2xl text-center font-bold text-green-700">{lessons.slice(-5).length}</p>
                    </div>
                </div>
                <div className="bg-purple-50 p-6 rounded-xl flex justify-center items-center gap-4 shadow hover:shadow-lg transition">
                    <FaRegFileAlt className="text-4xl text-purple-600" />
                    <div>
                        <h4 className="text-lg font-semibold text-base-800">Free Lessons</h4>
                        <p className="text-2xl text-center font-bold text-purple-700">{free.freeCount}</p>
                    </div>
                </div>
                <div className="bg-indigo-50 p-6 rounded-xl flex justify-center items-center gap-4 shadow hover:shadow-lg transition">
                    <FaStar className="text-4xl text-green-600" />
                    <div>
                        <h4 className="text-lg font-semibold text-base-800">Premium Lessons</h4>
                        <p className="text-2xl text-center font-bold text-green-700">{premiumData?.premiumCount}</p>
                    </div>
                </div>
                <div className="bg-purple-50 p-6 rounded-xl flex justify-center items-center gap-4 shadow hover:shadow-lg transition">
                    <FaRegFileAlt className="text-4xl text-purple-600" />
                    <div>
                        <h4 className="text-lg font-semibold text-base-800">User Role</h4>
                        <p className="text-2xl text-center font-bold text-purple-700">{userData?.role}</p>
                    </div>
                </div>
                <div className="bg-indigo-50 p-6 rounded-xl flex justify-center items-center gap-4 shadow hover:shadow-lg transition">
                    <FaRegFileAlt className="text-4xl text-indigo-600" />
                    <div>
                        <h4 className="text-lg font-semibold text-base-800">My Favorite</h4>
                        <p className="text-2xl text-center font-bold text-indigo-700">{favoriteLessons.length}</p>
                    </div>
                </div>
            </div>

            {/* Recent Lessons Table */}
            <div className="mt-10">
                <h2 className="text-2xl font-bold mb-4">Recently Added Lessons ({allLessons.length})</h2>
                {allLessons.length === 0 ? (
                    <p>No recent lessons found.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="table w-full border border-base-200 rounded-xl">
                            <thead>
                                <tr className="bg-base-200">
                                    <th>Image</th>
                                    <th>Title</th>
                                    <th>Category</th>
                                    <th>Created Date</th>
                                    <th>Access Level</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayedLessons.map((lesson) => (
                                    <tr key={lesson._id}>
                                        <td className='w-10 h-10'><img src={lesson?.image} alt="" /></td>
                                        <td>{lesson.title}</td>
                                        <td>{lesson.category}</td>
                                        <td>{new Date(lesson.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <select
                                                className="select select-bordered select-sm"
                                                value={lesson.accessLevel}
                                                onChange={(e) => handleAccessLevelChange(lesson._id, e.target.value)}
                                            >
                                                <option value="Free">Free</option>
                                                <option value="Premium">Premium</option>
                                            </select>
                                        </td>
                                        <td>
                                            <Link
                                                to={`/lesson-details/${lesson._id}`}
                                                className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                                            >
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {allLessons.length > itemsPerPage && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                )}
            </div>

            {/* User List */}
            <UserList />

            {/* Weekly Lessons Chart */}
            <div className="mt-10 mb-20">
                <h2 className="text-2xl font-bold mb-4">Weekly Contributions</h2>
                {chartData.length === 0 ? (
                    <p>No data to display.</p>
                ) : (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#875DF8" />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </Container>
    );
};

export default DashboardHome;
