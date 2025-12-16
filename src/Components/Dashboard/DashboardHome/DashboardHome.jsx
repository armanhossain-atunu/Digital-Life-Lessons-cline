import Container from '../../Shared/Container';
import TotalUsers from './DashboardHomeShared/TotalUsers';
import useAuth from '../../../Hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import LoadingSpinner from '../../Shared/LoadingSpinner';
import { FaRegBookmark, FaRegFileAlt, FaStar } from 'react-icons/fa';
import { Link } from 'react-router';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { MdMenuBook } from "react-icons/md";
import useLessons from '../../../Hooks/ShareAllApi/useLessons';
import useFavoriteLessons from '../../../Hooks/ShareAllApi/useFavoriteLessons';
import UserList from '../User/UserList';


const DashboardHome = () => {
    const { user } = useAuth();
    // Fetch all lessons
    const { data: allLessons = [] } = useLessons()
    // Fetch my lessons
    const { data: lessons = [], isLoading: lessonsLoading } = useQuery({
        queryKey: ["myLessons", user?.email],
        queryFn: async () =>
            (await axios.get(`${import.meta.env.VITE_API_URL}/lessons?email=${user?.email}`)).data,
        enabled: !!user?.email
    });
    // Fetch favorite lessons
    const { favoriteLessons, isLoading: favLoading } = useFavoriteLessons();
    const isLoading = lessonsLoading || favLoading;
    // Fetch total number of premium lessons
    const { data } = useQuery({
        queryKey: ["premiumLessonsCount"],
        queryFn: async () => {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/premiumLessonsCount`);
            return res.data;
        }

    });

    // Fetch total number of free lessons
    const { data: free = [], } = useQuery({
        queryKey: ["freeLessonsCount"],
        queryFn: async () => {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/freeLessonsCount`);
            return res.data;
        }
    });
    if (isLoading) {
        return <LoadingSpinner />;
    }

    // Prepare chart data (example: lessons added per day)
    const chartData = lessons.map(lesson => ({
        date: new Date(lesson.createdAt).toLocaleDateString(),
        count: 1
    })).reduce((acc, cur) => {
        const existing = acc.find(item => item.date === cur.date);
        if (existing) existing.count += 1;
        else acc.push(cur);
        return acc;
    }, []);

    return (
        <Container>
            <h1 className="text-2xl text-center font-semibold mt-20 mb-6">Dashboard Home</h1>

            {/* Total Users */}
            <div className="flex justify-center items-center">
                <TotalUsers />
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                <div className="bg-indigo-50 p-6 rounded-xl flex justify-center items-center gap-4 shadow hover:shadow-lg transition">
                    <FaRegFileAlt className="text-4xl text-indigo-600" />
                    <div>
                        <h4 className="text-lg font-semibold text-gray-800">Admin Lessons</h4>
                        <p className="text-2xl text-center font-bold text-indigo-700">{lessons.length}</p>
                    </div>
                </div>

                <div className="bg-purple-50 p-6 rounded-xl flex justify-center items-center gap-4 shadow hover:shadow-lg transition">
                    <MdMenuBook className="text-4xl text-purple-600" ></MdMenuBook>
                    <div>
                        <h4 className="text-lg font-semibold text-gray-800">Total Lessons</h4>
                        <p className="text-2xl text-center font-bold text-purple-700">{allLessons.length}</p>
                    </div>
                </div>

                <div className="bg-yellow-50 p-6 rounded-xl flex justify-center items-center gap-4 shadow hover:shadow-lg transition">
                    <FaRegBookmark className="text-4xl text-yellow-600" />
                    <div>
                        <h4 className="text-lg font-semibold text-gray-800">Saved Lessons</h4>
                        <p className="text-2xl text-center font-bold text-yellow-700">{favoriteLessons.length}</p>
                    </div>
                </div>

                <div className="bg-green-50 p-6 rounded-xl flex justify-center items-center gap-4 shadow hover:shadow-lg transition">
                    <FaRegFileAlt className="text-4xl text-green-600" />
                    <div>
                        <h4 className="text-lg font-semibold text-gray-800">Recent Lessons</h4>
                        <p className="text-2xl text-center font-bold text-green-700">{lessons.slice(-5).length}</p>
                    </div>
                </div>
                <div className="bg-purple-50 p-6 rounded-xl flex justify-center items-center gap-4 shadow hover:shadow-lg transition">
                    <FaRegFileAlt className="text-4xl text-purple-600" />
                    <div>
                        <h4 className="text-lg font-semibold text-gray-800">Free Lessons</h4>
                        <p className="text-2xl text-center font-bold text-purple-700">{free.freeCount}</p>
                    </div>
                </div>
                <div className="bg-indigo-50 p-6 rounded-xl flex justify-center items-center gap-4 shadow hover:shadow-lg transition">
                    <FaStar className="text-4xl text-green-600" />
                    <div>
                        <h4 className="text-lg font-semibold text-gray-800">Premium Lessons</h4>
                        <p className="text-2xl text-center font-bold text-green-700">{data?.premiumCount}</p>
                    </div>
                </div>

                <div className="bg-purple-50 p-6 rounded-xl flex justify-center items-center gap-4 shadow hover:shadow-lg transition">
                    <FaRegFileAlt className="text-4xl text-purple-600" />
                    <div>
                        <h4 className="text-lg font-semibold text-gray-800">User Role</h4>
                        <p className="text-2xl text-center font-bold text-purple-700">{user.role ? "⭐ Premium" : "Free"}</p>
                    </div>
                </div>
            </div>

            {/* Recent Lessons Table */}
            <div className="mt-10">
                <h2 className="text-2xl font-bold mb-4">Recently Added Lessons</h2>
                {lessons.length === 0 ? (
                    <p>No recent lessons found.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="table w-full border border-base-200 rounded-xl">
                            <thead>
                                <tr className="bg-base-200">
                                    <th> Image</th>
                                    <th>Title</th>
                                    <th>Category</th>
                                    <th>Created Date</th>
                                    <th>Access Level</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lessons.slice(-5).map((lesson) => (
                                    <tr key={lesson._id}>
                                        <td className='w-10 h-10'><img src={lesson?.image} alt="" /></td>
                                        <td>{lesson.title}</td>
                                        <td>{lesson.category}</td>
                                        <td>{new Date(lesson.createdAt).toLocaleDateString()}</td>
                                        <td>{lesson.accessLevel}</td>
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
            </div>


            <UserList></UserList>

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
