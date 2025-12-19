import { Link, useLocation, useNavigate } from 'react-router'
import { FcGoogle } from 'react-icons/fc'
import { toast } from 'react-hot-toast'
import { TbFidgetSpinner } from 'react-icons/tb'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { FaEye } from 'react-icons/fa'
import { FiEyeOff } from 'react-icons/fi'
import axios from 'axios'
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { imageUpload } from '../../../../Utils'
import useAuth from '../../../../Hooks/useAuth'
import LoadingSpinner from '../../../Shared/LoadingSpinner'

const SignUp = () => {
    const { createUser, updateUserProfile, signInWithGoogle, loading, setUser } = useAuth()
    const [show, setShow] = useState(false);
    const navigate = useNavigate()
    const location = useLocation()
    const from = location.state || '/'
    const queryClient = useQueryClient();

    // React Hook Form
    const { register, handleSubmit, formState: { errors } } = useForm()

    // ----------- SAVE USER TO DB (TanStack Query) ----------
    const saveUserMutation = useMutation({
        mutationKey: ["users"],
        mutationFn: async (userInfo) => {
            return await axios.post(`${import.meta.env.VITE_API_URL}/users`, userInfo);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["users"]);
        }
    });

    // -----------EMAIL SIGNUP ----------
    const handleCreateUser = async (data) => {
        const { name, image, email, password } = data;

        try {

            // Upload Image
            const imageURL = await imageUpload(image[0]);

            // Create User
            const result = await createUser(email, password);
            const createdUser = result.user;

            // Update Profile
            await updateUserProfile(name, imageURL);

            // Manually update context user (ensure UI updates)
            setUser({
                ...createdUser,
                displayName: name,
                photoURL: imageURL,
            });

            // Save user to DB
            // saveUserMutation.mutate({
            //     name,
            //     email,
            //     photoURL: imageURL,
            //     role: "user",
            //     plan: "free",
            //     createdAt: new Date().toLocaleString(),
            // });
            await saveUserMutation.mutateAsync({
                name,
                email,
                photoURL: imageURL,
                role: "user",
                plan: "free",
            });
            toast.success("Signup Successful");
            navigate(from, { replace: true });

        } catch (err) {
            console.log(err);
            toast.error(err.message);
        }
    };

    // -----------  GOOGLE SIGN-IN ----------
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
            });

            toast.success("Signup Successful");
            navigate(from, { replace: true });

        } catch (err) {
            toast.error(err.message);
        }
    };


    if (loading) return <LoadingSpinner />

    return (
        <div className='flex justify-center items-center min-h-screen'>
            <div className='flex flex-col max-w-md p-6 mt-20 mb-10 rounded-md sm:p-10 bg-gray-100 text-gray-900'>
                <div className='mb-8 text-center'>
                    <h1 className='my-3 text-4xl font-bold'>Sign Up</h1>
                    <p className='text-sm text-gray-400'>Welcome to Digital Life Lessons</p>
                </div>

                {/* SIGNUP FORM */}
                <form onSubmit={handleSubmit(handleCreateUser)} className='space-y-6'>
                    <div className='space-y-4'>
                        {/* Name */}
                        <div>
                            <label htmlFor='name' className='block mb-2 text-sm'>Name</label>
                            <input
                                type='text'
                                id='name'
                                placeholder='Enter Your Name Here'
                                className='w-full px-3 py-2 border rounded-md border-gray-300'
                                {...register('name', {
                                    required: 'Name is required',
                                    maxLength: { value: 20, message: 'Name cannot be too long' }
                                })}
                            />
                            {errors.name && (
                                <p className='text-red-500 text-xs mt-1'>{errors.name.message}</p>
                            )}
                        </div>

                        {/* Profile Image */}
                        <div>
                            <label htmlFor='image' className='block mb-2 text-sm'>Profile Image</label>
                            <input
                                type='file'
                                id='image'
                                accept='image/*'
                                className='w-full text-sm bg-base-100 border border-dashed p-2'
                                {...register('image')}
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor='email' className='block mb-2 text-sm'>Email</label>
                            <input
                                type='email'
                                id='email'
                                placeholder='Enter Your Email Here'
                                className='w-full px-3 py-2 border rounded-md border-gray-300'
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                        message: 'Enter a valid email'
                                    }
                                })}
                            />
                            {errors.email && (
                                <p className='text-red-500 text-xs mt-1'>{errors.email.message}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div className='relative'>
                            <label htmlFor='password' className='text-sm mb-2'>Password</label>
                            <input
                                type={show ? "text" : "password"}
                                id='password'
                                placeholder='*******'
                                className='w-full px-3 py-2 border rounded-md border-gray-300'
                                {...register('password', {
                                    required: 'Password is required',
                                    pattern: {
                                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
                                        message: 'Password must contain uppercase, lowercase, number & special char'
                                    }
                                })}
                            />
                            {errors.password && (
                                <p className='text-red-500 text-xs mt-1'>{errors.password.message}</p>
                            )}
                            <span
                                onClick={() => setShow(!show)}
                                className="absolute right-5 top-[41px] cursor-pointer">
                                {show ? <FaEye /> : <FiEyeOff />}
                            </span>
                        </div>
                    </div>

                    <button type="submit" className='bg-lime-500 w-full cursor-pointer rounded-md py-3 text-white'>
                        {loading ? <TbFidgetSpinner className='animate-spin m-auto' /> : 'Sign Up'}
                    </button>
                </form>

                {/* Google Login */}
                <div className='flex items-center pt-4 space-x-1'>
                    <div className='flex-1 h-px bg-gray-300'></div>
                    <p className='px-3 text-sm'>Signup with social accounts</p>
                    <div className='flex-1 h-px bg-gray-300'></div>
                </div>

                <div onClick={handleGoogleSignIn}
                    className='flex justify-center my-3 items-center space-x-2 border p-2 cursor-pointer'>
                    <FcGoogle size={32} />
                    <p>Continue with Google</p>
                </div>

                <p className='px-6 text-sm text-center text-gray-400'>
                    Already have an account?
                    <Link to='/auth/login' className='hover:underline hover:text-lime-500'>Login</Link>.
                </p>
            </div>
        </div>
    )
}

export default SignUp