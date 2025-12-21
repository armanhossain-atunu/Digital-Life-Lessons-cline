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

  // Remove single report
  const removeSingleReport = (lessonId, reporterEmail) => {
    toast((t) => (
      <div className="p-4 bg-white rounded-lg shadow-lg">
        <p className="font-medium">Remove this report?</p>
        <div className="flex justify-end gap-3 mt-4">
          <button
            className="px-4 py-2 bg-red-600 text-white rounded"
            onClick={async () => {
              try {
                await axios.patch(
                  `${import.meta.env.VITE_API_URL}/admin/lessons/${lessonId}/remove-report`,
                  { reporterEmail }
                );
                toast.dismiss(t.id);
                toast.success("Report removed");
                fetchReportedLessons();
              } catch {
                toast.dismiss(t.id);
                toast.error("Failed to remove report");
              }
            }}
          >
            Yes, Remove
          </button>
          <button
            className="px-4 py-2 bg-gray-300 rounded"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </button>
        </div>
      </div>
    ), { duration: Infinity });
  };


  // Update report status
  const updateReportStatus = async (lessonId, reporterEmail, status) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/admin/lessons/${lessonId}/update-report-status`,
        { reporterEmail, status }
      );
      toast.success(`Status updated to ${status}`);
      fetchReportedLessons();
    } catch {
      toast.error("Failed to update status");
    }
  };

  if (loading) return <LoadingSpinner />;

  // Function to get badge color
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-300 text-yellow-800";
      case "Resolved":
        return "bg-green-300 text-green-800";
      case "Rejected":
        return "bg-red-300 text-red-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Reported Lessons <span className="text-sm">({lessons.length})</span></h2>

      {lessons.length === 0 && (
        <p className="text-center text-gray-500">No reported lessons 🎉</p>
      )}

      {lessons.map((lesson) => (
        <div key={lesson._id} className="border rounded p-4 mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold">{lesson.title}</h3>
            <span className="badge badge-error">{lesson.reportCount} Reports</span>
          </div>

          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Reporter</th>
                  <th>Email</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {lesson.reports.map((report, idx) => (
                  <tr key={idx}>
                    <td>{report.reporterName || "Unknown User"}</td>
                    <td className="text-sm text-gray-600">{report.reporterEmail}</td>
                    <td>{report.reason}</td>

                    {/* Status badge + dropdown */}
                    <td className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 rounded-full text-sm font-semibold ${getStatusBadgeClass(
                          report.status || "Pending"
                        )}`}
                      >
                        {report.status || "Pending"}
                      </span>

                      <select
                        className="select select-sm border"
                        value={report.status || "Pending"}
                        onChange={(e) =>
                          updateReportStatus(
                            lesson._id,
                            report.reporterEmail,
                            e.target.value
                          )
                        }
                      >
                        <option value="Pending">Pending</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>

                    <td>
                      <button
                        className="btn btn-xs btn-error"
                        onClick={() =>
                          removeSingleReport(lesson._id, report.reporterEmail)
                        }
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Reports;
