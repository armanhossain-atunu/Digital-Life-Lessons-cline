import React from "react";
import { FaGithubSquare, FaLinkedin } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { Link } from "react-router";

const Footer = () => {
    return (
        <div>
            <footer className="footer flex justify-between items-center flex-wrap bg-base-200 text-base-content p-10">
                <aside>
                    <img
                        src="http://localhost:5173/src/assets/logo-white.png"
                        alt=""
                        className="filter brightness-0"
                    />
                    <p>
                        <Link to="/" className="text-2xl font-bold">
                            Digital <span className="text-[#875DF8]">Life Lessons</span>
                        </Link>
                        <br />
                        Providing reliable tech since 1992
                    </p>
                </aside>
                <nav>
                    <h6 className="footer-title">Services</h6>
                    <a className="link link-hover">Branding</a>
                    <a className="link link-hover">Design</a>
                    <a className="link link-hover">Marketing</a>
                    <a className="link link-hover">Advertisement</a>
                </nav>
                <nav>
                    <h6 className="footer-title">Company</h6>
                    <a className="link link-hover">About us</a>
                    <a className="link link-hover">Contact</a>
                    <a className="link link-hover">Jobs</a>
                    <a className="link link-hover">Press kit</a>
                </nav>
                <nav>
                    <h4>Follow Us</h4>
                    <div className="text-3xl flex gap-3 ">
                        <Link to="https://linkedin.com/login" target="_blank">
                            <FaLinkedin />
                        </Link>
                        <Link to="https://github.com/login" target="_blank">
                            <FaGithubSquare />
                        </Link>
                        <Link to="https://x.com/login" target="_blank">
                            <FaSquareXTwitter />
                        </Link>
                    </div>
                </nav>
            </footer>
            <footer className="footer sm:footer-horizontal footer-center bg-base-300 text-base-content p-4">
                <aside>
                    <p>
                        Copyright © {new Date().getFullYear()} - All right reserved by
                        <Link to="/">
                            Fin<span className="text-[#875DF8]">Ease</span>
                        </Link>
                    </p>
                </aside>
            </footer>
        </div>
    );
};

export default Footer;