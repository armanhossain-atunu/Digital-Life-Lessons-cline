import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Star } from "lucide";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router";
import LoadingSpinner from "../../Components/Shared/LoadingSpinner";
import LoveReact from "../../Components/Shared/LikeReact/LoveReact";
import Favorite from "../../Components/Home/Lessons/Favorite";
import ReviewSection from "../../Components/Reviews/ReviewSection";


const PublicLessons = () => {
  const { data = { total: 0, lessons: [] }, isLoading } = useQuery({
    queryKey: ["publicLessons"],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/lessons/public`
      );
      return res.data;
    },
  });

  if (isLoading) {
    return <LoadingSpinner></LoadingSpinner>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl mt-11 font-bold">
          Public Lessons ({data.total})
        </h2>
      </div>

      {/* Lessons Grid */}
      {data.lessons.length === 0 ? (
        <p className="text-center text-gray-500">
          No public lessons available
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {data.lessons.map((lesson) => (
            <div
              key={lesson._id}
              className="border rounded-xl shadow hover:shadow-lg transition bg-base-200"
            >
              {/* Thumbnail */}
              <img
                src={lesson?.image}
                alt={lesson?.title}
                className="h-44 w-full p-2 object-cover rounded-t-xl"
              />
              <p className="text-sm  bg-purple-500 py-2 px-3 inline-block mx-2 rounded-2xl text-base-500">{lesson?.category}</p>
              {/* Content */}
              <div className="p-4 space-y-2">
                <h3 className="font-semibold text-lg line-clamp-1">
                  {lesson?.title}
                </h3>

                <p className="text-sm text-base-500 line-clamp-2">
                  {lesson?.description}
                </p>

                <div className="flex items-center gap-1">
                  {lesson.averageRating ? (
                    <>
                      {(lesson.averageRating)}
                      <span className="text-sm flex items-center gap-1.5 text-base-500">
                        {lesson.totalRatings} <FaStar className="text-yellow-300"></FaStar> Ratings
                      </span>
                    </>
                  ) : (
                    <span className="text-sm text-base-400">No rating yet</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <LoveReact lessonId={lesson._id} />
                  <Favorite lessonId={lesson._id} />
                </div>
                {/* Reviews Modal */}
                <div className="mt-4">
                  <button
                    className="text-sm text-indigo-600 underline"
                    onClick={() => document.getElementById(`review_${lesson?._id}`).showModal()}
                  >
                    View Reviews
                  </button>
                  <dialog id={`review_${lesson?._id}`} className="modal">
                    <div className="modal-box">
                      <ReviewSection lessonId={lesson?._id} />
                      <div className="modal-action">
                        <form method="dialog">
                          <button className="btn">Close</button>
                        </form>
                      </div>
                    </div>
                  </dialog>
                </div>



                {/* Button */}
                <Link to={`/lesson-details/${lesson._id}`} className="btn btn-primary w-full mt-3">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PublicLessons;
