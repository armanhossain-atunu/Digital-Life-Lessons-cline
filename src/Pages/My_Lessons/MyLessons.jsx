import { useQuery } from "@tanstack/react-query";
import { FaHeart, FaRegHeart, FaRegThumbsUp } from "react-icons/fa";
import useAuth from "../../Hooks/useAuth";
import axios from "axios";
import Container from "../../Components/Shared/Container";
import LoadingSpinner from "../../Components/Shared/LoadingSpinner";
import Pagination from "../../Components/Shared/Pagination";
import { useState } from "react";
import { Link } from "react-router";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const MyLessons = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure()
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Fetch lessons
  const { data: lessons = [], isLoading, error } = useQuery({
    queryKey: ["myLessons", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `${import.meta.env.VITE_API_URL}/lessons?email=${user?.email}`
      );
      return res.data;
    },
  });

  // Pagination logic
  const totalPages = Math.ceil(lessons.length / itemsPerPage);
  const displayedLessons = lessons.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this lesson permanently?")) {
      await axios.delete(`${import.meta.env.VITE_API_URL}/lessons/${id}`);
      window.location.reload()
    }
  };

  // const handleUpdate = (lesson) => {

  //   console.log("Update lesson:", lesson);
  // };

  return (
    <Container className="mb-10">
      <h2 className="text-3xl mt-20 font-bold text-center mb-4">My Lessons</h2>

      {isLoading && <LoadingSpinner />}
      {error && <p className="text-center text-red-500">{error.message}</p>}

      {!isLoading && lessons.length === 0 && (
        <div className="text-center text-gray-500 py-20">
          <h3 className="text-2xl font-semibold">No lessons found</h3>
          <p className="mt-2">You haven’t created any lessons yet.</p>
        </div>
      )}

      {/* Table View */}
      {lessons.length > 0 && (
        <div className="overflow-x-auto mt-6">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Image</th>
                <th className="border p-2">Title</th>
                <th className="border p-2">Visibility</th>
                <th className="border p-2">Access Level</th>
                <th className="border p-2">Created At</th>
                <th className="border p-2">Reactions</th>
                <th className="border p-2">Favorites</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedLessons.map((lesson) => (
                <tr key={lesson._id} className="text-center">
                  <td className="border p-2">
                    <img
                      src={lesson.image || "/placeholder.jpg"}
                      alt={lesson.title}
                      className="w-20 h-20 object-cover rounded"
                    />
                  </td>
                  <td className="border p-2 font-semibold">{lesson.title}</td>
                  <td className="border p-2">
                    <select
                      defaultValue={lesson.isPublic ? "Public" : "Private"}
                      onChange={(e) =>
                        axios.patch(
                          `${import.meta.env.VITE_API_URL}/lessons/${lesson._id}`,
                          { isPublic: e.target.value === "Public" }
                        )
                      }
                      className="border rounded px-2 py-1"
                    >
                      <option value="Public">Public</option>
                      <option value="Private">Private</option>
                    </select>
                  </td>
                  <td className="border p-2">
                    <select
                      defaultValue={lesson.accessLevel}
                      disabled={user?.role !== "Premium"}
                      title={
                        user?.role !== "Premium"
                          ? "Upgrade to Premium to change access level"
                          : ""
                      }
                      onChange={(e) =>
                        axios.patch(
                          `${import.meta.env.VITE_API_URL}/lessons/${lesson._id}`,
                          { accessLevel: e.target.value }
                        )
                      }
                      className="border rounded px-2 py-1"
                    >
                      <option value="Free">Free</option>
                      <option value="Premium">Premium</option>
                    </select>
                  </td>
                  <td className="border p-2">{lesson.createdAt}</td>
                  <td className="border p-2 flex justify-center items-center gap-2">
                    <FaRegThumbsUp /> {lesson.reactionsCount || 0}
                  </td>
                  <td className="border p-2 flex justify-center items-center gap-2">
                    <FaHeart className="text-red-500" /> {lesson.favoritesCount || 0}
                  </td>
                  <td className="border p-2 space-x-2">
                    <button
                      onClick={() => console.log("Details:", lesson)}
                      className="px-2 py-1 bg-blue-500 text-white rounded"
                    >
                      Details
                    </button>
                    <Link
                      to={`/lessonsUpdate/${lesson._id}`}
                      className="px-2 py-1 bg-yellow-500 text-white rounded"
                    >
                      Update
                    </Link>
                    <button
                      onClick={() => handleDelete(lesson._id)}
                      className="px-2 py-1 bg-red-500 text-white rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {lessons.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </Container>
  );
};

export default MyLessons;
