import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Container from "../../Shared/Container";
import { MdDeleteForever, MdEdit } from "react-icons/md";
import toast from "react-hot-toast";
import LoadingSpinner from "../../Shared/LoadingSpinner";
import Comments from "../../Shared/Comments/Comments";
import LoveReact from "../../Shared/LikeReact/LoveReact";
import useAuth from "../../../Hooks/useAuth";
import { useState } from "react";
import FavoriteLessons from "./Favorite";
import { Link, useNavigate } from "react-router";
import Search from "./Search";
import ReportLesson from "../../../Pages/Reports/ReportLesson";


const Lessons = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const navigate = useNavigate()
    const [visibleCount, setVisibleCount] = useState(6);
    const [expanded, setExpanded] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    // ================================================================================================
    //                        Fetch user role
    // ===============================================================================================
    const useUserRole = (email) => {
        return useQuery({
            queryKey: ["userRole", email],
            queryFn: async () => {
                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}/user?email=${email}`
                );
                return res.data;
            },
            enabled: !!email,
        });
    };
    const role = useUserRole(user?.email).data?.role;


    // ================================================================================================
    //                        Show More state
    // ===============================================================================================


    const toggleExpand = (id) => {
        setExpanded((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    // ================================================================================================
    //                        Fetch lessons
    // ===============================================================================================
    const { data: lessons = [], isLoading, error } = useQuery({
        queryKey: ["lessons"],
        queryFn: async () => {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/lessons`);
            return res.data;
        },
    });
    const filteredLessons = lessons.filter((lesson) =>
        lesson.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const visibleLessons = filteredLessons.slice(0, visibleCount);

    // ================================================================================================
    //                        Delete Mutation
    // ===============================================================================================
    const deleteLessonMutation = useMutation({
        mutationFn: async (id) => {
            await axios.delete(`${import.meta.env.VITE_API_URL}/lessons/${id}`);
        },
        onSuccess: (_, id) => {
            queryClient.setQueryData(["lessons"], (oldLessons = []) =>
                oldLessons.filter((lesson) => lesson._id !== id)
            );
            toast.success("Lesson deleted successfully!");
        },
        onError: () => {
            toast.error("Failed to delete the lesson.");
        },
    });
    // ================================================================================================
    //                        Delete Handler
    // ===============================================================================================
    const handleDelete = (id) => {
        toast((t) => (
            <div className="p-3 bg-white border rounded shadow-md">
                <p className="mb-2">Are you sure you want to delete this lesson?</p>
                <div className="flex justify-end gap-2">
                    <button
                        className="bg-red-600 text-white px-3 py-1 rounded"
                        onClick={() => {
                            deleteLessonMutation.mutate(id);
                            toast.dismiss(t.id);
                        }}
                    >
                        Yes
                    </button>
                    <button
                        className="bg-gray-300 text-black px-3 py-1 rounded"
                        onClick={() => toast.dismiss(t.id)}
                    >
                        No
                    </button>
                </div>
            </div>
        ),
            { duration: Infinity }
        );
    };

    // ================================================================================================
    //                        Payment Handler Function
    // ===============================================================================================
    const handlePayment = async (lesson) => {
        if (!user) {
            toast.error("Please login first!");
            navigate('/auth/login')
            return;
        }

        if (!lesson) {
            toast.error("Lesson data missing!");
            return;
        }
        // ================================================================================================
        //                        Payment Handler payment info
        // ===============================================================================================
        const paymentInfo = {
            lessonId: lesson._id,
            name: lesson.title,
            price: lesson.price,
            quantity: 1,
            customer: {
                name: user?.displayName || "Unknown User",
                email: user?.email || "No Email",
                image: user?.photoURL || "",
            },
        };

        // console.log("Payment Info:", paymentInfo);
        // ================================================================================================
        //                        Payment Handler Function post
        // ===============================================================================================
        const result = await axios.post(
            `${import.meta.env.VITE_API_URL}/create-checkout-session`,
            paymentInfo
        );

        window.location.href = result.data.url;
    };

    // ================================================================================================
    if (isLoading) return <LoadingSpinner />;
    if (error) return <p>{error.message}</p>;

    return (
        <Container>
            <h1 className="text-2xl text-center font-bold mb-6">
                All Lessons ({lessons.length})
            </h1>


            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} ></Search>

            <  div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                {filteredLessons.length === 0 ? (
                    <div className="col-span-full text-center py-20">
                        <h2 className="text-2xl font-semibold text-gray-500">
                            🔍 Lesson not found
                        </h2>
                        <p className="text-gray-400 mt-2">
                            Try searching with a different keyword
                        </p>
                    </div>
                ) : (
                    visibleLessons.map((lesson) => {
                        const {
                            _id,
                            image,
                            title,
                            price,
                            description,
                            accessLevel: rawAccess = "free",
                            authorEmail,
                            isPublic: rawIsPublic = false,
                        } = lesson || {};
                        const isAdmin = role?.toLowerCase() === "admin";

                        const isOwner = authorEmail === user?.email;
                        const userIsPremium =
                            String(user?.plan || "free").toLowerCase() === "premium";

                        const isPublic =
                            rawIsPublic === true ||
                            String(rawIsPublic).toLowerCase() === "true";

                        const accessLevel = String(rawAccess || "free").toLowerCase();

                        const hasPremiumAccess =
                            accessLevel !== "premium" ||
                            isAdmin ||
                            isOwner ||
                            userIsPremium;

                        const hasVisibilityAccess =
                            isPublic ||
                            isAdmin ||
                            isOwner;

                        const canView = hasPremiumAccess && hasVisibilityAccess;

                        const isLocked = !canView;

                        return (
                            <div
                                key={_id}
                                className="relative border overflow-hidden rounded-lg group border-gray-300 p-4 shadow hover:shadow-lg transition"
                            >
                                {/* Image */}
                                {image && (
                                    <img
                                        src={image}
                                        className={`w-full h-48 object-cover rounded-lg mb-3 transition-transform
                                        duration-500 group-hover:scale-110 ${isLocked ? "blur-md brightness-75" : ""}`}
                                    />
                                )}

                                <h3 className="text-lg font-semibold">{title}</h3>

                                {/* Description */}
                                <p className="text-base-600">
                                    {expanded[_id]
                                        ? description
                                        : `${description?.slice(0, 80)}...`}
                                    <button
                                        onClick={() => toggleExpand(_id)}
                                        className="text-blue-600 underline ml-2"
                                    >
                                        {expanded[_id] ? "See Less" : (
                                            <Link to={`/lesson-details/${_id}`}>See More</Link>
                                        )}
                                    </button>
                                </p>
                                {/* Lock Screen */}
                                {isLocked && (
                                    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex flex-col 
                                items-center justify-center text-center p-6 rounded-lg">
                                        <div className="mb-2 font-semibold text-purple-600">
                                            🔒 Premium Lesson
                                        </div>
                                        <p className="text-gray-700 mb-3">
                                            Upgrade to Premium to unlock this lesson.
                                        </p>
                                        <button
                                            onClick={() =>
                                                document.getElementById(`premium_modal_${_id}`).showModal()
                                            }
                                            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-all"
                                        >
                                            Upgrade Now
                                        </button>
                                    </div>
                                )}
                                {/* Dynamic MODAL */}
                                <dialog id={`premium_modal_${_id}`} className="modal">
                                    <div className="modal-box">
                                        <h3 className="font-bold text-lg">Upgrade to Premium</h3>

                                        <p><b>Name:</b> {title}</p>
                                        <p><b>Price:</b> ${price}</p>
                                        <p><b>Access Level:</b> {accessLevel}</p>

                                        <div className="flex justify-between items-center py-5">
                                            <button
                                                onClick={() =>
                                                    document.getElementById(`premium_modal_${_id}`).close()
                                                }
                                                className="shadow hover:bg-red-300 font-bold py-2 px-4 rounded"
                                            >
                                                Close
                                            </button>

                                            <button
                                                onClick={() => handlePayment(lesson)}
                                                className="shadow hover:bg-green-400 font-bold py-2 px-4 rounded"
                                            >
                                                Pay
                                            </button>
                                        </div>
                                    </div>
                                </dialog>
                                <p>Author: {authorEmail}</p>
                                <p>Access Level: {accessLevel}</p>

                                <div className="flex justify-between items-center">
                                    <p>Public: {isPublic ? "Yes" : "No"}</p>
                                    <Link to={`/lesson-details/${_id}`} className="mt-2 bg-blue-600 text-white px-4 py-2 rounded">Details</Link>
                                </div>
                                <div className="flex justify-end mt-3 gap-4 items-center">

                                    <LoveReact lessonId={_id} />
                                    {(isOwner || isAdmin) && (
                                        <button
                                            onClick={() => handleDelete(_id)}
                                            className="text-red-600 text-2xl hover:text-red-800"
                                        >
                                            <MdDeleteForever />
                                        </button>
                                    )}
                                    <FavoriteLessons lessonId={lesson._id} />
                                    {(isOwner || isAdmin) && (
                                        <Link to={`/edit/${_id}`}>
                                            <button className="text-blue-600 text-2xl hover:text-blue-800">
                                                <MdEdit />
                                            </button>
                                        </Link>
                                    )}

                                    <ReportLesson lessonId={_id}></ReportLesson>
                                </div>

                                <Comments postId={_id} />
                            </div>
                        );
                    })
                )}
            </div>
            {/* Show More */}
            <div className="flex justify-center mt-6 mb-6">
                {visibleCount < lessons.length ? (
                    <button
                        onClick={() => setVisibleCount((prev) => prev + 6)}
                        className="px-4 py-2 bg-blue-600 text-white rounded"
                    >
                        Show More
                    </button>
                ) : (
                    lessons.length > 6 && (
                        <button
                            onClick={() => setVisibleCount(6)}
                            className="px-4 py-2 bg-gray-600 text-white rounded"
                        >
                            Show Less
                        </button>
                    )
                )}
            </div>
        </Container>
    );
};

export default Lessons;
