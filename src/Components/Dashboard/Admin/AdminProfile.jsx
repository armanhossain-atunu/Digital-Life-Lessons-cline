
import React, { useState } from "react";
import { FaEdit, FaRegBookmark, FaRegFileAlt, FaCalendarAlt } from "react-icons/fa";
import useAuth from "../../../Hooks/useAuth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import LoadingSpinner from "../../Shared/LoadingSpinner";
import toast from "react-hot-toast";
import { imageUpload } from "../../../Utils";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const UserProfile = () => {
  const { user, updateUserProfile, setUser } = useAuth();
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(user.displayName || "");
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(user.photoURL || "");

  // Fetch user profile
  const { data: profile = [], isLoading } = useQuery({
    queryKey: ["users", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`${import.meta.env.VITE_API_URL}/users?email=${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  // My lessons
  const { data: lessons = [] } = useQuery({
    queryKey: ["myLessons", user?.email],
    queryFn: async () => (await axiosSecure.get(`${import.meta.env.VITE_API_URL}/lessons?email=${user?.email}`)).data,
    enabled: !!user?.email
  });

  // Favorite lessons
  const { data: favoriteLessons = [] } = useQuery({
    queryKey: ["favoriteFullLessons", user?.email],
    queryFn: async () =>
      (await axiosSecure.get(`${import.meta.env.VITE_API_URL}/favoriteFullLessons?email=${user?.email}`)).data,
    enabled: !!user?.email,
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!name) return toast.error("Name cannot be empty");

    try {
      toast.loading("Updating profile...");

      //  If new photo selected, upload and get URL
      let photoURL = user.photoURL || "";
      if (photoFile) {
        photoURL = await imageUpload(photoFile);
      }

      //  Update Firebase profile
      if (updateUserProfile) await updateUserProfile(name, photoURL);

      // Update backend user record
      await axios.put(`${import.meta.env.VITE_API_URL}/updateUserProfile`, {
        email: user.email,
        displayName: name,
        photoURL,
      });

      //  Update local context and queries
      setUser({ ...user, displayName: name, photoURL });
      queryClient.invalidateQueries(["users", user?.email]);

      toast.dismiss();
      toast.success("Profile updated successfully!");
      setEditMode(false);
      setPhotoFile(null);
    } catch (err) {
      console.error("Profile update failed:", err);
      toast.dismiss();
      toast.error("Failed to update profile");
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="bg-base-100 min-h-screen pb-12 pt-20 px-4">
      <div className="max-w-4xl mx-auto bg-base-200 shadow-lg rounded-2xl p-8">

        {/* Header */}
        <div className="flex flex-wrap text-center md:text-left items-center gap-6 border-b pb-6">
          <img
            src={photoPreview}
            alt="profile"
            className="w-28  h-28 mx-auto rounded-full border-4 border-indigo-500 object-cover"
          />

          <div className="flex-1">
            {editMode ? (
              <>
                <input
                  type="text"
                  className="input input-bordered w-full mb-2"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <input type="file" accept="image/*" onChange={handleFileChange} />
              </>
            ) : (
              <>
                <h2 className="text-3xl font-bold text-base-800">{user.displayName}</h2>
                <p className="text-base-500">{user.email}</p>
                <div className="flex items-center gap-2 text-base-500 mt-2">
                  <FaCalendarAlt />
                  <span>Joined: {profile[0]?.createdAt}</span>
                </div>
              </>
            )}
            <p className="inline-block mt-2 px-4 py-1 bg-indigo-600 text-white rounded-full text-sm">{profile[0]?.role}</p>

          </div>
          <div className="mx-auto flex  gap-2">
            {editMode ? (
              <>
                <button
                  className="bg-base-300 hover:bg-green-700 text-white px-4 py-2 rounded-xl transition"
                  onClick={handleSave}
                >
                  Save
                </button>
                <button
                  className="bg-base-300 hover:bg-gray-400 px-4 py-2 rounded-xl transition"
                  onClick={() => setEditMode(false)}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition"
                onClick={() => setEditMode(true)}
              >
                <FaEdit /> Edit Profile
              </button>
            )}
          </div>
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
              <h4 className="text-lg font-semibold text-base-800">Total Lessons</h4>
              <p className="text-2xl font-bold text-indigo-700">{lessons.length}</p>
            </div>
          </div>

          <div className="bg-yellow-50 p-6 rounded-xl flex items-center gap-4 shadow">
            <FaRegBookmark className="text-4xl text-yellow-600" />
            <div>
              <h4 className="text-lg font-semibold text-base-800">Saved Lessons</h4>
              <p className="text-2xl font-bold text-yellow-700">{favoriteLessons.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
