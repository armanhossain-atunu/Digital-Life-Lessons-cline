import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import useAuth from "../../Hooks/useAuth";

const ReportLesson = ({ lessonId }) => {
    const { user } = useAuth()
    console.log(user)
    const [open, setOpen] = useState(false);
    const [reason, setReason] = useState("");
    const [email, setEmail] = useState("");

    const reportMutation = useMutation({
        mutationFn: async (data) => {
            return axios.post(`${import.meta.env.VITE_API_URL}/lessons/report/${lessonId}`, data);;
        },
        onSuccess: () => {
            toast.success("Lesson reported successfully");
            setOpen(false);
            setReason("");
            setEmail("");
        },
        onError: (err) => {
            if (err.response?.status === 409) {
                toast.error("You already reported this lesson");
            } else {
                toast.error("Failed to report lesson");
            }
        },
    });
    console.log(reportMutation);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!reason.trim() || !email.trim()) {
            toast.error("Please enter both reason and email");
            return;
        }
        reportMutation.mutate({ reason, reporterEmail: email });
    };

    return (
        <>
            <button
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                onClick={() => setOpen(true)}
            >
                Report
            </button>

            {open && (
                <dialog open className="modal">
                    <div className="modal-box max-w-md">
                        <h3 className="font-bold text-lg mb-3">Report Lesson</h3>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="email"
                                placeholder="Your email"
                                className="input w-full border"
                                defaultValue={user?.email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
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
                                    className="btn btn-sm btn-red"
                                >
                                    Submit
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
