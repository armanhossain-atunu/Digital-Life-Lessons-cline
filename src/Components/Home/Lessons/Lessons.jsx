import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Container from "../../Shared/Container";
import toast from "react-hot-toast";
import axios from "axios";
import { MdDeleteForever } from "react-icons/md";
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
import { IoIosLock } from "react-icons/io";
import SkeletonCard from "../../Shared/SkeletonCard/SkeletonCard";

const Lessons = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [expanded, setExpanded] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [setCompletedLesson] = useState(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const [play, setPlay] = useState(null);

  const itemsPerPage = 8;

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
  const noDelete = userData?.permissions === "no-delete";
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

  // Search filter
  const filteredLessons = lessons.filter((lesson) =>
    (lesson.title || "").toLowerCase().includes((searchTerm || "").toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredLessons.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedLessons = filteredLessons.slice(startIndex, endIndex);

  // Hide animation after 2 sec
  useEffect(() => {
    if (showAnimation) {
      const timer = setTimeout(() => {
        setShowAnimation(false);
        setCompletedLesson(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showAnimation, setCompletedLesson]);

  // Delete mutation
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
    toast(
      (t) => (
        <div className="p-4 bg-base-200 rounded-lg shadow-lg">
          <p className="text-lg text-base-content font-medium">
            Delete this lesson permanently?
          </p>

          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={() => {
                deleteLessonMutation.mutate(id);
                toast.dismiss(t.id);
              }}
              className="px-4 py-2 bg-error text-white rounded hover:bg-error/80"
            >
              Yes, Delete
            </button>

            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-4 py-2 bg-base-300 text-base-content rounded hover:bg-base-300/80"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
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

  const onPageChange = (pageNum) => {
    setCurrentPage(pageNum);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </Container>
    );
  }
  if (error)
    return (
      <p className="text-center text-red-500">
        Failed to load lessons. please try again.
      </p>
    );

  return (
    <Container>
      <h1 className="text-3xl font-bold text-center mb-2 mt-5">
        Featured Life Lessons.
      </h1>
      <p className="text-xl font-medium text-center">
        Life-changing insights, handpicked for your growth.
      </p>

      <div className="flex flex-col md:flex-row justify-between gap-4 mb-4 z-50">
        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
          const locked =
            access === "premium" && !isPremium && !isAdmin && !isOwner;

          return (
            <div
              key={_id}
              className={`relative bg-base-300 rounded-xl shadow border overflow-y-scroll ${
                expanded[_id] ? "h-full" : "h-full"
              } ${locked ? "cursor-not-allowed" : "cursor-pointer"}`}
            >
              {locked && (
                <div className="absolute inset-0 bg-black/80 z-10 flex flex-col items-center justify-center text-white">
                  <IoIosLock className="text-6xl mb-4" />
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
                data-aos="zoom-in"
                duration="1000"
                className={`w-full h-48 p-2 rounded-xl object-cover ${
                  locked ? "brightness-50" : ""
                }`}
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
                    {expanded[_id] ? (
                      "less"
                    ) : (
                      <Link to={`/lesson-details/${_id}`}>more</Link>
                    )}
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

                  {/* 🔥 DELETE BUTTON CONTROL HERE */}
                  {(isOwner || (isAdmin && !noDelete)) && (
                    <button
                      onClick={() => handleDelete(_id)}
                      className="text-red-600 hover:text-red-800 text-2xl"
                      title="Delete Lesson"
                    >
                      <MdDeleteForever />
                    </button>
                  )}
                </div>

                <Comments postId={_id} />
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
        />
      )}
    </Container>
  );
};

export default Lessons;
