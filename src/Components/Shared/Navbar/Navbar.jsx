import React, { useEffect, useState } from "react";
import MyLink from "./MyLink";
import { Link } from "react-router";
import Container from "../Container";
import useAuth from "../../../Hooks/useAuth";
import avatarImg from "../../../assets/placeholder.jpg";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import useUsers from "../../../Hooks/ShareAllApi/useUsers";

const Navbar = () => {
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
    const { user, logOut } = useAuth();
    const { data: users = [], } = useUsers( )
    const currentUser = users.find(u => u.email === user?.email);
    const userPlan = currentUser?.plan;
    const userRole = currentUser?.role;
  
    const useUserRole = (email) => {
        return useQuery({
            queryKey: ["userRole", email],
            queryFn: async () => {
                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}/user?email=${email}`
                );
                return res.data;
            },
            enabled: !!email,
        });
    };

    // const { data: userData } = useUserRole(user?.email);
    const { data: userDB } = useUserRole(user?.email);

    // console.log(userDB);

    const photoURL = userDB?.photoURL || userDB?.image;

    // console.log(photoURL);

    // Theme Handler
    useEffect(() => {
        const html = document.querySelector("html");
        html.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const handelTheme = (checked) => {
        setTheme(checked ? "dark" : "light");
    };

    const handleLogOut = () => {
        logOut()
            .then(() => console.log("Logged out"))
            .catch((error) => console.log(error));
    };

    // Navigation Items
    const navItems = (
        <>
            <div className="flex justify-between">
                <li>
                    <MyLink to="/" className="text-base font-medium">Home</MyLink>
                </li>

                {/* Theme Toggle */}
                <label className="toggle lg:hidden  text-base-content mr-5">
                    <input
                        type="checkbox"
                        className="theme-controller"
                        onChange={(e) => handelTheme(e.target.checked)}
                        checked={theme === "dark"}
                    />
                    <svg aria-label="sun" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor">
                            <circle cx="12" cy="12" r="4"></circle>
                            <path d="M12 2v2"></path>
                            <path d="M12 20v2"></path>
                            <path d="m4.93 4.93 1.41 1.41"></path>
                            <path d="m17.66 17.66 1.41 1.41"></path>
                            <path d="M2 12h2"></path>
                            <path d="M20 12h2"></path>
                            <path d="m6.34 17.66-1.41 1.41"></path>
                            <path d="m19.07 4.93-1.41 1.41"></path>
                        </g>
                    </svg>
                    <svg aria-label="moon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor">
                            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
                        </g>
                    </svg>
                </label>
            </div>

            <li>
                <MyLink to="/about" className="text-base font-medium">About</MyLink>
            </li>
            <li>
                <MyLink to="/contact" className="text-base font-medium">Contact</MyLink>
            </li>

            <div className="text-base font-medium flex flex-col lg:flex-row">
                <li>
                    <MyLink to="/add-lessons">Add Lesson</MyLink>
                </li>
                {/* <li>
                    <MyLink to="/my-lessons">My Lessons</MyLink>
                </li> */}
                <li>
                    <MyLink to="/public-lessons">Public Lessons </MyLink>
                </li>
                <li>
                    <MyLink to="/favorite-lessons">Favorites Lessons</MyLink>
                </li>
            </div>
        </>
    );

    return (
        <div className="bg-base-300 shadow-sm fixed top-0 left-0 w-full z-50">
            <Container>
                <div className="navbar p-0">

                    {/* Left Side */}
                    <div className="navbar-start">
                        {/* Mobile Menu */}
                        <div className="dropdown">
                            <div
                                tabIndex={0}
                                role="button"
                                className="btn btn-ghost lg:hidden"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h8m-8 6h16"
                                    />
                                </svg>
                            </div>

                            <ul
                                tabIndex="-1"
                                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
                            >
                                {navItems}
                                {/* User Plan Button / Badge */}
                                {user && userPlan === "free" && (
                                    <Link to="/pricing" className="btn text-base-200 bg-purple-500 mr-2">
                                        Upgrade to Pro
                                    </Link>
                                )}

                                {user && userPlan === "premium" && (
                                    <span className="badge badge-warning mr-2">
                                        Premium ⭐
                                    </span>
                                )}

                            </ul>
                        </div>

                        <Link to="/" className="text-sm md:text-2xl font-bold">
                            Digital <span className="text-[#875DF8]">Life Lessons</span>
                        </Link>
                    </div>

                    {/* Center Menu */}
                    <div className="navbar-center hidden lg:flex">
                        <ul className="menu menu-horizontal px-1">{navItems}</ul>
                    </div>


                    {/* Right Side */}
                    <div className="navbar-end">
                        {/* User Plan Button / Badge */}
                        {user && userPlan === "free" && (
                            <Link to="/pricing" className="btn text-base-200 hidden md:flex bg-purple-500 mr-2">
                                Upgrade to Pro
                            </Link>
                        )}

                        {user && userPlan === "premium" && (
                            <span className="badge badge-warning hidden md:flex mr-2">
                                Premium ⭐
                            </span>
                        )}


                        {/* User Avatar */}
                        <div className="dropdown dropdown-end">
                            <div
                                tabIndex={0}
                                role="button"
                                className="btn btn-ghost btn-circle avatar"
                            >
                                <div className="w-10 rounded-full">
                                    <img
                                        className="rounded-full"
                                        referrerPolicy="no-referrer"
                                        src={photoURL || avatarImg}
                                        alt="profile"
                                    />
                                </div>
                            </div>

                            <ul
                                tabIndex="-1"
                                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
                            >

                                {/* Theme Toggle */}
                                <label className="toggle text-base-content mr-5">
                                    <input
                                        type="checkbox"
                                        className="theme-controller"
                                        onChange={(e) => handelTheme(e.target.checked)}
                                        checked={theme === "dark"}
                                    />
                                    <svg aria-label="sun" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor">
                                            <circle cx="12" cy="12" r="4"></circle>
                                            <path d="M12 2v2"></path>
                                            <path d="M12 20v2"></path>
                                            <path d="m4.93 4.93 1.41 1.41"></path>
                                            <path d="m17.66 17.66 1.41 1.41"></path>
                                            <path d="M2 12h2"></path>
                                            <path d="M20 12h2"></path>
                                            <path d="m6.34 17.66-1.41 1.41"></path>
                                            <path d="m19.07 4.93-1.41 1.41"></path>
                                        </g>
                                    </svg>

                                    <svg aria-label="moon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor">
                                            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
                                        </g>
                                    </svg>
                                </label>
                                {user ? (
                                    <>
                                        <h1 className="px-4 py-3 text-xl font-semibold">
                                            {userRole?.displayName || user.displayName}
                                        </h1>

                                        <Link
                                            to={
                                                userRole === "admin" ? "/dashboard" : "/userprofile"
                                            }
                                            className="px-4 py-3 hover:bg-base-100 transition font-semibold"
                                        >
                                            {userRole === "admin" ? "Dashboard" : "My Dashboard"}
                                        </Link>
                                    
                                        <Link
                                            to={
                                                userRole === "admin" ? "/dashboard/reports" : "/my-lessons"
                                            }
                                            className ="px-4 py-3 hover:bg-base-100 transition font-semibold"
                                        >
                                            {userRole === "admin" ? "Reports" : "My Lessons"}
                                        </Link>
                                        <Link
                                            to={
                                                userRole === "admin" ? "/dashboard/admin-profile" : "/user-pay-history"
                                            }
                                            className ="px-4 py-3 hover:bg-base-100 transition font-semibold"
                                        >
                                            {userRole === "admin" ? "Admin Profile" : "Payment History"}
                                        </Link>

                                        <div
                                            onClick={handleLogOut}
                                            className="px-4 py-3 hover:bg-base-100 transition font-semibold cursor-pointer"
                                        >
                                            Logout
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            to="/auth/login"
                                            className="px-4 hover:bg-purple-300 py-3 mt-2  transition font-semibold"
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            to="/auth/signup"
                                            className="px-4 py-3 hover:bg-purple-300  transition font-semibold"
                                        >
                                            Sign Up
                                        </Link>
                                    </>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default Navbar;