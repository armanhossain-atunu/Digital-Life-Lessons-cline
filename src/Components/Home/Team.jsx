import React from "react";
import { FaGithubSquare, FaLinkedin } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { Link } from "react-router";
import Container from "../Shared/Container";

const Team = () => {


    const teamMembers = [
        {
            name: "Arman Hossain Atunu",
            role: "Full Stack Developer",
            expertise: "React.js, Node.js, MongoDB, Tailwind CSS",
            image:
                "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=387",
        },
        {
            name: "Afsana Rahman",
            role: "UI/UX Designer",
            expertise: "Figma, Frontend Design, Branding",
            image:
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=464",
        },
        {
            name: "Rafiul Hasan",
            role: "Backend Engineer",
            expertise: "Express.js, REST API, Database Architecture",
            image:
                "https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=464",
        },
        {
            name: "Nusrat Jahan",
            role: "Project Manager",
            expertise: "Team Management, Agile Workflow, Product Strategy",
            image:
                "https://images.unsplash.com/photo-1758922584983-82ffd5720c6a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=431",
        },
    ];
    return (
        <div>
            <Container>
                <section>
                    <div className="flex flex-col items-center justify-center 6">
                        <h2 className="text-4xl mt-5 font-bold mb-4">Meet Our Team</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {teamMembers.map((member, index) => (

                                <div
                                    key={index} 
                                    data-aos="fade-up"
                                    data-aos-duration="1000"
                                    className="card group relative bg-white mb-5 dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:-translate-y-2 transition-all duration-300"
                                >
                                    <figure className=" pt-5">
                                        <img
                                            src={member.image}
                                            alt="Shoes"
                                            className="rounded-xl h-90"
                                        />
                                    </figure>
                                    <div className="card-body  items-center text-center">
                                        <h2 className="card-title font-bold">{member.name}</h2>
                                        <h2 className="text-[18px] font-medium">{member.role}</h2>
                                        <p>{member.expertise}</p>
                                        <div className="">
                                            <button className=" ">
                                                <div className="absolute inset-0 flex items-end justify-center text-2xl  pb-10  gap-4  transition-all duration-500 opacity-0 group-hover:opacity-100">
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
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </Container>
        </div>
    );
};

export default Team;