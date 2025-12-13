import React from "react";
import Container from "../../Components/Shared/Container";
import useAuth from "../../Hooks/useAuth";
import { Link } from "react-router";
import useFavoriteLessons from "../../Hooks/ShareAllApi/useFavoriteLessons";
import LoadingSpinner from "../../Components/Shared/LoadingSpinner";

const FavoriteLessons = () => {
  const { user } = useAuth();
  //favoriteLessons is the array of favorite lessons
  const { favoriteLessons, isLoading, error } = useFavoriteLessons()

  if (!user) return <Container><p className="mt-20 text-center">Please login to see your favorite lessons.</p></Container>;
  if (isLoading) return <LoadingSpinner />
  if (error) return <Container><p className="mt-20 text-center text-red-500">Failed to load favorites</p></Container>;

  return (
    <Container>
      <h1 className="text-2xl mt-20 text-center font-semibold mb-6">
        Favorite Lessons ({favoriteLessons.length})
      </h1>

      {favoriteLessons.length === 0 && (
        <p className="text-center text-gray-500">You have no favorite lessons yet.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {favoriteLessons.map((lesson) => (
          <div
            key={lesson._id}
            className="bg-base-100 shadow-md hover:shadow-lg transition rounded-2xl p-5 border border-base-200 relative"
          >
            {/* Premium Overlay */}
            {lesson.accessLevel === "premium" && !user.isPremium && (
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-white font-bold rounded-2xl z-10">
                Premium Lesson - Upgrade to view
              </div>
            )}

            {/* Image */}
            {lesson.image && (
              <img
                src={lesson.image}
                alt={lesson.title}
                className="w-full h-48 object-cover rounded-xl mb-4"
              />
            )}

            {/* Category Badge */}
            <span className="px-3 py-1 bg-indigo-100 text-indigo-600 text-sm rounded-full">
              {lesson.category}
            </span>

            {/* Title */}
            <h3 className="text-2xl font-bold mt-3 text-base-800">{lesson.title}</h3>

            {/* Short Description */}
            <p className="text-base-600 mt-2">
              {lesson.description.length > 120
                ? lesson.description.slice(0, 120) + "..."
                : lesson.description}
            </p>

            {/* Footer */}
            <div className="flex justify-between items-center mt-4">
              <p className="text-sm text-base-500">
                Tone: {lesson.emotionalTone || lesson.tone}
              </p>

              <Link
                to={`/lesson-details/${lesson._id}`}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
};

export default FavoriteLessons;
