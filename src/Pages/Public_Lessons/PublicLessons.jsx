import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import Container from "../../Components/Shared/Container";
import { Link } from "react-router";
import LoadingSpinner from "../../Components/Shared/LoadingSpinner";
import Pagination from "../../Components/Shared/Pagination";
import SkeletonCard from "../../Components/Shared/SkeletonCard/SkeletonCard";

const PublicLessons = () => {
  const [categoryFilter, setCategoryFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Fetch all lessons for filtering
  const { data: allData, isLoading } = useQuery({
    queryKey: ["public-lessons"],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/lessons/public`);
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </Container>
    );
  }

  // Extract unique categories for dropdown
  const categories = allData?.lessons
    ? [...new Set(allData.lessons.map((lesson) => lesson.category))]
    : [];

  // Filter lessons by selected category
  const filteredLessons = categoryFilter
    ? allData.lessons.filter((lesson) => lesson.category === categoryFilter)
    : allData.lessons;

  // Pagination logic
  const totalPages = Math.ceil(filteredLessons.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentLessons = filteredLessons.slice(startIndex, startIndex + itemsPerPage);

  const handleCategoryChange = (e) => {
    setCategoryFilter(e.target.value);
    setCurrentPage(1); // Reset to page 1 when filter changes
  };

  const onPageChange = (pageNum) => {
    setCurrentPage(pageNum);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Container>
      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-4 mt-16 text-center">Public Lessons</h1>
      <p className="text-xl font-medium text-center mb-6">
        Knowledge For Everyone, Everywhere
      </p>

      {/* Category Filter */}
      <div className="text-end mb-6">
        <select
          className="select select-bordered w-60"
          value={categoryFilter}
          onChange={handleCategoryChange}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentLessons.length > 0 ? (
          currentLessons.map((lesson) => (
            <div
              key={lesson._id}
              className="bg-base-200 h-full p-6 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 flex flex-col"
            >
              <img
                src={lesson.image || "/placeholder.jpg"}
                alt={lesson.title}
                className="w-full h-52 md:h-48 lg:h-56 object-cover rounded-xl mb-4"
              />

              <div className="flex justify-between items-center mb-2">
                <p className="text-xs md:text-sm font-semibold bg-purple-500 py-1 px-3 rounded-full text-base-100">
                  {lesson.category}
                </p>

                <div className="flex items-center gap-3">
                  <h1 className="text-xs md:text-sm font-medium">{lesson.authorName}</h1>
                  <img
                    src={lesson.authorImage || "/avatar.png"}
                    alt={lesson.authorName}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                </div>
              </div>

              <h2 className="text-lg md:text-xl font-semibold mb-2">{lesson.title}</h2>

              <p className="text-base-600 text-sm md:text-base mb-4 line-clamp-3">
                {lesson.description?.slice(0, 150)}...
                <Link
                  to={`/lesson-details/${lesson._id}`}
                  className="text-blue-500 ml-1 font-medium"
                >
                  more
                </Link>
              </p>

              <Link
                to={`/lesson-details/${lesson._id}`}
                className="btn btn-primary w-full mt-auto"
              >
                View Details
              </Link>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            No lessons found.
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </Container>
  );
};

export default PublicLessons;
