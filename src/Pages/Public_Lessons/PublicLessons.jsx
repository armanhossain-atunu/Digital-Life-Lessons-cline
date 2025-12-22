import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Container from "../../Components/Shared/Container";
import { Link } from "react-router";

const PublicLessons = () => {
  const { data = { total: 0, lessons: [] }, isLoading } = useQuery({
    queryKey: ["public-lessons"],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/lessons/public`
      );
      return res.data;
    },
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <Container>
      <h1 className="text-3xl font-bold mb-4 mt-17 text-center"> Public Lessons </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.lessons.map((lesson) => (
          <div key={lesson._id} className="bg-base-200 h-full p-4 rounded shadow">
            <img src={lesson.image} alt={lesson.title} className="w-full h-48" />
            <div className="flex justify-between items-center">
              <p className="text-sm bg-purple-500 mt-2 py-1 px-3 inline-block  rounded-2xl text-white">
                {lesson.category}
              </p>
              <div className="flex items-center mt-1 gap-3">
                <h1 className="text-sm font-medium">{lesson.authorName}</h1>
                <img
                  src={lesson.authorImage || "/avatar.png"}
                  alt={lesson.authorName}
                  className="h-10 w-10 rounded-full object-cover"
                />
              </div>
            </div>
            <p className="text-sm text-gray-500">
              {new Date(lesson.createdAt).toLocaleDateString()}
            </p>
            <p>{lesson.accessLevel}</p>
            <p>{lesson.tone}</p>
            <h2 className="text-xl font-semibold">{lesson.title}</h2>
            <p className="text-gray-600 mt-2">
              {lesson.description && `${lesson.description?.slice(0, 100)}...`}
              <Link to={`/lesson-details/${lesson._id}`} className="text-blue-500" >more</Link>
            </p>
            {/* Details */}
            <Link
              to={`/lesson-details/${lesson._id}`}
              className="btn btn-primary w-full mt-3"
            >
              View Details
            </Link>
          </div>

        ))}

      </div>
    </Container >
  );
};

export default PublicLessons;
