// import React from 'react';

// const Reports = () => {
//     return (
//         <div>
//             <h1 className='text-2xl mt-20 font-semibold'>Reports</h1>
            

//         </div>
//     );
// };

// export default Reports;


import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import LoadingSpinner from "../../Components/Shared/LoadingSpinner";

const Reports = () => {
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchReportedLessons = async () => {
        try {
            setLoading(true);
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/admin/reported-lessons`
            );
            setLessons(res.data);
        } catch {
            toast.error("Failed to load reports");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReportedLessons();
    }, []);

    const removeSingleReport = async (lessonId, reporterEmail) => {
        try {
            await axios.patch(
                `${import.meta.env.VITE_API_URL}/admin/lessons/${lessonId}/remove-report`,
                { reporterEmail }
            );
            toast.success("Report removed");
            fetchReportedLessons();
        } catch {
            toast.error("Failed to remove report");
        }
    };

    const clearAllReports = async (lessonId) => {
        if (!confirm("Clear all reports for this lesson?")) return;

        try {
            await axios.patch(
                `${import.meta.env.VITE_API_URL}/admin/lessons/${lessonId}/clear-reports`
            );
            toast.success("All reports cleared");
            fetchReportedLessons();
        } catch {
            toast.error("Failed to clear reports");
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">
                Reported Lessons
            </h2>

            {lessons.map((lesson) => (
                <div
                    key={lesson._id}
                    className="border rounded p-4 mb-6"
                >
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-semibold">
                            {lesson.title}
                        </h3>
                        <span className="badge badge-error">
                            {lesson.reportCount} Reports
                        </span>
                    </div>

                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>Reporter</th>
                                <th>Reason</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lesson.reports.map((report, idx) => (
                                <tr key={idx}>
                                    <td>{report.reporterEmail}</td>
                                    <td>{report.reason}</td>
                                    <td>
                                        <button
                                            className="btn btn-xs btn-error"
                                            onClick={() =>
                                                removeSingleReport(
                                                    lesson._id,
                                                    report.reporterEmail
                                                )
                                            }
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="text-right mt-3">
                        <button
                            onClick={() =>
                                clearAllReports(lesson._id)
                            }
                            className="btn btn-sm btn-warning"
                        >
                            Clear All Reports
                        </button>
                    </div>
                </div>
            ))}

            {lessons.length === 0 && (
                <p className="text-center text-gray-500">
                    No reported lessons 🎉
                </p>
            )}
        </div>
    );
};

export default Reports;
