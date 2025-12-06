// import React, { useState } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../Hooks/useAuth";
import { imageUpload } from "../../Utils";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

const AddLesson = () => {
    const { user } = useAuth();
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    // useMutation hook useCase (POST || PUT || PATCH || DELETE)
    const { mutateAsync, isPending, isError, reset: mutationReset } = useMutation({
        mutationFn: async (lessonData) => {
            const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/add_lessons`, lessonData);
            toast.success("Lesson added successfully!");
            reset();
            mutationReset();
            return data;
        }
    });

    // Form submit handler
    const onSubmit = async (data) => {
        const { title, description, category, tone, isPublic, accessLevel, image } = data;

        const imageFile = image[0]
        try {
            const imageUrl = await imageUpload(imageFile)
            const lessonData = {
                title,
                description,
                category,
                tone,
                isPublic,
                accessLevel,
                authorName: user.name,
                authorEmail: user.email,
                image: imageUrl,
                createdAt: new Date().toLocaleString(),
            };
            await mutateAsync(lessonData)

        }
        catch (err) {
            console.log(err);
        }
    };
    //
    if (isPending) {
        return <div>Submitting lesson...</div>
    }
    if (isError) {
        return <div>Error occurred while submitting the lesson.</div>
    }

    return (
        <div className="max-w-3xl mx-auto p-6 bg-base-200 shadow-md rounded-xl mt-20 mb-10">
            <h1 className="text-2xl text-center font-bold mb-2">Create New Life Lesson</h1>
            <p className="text-base-600 text-center mb-6">
                Share your insights, experiences, and lessons learned to inspire others.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                {/* Lesson Title */}
                <div>
                    <label className="block font-semibold mb-1">Lesson Title</label>
                    <input
                        type="text"
                        {...register("title", { required: true })}
                        placeholder="Enter lesson title"
                        className="w-full border p-2 rounded"
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">Title is required</p>}
                </div>

                {/* Full Description */}
                <div>
                    <label className="block font-semibold mb-1">Full Description / Story / Insight</label>
                    <textarea
                        {...register("description", { required: true })}
                        placeholder="Enter full lesson content"
                        rows={5}
                        className="w-full border p-2 rounded"
                    ></textarea>
                    {errors.description && <p className="text-red-500 text-sm mt-1">Description is required</p>}
                </div>

                {/* Category Dropdown */}
                <div>
                    <label className="block font-semibold mb-1">Category</label>
                    <select
                        {...register("category", { required: true })}
                        className="w-full border p-2 rounded"
                    >
                        <option value="">Select category</option>
                        <option value="Personal Growth">Personal Growth</option>
                        <option value="Career">Career</option>
                        <option value="Relationships">Relationships</option>
                        <option value="Mindset">Mindset</option>
                        <option value="Mistakes Learned">Mistakes Learned</option>
                    </select>
                    {errors.category && <p className="text-red-500 text-sm mt-1">Category is required</p>}
                </div>

                {/* Emotional Tone Dropdown */}
                <div>
                    <label className="block font-semibold mb-1">Emotional Tone</label>
                    <select
                        {...register("tone", { required: true })}
                        className="w-full border p-2 rounded"
                    >
                        <option value="">Select tone</option>
                        <option value="Motivational">Motivational</option>
                        <option value="Sad">Sad</option>
                        <option value="Realization">Realization</option>
                        <option value="Gratitude">Gratitude</option>
                    </select>
                    {errors.tone && <p className="text-red-500 text-sm mt-1">Tone is required</p>}
                </div>

                {/* Image Upload */}
                <div className=' p-4  w-full  m-auto rounded-lg grow'>
                    <div className='file_upload px-5 py-3 relative border-4 border-dotted border-gray-300 rounded-lg'>
                        <div className='flex flex-col w-max mx-auto text-center'>
                            <label>
                                <input
                                    className='text-sm cursor-pointer w-36 hidden'
                                    type='file'
                                    name='image'
                                    id='image'
                                    accept='image/*'
                                    hidden
                                    {...register('image', {
                                        required: 'Image is required',
                                    })}
                                />
                                {errors.image && (
                                    <p className='text-xs text-red-500 mt-1'>
                                        {errors.image.message}
                                    </p>
                                )}
                                <div className='bg-lime-500 text-white border border-gray-300 rounded font-semibold cursor-pointer p-1 px-3 hover:bg-lime-500'>
                                    Upload
                                </div>
                            </label>
                        </div>
                    </div>
                </div>


                {/* <div>
                    <input type="file" onChange={handleImageChange} />
                    {imagePreview && <img src={imagePreview} alt="Preview" className="w-48 mt-2 rounded" />}
                </div> */}

                {/* Privacy Dropdown */}
                <div>
                    <label className="block font-semibold mb-1">Privacy</label>
                    <select
                        {...register("isPublic", { required: true })}
                        className="w-full border p-2 rounded"
                    >
                        <option value="true">Public</option>
                        <option value="false">Private</option>
                    </select>
                </div>

                {/* Access Level Dropdown */}
                <div>
                    <label className="block font-semibold mb-1">Access Level</label>
                    <select
                        {...register("accessLevel")}
                    // disabled={!user.isPremium}
                    // title={!user.isPremium ? "Upgrade to Premium to create paid lessons" : ""}
                    // className={`w-full border p-2 rounded ${!user.isPremium ? "bg-gray-100 cursor-not-allowed" : ""}`}
                    >
                        <option value="Free">Free</option>
                        <option value="Premium">Premium</option>
                    </select>
                    {/* {!user.isPremium && <p className="text-gray-500 text-sm mt-1">Upgrade to Premium to create paid lessons</p>} */}
                </div>

                {/* Submit Button */}
                <div >

                    <button
                        type="submit"
                        className=" w-full px-6 py-2 text-2xl bg-lime-500  text-white rounded hover:bg-lime-600 transition"
                    >
                        Create Lesson
                    </button>

                </div>

            </form>
        </div>
    );
};

export default AddLesson;
