import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import useAuth from "../../Hooks/useAuth";
import { useNavigate } from "react-router";

const ReportLesson = ({ lessonId, reportedUserEmail }) => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const [reason, setReason] = useState("");
    const [otherReason, setOtherReason] = useState("");
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
            toast.error("Please select a reason");
            return;
        }

        // If "Other" is selected, require text
        if (reason === "Other" && !otherReason.trim()) {
            toast.error("Please provide details for 'Other'");
            return;
        }

        try {
            setLoading(true);

            await axios.post(
                `${import.meta.env.VITE_API_URL}/lessons/report/${lessonId}`,
                {
                    lessonId,
                    reporterUserId: user?._id,
                    reporterEmail: user?.email,
                    reportedUserEmail,
                    reason: reason === "Other" ? otherReason : reason,
                    timestamp: new Date().toISOString(),
                }
            );

            toast.success("Lesson reported successfully");
            setOpen(false);
            setReason("");
            setOtherReason("");
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
                className="badge badge-outline"
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
                                className="input w-full border bg-base-100"
                                value={user?.email || ""}
                                disabled
                            />

                            {/* Dropdown for reason */}
                            <select
                                className="select w-full border"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                required
                            >
                                <option value="">Select reason</option>
                                <option value="Inappropriate Content">Inappropriate Content</option>
                                <option value="Hate Speech or Harassment">Hate Speech or Harassment</option>
                                <option value="Misleading or False Information">Misleading or False Information</option>
                                <option value="Spam or Promotional Content">Spam or Promotional Content</option>
                                <option value="Sensitive or Disturbing Content">Sensitive or Disturbing Content</option>
                                <option value="Other">Other</option>
                            </select>

                            {/* Show textarea only if "Other" is selected */}
                            {reason === "Other" && (
                                <textarea
                                    className="textarea w-full border"
                                    placeholder="Please describe the issue"
                                    value={otherReason}
                                    onChange={(e) => setOtherReason(e.target.value)}
                                    rows={4}
                                    required
                                />
                            )}

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
