import React, { useEffect, useState } from "react";
import MyLink from "./MyLink";
import { Link, } from "react-router";

import Container from "../Container";
import { AuthContext } from "../../../Providers/AuthContext";

const Navbar = () => {
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
    //   const { user} = useContext(AuthContext);

    //   const navigate = useNavigate();
    useEffect(() => {
        const html = document.querySelector("html");
        html.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);
    const handelTheme = (checked) => {
        setTheme(checked ? "dark" : "light");
    };
    //   const handleLogOut = () => {
    //     logOut()
    //       .then(() => {
    //         navigate("/");
    //       })
    //       .catch((error) => {
    //         console.log(error);
    //       });
    //   };

    const navItems = (
        <>
            <li>
                <MyLink to="/" className={'text-base font-medium'}>Home</MyLink>
            </li>
            <li>
                <MyLink to="/about" className={'text-base font-medium'}>About</MyLink>
            </li>
            <div className="text-base font-medium flex flex-col lg:flex-row">
                <li>
                    <MyLink to="/AddTransaction">Add Lesson</MyLink>
                </li>
                <li>
                    <MyLink to="/MyTransactions">My Lessons</MyLink>
                </li>
                <li>
                    <MyLink to="/MyTransactions">Favorites</MyLink>
                </li>
                <li>
                    <MyLink to="/Reports">Reports</MyLink>
                </li>
            </div>
        </>
    );

    return (
        <div className="bg-base-300 shadow-sm fixed top-0 left-0 w-full  to-0 z-50">
            <Container>
                <div className="navbar p-0 ">
                    <div className="navbar-start">
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
                                    />{" "}
                                </svg>
                            </div>
                            <ul
                                tabIndex="-1"
                                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
                            >
                                {navItems}
                            </ul>

                        </div>
                        <Link to="/" className="text-2xl font-bold">
                            Digital <span className="text-[#875DF8]">Life Lessons</span>
                        </Link>
                    </div>
                    <div className="navbar-center hidden lg:flex">
                        <ul className="menu menu-horizontal px-1">{navItems}</ul>
                    </div>
                    <div className="navbar-end ">
                        {/* theme toggle */}
                        <label className="toggle text-base-content mr-5">
                            <input
                                type="checkbox"
                                value="synthwave"
                                className="theme-controller"
                                onChange={(e) => handelTheme(e.target.checked)}
                            />

                            <svg
                                aria-label="sun"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                            >
                                <g
                                    strokeLinejoin="round"
                                    strokeLinecap="round"
                                    strokeWidth="2"
                                    fill="none"
                                    stroke="currentColor"
                                >
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
                            <svg
                                aria-label="moon"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                            >
                                <g
                                    strokeLinejoin="round"
                                    strokeLinecap="round"
                                    strokeWidth="2"
                                    fill="none"
                                    stroke="currentColor"
                                >
                                    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
                                </g>
                            </svg>
                        </label>
                        {/*  user avatar */}
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                                <div className="w-10 rounded-full">
                                    <img
                                        alt="Tailwind CSS Navbar component"
                                        src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                                </div>
                            </div>
                            <ul
                                tabIndex="-1"
                                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                                <li>
                                    <a className="justify-between">
                                        Profile
                                        <span className="badge">New</span>
                                    </a>
                                </li>
                                <li><a>Dashboard</a></li>
                                <li><a>Logout</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default Navbar;