import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Container from "../../Shared/Container";
import { MdDeleteForever } from "react-icons/md";
import toast from "react-hot-toast";
import LoadingSpinner from "../../Shared/LoadingSpinner";
import Card from "../Card";
import Comments from "../../Shared/Comments/Comments";
import LikeButton from "../../Shared/LikeReact/LoveReact";
import LoveReact from "../../Shared/LikeReact/LoveReact";
import useAuth from "../../../Hooks/useAuth";
import { Link } from "react-router";


const Lessons = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    const { data: lessons = [], isLoading, error } = useQuery({
        queryKey: ["lessons"],
        queryFn: async () => {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/lessons`);
            return res.data;
        },
    });
    const isOwner = lessons.authorEmail === user?.email;
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
            <h1 className="text-2xl text-center font-bold mb-6"> All Lessons {lessons.length}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {lessons.map((lesson) => (
                    <div key={lesson._id}
                        className="border border-gray-300 rounded-lg p-4 shadow hover:shadow-lg transition"
                        lesson={lesson}>
                        <img src={lesson.image} className="w-full h-48 object-cover rounded-lg mb-3" />
                        <h3 className="text-lg font-semibold">{lesson.title}</h3>
                        <p className="text-base-600">`${lesson.description.slice(0, 60).concat("...")}<Link to={`/lessons/${lesson._id}`}>Read More</Link> `</p>
                        <div className="flex justify-end mt-3 gap-4 items-center">

                            <LoveReact lessonId={lesson._id}></LoveReact>
                            {/* 

                            {isOwner && (
                                <button
                                    onClick={() => handleDelete(lesson._id)}
                                    className="text-red-600 text-2xl hover:text-red-800"
                                >
                                    <MdDeleteForever />
                                </button>
                            )} */}
                            <button
                                className="text-red-600 cursor-pointer hover:text-red-800 transition-colors"
                                onClick={() => handleDelete(lesson._id)}
                            >
                                <MdDeleteForever size={22} />
                            </button>

                        </div>
                        <Comments postId={lesson._id}></Comments>
                    </div>
                ))}
            </div>

        </Container>
    );
};

export default Lessons;
