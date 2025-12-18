import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { imageUpload } from "../../../Utils";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
const API = import.meta.env.VITE_API_URL;

const UpdateLesson = () => {
    const { id } = useParams();
    const [newImage, setNewImage] = useState(null);
    const [loading, setLoading] = useState(false);
      const axiosSecure = useAxiosSecure()

    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    /* ======================
       FETCH LESSON BY ID
    ======================= */
    const { data: lesson, isLoading } = useQuery({
        queryKey: ["lesson", id],
        queryFn: async () => {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/lessons/${id}`);
            return res.data;
        },
    });

    /* ======================
       PRE-FILL FORM
    ======================= */
    useEffect(() => {
        if (lesson) {
            reset({
                title: lesson.title,
                description: lesson.description,
                category: lesson.category,
                tone: lesson.tone,
                isPublic: lesson.isPublic,
                accessLevel: lesson.accessLevel,

            });
        }
    }, [lesson, reset]);

    /* ======================
       IMAGE CHANGE
    ======================= */
    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setNewImage(e.target.files[0]);
        }
    };

    /* ======================
       UPDATE SUBMIT
    ======================= */
    const onSubmit = async (data) => {
        try {
            setLoading(true);

            let imageUrl = lesson.image;

            // upload new image only if selected
            if (newImage) {
                imageUrl = await imageUpload(newImage);
            }

            const updatedLesson = {
                title: data.title,
                description: data.description,
                category: data.category,
                tone: data.tone,
                isPublic: data.isPublic === "true" || data.isPublic === true,
                accessLevel: data.accessLevel,
                price: Number(data.price),
                image: imageUrl,
            };

            const res = await axiosSecure.patch(
                `${API}/lessons/${lesson._id}`,
                updatedLesson
            );

            if (res.data.modifiedCount > 0) {
                toast.success("Lesson updated successfully ✅");
                navigate('/')
            } else {
                toast("No changes detected");
            }
        } catch (err) {
            console.error(err);
            toast.error("Lesson update failed ❌");
        } finally {
            setLoading(false);
        }
    };

    if (isLoading) return <p className="text-center mt-10">Loading...</p>;

    /* ======================
       JSX
    ======================= */
    return (
        <div className="max-w-3xl mx-auto p-6">
            <h2 className="text-2xl mt-20 text-center font-bold mb-6">Update Lesson</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">


                {/* Author name read only */}
                <input
                    value={lesson.authorName}
                    disabled
                    className="input input-bordered w-full bg-gray-100"
                />


                {/* Author Email (READ ONLY) */}
                <input
                    value={lesson.authorEmail}
                    disabled
                    className="input input-bordered w-full bg-gray-100"
                />

                {/* Title */}
                <input
                    {...register("title", { required: true })}
                    className="input input-bordered w-full"
                    placeholder="Lesson Title"
                />
                {errors.title && (
                    <p className="text-red-500">Title is required</p>
                )}

                {/* Description */}
                <textarea
                    {...register("description", { required: true })}
                    className="textarea textarea-bordered w-full"
                    placeholder="Lesson Description"
                />
                {errors.description && (
                    <p className="text-red-500">Description is required</p>
                )}

                {/* Category */}
                <select
                    {...register("category")}
                    className="select select-bordered w-full"
                >
                    <option>Mistakes Learned</option>
                    <option>Life Lesson</option>
                    <option>Motivation</option>
                </select>

                {/* Tone */}
                <select
                    {...register("tone")}
                    className="select select-bordered w-full"
                >
                    <option>Gratitude</option>
                    <option>Regret</option>
                    <option>Hope</option>
                </select>

                {/* Public / Private */}
                <select
                    {...register("isPublic")}
                    className="select select-bordered w-full"
                >
                    <option value={true}>Public</option>
                    <option value={false}>Private</option>
                </select>

                {/* Access Level */}
                <select
                    {...register("accessLevel")}
                    className="select select-bordered w-full"
                >
                    <option value="Free">Free</option>
                    <option value="Premium">Premium</option>
                </select>

                {/* Current Image Preview */}
                <img
                    src={lesson.image}
                    alt="lesson"
                    className="w-full h-48 object-cover rounded"
                />

                {/* Image Upload */}
                <input
                    type="file"
                    onChange={handleImageChange}
                    className="file-input file-input-bordered w-full"
                />


                {/* Submit */}
                <button
                    disabled={loading}
                    className="btn btn-primary w-full"
                >
                    {loading ? "Updating..." : "Update Lesson"}
                </button>
            </form>
        </div>
    );
};

export default UpdateLesson;
