import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";


const LessonsByCategory = () => {
    // State
    const [category, setCategory] = useState(""); 
    const [sort, setSort] = useState("newest");

    // Fetch lessons from backend
    const { data: lessons = [], isLoading } = useQuery({
        queryKey: ["lessons", category, sort],
        queryFn: async () => {
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/lessons?category=${category}&sort=${sort}`
            );
            return res.data;
        },
    });

    if (isLoading) return <p className="text-center mt-10">Loading...</p>;

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            <h2 className="text-2xl font-bold mb-4 text-center">Lessons</h2>

            {/* Filters */}
            <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-6">
                {/* Category Filter */}
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="select select-bordered w-full md:w-1/2"
                >
                    <option value="">All Categories</option>
                    <option value="Life Lesson">Life Lesson</option>
                    <option value="Motivation">Motivation</option>
                    <option value="Mistakes Learned">Mistakes Learned</option>
                </select>

                {/* Sort Filter */}
                <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="select select-bordered w-full md:w-1/2"
                >
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="az">Title A–Z</option>
                    <option value="za">Title Z–A</option>
                </select>
            </div>

            {/* Lessons Grid */}
            {lessons.length === 0 ? (
                <p className="text-center text-gray-500">No lessons found</p>
            ) : (
                <div className="grid md:grid-cols-3 gap-6">
                    {lessons.map((lesson) => (
                        <div
                            key={lesson._id}
                            className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition"
                        >
                            <img
                                src={lesson.image}
                                alt={lesson.title}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-4">
                                <h3 className="text-lg font-semibold mb-1">{lesson.title}</h3>
                                <p className="text-gray-600 text-sm mb-2">{lesson.category}</p>
                                <p className="text-gray-700 text-sm line-clamp-3">
                                    {lesson.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LessonsByCategory;
