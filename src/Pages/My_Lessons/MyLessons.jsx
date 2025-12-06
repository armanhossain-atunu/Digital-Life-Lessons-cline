import React, { useState } from "react";
import { FaTrash, FaEdit, FaEye, FaLock, FaHeart, FaRegHeart, FaRegThumbsUp } from "react-icons/fa";

const MyLessons = () => {
  const [lessons, setLessons] = useState([
    {
      id: 1,
      title: "Overcoming Fear",
      description: "How I overcame fear in my life and became confident.",
      category: "Personal Growth",
      isPublic: true,
      accessLevel: "Free",
      reactions: 12,
      favorites: 8,
      isFavorited: false,
      comments: ["This is inspiring!", "Great lesson!"],
    },
    {
      id: 2,
      title: "Career Lessons",
      description: "Lessons learned from switching jobs and finding passion.",
      category: "Career",
      isPublic: false,
      accessLevel: "Premium",
      reactions: 22,
      favorites: 14,
      isFavorited: true,
      comments: [],
    },
    {
      id: 3,
      title: "Gratitude Mindset",
      description: "How practicing gratitude changed my daily life.",
      category: "Mindset",
      isPublic: true,
      accessLevel: "Free",
      reactions: 18,
      favorites: 9,
      isFavorited: false,
      comments: ["Nice insights!"],
    },
  ]);

  const [commentText, setCommentText] = useState({}); // store temp input for each lesson

  // Toggle favorite
  const handleFavorite = (id) => {
    setLessons(prev =>
      prev.map(lesson =>
        lesson.id === id
          ? {
              ...lesson,
              isFavorited: !lesson.isFavorited,
              favorites: lesson.isFavorited ? lesson.favorites - 1 : lesson.favorites + 1,
            }
          : lesson
      )
    );
  };

  // Add comment
  const handleAddComment = (lessonId) => {
    if (!commentText[lessonId]) return;
    setLessons(prev =>
      prev.map(lesson =>
        lesson.id === lessonId
          ? { ...lesson, comments: [...lesson.comments, commentText[lessonId]] }
          : lesson
      )
    );
    setCommentText(prev => ({ ...prev, [lessonId]: "" })); // reset input
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6">My Lessons</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lessons.map(lesson => (
          <div key={lesson.id} className="bg-white shadow-md rounded-xl p-4 relative hover:shadow-xl transition">
            
            {/* Title */}
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{lesson.title}</h3>
            
            {/* Category */}
            <p className="text-sm text-gray-500 mb-2">Category: {lesson.category}</p>
            
            {/* Description */}
            <p className="text-gray-600 mb-4">{lesson.description}</p>

            {/* Privacy & Access */}
            <div className="flex items-center gap-4 mb-4 text-gray-600">
              {lesson.isPublic ? <FaEye title="Public" /> : <FaLock title="Private" />}
              <span>{lesson.accessLevel}</span>
            </div>

            {/* Reactions & Favorites */}
            <div className="flex items-center gap-4 mb-4 text-gray-600">
              <FaRegThumbsUp /> {lesson.reactions}
              <button onClick={() => handleFavorite(lesson.id)} className="flex items-center gap-1">
                {lesson.isFavorited ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
                <span>{lesson.favorites}</span>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mb-4">
              <button className="flex items-center gap-1 px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                <FaEdit /> Update
              </button>
              <button className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">
                <FaTrash /> Delete
              </button>
            </div>

            {/* Comment Section */}
            <div className="mt-4 border-t pt-2">
              <h4 className="font-semibold mb-2">Comments</h4>
              <div className="space-y-2">
                {lesson.comments.length === 0 && <p className="text-gray-500 text-sm">No comments yet.</p>}
                {lesson.comments.map((c, i) => (
                  <p key={i} className="text-gray-700 text-sm bg-gray-100 p-2 rounded">{c}</p>
                ))}
              </div>

              {/* Add Comment Input */}
              <div className="flex mt-2 gap-2">
                <input
                  type="text"
                  value={commentText[lesson.id] || ""}
                  onChange={(e) => setCommentText(prev => ({ ...prev, [lesson.id]: e.target.value }))}
                  placeholder="Add a comment..."
                  className="flex-1 border p-2 rounded"
                />
                <button
                  onClick={() => handleAddComment(lesson.id)}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyLessons;
