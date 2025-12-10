import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Container from "../../Shared/Container";
import { MdDeleteForever, MdEdit } from "react-icons/md";
import toast from "react-hot-toast";
import LoadingSpinner from "../../Shared/LoadingSpinner";
import Comments from "../../Shared/Comments/Comments";
import LoveReact from "../../Shared/LikeReact/LoveReact";
import useAuth from "../../../Hooks/useAuth";
import { Link } from "react-router";
import { useState } from "react";
import FavoriteLessons from "./FavoriteLessons";


const Lessons = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();
    // Show More system
    const [visibleCount, setVisibleCount] = useState(6);
    const [expanded, setExpanded] = useState({});
   
    const toggleExpand = (id) => {
        setExpanded((prev) => ({
            ...prev,
            [id]: !prev[id]
        }));
    };
    const { data: lessons = [], isLoading, error } = useQuery({
        queryKey: ["lessons"],
        queryFn: async () => {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/lessons`);
            return res.data;
        },
    });
    const visibleLessons = lessons.slice(0, visibleCount);

    // Mutation for deleting a lesson
    const deleteLessonMutation = useMutation({
        mutationFn: async (id) => {
            await axios.delete(`${import.meta.env.VITE_API_URL}/lessons/${id}`);
        },
        // Update the cache after a successful delete
        onSuccess: (_, id) => {
            queryClient.setQueryData(["lessons"], (oldLessons) =>
                oldLessons.filter((lesson) => lesson._id !== id)
            );
            toast.success("Lesson deleted successfully!");
        },
        // Handle error
        onError: () => {
            toast.error("Failed to delete the lesson.");
        }
    });
    // Handle delete with toast confirmation
    const handleDelete = (id) => {
        toast(
            (t) => (
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
    }

 
    if (isLoading) return <LoadingSpinner></LoadingSpinner>;
    if (error) return <p>{error.message}</p>;

    return (


        <Container>
            <h1 className="text-2xl text-center font-bold mb-6">
                All Lessons {lessons.length}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {visibleLessons.map((lesson) => {
                    const {
                        _id,
                        image,
                        title,
                        description,
                        accessLevel: rawAccess = "Free",
                        authorEmail,
                        isPublic: rawIsPublic = false,
                    } = lesson || {};

                    const isPublic = rawIsPublic === true || String(rawIsPublic).toLowerCase() === "true";
                    const accessLevel = String(rawAccess || "free").toLowerCase();
                    const isOwner = authorEmail === user?.email;
                    const userIsPremium = String(user?.plan || user?.role || "free").toLowerCase() === "premium";
                    const isLocked = isPublic && accessLevel === "premium" && !userIsPremium && !(isOwner && user);
                    return (
                        <div
                            key={_id}
                            className="relative border border-gray-300 rounded-lg p-4 shadow hover:shadow-lg transition"
                        >
                            {image && (
                                <img
                                    src={image}
                                    className={`w-full h-48 object-cover rounded-lg mb-3 ${isLocked ? "blur-md brightness-75" : ""}`}
                                />
                            )}

                            <h3 className="text-lg font-semibold">{title}</h3>

                            {/* Description with See More */}
                            <p className="text-base-600">
                                {expanded[_id]
                                    ? description
                                    : (description ? description.slice(0, 80) : "") + "..."
                                }
                                <button
                                    onClick={() => toggleExpand(_id)}
                                    className="text-blue-600 underline ml-2"
                                >
                                    {expanded[_id] ? "See Less" : (<Link to={`/lessonsDetails/${_id}`}>See More</Link>)}
                                </button>
                            </p>

                            {isLocked && (
                                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6 rounded-lg">
                                    <div className="mb-2 font-semibold text-purple-600">🔒 Premium Lesson</div>
                                    <p className="text-gray-700 mb-3">Upgrade to Premium to unlock this lesson.</p>
                                    <Link to="/upgrade" className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-all">Upgrade Now</Link>
                                </div>
                            )}

                            <p>Author: {authorEmail}</p>
                            <p>Access Level: {accessLevel}</p>

                            <div className="flex justify-between items-center">
                                <p>Public: {isPublic ? "Yes" : "No"}</p>
                                <Link to={`/lessonsDetails/${_id}`} className="text-red-600 mt-2  hover:text-red-800">Details</Link>
                            </div>
                            <div className="flex justify-end mt-3 gap-4 items-center">
                                <LoveReact lessonId={_id} />
                                {/* Delete button only owner can see */}
                                {isOwner && (
                                    <button
                                        onClick={() => handleDelete(_id)}
                                        className="text-red-600 text-2xl hover:text-red-800"
                                    >
                                        <MdDeleteForever />
                                    </button>
                                )}
                               {/* Favorite button */}
                                <FavoriteLessons lessonId={lesson._id}></FavoriteLessons>

                                {/* Edit button only owner can see */}
                                {isOwner && (
                                    <Link to={`/edit/${_id}`}>
                                        <button className="text-blue-600 text-2xl hover:text-blue-800">
                                            <MdEdit />
                                        </button>
                                    </Link>
                                )}

                            </div>

                            <Comments postId={_id} />
                        </div>
                    );
                })}
            </div>
            {/* Show More / Show Less Buttons */}
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
