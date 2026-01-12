import { useQuery } from "@tanstack/react-query";
import { FaHeart, FaRegThumbsUp } from "react-icons/fa";
import useAuth from "../../Hooks/useAuth";
import Container from "../../Components/Shared/Container";
import LoadingSpinner from "../../Components/Shared/LoadingSpinner";
import Pagination from "../../Components/Shared/Pagination";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import toast from "react-hot-toast";

const MyLessons = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Fetch lessons
  const {
    data: lessons = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["myLessons", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/lessons?email=${user.email}`
      );
      return res.data;
    },
  });

  // Pagination
  const totalPages = Math.ceil(lessons.length / itemsPerPage);
  const displayedLessons = lessons.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Delete handler
  const handleDelete = (id) => {
    toast((t) => (
      <div className="p-4 bg-base-200 rounded-lg shadow-lg">
        <p className="font-medium">Delete this lesson permanently?</p>
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={async () => {
              await axiosSecure.delete(`/lessons/${id}`, {
                data: {
                  email: user.email,
                  role: user.role,
                },
              });
              toast.dismiss(t.id);
              toast.success("Lesson deleted");
              refetch();
            }}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Yes, Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-4 py-2 bg-base-300 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    ), { duration: Infinity });
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <Container className="mb-10">
      <h2 className="text-3xl mt-6 font-bold text-center mb-4">
        My Lessons
      </h2>

      {lessons.length === 0 && (
        <div className="text-center text-base-500 py-5">
          <h3 className="text-2xl font-semibold">No lessons found</h3>
        </div>
      )}

    {lessons.length > 0 && (
  <div className="w-full overflow-x-auto mt-6">
    <table className="w-full table-auto mb-6 border">
      <thead className="bg-gray-100">
        <tr>
          <th className="border p-2">Image</th>
          <th className="border p-2">Title</th>
          <th className="border p-2">Visibility</th>
          <th className="border p-2">Access</th>
          <th className="border p-2">Created</th>
          <th className="border p-2">Actions</th>
        </tr>
      </thead>

      <tbody>
        {displayedLessons.map((lesson) => (
          <tr key={lesson._id} className="text-center">
            <td className="border p-2">
              <img
                src={lesson.image}
                className="w-16 h-16 object-cover rounded mx-auto"
              />
            </td>
            <td className="border p-2 font-semibold whitespace-nowrap">
              {lesson.title}
            </td>
            <td className="border p-2">
              {lesson.isPublic ? "Public" : "Private"}
            </td>
            <td className="border p-2">
              {lesson.accessLevel}
            </td>
            <td className="border p-2 whitespace-nowrap">
              {new Date(lesson.createdAt).toLocaleDateString()}
            </td>

            <td className="border p-2 space-x-2 whitespace-nowrap">
              <button
                onClick={() => navigate(`/lesson-details/${lesson._id}`)}
                className="px-2 py-1 bg-blue-500 text-white rounded"
              >
                Details
              </button>

              <Link
                to={`/UpdateLesson/${lesson._id}`}
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
