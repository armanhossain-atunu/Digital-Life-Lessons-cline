import { FaEdit, FaRegBookmark, FaRegFileAlt, FaCalendarAlt } from "react-icons/fa";
import useAuth from "../../../Hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import LoadingSpinner from "../../Shared/LoadingSpinner";

const UserProfile = () => {
  const { user } = useAuth();
  // my lessons
  const { data: lessons = [] } = useQuery({
    queryKey: ["myLessons", user?.email],
    queryFn: async () =>
      (await axios.get(`${import.meta.env.VITE_API_URL}/lessons?email=${user?.email}`)).data,
    enabled: !!user?.email
  })
  // favorite 
  const { data: favoriteLessons = [], isLoading } = useQuery({
    queryKey: ["favoriteFullLessons", user?.email],
    queryFn: async () =>
      (await axios.get(`${import.meta.env.VITE_API_URL}/favoriteFullLessons?email=${user?.email}`)).data,
    enabled: !!user?.email,
  });

  if (isLoading) {
    return <LoadingSpinner></LoadingSpinner>
  }
  return (
    <div className="bg-base-100 min-h-screen pb-12 pt-20 px-4">
      <div className="max-w-4xl mx-auto bg-base-200 shadow-lg rounded-2xl p-8">

        {/* Header: Profile Picture + Name */}
        <div className="flex items-center gap-6 border-b pb-6">
          <img
            src={user.photoURL}
            alt="profile"
            className="w-28 h-28 rounded-full border-4 border-indigo-500"
          />

          <div>
            <h2 className="text-3xl font-bold text-base-800">{user.displayName}</h2>
            <p className="text-base-500">{user.email}</p>

            <div className="flex items-center gap-2 text-base-500 mt-2">
              <FaCalendarAlt />
              <span>Joined: {user.createdAt}</span>
            </div>
          </div>

          <button className="ml-auto bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition">
            <FaEdit /> Edit Profile
          </button>
        </div>

        {/* Bio */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-base-800 mb-2">About</h3>
          <p className="text-base-600">{user.bio}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
          <div className="bg-indigo-50 p-6 rounded-xl flex items-center gap-4 shadow">
            <FaRegFileAlt className="text-4xl text-indigo-600" />
            <div>
              <h4 className="text-lg font-semibold text-gray-800">Total Lessons</h4>
              <p className="text-2xl font-bold text-indigo-700">{lessons.length}</p>
            </div>
          </div>

          <div className="bg-yellow-50 p-6 rounded-xl flex items-center gap-4 shadow">
            <FaRegBookmark className="text-4xl text-yellow-600" />
            <div>
              <h4 className="text-lg font-semibold text-gray-800">Saved Lessons</h4>
              <p className="text-2xl font-bold text-yellow-700">{favoriteLessons.length}</p>
            </div>
          </div>
        </div>

        {/* Extra Section (Optional) */}
        <div className="mt-10">
          <h3 className="text-xl font-semibold text-base-800 mb-3">Recent Activities</h3>
          <p className="text-base-500 italic">
            (You can show recent lessons, saved lessons, comments etc...)
          </p>
        </div>

      </div>
    </div>
  );
};

export default UserProfile;
