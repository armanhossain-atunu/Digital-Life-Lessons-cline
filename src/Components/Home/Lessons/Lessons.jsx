import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Container from "../../Shared/Container";
import toast from "react-hot-toast";
import axios from "axios";
import { MdDeleteForever } from "react-icons/md";
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

const Lessons = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [expanded, setExpanded] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [ setCompletedLesson] = useState(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const [play, setPlay] = useState(null);
  // const [sortBy, setSortBy] = useState("newest");
  const itemsPerPage = 6;

  // Fetch user role
  const { data: userData } = useQuery({
    queryKey: ["userRole", user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const res = await axiosSecure.get(
        `${import.meta.env.VITE_API_URL}/user?email=${user.email}`
      );
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

  // Fetch lessons with sorting
  const { data: lessons = [], isLoading, error } = useQuery({
    queryKey: ["lessons"],
    queryFn: async () => {
      const res = await axiosSecure.get(`${import.meta.env.VITE_API_URL}/lessons`, {
       
      });
      return res.data;
    },
  });

  // Safe search filter
  const filteredLessons = lessons.filter((lesson) =>
    (lesson.title || "").toLowerCase().includes((searchTerm || "").toLowerCase())
  );

  // Pagination
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
  }, [showAnimation, setCompletedLesson]);
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
  if (error)
    return (
      <p className="text-center text-red-500">
        Failed to load lessons. please try again.
      </p>
    );

  return (
    <Container>
      <h1 className="text-3xl font-bold text-center my-8">
        Featured Life Lessons.
      </h1>
      <p className="text-xl font-medium text-center" >Life-changing insights, handpicked for your growth.</p>

      {/* Search + Sort */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

       
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedLessons.map((lesson) => {
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
          const access = (accessLevel || "free").toLowerCase();
          const locked = access === "premium" && !isPremium && !isAdmin && !isOwner;

          return (
            <div
              key={_id}

              className={`relative bg-base-300 rounded-xl shadow border overflow-y-scroll ${
                expanded[_id] ? "h-full" : "h-full"
              }
              ${locked ? "cursor-not-allowed" : "cursor-pointer"}`
              }
            >
              {locked && (
                <div className="absolute inset-0 bg-black/80  z-10 flex flex-col items-center justify-center text-white">
                  <p className="text-xl mb-2">Premium</p>
                  <button
                    onClick={() => handlePayment(lesson)}
                    className="px-6 py-2 bg-purple-600 rounded-lg"
                  >
                    Upgrade Now
                  </button>
                </div>
              )}

              <img
                src={image || "/placeholder.jpg"}
                alt={title}
                className={`w-full h-48 object-cover ${locked && "brightness-50"}`}
              />

              <div className="p-5">
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(createdAt).toLocaleDateString()}
                </p>

                <p className="text-gray-600 mt-2">
                  {expanded[_id] ? description : `${description?.slice(0, 100)}...`}
                  <button
                    onClick={() => toggleExpand(_id)}
                    className="text-indigo-600 ml-1"
                  >
                    {expanded[_id] ? "less" : "more"}
                  </button>
                </p>

                <div className="flex justify-between items-center mt-4">
                  <Link
                    to={`/lesson-details/${_id}`}
                    onClick={(e) => locked && e.preventDefault()}
                    className="btn btn-sm btn-primary"
                  >
                    {locked ? "Locked" : "View"}
                  </Link>

                  <LoveReact lessonId={_id}>
                    <Lottie
                      animationData={LoveReactAnimation}
                      loop={false}
                      autoplay={play === _id}
                      onComplete={() => setPlay(null)}
                      className="w-8 h-8 cursor-pointer"
                    />
                  </LoveReact>

                  {(isOwner || isAdmin) && (
                    <button
                      onClick={() => handleDelete(_id)}
                      className="text-red-600 hover:text-red-800 text-2xl"
                      title="Delete Lesson"
                    >
                      <MdDeleteForever />
                    </button>
                  )}
                </div>
                <Comments
                  postId={_id}
                  onLessonCompleted={() => handleLessonCompleted(title)}
                />
              </div>
            </div>
          );
        })}
      </div>
      {lessons.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />)}
    </Container>
  );
};

export default Lessons;
