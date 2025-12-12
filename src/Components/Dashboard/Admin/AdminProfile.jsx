import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import LoadingSpinner from "../../Shared/LoadingSpinner";
import useAuth from "../../../Hooks/useAuth";
import { FaCalendarAlt } from "react-icons/fa";
import toast from "react-hot-toast";
import { imageUpload } from "../../../Utils";

const AdminProfile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch profile
  const { data: profile = {}, isLoading } = useQuery({
    queryKey: ["users", user?.email],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/user?email=${user.email}`);
      return res.data || {};
    },
    enabled: !!user?.email,
  });

  const [name, setName] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");

  useEffect(() => {
    if (profile) {
      setName(profile.displayName || profile.name || "");
      setPhotoPreview(profile.photoURL || profile.image || "");
    }
  }, [profile]);

  // Mutation
  const updateMutation = useMutation({
    mutationFn: async ({ displayName, photoURL }) => {
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/updateUserProfile`, {
        email: user.email,
        displayName,
        photoURL,
      });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success("Profile updated successfully!");
      queryClient.invalidateQueries(["users", user?.email]);
      setPhotoFile(null);

      const updated = data?.updatedUser || {};
      setPhotoPreview(updated.photoURL || photoPreview);
      setName(updated.displayName || name);
    },
    onError: () => toast.error("Failed to update profile"),
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!name) return toast.error("Name cannot be empty");

    let photoURL = photoPreview;

    if (photoFile) {
      try {
        photoURL = await imageUpload(photoFile); // Upload to imgbb
      } catch (err ) {
        return toast.error("Image upload failed");
      }
    }

    updateMutation.mutate({ displayName: name, photoURL });
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Admin Profile</h1>

      <div className="bg-base-400 shadow-md rounded-xl p-6 border border-base-200">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Avatar */}
          <div className="relative">
            <img
              src={photoPreview}
              alt="Profile"
              className="w-32 h-32 rounded-full border"
            />
            <label className="absolute bottom-1 right-1 bg-indigo-600 text-base-100 text-xs px-2 py-1 rounded cursor-pointer">
              Change
              <input type="file" className="hidden" onChange={handleFileChange} />
            </label>
          </div>

          {/* Profile Info */}
          <div className="flex-1 space-y-3">
            <div>
              <h2 className="text-xl font-bold">{name}</h2>
              <p className="text-gray-600">{profile?.email}</p>
            </div>

            <span className="inline-block px-4 py-1 text-sm text-base-100 bg-indigo-600 rounded-full">
              {profile?.role}
            </span>
            <div className="flex items-center gap-2 text-base-500 mt-2">
              <FaCalendarAlt />
              <span>Joined: {new Date(profile?.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="my-6 border-b"></div>

        {/* Form */}
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-indigo-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={profile?.email || ""}
              disabled
              className="w-full border rounded-lg px-3 py-2 bg-base-100 cursor-not-allowed"
            />
          </div>
        </form>

        <div className="mt-6">
          <button
            className="px-6 py-2 bg-indigo-600 text-base-100 rounded-lg shadow hover:bg-indigo-700 transition"
            onClick={handleSave}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
