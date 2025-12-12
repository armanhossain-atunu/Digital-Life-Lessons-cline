import { useQuery } from "@tanstack/react-query";
import { FaHeart, FaRegHeart, FaRegThumbsUp } from "react-icons/fa";
import useAuth from "../../Hooks/useAuth";
import axios from "axios";
import Container from "../../Components/Shared/Container";
import Comments from "../../Components/Shared/Comments/Comments";

const MyLessons = () => {
  const { user } = useAuth();

  // Fetch lessons from API
const { data : lessons = [], isLoading,error } = useQuery({
  queryKey: ["myLessons", user?.email],
  queryFn: async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/lessons?email=${user?.email}`);
    return res.data;
  },
});

  return (
    <Container className="mb-10">
      <h2 className="text-3xl  mt-20 font-bold text-center mb-4">My Lessons</h2>
      {isLoading && <p>Loading...</p>}
      {error && <p>{error.message}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-4">
        {lessons.map((lesson) => (
          <div
            key={lesson._id}
            className="border border-gray-300 rounded-lg p-4 shadow hover:shadow-lg transition"
          >
            <img src={lesson.image} alt={lesson.title} className="w-full h-60 object-cover rounded-2xl mb-2 " />
            <h3 className="text-lg font-semibold mb-2">{lesson.title}</h3>
            <p className="text-gray-600">{lesson.description}</p>
            <div className="flex items-center mt-2">
              <FaRegThumbsUp className="mr-2" />
              <span className="text-gray-600">{lesson.likes}</span>
            </div>
            <div className="flex items-center mt-2">
              <FaHeart className="mr-2" />
              <span className="text-gray-600">{lesson.dislikes}</span>
            </div>
            <Comments postId={lesson._id}></Comments>
          </div>
        ))}
      </div>
    </Container>
  );
};

export default MyLessons;
