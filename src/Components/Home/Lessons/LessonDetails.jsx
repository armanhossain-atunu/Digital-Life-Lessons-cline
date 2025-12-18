import { Link, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import LoadingSpinner from "../../Shared/LoadingSpinner";
import Container from "../../Shared/Container";

const LessonCard = ({ lesson }) => {
  return (
    <Link to={`/lesson-details/${lesson._id}`} className="card bg-base-100 shadow hover:shadow-xl transition">
      <figure>
        <img
          src={lesson.image}
          alt={lesson.title}
          className="h-40 w-full object-cover"
        />
      </figure>
      
      <div className="card-body">
        <h2 className="card-title text-lg">{lesson.title}</h2>
        <p className="text-sm text-base-600">{lesson.category}</p>
      </div>
    </Link>
  );
};

const LessonDetails = () => {
  const { id } = useParams();

  // Single lesson
  const { data: lesson, isLoading, isError } = useQuery({
    queryKey: ["lessonDetails", id],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/lessons/${id}`
      );
      return res.data;
    },
    enabled: !!id,
  });

  // Similar lessons (category based)
  const {
    data: similarLessons = [],
    isLoading: similarLoading,
  } = useQuery({
    queryKey: ["similarLessons", id],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/lessons/similar/${id}`
      );
      return res.data;
    },
    enabled: !!id,
  });

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <p className="text-red-500">Lesson load failed</p>;

  return (
    <Container>
      {/* Lesson Details */}
      <h1 className="text-3xl text-center mt-20 font-bold">
        Lesson Details
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        {lesson.image && (
          <img
            src={lesson.image}
            alt={lesson.title}
            className="w-full h-64 md:h-96 object-cover rounded-2xl shadow"
          />
        )}

        <div className="bg-base-200 p-6 rounded-2xl shadow">
          <h2 className="text-3xl font-bold mb-4">{lesson.title}</h2>

          <div className="flex flex-wrap gap-2 mb-4">
            <span className="badge badge-outline">
              Category: {lesson.category}
            </span>
            <span className="badge badge-outline">
              Tone: {lesson.tone}
            </span>
            <span className="badge badge-outline">
              Access: {lesson.accessLevel}
            </span>
          </div>

          <p>{lesson.description}</p>
        </div>
      </div>

      {/*  Similar Lessons Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">
          Similar Lessons (Category Based)
        </h2>

        {similarLoading ? (
          <LoadingSpinner />
        ) : similarLessons.length === 0 ? (
          <p className="text-base-500">No similar lessons found</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {similarLessons.map((item) => (
              <LessonCard key={item._id} lesson={item} />
            ))}
          </div>
        )}
      </div>
    </Container>
  );
};

export default LessonDetails;
