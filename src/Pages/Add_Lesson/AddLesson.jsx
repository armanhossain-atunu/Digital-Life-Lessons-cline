import { Controller, useForm, Watch } from "react-hook-form";
import useAuth from "../../Hooks/useAuth";
import { imageUpload } from "../../Utils";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useState } from "react";
import LottieAnimation from "../../Components/Shared/LottieAnimation";
import { useNavigate } from "react-router";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useUsers from "../../Hooks/ShareAllApi/useUsers";



const AddLesson = () => {
    const { user } = useAuth();
    const { data: users = [] } = useUsers()
    const currentUser = users.find(u => u.email === user?.email);
    console.log(currentUser?.plan, 'users db');
    const axiosSecure = useAxiosSecure()
    const navigate = useNavigate();
    const [showAnimation, setShowAnimation] = useState(false);
    const { register, handleSubmit, reset, control, watch, formState: { errors } } = useForm();


    const watchAccess = watch("accessLevel", "Free");
    // useMutation hook useCase (POST || PUT || PATCH ||
    const { mutateAsync, isPending, isError, reset: mutationReset } = useMutation({
        mutationFn: async (lessonData) => {
            const { data } = await axiosSecure.post(`${import.meta.env.VITE_API_URL}/add_lessons`, lessonData);
            toast.success("Lesson added successfully!");
            setShowAnimation(true);
            setTimeout(() => setShowAnimation(false), 2500);
            reset();
            navigate("/");
            mutationReset();
            return data;
        }
    });

    // Form submit handler
    const onSubmit = async (data) => {
        const { title, description, category, tone, isPublic, accessLevel, image, price } = data;

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
                price: accessLevel === "Premium" ? Number(price) : 0,
                authorName: user.displayName,
                authorEmail: user.email,
                image: imageUrl,
                createdAt: new Date(),
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
                        className="w-full border bg-base-200 p-2 rounded"
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
                        className="w-full bg-base-200 border p-2 rounded"
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
                        <div className='w-[40%] bg-lime-500 cursor-pointer hover:bg-lime-600 flex flex-col items-center mx-auto text-center'>
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
                                <div className=' text-white  border-gray-300 rounded cursor-pointer font-semibold  p-1 px-3 '>
                                    Upload
                                </div>
                            </label>
                        </div>
                        {errors.image && (
                            <p className='text-xs text-red-500 mt-1 text-center'>
                                {errors.image.message}
                            </p>
                        )}
                    </div>
                </div>
                {/* Privacy Dropdown */}
                <div>
                    <label className="block font-semibold mb-1">Privacy</label>
                    <select
                        {...register("isPublic", { required: true })}
                        className="w-full bg-base-200 border p-2 rounded"
                    >
                        <option value="true">Public</option>
                        <option value="false">Private</option>
                    </select>
                </div>

                {/* Access Level Dropdown
                <div>
                    <label className="block font-semibold mb-1">Access Level</label>
                    <select
                        {...register("accessLevel")}
                        className="bg-base-200"
                    >
                        <option value="Free">Free</option>
                        <option value="Premium">Premium</option>
                    </select>
                </div> */}


                {/* Access Level Dropdown */}
                <div>
                    <label className="block font-semibold mb-1">Access Level</label>
                    <select
                        {...register("accessLevel")}
                        className="bg-base-200 w-full border p-2 rounded"
                    >
                        <option value="Free">Free</option>
                        <option
                            value="Premium"
                            disabled={currentUser?.plan !== "premium"}
                            title={currentUser?.plan !== "premium" ? "Upgrade to Premium to create paid lessons" : ""}
                        >
                            Premium
                        </option>
                    </select>
                </div>
                {/* Conditional Price Input */}
                {watchAccess === "Premium" && (
                    <Controller
                        name="price"
                        control={control}
                        defaultValue={20}
                        render={({ field }) => (
                            <input
                                {...field}
                                type="number"
                                placeholder="Enter price"
                                className="w-full px-3 py-2 border rounded-md"
                            />
                        )}
                    />
                )}
                {/* Submit Button */}
                <div >
                    <button
                        type="submit"
                        className=" w-full px-6 py-2 text-2xl bg-lime-500 cursor-pointer  text-white rounded hover:bg-lime-600 transition"
                    >
                        Create Lesson
                    </button>
                    <LottieAnimation show={showAnimation} />
                </div>
            </form>
        </div>
    );
};

export default AddLesson;
