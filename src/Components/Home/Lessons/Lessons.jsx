import { useQuery, } from "@tanstack/react-query";
import Container from "../../Shared/Container";
import toast from "react-hot-toast";
import axios from 'axios';
import LoadingSpinner from "../../Shared/LoadingSpinner";
import Comments from "../../Shared/Comments/Comments";
import LoveReact from "../../Shared/LikeReact/LoveReact";
import useAuth from "../../../Hooks/useAuth";
import { useState, useEffect } from "react";
import Lottie from "lottie-react";
import LoveReactAnimation from "../../../assets/Love_react.json";
import { Link, useNavigate } from "react-router";
import Search from "./Search";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Pagination from "../../Shared/Pagination";
import LessonsByCategory from "../../Shared/LessonsByCategory";

const Lessons = () => {
  // const queryClient = useQueryClient();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure()
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [expanded, setExpanded] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [completedLesson, setCompletedLesson] = useState(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const [play, setPlay] = useState(null)
  const itemsPerPage = 6;

  // Fetch user role
  const { data: userData } = useQuery({
    queryKey: ["userRole", user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const res = await axiosSecure.get(`${import.meta.env.VITE_API_URL}/user?email=${user.email}`);
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
      const res = await axiosSecure.get(`${import.meta.env.VITE_API_URL}/lessons`);
      return res.data;
    },
  });

  // Filter and paginate lessons
  const filteredLessons = lessons.filter((lesson) =>
    lesson.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredLessons.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedLessons = filteredLessons.slice(startIndex, endIndex);


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
    } catch {
      toast.error("Payment failed. Try again.");
    }
  };

  const handleLessonCompleted = (lessonTitle) => {
    setCompletedLesson(lessonTitle);
    setShowAnimation(true);
  };

  const onPageChange = (pageNum) => {
    setCurrentPage(pageNum);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <p className="text-center text-red-500">
    Failed to load lessons. please try again.
    <LoadingSpinner></LoadingSpinner>
  </p>;

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
        Featured Life Lessons({lessons.length})
      </h1>

      <Search className='flex justify-end' searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <LessonsByCategory></LessonsByCategory>

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
              description,
              accessLevel = "free",
              authorEmail,
              createdAt,
            } = lesson;

            const isOwner = authorEmail === user?.email;
            const access = accessLevel.toLowerCase();
            const locked = access === "premium" && !isPremium && !isAdmin && !isOwner;


            return (
              <div
                key={_id}
                className="relative bg-base-300 rounded-xl max-h-[600px] scrollbar-hide overflow-y-auto shadow hover:shadow-xl transition-all border overflow-hidden"
              >
                {/* Premium Lock Overlay */}
                {
                  locked && (
                    <div className="absolute  inset-0 bg-black/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-white text-center p-6">
                      <span className="text-5xl mb-3">Premium</span>
                      <p className="text-sm mb-4">Upgrade to access this lesson</p>
                      <button
                        onClick={() => handlePayment(lesson)}
                        className="px-6 py-2 bg-purple-600 rounded-lg hover:bg-purple-700"
                      >
                        Upgrade Now Pay
                      </button>
                    </div>
                  )
                }

                <img
                  src={image || "/placeholder.jpg"}
                  alt={title}
                  className={`w-full h-50 rounded-xl p-2 object-cover ${locked ? "brightness-50" : ""}`}
                />
                <div className="text-end px-2">
                  <p> {createdAt}</p>
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold text-base-800">{title}</h3>

                  <p className="text-gray-600 text-sm mt-2">
                    {expanded[_id] ? description : `${description?.slice(0, 100)}...`}
                    <button
                      onClick={() => toggleExpand(_id)}
                      className="text-indigo-600 font-medium ml-1 hover:underline"
                    >
                      {expanded[_id] ? "less" : "more"}
                    </button>
                  </p>
                  {/* 
                
                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-3 mt-5">
                    <Link
                      to={`/lesson-details/${_id}`}
                      className={`px-5 py-2 rounded-lg font-medium transition ${locked
                        ? " "
                        : ' bg-blue-500 text-base-600 text-base-300 hover:bg-blue-600 px-1.5 py-0.5'
                        }`}
                      onClick={(e) => locked && e.preventDefault()}
                    >
                      {locked ? "Locked" : "View"}
                    </Link>

                    <div className="flex items-center gap-3">
                      <LoveReact lessonId={_id}>
                        <div onClick={() => setPlay(_id)}>
                          <Lottie
                            animationData={LoveReactAnimation}
                            loop={false}
                            autoplay={play === _id}
                            onComplete={() => setPlay(null)}
                            className="w-8 h-8 z-50 cursor-pointer"
                          />
                        </div>
                      </LoveReact>

                    </div>
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
        <Pagination currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}></Pagination>
      )}
    </Container>
  );
}

export default Lessons;