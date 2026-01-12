import React, { useState } from "react";
import toast from "react-hot-toast";
import { BiCheckCircle } from "react-icons/bi";

const jobs = [
    {
        id: 1,
        title: "Frontend Developer",
        company: "FinEase",
        location: "Dhaka, Bangladesh",
        type: "Full Time",
        salary: "৳40k - ৳70k",
    },
    {
        id: 2,
        title: "Backend Developer (Node.js)",
        company: "FinEase",
        location: "Remote",
        type: "Remote",
        salary: "৳50k - ৳90k",
    },
    {
        id: 3,
        title: "UI/UX Designer",
        company: "FinEase",
        location: "Dhaka",
        type: "Part Time",
        salary: "৳30k - ৳50k",
    },
];

const Jobs = () => {
    const [appliedJobs, setAppliedJobs] = useState([]);

    const handleApply = (job) => {
        // Prevent duplicate apply
        if (appliedJobs.includes(job.id)) return;

        toast.success(`Applied successfully for ${job.title} 🎉`, {
            position: "top-right",
            autoClose: 3000,
            progressClassName: "!bg-[#875df8]",
            icon: <BiCheckCircle className="text-[#875df8] w-5 h-5"/>
    });

        setAppliedJobs([...appliedJobs, job.id]);
    };

    return (
        <div className="min-h-screen bg-base-50">
            <div className="max-w-6xl mx-auto px-4 mt-17 py-10">

                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold mb-3">
                        Explore <span className="text-[#875DF8]">Jobs</span>
                    </h1>
                    <p className="text-base-500 text-lg">
                        Apply once and track your applications
                    </p>
                </div>

                {/* Jobs Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {jobs.map((job) => {
                        const isApplied = appliedJobs.includes(job.id);

                        return (
                            <div
                                key={job.id}
                                data-aos="flip-right"
                                data-aos-duration="1000"
                                className="bg-base-200 rounded-xl shadow p-6"
                            >
                                <h2 className="text-xl font-semibold mb-1">
                                    {job.title}
                                </h2>

                                <p className="text-base-600 font-medium">
                                    {job.company}
                                </p>

                                <div className="mt-3 space-y-1 text-sm text-base-500">
                                    <p>📍 {job.location}</p>
                                    <p>💼 {job.type}</p>
                                    <p>💰 {job.salary}</p>
                                </div>

                                <button
                                    disabled={isApplied}
                                    onClick={() => handleApply(job)}
                                    className={`mt-5 w-full py-2 rounded-lg font-semibold transition
                    ${isApplied
                                            ? "bg-base-300 text-base-500 cursor-not-allowed"
                                            : "bg-[#875DF8] text-base-100 hover:bg-[#6f48e6]"
                                        }
                  `}
                                >
                                    {isApplied ? "Applied" : "Apply Now"}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Toast */}
           
        </div>
    );
};

export default Jobs;