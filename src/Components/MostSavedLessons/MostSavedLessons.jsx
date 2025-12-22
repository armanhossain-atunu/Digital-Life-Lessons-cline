import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import LoadingSpinner from "../Shared/LoadingSpinner";
import Container from "../Shared/Container";

const MostSavedLessons = () => {
  const axiosSecure = useAxiosSecure();

  // Fetch favorites
  const {
    data: favorites = [],
    isLoading: favLoading,
  } = useQuery({
    queryKey: ["favorites"],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `${import.meta.env.VITE_API_URL}/Favorite`
      );
      return res.data;
    },
    refetchInterval: 5000,
  });

  // Fetch lessons
  const { data: lessons = [], isLoading: lessonLoading } = useQuery({
    queryKey: ["lessons"],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `${import.meta.env.VITE_API_URL}/lessons`
      );
      return res.data;
    },
  });

  if (favLoading || lessonLoading) return <LoadingSpinner />;

  // Merge lessons with favorite count
  const mostSavedLessons = lessons
    .map((lesson) => {
      const fav = favorites.find((f) => f.lessonId === lesson._id);
      return {
        ...lesson,
        favoritedBy: fav?.favoritedBy || [],
        favoriteCount: fav?.favoritedBy?.length || 0,
      };
    })
    .filter((lesson) => lesson.favoriteCount > 0)
    .sort((a, b) => b.favoriteCount - a.favoriteCount)
    .slice(0, 6);

  return (
    <Container className="mt-20">
      <h2 className="text-3xl font-bold text-center mb-8">
        Most Saved Lessons
      </h2>

      {mostSavedLessons.length === 0 ? (
        <p className="text-center text-gray-500">No saved lessons found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mostSavedLessons.map((lesson) => (
            <div key={lesson._id} className="card shadow p-4 rounded-lg border">
              <h3 className="font-bold text-lg">{lesson.title}</h3>

              <div className="mt-2 text-sm text-gray-600">
                <p>
                  🔖 Saved by:{" "}
                  {lesson.favoritedBy.slice(0, 3).join(", ")}
                  {lesson.favoritedBy.length > 3
                    ? ` +${lesson.favoritedBy.length - 3} more`
                    : ""}
                </p>
                <p>Total Saves: {lesson.favoriteCount}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Container>
  );
};

export default MostSavedLessons;
