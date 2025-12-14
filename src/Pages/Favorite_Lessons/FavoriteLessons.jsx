import React from "react";
import Container from "../../Components/Shared/Container";
import useAuth from "../../Hooks/useAuth";
import { Link } from "react-router"; // Fixed: was "react-router" → "react-router-dom"
import useFavoriteLessons from "../../Hooks/ShareAllApi/useFavoriteLessons";
import LoadingSpinner from "../../Components/Shared/LoadingSpinner";

const FavoriteLessons = () => {
  const { user } = useAuth();
  const { favoriteLessons, isLoading, error } = useFavoriteLessons();

  if (!user)
    return (
      <Container>
        <p className="mt-20 text-center">Please login to see your favorite lessons.</p>
      </Container>
    );

  if (isLoading) return <LoadingSpinner />;

  if (error)
    return (
      <Container>
        <p className="mt-20 text-center text-red-500">Failed to load favorites</p>
      </Container>
    );

  return (
    <Container>
      <h1 className="text-3xl mt-20 text-center font-semibold mb-8">
        Favorite Lessons ({favoriteLessons.length})
      </h1>

      {favoriteLessons.length === 0 ? (
        <p className="text-center text-gray-500 mb-10">
          You have no favorite lessons yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse border border-base-300">
            <thead>
              <tr className="bg-indigo-50 text-left">
                <th className="px-6 py-4 border border-base-300">Image</th>
                <th className="px-6 py-4 border border-base-300">Category</th>
                <th className="px-6 py-4 border border-base-300">Title</th>
                <th className="px-6 py-4 border border-base-300">Description</th>
                <th className="px-6 py-4 border border-base-300">Tone</th>
                <th className="px-6 py-4 border border-base-300 text-center">Access</th>
                <th className="px-6 py-4 border border-base-300 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {favoriteLessons.map((lesson) => {
                const isPremiumLocked = lesson.accessLevel === "premium" && !user.isPremium;

                return (
                  <tr
                    key={lesson._id}
                    className={`hover:bg-base-100 transition ${isPremiumLocked ? "opacity-70" : ""}`}
                  >
                    {/* Image */}
                    <td className="px-6 py-4 border border-base-300">
                      {lesson.image ? (
                        <img
                          src={lesson.image}
                          alt={lesson.title}
                          className="w-24 h-16 object-cover rounded-md"
                        />
                      ) : (
                        <div className="w-24 h-16 bg-gray-200 rounded-md flex items-center justify-center text-gray-500 text-sm">
                          No image
                        </div>
                      )}
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4 border border-base-300">
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-600 text-sm rounded-full">
                        {lesson.category}
                      </span>
                    </td>

                    {/* Title */}
                    <td className="px-6 py-4 border border-base-300 font-semibold">
                      {lesson.title}
                    </td>

                    {/* Description */}
                    <td className="px-6 py-4 border border-base-300 text-sm text-base-600 max-w-md">
                      {lesson.description}
                    </td>

                    {/* Tone */}
                    <td className="px-6 py-4 border border-base-300 text-sm">
                      {lesson.emotionalTone || lesson.tone || "-"}
                    </td>

                    {/* Access Level */}
                    <td className="px-6 py-4 border border-base-300 text-center">
                      {lesson.accessLevel === "premium" ? (
                        <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs rounded-full">
                          Premium
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                          Free
                        </span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="px-6 py-4 border border-base-300 text-center">
                      {isPremiumLocked ? (
                        <span className="text-sm text-gray-600">
                          Upgrade to view
                        </span>
                      ) : (
                        <Link
                          to={`/lesson-details/${lesson._id}`}
                          className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition inline-block"
                        >
                          View Details
                        </Link>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Container>
  );
};

export default FavoriteLessons;