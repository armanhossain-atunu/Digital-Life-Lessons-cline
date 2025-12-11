import React from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import LoadingSpinner from "../../Shared/LoadingSpinner";
import Container from "../../Shared/Container";

const LessonDetails = () => {
    const { id } = useParams(); // _id from URL

    // Fetch lesson details
    const { data: lesson, isLoading, isError } = useQuery({
        queryKey: ["lessonDetails", id],
        queryFn: async () => {
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/lessons/${id}`
            );
            return res.data;
        },
        enabled: !!id,
    });

    if (isLoading) return <LoadingSpinner />;
    if (isError) return <p className="text-red-500">Failed to load lesson.</p>;

    return (
        <Container>
            <div className=" flex justify-between items-center gap-3  bg-base-100 min-h-screen " >
                {/* Lesson Image */}
                {lesson.image && (
                    <img
                        src={lesson.image}
                        alt={lesson.title}
                        className="w-1/2 h-64 mt-12 sm:h-96 object-cover rounded-2xl shadow-lg mb-6"
                    />
                )}

                {/* Lesson Info */}
                <div className=" bg-base-200 w-1/2 h-[70vh] mt-8 p-3 overflow-y-scroll rounded-2xl shadow hover:shadow-2xl">
                    {/* Title */}
                    <h1 className="text-3xl sm:text-4xl font-bold text-base-800 mb-4">
                        {lesson.title}
                    </h1>

                    {/* Meta Info */}
                    <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-500">
                        <span>Category: {lesson.category}</span>
                        <span>Tone: {lesson.tone}</span>
                        <span>Access: {lesson.accessLevel}</span>
                        <span>Author: {lesson.authorEmail}</span>
                        <span>Created: {lesson.createdAt}</span>
                    </div>

                    {/* Description */}

                    <p className="text-gray-600">{lesson.description}</p>

                </div>
            </div>
        </Container>
    );
};

export default LessonDetails;
