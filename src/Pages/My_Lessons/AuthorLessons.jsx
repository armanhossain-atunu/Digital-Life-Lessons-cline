import { Link, useParams, Navigate } from "react-router";
import useLessons from "../../Hooks/ShareAllApi/useLessons";
import useUsers from "../../Hooks/ShareAllApi/useUsers"; // 
import LoadingSpinner from "../../Components/Shared/LoadingSpinner";
import Container from "../../Components/Shared/Container";
import Pagination from "../../Components/Shared/Pagination";
import { useState } from "react";

const AuthorLessons = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { authorEmail } = useParams();
  const { data: lessons = [], isLoading } = useLessons();
  const { data: users = [], isLoading: userLoading } = useUsers();

  if (isLoading || userLoading) return <LoadingSpinner />;

 
  const authorUser = users.find((u) => u.email === authorEmail);

 
  if (!authorUser || (authorUser.role !== "admin" && authorUser.plan !== "premium")) {
    return (
      <Container>
        <p className="mt-20 text-center text-red-500">
          Access denied. Only premium or admin authors can share lessons.
        </p>
      </Container>
    );
  }

  const authorLessons = lessons.filter((l) => l.authorEmail === authorEmail);

  // Pagination logic
  const itemsPerPage = 6;
  const totalPages = Math.ceil(authorLessons.length / itemsPerPage);
  const displayedLessons = authorLessons.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Container>
      <h2 className="text-2xl mt-20 font-bold mb-6">
        Lessons Author: {authorEmail}
      </h2>
      {authorLessons.length === 0 ? (
        <p>No lessons found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedLessons.map((lesson) => (
            <div
              key={lesson._id}
              className="border rounded-lg shadow hover:shadow-lg transition p-5 bg-white"
            >
              <h3 className="text-lg font-semibold text-purple-700 mb-2">
                {lesson.title}
              </h3>
              <img src={lesson.image} alt="" />
              <p className="text-gray-600 mb-3">{lesson.description}</p>
              <div className="text-sm mb-5 text-gray-500">
                <p>Author: {lesson.authorEmail}</p>
                <p>Created: {lesson.createdAt}</p>
              </div>
              <Link
                to={`/lesson-details/${lesson._id}`}
                className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {authorLessons.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </Container>
  );
};

export default AuthorLessons;
