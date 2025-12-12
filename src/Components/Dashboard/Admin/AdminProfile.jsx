import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import LoadingSpinner from "../../Shared/LoadingSpinner";
import useAuth from "../../../Hooks/useAuth";
import { FaCalendarAlt } from "react-icons/fa";

const AdminProfile = () => {
  const { user } = useAuth();
  const { data: profile = {}, isLoading } = useQuery({
    queryKey: ["users", user?.email],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/users?email=${user.email}`
      );
      return res.data;
    },
    enabled: !!user?.email,

  });
 
  if (isLoading) {
    return <LoadingSpinner></LoadingSpinner>
  }
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <h1 className="text-2xl font-semibold mb-6">Admin Profile</h1>

      <div className="bg-base-400 shadow-md rounded-xl p-6 border border-base-200">

        {/* Profile Section */}
        <div className="flex flex-col md:flex-row items-center gap-6">

          {/* Avatar */}
          <div className="relative">
            <img
              src={profile[0]?.image}
              alt="Profile"
              className="w-32 h-32 rounded-full border"
            />
            <label className="absolute bottom-1 right-1 bg-indigo-600 text-base-100 text-xs px-2 py-1 rounded cursor-pointer">
              Change
              <input type="file" className="hidden" />
            </label>
          </div>

          {/* Profile Info */}
          <div className="flex-1 space-y-3">
            <div>
              <h2 className="text-xl font-bold">{profile[0]?.name}</h2>
              <p className="text-gray-600">{profile[0]?.email}</p>
            </div>

            <span className="inline-block px-4 py-1 text-sm text-base-100 bg-indigo-600 rounded-full">
              {profile[0]?.role}
            </span>
            <div className="flex items-center gap-2 text-base-500 mt-2">
              <FaCalendarAlt />
              <span>Joined: {profile[0].createdAt}</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-6 border-b"></div>

        {/* Form */}
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              defaultValue={profile[0]?.name}
              className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-indigo-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              defaultValue={profile[0]?.email}
              className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-indigo-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <input
              type="text"
              defaultValue={profile[0]?.role}
              disabled
              className="w-full bg-base-100 border rounded-lg px-3 py-2 cursor-not-allowed"
            />
          </div>
        </form>

        {/* Save Button */}
        <div className="mt-6">
          <button className="px-6 py-2 bg-indigo-600 text-base-100 rounded-lg shadow hover:bg-indigo-700 transition">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
