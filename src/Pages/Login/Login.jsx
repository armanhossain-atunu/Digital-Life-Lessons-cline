import { Link, Navigate, useNavigate } from "react-router";
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
  const { signIn, signInWithGoogle, loading, setLoading } = useAuth();

  const navigate = useNavigate();
  const [show, setShow] = useState(false);


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
  // -----------------------------------
  // Admin Auto & users Login
  // -----------------------------------
  const handleAdminLogin = () => {
    handleLogin({
      email: "admin2@dll.com",
      password: "Admin@123",
    });
  };

  const handleUserLogin = () => {
    handleLogin({
      email: "codefiy@dll.com",
      password: "Admin@123",
    });
  };
  // -----------------------------------
  // Email + Password Login
  // -----------------------------------
  const handleLogin = async (data) => {
    try {
      await signIn(data.email, data.password);
      toast.success("Login Successful");
      navigate('/');
    } catch (error) {
      setLoading(false)
      const errorCode = error.code;
      switch (errorCode) {
        case "auth/invalid-email":
          toast.error("Invalid email format");
          break;
        case "auth/user-not-found":
          toast.error("No account found with this email");
          break;
        case "auth/wrong-password":
          toast.error("Incorrect password");
          break;
        case "auth/invalid-credential":
          toast.error("Invalid credentials. Please try again");
          break;
        case "auth/network-request-failed":
          toast.error("Network error. Check your connection");
          break;
        default:
          toast.error("Login failed. Please try again");
      }
    }
  };

  // -----------------------------------
  // Google Login + Save To DB
  // -----------------------------------
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithGoogle();
      const user = result.user;

      await saveUserMutation.mutateAsync({
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        role: "user",
        plan: "free",
        createdAt: new Date().toLocaleString(),
      });

      toast.success("Signup Successful");
      navigate('/');
    } catch (err) {
      console.error(err);
      toast.error("Google login failed. Please try again");
    }
  };

  // Loading / Already Logged in
  if (loading) return <LoadingSpinner />;


  return (
    <div className="flex flex-col md:flex-row justify-center items-center min-h-screen bg-base-50">
      {/* Login Form */}
      <div className="flex flex-col max-w-md p-6 sm:p-10 rounded-md bg-base-100 shadow-lg border md:mr-10">
        <div className="mb-8 text-center">
          <h1 className="my-3 text-4xl font-bold">Log In</h1>
          <p className="text-sm text-base-400">Sign in to access your account</p>
        </div>

        <form onSubmit={handleSubmit(handleLogin)} className="space-y-6">
          {/* Email */}
          <div className="relative">
            <label htmlFor="email" className="block mb-2 text-sm">
              Email address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-3 py-2 border rounded-md border-base-300 focus:outline-none focus:ring-2 focus:ring-lime-500 bg-base-100 text-base-900"
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
            <label htmlFor="password" className="block mb-2 text-sm">
              Password
            </label>
            <input
              type={show ? "text" : "password"}
              placeholder="*******"
              className="w-full px-3 py-2 border rounded-md border-base-300 focus:outline-none focus:ring-2 focus:ring-lime-500 bg-base-100 text-base-900"
              {...register("password", {
                required: "Password is required",
              })}
            />
            <span
              onClick={() => setShow(!show)}
              className="absolute right-3 top-10 cursor-pointer text-base-600"
            >
              {show ? <FaEye /> : <FiEyeOff />}
            </span>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-md bg-lime-500 text-base-100 font-semibold hover:bg-lime-600 transition"
          >
            Log In
          </button>


        </form>
        {/* Admin & User Buttons */}
        <div className="flex justify-center gap-4 mt-5">
          <button
            onClick={handleAdminLogin}
            className="w-full py-3 rounded-md bg-lime-500 text-base-100 font-semibold hover:bg-lime-600 transition"
          >
            Admin
          </button>

          <button 
          onClick={handleUserLogin}
          className="w-full py-3 rounded-md bg-lime-500 text-base-100 font-semibold hover:bg-lime-600 transition">
            User
          </button>
        </div>

        {/* OR Divider */}
        <div className="flex items-center pt-4 space-x-2">
          <div className="flex-1 h-px bg-base-300"></div>
          <p className="px-3 text-sm text-base-400">or</p>
          <div className="flex-1 h-px bg-base-300"></div>
        </div>

        {/* Google Login */}
        <div
          onClick={handleGoogleSignIn}
          className="flex justify-center items-center space-x-2 border border-base-300 rounded-md py-2 mt-3 cursor-pointer hover:bg-base-100 transition"
        >
          <FcGoogle size={28} />
          <p className="font-medium">Continue with Google</p>
        </div>

        {/* Signup Link */}
        <p className="px-6 text-sm text-center text-gray-400 mt-4">
          Don't have an account yet?{" "}
          <Link
            to="/auth/signup"
            className="text-lime-500 hover:underline"
          >
            Sign up
          </Link>
          .
        </p>
      </div>

      {/* Image / Animation */}
      <div className="mt-8 md:mt-0 ">
        <img
          src="https://assets-v2.lottiefiles.com/a/7635dd88-116a-11ee-b318-ffcf40e06a51/3b8KwGTSsy.gif"
          alt="Login Animation"
          className="hidden rounded-md md:block w-80 md:w-[450px] h-80 md:h-[559px] object-cover"
        />
      </div>
    </div>
  );
};

export default Login;
