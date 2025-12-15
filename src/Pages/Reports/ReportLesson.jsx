import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import useAuth from "../../Hooks/useAuth";
import { useNavigate } from "react-router";

const ReportLesson = ({ lessonId }) => {
    // console.log(lessonId);
    const { user } = useAuth();
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const [reason, setReason] = useState("");
    const [loading, setLoading] = useState(false);

    const handleOpenReport = () => {
        if (!user) {
            toast.error("Please login first");
            navigate("/auth/login");
            return;
        }
        setOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!reason.trim()) {
            toast.error("Please enter a reason");
            return;
        }

        try {
            setLoading(true);

            await axios.post(
                `${import.meta.env.VITE_API_URL}/lessons/report/${lessonId}`,
                {
                    reason,
                    reporterEmail: user.email,
                }
            );

            toast.success("Lesson reported successfully");
            setOpen(false);
            setReason("");
        } catch (err) {
            if (err.response?.status === 409) {
                toast.error("You already reported this lesson");
            } else {
                toast.error("Failed to report lesson");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                onClick={handleOpenReport}
            >
                Report
            </button>

            {open && (
                <dialog open className="modal">
                    <div className="modal-box max-w-md">
                        <h3 className="font-bold text-lg mb-3">
                            Report Lesson
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="email"
                                className="input w-full border bg-gray-100"
                                value={user?.email || ""}
                                disabled
                            />
                            <textarea
                                className="textarea w-full border"
                                placeholder="Enter reason for reporting"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                rows={4}
                                required
                            />
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    className="btn btn-sm"
                                    onClick={() => setOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-sm btn-error"
                                    disabled={loading}
                                >
                                    {loading ? "Submitting..." : "Submit"}
                                </button>
                            </div>
                        </form>
                    </div>
                </dialog>
            )}
        </>
    );
};

export default ReportLesson;
