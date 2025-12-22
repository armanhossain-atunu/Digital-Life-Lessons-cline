import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import LoadingSpinner from "../../Components/Shared/LoadingSpinner";

const ReportLesson = ({ lessonId }) => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [loading, setLoading] = useState(false);

  //  Get lessons with reports
  const { data: reportedLessons = [], isLoading } = useQuery({
    queryKey: ["reported-lessons", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `${import.meta.env.VITE_API_URL}/admin/reported-lessons`
      );
      return res.data;
    },
  });

  // Find current user's report status
  const userReport = reportedLessons
    ?.find((lesson) => String(lesson._id) === String(lessonId))
    ?.reports?.find((r) => r.reporterEmail === user?.email);

  const reportStatus = userReport?.status;

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

    if (!reason) {
      toast.error("Please select a reason");
      return;
    }

    if (reason === "Other" && !otherReason.trim()) {
      toast.error("Please describe the issue");
      return;
    }

    try {
      setLoading(true);

      await axiosSecure.post(
        `${import.meta.env.VITE_API_URL}/lessons/report/${lessonId}`,
        {
          reporterName: user.displayName || "Anonymous",
          reporterEmail: user.email,
          reason: reason === "Other" ? otherReason : reason,
          status: "Pending",
        }
      );

      toast.success("Lesson reported successfully");

      //  REAL-TIME UI UPDATE (NO PAGE RELOAD)
      queryClient.invalidateQueries(["reported-lessons"]);

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

  if (isLoading) return <LoadingSpinner />;

  //  Status badge color
  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return "badge-warning";
      case "Resolved":
        return "badge-success";
      case "Rejected":
        return "badge-error";
      default:
        return "badge-outline";
    }
  };

  return (
    <>
      {/*  Report Button */}
      <button
        className="badge badge-outline"
        onClick={handleOpenReport}
        disabled={reportStatus === "Pending"}
      >
        {reportStatus === "Pending" ? "Reported" : "Report"}
      </button>
      {/* 🏷 Status */}
      {reportStatus && (
        <span className={`badge ml-2 ${getStatusClass(reportStatus)}`}>
          {reportStatus}
        </span>
      )}

      {/*  Modal */}
      {open && (
        <dialog open className="modal">
          <div className="modal-box max-w-md">
            <h3 className="font-bold text-lg mb-3">Report Lesson</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                className="input w-full border"
                value={user?.email}
                disabled
              />

              <select
                className="select w-full border"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              >
                <option value="">Select reason</option>
                <option value="Inappropriate Content">
                  Inappropriate Content
                </option>
                <option value="Hate Speech or Harassment">
                  Hate Speech or Harassment
                </option>
                <option value="Misleading or False Information">
                  Misleading or False Information
                </option>
                <option value="Spam or Promotional Content">
                  Spam or Promotional Content
                </option>
                <option value="Sensitive or Disturbing Content">
                  Sensitive or Disturbing Content
                </option>
                <option value="Other">Other</option>
              </select>

              {reason === "Other" && (
                <textarea
                  className="textarea w-full border"
                  placeholder="Describe the issue"
                  value={otherReason}
                  onChange={(e) => setOtherReason(e.target.value)}
                  rows={4}
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
