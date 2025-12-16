import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams } from "react-router";
import useAuth from "../../../Hooks/useAuth";
import useUsers from "../../../Hooks/ShareAllApi/useUsers";

const LessonsUpdate = () => {
    const { user } = useAuth()
    const { data: users = [], isLoading } = useUsers(user?.email)
    const { name, email } = users
    console.log(users);
    const { id } = useParams();
    const [lesson, setLesson] = useState(null);

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm();

    // 🔹 Load existing lesson (Pre-filled)
    useEffect(() => {
        axios
            .get(`${import.meta.env.VITE_API_URL}/lessons/${id}`)
            .then((res) => {
                setLesson(res.data);
                reset(res.data); // ⭐ pre-fill form
            });
    }, [id, reset]);

 
    // 🔹 Submit updated data
    const onSubmit = async (data) => {
        try {
            const formData = new FormData();

            formData.append("title", data.title);
            formData.append("description", data.description);
            formData.append("access", data.access);

            // optional image upload
            if (data.image?.[0]) {
                formData.append("image", data.image[0]);
            }

            await axios.patch(
                `${import.meta.env.VITE_API_URL}/lessons/${id}`,
                formData
            );

            toast.success("Lesson updated successfully ✅");
        } catch (error) {
            toast.error("Update failed ❌");
        }
    };

    if (!lesson) return <p className="text-center mt-10">Loading...</p>;

    return (
        <div className="max-w-2xl mx-auto mt-10">
            <h2 className="text-2xl font-bold text-center mb-6">
                Update Lesson
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                {/* User Name (Read Only) */}
                <div>
                    <label className="label">User Name</label>
                    <input
                        defaultValue={name}
                        readOnly
                        className="input input-bordered w-full bg-gray-100"
                    />
                </div>

                {/* Email (Read Only) */}
                <div>
                    <label className="label">Email</label>
                    <input
                        defaultValue={email}
                        readOnly
                        className="input input-bordered w-full bg-gray-100"
                    />
                </div>

                {/* Lesson Title */}
                <div>
                    <label className="label">Lesson Title</label>
                    <input
                        {...register("title", { required: true })}
                        className="input input-bordered w-full"
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="label">Description</label>
                    <textarea
                        {...register("description", { required: true })}
                        className="textarea textarea-bordered w-full"
                    />
                </div>

                {/* Access Level */}
                <div>
                    <label className="label">Access Level</label>
                    <select
                        {...register("access")}
                      
                        className="select select-bordered w-full"
                    >
                        <option value="free">Free</option>
                        <option value="premium">Premium</option>
                    </select>
                </div>

                {/* Image Re-upload (Optional) */}
                <div>
                    <label className="label">Update Image (optional)</label>
                    <input
                        type="file"
                        {...register("image")}
                        className="file-input file-input-bordered w-full"
                    />
                </div>

                <button className="btn bg-purple-500 text-white w-full">
                    Update Lesson
                </button>
            </form>
        </div>
    );
};

export default LessonsUpdate;
