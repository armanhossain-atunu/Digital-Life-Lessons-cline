import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Container from "../../Shared/Container";
import { MdDeleteForever, MdEdit, MdFavorite } from "react-icons/md";
import toast from "react-hot-toast";
import LoadingSpinner from "../../Shared/LoadingSpinner";
import Comments from "../../Shared/Comments/Comments";
import LoveReact from "../../Shared/LikeReact/LoveReact";
import useAuth from "../../../Hooks/useAuth";
import { useState, useEffect } from "react";
import FavoriteLessons from "./Favorite";
import { Link, useNavigate } from "react-router";
import Search from "./Search";
import ReportLesson from "../../../Pages/Reports/ReportLesson";
import ReviewSection from "../../Reviews/ReviewSection";
import Lottie from "lottie-react";

const Lessons = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [expanded, setExpanded] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [completedLesson, setCompletedLesson] = useState(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const itemsPerPage = 6;

  // Fetch user role
  const { data: userData } = useQuery({
    queryKey: ["userRole", user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/user?email=${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  const role = userData?.role?.toLowerCase();
  const isAdmin = role === "admin";
  const isPremium = (userData?.plan || "free").toLowerCase() === "premium";

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Fetch lessons
  const { data: lessons = [], isLoading, error } = useQuery({
    queryKey: ["lessons"],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/lessons`);
      return res.data;
    },
  });

  // Fetch user's favorite lessons
  const { data: favoriteLessons = [] } = useQuery({
    queryKey: ["favoriteLessons", user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/favorites?email=${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  const isFavorited = (lessonId) => {
    return favoriteLessons.some((fav) => fav.lessonId === lessonId || fav._id === lessonId);
  };

  // Filter and paginate lessons
  const filteredLessons = lessons.filter((lesson) =>
    lesson.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredLessons.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedLessons = filteredLessons.slice(startIndex, endIndex);

  // // Reset to page 1 when search term changes
  // useEffect(() => {
  //   setCurrentPage(1);
  // }, [searchTerm]);

  // Hide animation after 2 seconds
  useEffect(() => {
    if (showAnimation) {
      const timer = setTimeout(() => {
        setShowAnimation(false);
        setCompletedLesson(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showAnimation]);

  // Delete Mutation
  const deleteLessonMutation = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`${import.meta.env.VITE_API_URL}/lessons/${id}`);
    },
    onSuccess: (_, id) => {
      queryClient.setQueryData(["lessons"], (old = []) =>
        old.filter((lesson) => lesson._id !== id)
      );
      toast.success("Lesson deleted successfully!");
    },
  });

  const handleDelete = (id) => {
    toast((t) => (
      <div className="p-4 bg-white rounded-lg shadow-lg">
        <p className="font-medium">Delete this lesson permanently?</p>
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={() => {
              deleteLessonMutation.mutate(id);
              toast.dismiss(t.id);
            }}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Yes, Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    ), { duration: Infinity });
  };

  const handlePayment = async (lesson) => {
    if (!user) {
      toast.error("Please login first!");
      navigate("/auth/login");
      return;
    }

    const paymentInfo = {
      lessonId: lesson._id,
      name: lesson.title,
      price: lesson.price,
      quantity: 1,
      customer: {
        name: user.displayName || "User",
        email: user.email,
        image: user.photoURL || "",
      },
    };

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/create-checkout-session`,
        paymentInfo
      );

      window.location.assign(data.url);
    } catch (err) {
      toast.error("Payment failed. Try again.");
    }
  };

  const handleLessonCompleted = (lessonTitle) => {
    setCompletedLesson(lessonTitle);
    setShowAnimation(true);
  };

  const handlePaginationChange = (pageNum) => {
    setCurrentPage(pageNum);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <p className="text-center text-red-500">Failed to load lessons.</p>;

  return (
    <Container>
      {/* Success Animation Overlay */}
      {showAnimation && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-8 text-center max-w-sm">
            <FiCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
            <p className="mt-4 text-lg font-semibold text-gray-800">
              Great job! Lesson Completed
            </p>
            <p className="text-gray-600">{completedLesson}</p>
          </div>
        </div>
      )}

      <h1 className="text-3xl font-bold text-center my-8">
        All Lessons ({lessons.length})
      </h1>

      <Search className='flex justify-end' searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-2 gap-6">
        {filteredLessons.length === 0 ? (
          <div className="col-span-full text-center py-20">
            <h2 className="text-2xl font-semibold text-gray-500">Lesson not found</h2>
            <p className="text-gray-400 mt-2">Try searching with different keywords</p>
          </div>
        ) : (
          paginatedLessons.map((lesson) => {
            const {
              _id,
              image,
              title,
              price,
              description,
              accessLevel = "free",
              authorEmail,
              isPublic = false,
            } = lesson;

            const isOwner = authorEmail === user?.email;
            const access = accessLevel.toLowerCase();
            const publicAccess = isPublic === true || String(isPublic).toLowerCase() === "true";
            const locked = access === "premium" && !isPremium && !isAdmin && !isOwner;

            const favorited = isFavorited(_id);

            return (
              <div
                key={_id}
                className="relative bg-white rounded-xl h-[700px] overflow-y-scroll shadow hover:shadow-xl transition-all border overflow-hidden"
              >
                {/* Premium Lock Overlay */}
                {locked && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-white text-center p-6">
                    <span className="text-5xl mb-3">Premium</span>
                    <p className="text-sm mb-4">Upgrade to access this lesson</p>
                    <button
                      onClick={() => handlePayment(lesson)}
                      className="px-6 py-2 bg-purple-600 rounded-lg hover:bg-purple-700"
                    >
                      Upgrade Now (${price})
                    </button>
                  </div>
                )}

                <img
                  src={image || "/placeholder.jpg"}
                  alt={title}
                  className={`w-full h-50 rounded-xl p-2 object-cover ${locked ? "brightness-50" : ""}`}
                />

                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-800">{title}</h3>

                  <p className="text-gray-600 text-sm mt-2">
                    {expanded[_id] ? description : `${description?.slice(0, 100)}...`}
                    <button
                      onClick={() => toggleExpand(_id)}
                      className="text-indigo-600 font-medium ml-1 hover:underline"
                    >
                      {expanded[_id] ? "less" : "more"}
                    </button>
                  </p>

                  <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                    <span>by {authorEmail}</span>
                    <span className="capitalize">{access} • {publicAccess ? "Public" : "Private"}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-3 mt-5">
                    <Link
                      to={`/lesson-details/${_id}`}
                      className={`px-5 py-2 rounded-lg font-medium transition ${locked
                        ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                        : "bg-indigo-600 text-white hover:bg-indigo-700"
                        }`}
                      onClick={(e) => locked && e.preventDefault()}
                    >
                      {locked ? "Locked" : "View Details"}
                    </Link>

                    <div className="flex items-center gap-3">
                      <LoveReact lessonId={_id} />
                    
                      <FavoriteLessons lessonId={_id} />

                      {favorited && (
                        <button
                          onClick={() => {
                            document.querySelector(`[data-lesson-id="${_id}"]`)?.click();
                            toast.success("Removed from favorites");
                          }}
                          className="flex items-center gap-1 px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition text-sm font-medium"
                          title="Remove from Favorites"
                        >
                          <MdFavorite className="text-red-600" />
                          Remove
                        </button>
                      )}

                      {(isOwner || isAdmin) && (
                        <>
                          <button
                            onClick={() => handleDelete(_id)}
                            className="text-red-600 hover:text-red-800 text-2xl"
                            title="Delete Lesson"
                          >
                            <MdDeleteForever />
                          </button>
                          <Link to={`/lessonsUpdate/${_id}`} className="text-blue-600 hover:text-blue-800 text-2xl">
                            <MdEdit />
                          </Link>
                        </>
                      )}

                      <ReportLesson lessonId={_id} />
                    </div>
                  </div>

                  {/* Reviews Modal */}
                  <div className="mt-4">
                    <button
                      className="text-sm text-indigo-600 underline"
                      onClick={() => document.getElementById(`review_${_id}`).showModal()}
                    >
                      View Reviews
                    </button>
                    <dialog id={`review_${_id}`} className="modal">
                      <div className="modal-box">
                        <ReviewSection lessonId={_id} />
                        <div className="modal-action">
                          <form method="dialog">
                            <button className="btn">Close</button>
                          </form>
                        </div>
                      </div>
                    </dialog>
                  </div>

                  <Comments postId={_id} onLessonCompleted={() => handleLessonCompleted(title)} />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination Controls */}
      {filteredLessons.length > 0 && (
        <div className="flex justify-center items-center gap-3 my-10">
          {/* Previous Button */}
          <button
            onClick={() => handlePaginationChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
          >
            Previous
          </button>

          {/* Page Numbers */}
          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePaginationChange(page)}
                className={`px-3 py-2 rounded-lg font-medium transition ${currentPage === page
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
              >
                {page}
              </button>
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={() => handlePaginationChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
          >
            Next
          </button>
        </div>
      )}
    </Container>
  );
};

export default Lessons;