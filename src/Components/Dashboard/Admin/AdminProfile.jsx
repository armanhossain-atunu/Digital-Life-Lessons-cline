import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import LoadingSpinner from "../../Shared/LoadingSpinner";
import useAuth from "../../../Hooks/useAuth";
import { FaCalendarAlt, FaEdit } from "react-icons/fa";
import toast from "react-hot-toast";
import { imageUpload } from "../../../Utils";

const AdminProfile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: profile = {}, isLoading } = useQuery({
    queryKey: ["users", user?.email],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/user?email=${user.email}`
      );
      return res.data || {};
    },
    enabled: !!user?.email,
  });
  // console.log(profile.photoURL);


  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");

  useEffect(() => {
    if (profile) {
      setName(profile.displayName || profile.name || "");
      setPhotoPreview(profile.photoURL || profile.image || "");
    }
  }, [profile]);

  const updateMutation = useMutation({
    mutationFn: async ({ displayName, photoURL }) => {
      return axios.put(`${import.meta.env.VITE_API_URL}/updateUserProfile`, {
        email: user.email,
        displayName,
        photoURL,
      });
    },
    onSuccess: () => {
      toast.success("Profile updated");
      queryClient.invalidateQueries(["users", user?.email]);
      setEditMode(false);
      setPhotoFile(null);
    },
    onError: () => toast.error("Update failed"),
  });

  const handleSave = async () => {
    if (!name) return toast.error("Name required");

    let photoURL = photoPreview;
    if (photoFile) photoURL = await imageUpload(photoFile);

    updateMutation.mutate({ displayName: name, photoURL });
  };

  if (isLoading) return <LoadingSpinner />;
  return (
    <div className="bg-base-100 min-h-screen pt-20 px-4">
      <div className="max-w-4xl mx-auto bg-base-200 rounded-2xl p-8 shadow">

        {/* Header */}
        <div className="flex items-center gap-6 border-b pb-6">
          <img
            src={photoPreview}
            className="w-28 h-28 rounded-full border-4 border-indigo-500 object-cover"
          />

          <div className="flex-1">
            {editMode ? (
              <>
                <input
                  className="input input-bordered w-full mb-2"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <input type="file" onChange={(e) => setPhotoFile(e.target.files[0])} />
              </>
            ) : (
              <>
                <h2 className="text-3xl font-bold">{name}</h2>
                <p className="text-gray-500">{profile.email}</p>
                <div className="flex items-center gap-2 text-gray-500 mt-2">
                  <FaCalendarAlt />
                  <span>Joined: {profile?.createdAt}</span>
                </div>
                <span className="inline-block mt-2 px-4 py-1 bg-indigo-600 text-white rounded-full text-sm">
                  {profile.role}
                </span>
              </>
            )}
          </div>

          <div>
            {editMode ? (
              <>
                <button
                  onClick={handleSave}
                  className="bg-green-600 text-white px-4 py-2 rounded-xl mr-2"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="bg-gray-300 px-4 py-2 rounded-xl"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-xl flex items-center gap-2"
              >
                <FaEdit /> Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
