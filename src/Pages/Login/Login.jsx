import { Link, Navigate, useLocation, useNavigate } from "react-router";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import LoadingSpinner from "../../Components/Shared/LoadingSpinner";
import useAuth from "../../Hooks/useAuth";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye } from "react-icons/fa";
import { FiEyeOff } from "react-icons/fi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const Login = () => {
    const { signIn, signInWithGoogle, loading, user, setLoading } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const [show, setShow] = useState(false);
    const from = location.state?.from?.pathname || "/";

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    // TanStack Query: Save User to Database
    const queryClient = useQueryClient();

    const saveUserMutation = useMutation({
        mutationFn: async (userInfo) =>
            axios.post(`${import.meta.env.VITE_API_URL}/users`, userInfo),
        onSuccess: () => {
            queryClient.invalidateQueries(["users"]);
        },
    });

    // Check if user exists (Frontend)
    const checkUserExists = async (email) => {
        try {
            const { data } = await axios.get(
                `${import.meta.env.VITE_API_URL}/users?email=${email}`
            );
            return data.length > 0;
        } catch (err) {
            console.log(err);
            return false;
        }
    };

    // -----------------------------------
    // Email + Password Login
    // -----------------------------------
    const handleLogin = async (data) => {
        try {
            await signIn(data.email, data.password);
            toast.success("Login Successful");
            navigate(from, { replace: true });
        } catch (err) {
            console.log(err);
            setLoading(false);
            toast.error(err?.message);
        }
    };

    // -----------------------------------
    //  Google Login + Save To DB
    // -----------------------------------
    const handleGoogleSignIn = async () => {
        try {
            const result = await signInWithGoogle();
            const loggedUser = result.user;

            const email = loggedUser.email;
            const name = loggedUser.displayName;
            const imageURL = loggedUser.photoURL;

            const exists = await checkUserExists(email);

            if (!exists) {
                saveUserMutation.mutate({
                    name,
                    email,
                    image: imageURL,
                    role: "user",
                    createdAt: new Date(),
                });
            }

            toast.success("Login Successful");
            navigate(from, { replace: true });

        } catch (err) {
            console.log(err);
            toast.error(err.message);
        }
    };

    // Loading / Already Logged in
    if (loading) return <LoadingSpinner />;
    if (user) return <Navigate to={from} replace={true} />;

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="flex flex-col max-w-md p-6 mt-20 mb-20 rounded-md sm:p-10 bg-gray-100 text-gray-900 shadow-lg border">

                <div className="mb-8 text-center">
                    <h1 className="my-3 text-4xl font-bold">Log In</h1>
                    <p className="text-sm text-gray-400">
                        Sign in to access your account
                    </p>
                </div>

                {/* Login Form */}
                <form
                    onSubmit={handleSubmit(handleLogin)}
                    className="space-y-6"
                >
                    <div className="space-y-4">
                        {/* Email */}
                        <div className="relative">
                            <label htmlFor="email" className="block mb-2 text-sm">
                                Email address
                            </label>
                            <input
                                type="email"
                                placeholder="Enter Your Email"
                                className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-lime-500 bg-gray-200 text-gray-900"
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /\S+@\S+\.\S+/,
                                        message: "Enter a valid email",
                                    },
                                })}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="relative">
                            <label htmlFor="password" className="text-sm mb-2">
                                Password
                            </label>
                            <input
                                type={show ? "text" : "password"}
                                placeholder="*******"
                                className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-lime-500 bg-gray-200 text-gray-900"
                                {...register("password", {
                                    required: "Password is required",
                                })}
                            />

                            <span
                                onClick={() => setShow(!show)}
                                className="absolute right-5 top-10 cursor-pointer text-gray-600"
                            >
                                {show ? <FaEye /> : <FiEyeOff />}
                            </span>

                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Login Button */}
                    <div>
                        <button
                            type="submit"
                            className="bg-lime-500 w-full rounded-md py-3 text-white font-semibold hover:bg-lime-600 transition"
                        >
                            {loading ? <LoadingSpinner /> : "Continue"}
                        </button>
                    </div>
                </form>

                {/* Google Login */}
                <div className="flex items-center pt-4 space-x-1">
                    <div className="flex-1 h-px bg-gray-300"></div>
                    <p className="px-3 text-sm text-gray-400">or</p>
                    <div className="flex-1 h-px bg-gray-300"></div>
                </div>

                <div
                    onClick={handleGoogleSignIn}
                    className="flex justify-center items-center space-x-2 border m-3 p-2 border-gray-300 rounded-md cursor-pointer hover:bg-gray-200 transition"
                >
                    <FcGoogle size={28} />
                    <p className="font-medium">Continue with Google</p>
                </div>

                <p className="px-6 text-sm text-center text-gray-400">
                    Don&apos;t have an account yet?{" "}
                    <Link
                        state={from}
                        to="/auth/signup"
                        className="hover:underline hover:text-lime-500 text-gray-600"
                    >
                        Sign up
                    </Link>
                    .
                </p>
            </div>
        </div>
    );
};

export default Login;
