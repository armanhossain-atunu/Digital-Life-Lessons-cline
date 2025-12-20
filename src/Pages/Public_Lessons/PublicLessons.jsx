import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router";
import { useState } from "react";
import LoadingSpinner from "../../Components/Shared/LoadingSpinner";
import LoveReact from "../../Components/Shared/LikeReact/LoveReact";
import FavoriteButton from "../../Components/Home/Lessons/Favorite";
import ReviewSection from "../../Components/Reviews/ReviewSection";
import useAuth from "../../Hooks/useAuth";

const PublicLessons = () => {
  const { user } = useAuth();

  // 🔹 State
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [tone, setTone] = useState("");
  const [sort, setSort] = useState("newest");

  const { data = { total: 0, lessons: [] }, isLoading } = useQuery({
    queryKey: ["publicLessons", search, category, tone, sort],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/lessons/public`,
        {
          params: { search, category, tone, sort },
        }
      );
      return res.data;
    },
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* 🔹 Header */}
      <h2 className="text-2xl mt-11 font-bold mb-6">
        Public Lessons ({data.total})
      </h2>

      {/* 🔹 Search + Filter + Sort */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        {/* Search */}
        <input
          type="text"
          placeholder="Search by title or keyword..."
          className="input input-bordered w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Category Filter */}
        <select
          className="select select-bordered w-full"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Personal Growth">Personal Growth</option>
          <option value="Career">Career</option>
          <option value="Mindset">Mindset</option>
          <option value="Relationships">Relationships</option>
        </select>

        {/* Emotional Tone Filter */}
        <select
          className="select select-bordered w-full"
          value={tone}
          onChange={(e) => setTone(e.target.value)}
        >
          <option value="">All Emotional Tones</option>
          <option value="Motivational">Motivational</option>
          <option value="Realization">Realization</option>
          <option value="Sad">Sad</option>
          <option value="Gratitude">Gratitude</option>
        </select>

        {/* Sort */}
        <select
          className="select select-bordered w-full"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="newest">Newest</option>
          <option value="mostSaved">Most Saved</option>
        </select>
      </div>

      {/* 🔹 Lessons Grid */}
      {data.lessons.length === 0 ? (
        <p className="text-center text-gray-500">
          No public lessons found
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

              <p className="text-sm bg-purple-500 py-1 px-3 inline-block mx-2 rounded-2xl text-white">
                {lesson?.category}
              </p>

              <div className="p-4 space-y-2">
                <h3 className="font-semibold text-lg line-clamp-1">
                  {lesson?.title}
                </h3>

                <p className="text-sm text-base-500 line-clamp-2">
                  {lesson?.description}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-1">
                  {lesson.averageRating ? (
                    <>
                      {lesson.averageRating}
                      <span className="text-sm flex items-center gap-1.5 text-base-500">
                        {lesson.totalRatings}
                        <FaStar className="text-yellow-400" />
                      </span>
                    </>
                  ) : (
                    <span className="text-sm text-base-400">
                      No rating yet
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <LoveReact lessonId={lesson._id} />
                  <FavoriteButton lessonId={lesson._id} user={user} />
                </div>

                {/* Reviews */}
                <button
                  className="text-sm text-indigo-600 underline"
                  onClick={() =>
                    document
                      .getElementById(`review_${lesson._id}`)
                      .showModal()
                  }
                >
                  View Reviews
                </button>

                <dialog id={`review_${lesson._id}`} className="modal">
                  <div className="modal-box">
                    <ReviewSection lessonId={lesson._id} />
                    <div className="modal-action">
                      <form method="dialog">
                        <button className="btn">Close</button>
                      </form>
                    </div>
                  </div>
                </dialog>

                {/* Details */}
                <Link
                  to={`/lesson-details/${lesson._id}`}
                  className="btn btn-primary w-full mt-3"
                >
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
