import { Link, useParams } from "react-router";
import useLessons from "../../Hooks/ShareAllApi/useLessons";
import useUsers from "../../Hooks/ShareAllApi/useUsers";
import LoadingSpinner from "../../Components/Shared/LoadingSpinner";
import Container from "../../Components/Shared/Container";
import Pagination from "../../Components/Shared/Pagination";
import { useState } from "react";
// import useAuth from "../../Hooks/useAuth";

const AuthorLessons = () => {
  const { authorEmail } = useParams();
  // const{user}=useAuth()
  const [currentPage, setCurrentPage] = useState(1);

  const { data: lessons = [], isLoading } = useLessons();
  const { data: users = [], isLoading: userLoading } = useUsers();

  if (isLoading || userLoading) return <LoadingSpinner />;

  // Find author
  const authorUser = users.find((u) => u.email === authorEmail);

  if (!authorUser) {
    return (
      <Container>
        <p className="mt-20 text-center text-red-500">
          Author not found
        </p>
      </Container>
    );
  }

  // Access logic
  // const isAdmin = authorUser.role === "admin";
  // const isPremium = authorUser.plan === "premium";
  // const isOwner = user?.email === authorEmail;


  // if (!isAdmin && !isPremium && !isOwner) {
  //   return (
  //     <Container>
  //       <p className="mt-20 text-center text-red-500">
  //         Access denied. Only Admin or Premium authors can share lessons.
  //       </p>
  //     </Container>
  //   );
  // }

  // Author lessons
  const authorLessons = lessons.filter(
    (lesson) => lesson.authorEmail === authorEmail
  );

  // Pagination
  const itemsPerPage = 6;
  const totalPages = Math.ceil(authorLessons.length / itemsPerPage);
  const displayedLessons = authorLessons.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Container>
      {/* Author Info */}
      <div className="flex flex-col items-center space-y-1 ">
        <img
          src={authorUser.photoURL || "/avatar.png"}
          alt={authorUser.name}
          className="w-20 h-20 mt-20 rounded-full"
        />
        <h1 className="text-3xl font-bold">{authorUser.name}</h1>
        <p className="text-gray-600">{authorUser.email}</p>
        <p>Plan: <b>{authorUser.plan}</b></p>
      </div>
      <hr className="mb-10" />

      {/* Lessons */}
      {authorLessons.length === 0 ? (
        <p className="text-center text-gray-500">
          No lessons found.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedLessons.map((lesson) => (
            <div
              key={lesson._id}
              className="border rounded-lg shadow hover:shadow-lg transition p-5 bg-base-200"
            >
              <img
                src={lesson.image}
                alt={lesson.title}
                className="h-40 w-full object-cover rounded mb-3"
              />

              <h3 className="text-lg font-semibold text-purple-700 mb-2">
                {lesson.title}
              </h3>

              <p className="text-gray-600 mb-3">
                {lesson.description?.slice(0, 100)}...
              </p>

              <p className="text-sm text-gray-500 mb-4">
                Created: {new Date(lesson.createdAt).toLocaleDateString()}
              </p>

              <Link
                to={`/lesson-details/${lesson._id}`}
                className="inline-block px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
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