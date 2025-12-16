import React from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import LoadingSpinner from "../../Shared/LoadingSpinner";
import Container from "../../Shared/Container";

const LessonDetails = () => {
  const { id } = useParams();

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
      <div className="grid grid-cols-1 mt-21 md:grid-cols-2 gap-6 bg-base-100 min-h-screen p-6">
        {/* Lesson Image */}
        {lesson.image && (
          <img
            src={lesson.image}
            alt={lesson.title}
            className="w-full h-64 md:h-96 object-cover hover:shadow-2xl  rounded-2xl shadow-lg"
          />
        )}

        {/* Lesson Info */}
        <div className="bg-base-200 h-64 md:h-96  p-6 rounded-2xl shadow hover:shadow-2xl flex flex-col">
          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-bold text-base-800 mb-4">
            {lesson.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-2 mb-4 text-sm text-base-600">
            <span className="badge badge-outline">Category: {lesson.category}</span>
            <span className="badge badge-outline">Tone: {lesson.tone}</span>
            <span className="badge badge-outline">Access: {lesson.accessLevel}</span>
            <span className="badge badge-outline">Author: {lesson.authorEmail}</span>
            <span className="badge badge-outline">Created: {(lesson.createdAt)}</span>
          </div>

          {/* Description */}
          <div className="overflow-y-auto max-h-[50vh] pr-2">
            <p className="text-base-700 leading-relaxed">{lesson.description}</p>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default LessonDetails;
