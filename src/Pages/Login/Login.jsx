import { Link, Navigate, useLocation, useNavigate } from 'react-router'
import toast from 'react-hot-toast'
import { FcGoogle } from 'react-icons/fc'
import LoadingSpinner from '../../Components/Shared/LoadingSpinner'
import useAuth from '../../Hooks/useAuth'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { FaEye } from 'react-icons/fa'
import { FiEyeOff } from 'react-icons/fi'


const Login = () => {
    const { signIn, signInWithGoogle, updateUserProfile, loading, user, setLoading } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const [show, setShow] = useState(false);
    const from = location.state?.from?.pathname || '/'
    // React Hook Form
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm()

    if (loading) return <LoadingSpinner />
    if (user) return <Navigate to={from} replace={true} />
    // form submit handler
    const handleLogin = async data => {
        try {
            //User Login
            await signIn(data.email, data.password)
            navigate(from, { replace: true })
            toast.success('Login Successful')
        } catch (err) {
            console.log(err)
            setLoading(false)
            toast.error(err?.message)
        }
    };
    // Handle Google Signin
    const handleGoogleSignIn = async () => {
        try {
            //User Registration using google
            const { user } = await signInWithGoogle()
            await updateUserProfile(
                user?.displayName,
                user?.photoURL,
            )
            navigate(from, { replace: true })
            toast.success('Login Successful')
        } catch (err) {
            console.log(err)
            setLoading(false)
            toast.error(err?.message)
        }
    };
    return (
        <div className='flex justify-center items-center  min-h-screen '>
            <div className='flex flex-col max-w-md p-6 mt-20 mb-20 rounded-md sm:p-10 bg-gray-100 text-gray-900'>
                <div className='mb-8 text-center'>
                    <h1 className='my-3 text-4xl font-bold'>Log In</h1>
                    <p className='text-sm text-gray-400'>
                        Sign in to access your account
                    </p>
                </div>
                {/* Login Form */}
                <form
                    onSubmit={handleSubmit(handleLogin)}
                    noValidate=''
                    action=''
                    className='space-y-6 ng-untouched ng-pristine ng-valid'
                >
                    <div className='space-y-4'>
                        <div className='relative'>
                            <label htmlFor='email' className='block mb-2 text-sm'>
                                Email address
                            </label>
                            <input
                                type='email'
                                name='email'
                                id='email'
                                required
                                placeholder='Enter Your Email Here'
                                className='w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-lime-500 bg-gray-200 text-gray-900'
                                data-temp-mail-org='0'
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /\S+@\S+\.\S+/, 
                                        message: 'Enter a valid email',
                                    },
                                })}
                            />
                        </div>
                        <div className='relative'>
                            <div className='flex justify-between'>
                                <label htmlFor='password' className='text-sm mb-2'>
                                    Password
                                </label>
                            </div>
                            <input
                                type={show ? "text" : "password"}
                                autoComplete='new-password'
                                name='password'
                                placeholder='*******'
                                className='w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-lime-500 bg-gray-200 text-gray-900'
                                {...register('password', {
                                    required: 'Password is required',
                                    pattern: {
                                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
                                        message: 'Password must contain uppercase, lowercase, number & special character',
                                    },
                                })}
                            />
                            {errors.password && (
                                <p className='text-red-500 text-xs mt-1'>
                                    {errors.password.message}
                                </p>
                            )}

                            {/* Show Password */}
                            <span
                                onClick={() => {
                                    setShow(!show);
                                }}
                                className="absolute right-5 top-10 z-50 cursor-pointer"
                            >
                                {show ? <FaEye></FaEye> : <FiEyeOff></FiEyeOff>}
                            </span>

                        </div>

                    </div>

                    <div>
                        <button
                            type='submit'
                            className='bg-lime-500 w-full rounded-md py-3 text-white'
                        >
                            {loading ? (
                                <LoadingSpinner className='animate-spin m-auto' />
                            ) : (
                                'Continue'
                            )}
                        </button>
                    </div>
                </form>
                <div className='space-y-1'>
                    <button className='text-xs hover:underline hover:text-lime-500 text-gray-400 cursor-pointer'>
                        Forgot password?
                    </button>
                </div>
                <div className='flex items-center pt-4 space-x-1'>
                    <div className='flex-1 h-px sm:w-16 dark:bg-gray-700'></div>
                    <p className='px-3 text-sm dark:text-gray-400'>
                        Login with social accounts
                    </p>
                    <div className='flex-1 h-px sm:w-16 dark:bg-gray-700'></div>
                </div>
                <div
                    onClick={handleGoogleSignIn}
                    className='flex justify-center items-center space-x-2 border m-3 p-2 border-gray-300 border-rounded cursor-pointer'
                >
                    <FcGoogle size={32} />

                    <p>Continue with Google</p>
                </div>
                <p className='px-6 text-sm text-center text-gray-400'>
                    Don&apos;t have an account yet?{' '}
                    <Link
                        state={from}
                        to='/auth/signup'
                        className='hover:underline hover:text-lime-500 text-gray-600'
                    >
                        Sign up
                    </Link>
                    .
                </p>
            </div>
        </div>
    )
}

export default Login