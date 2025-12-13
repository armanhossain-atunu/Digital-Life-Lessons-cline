import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router";
import axios from "axios";
import { MdCheckCircle, MdError } from "react-icons/md";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("Verifying payment...");
  const [lessonId, setLessonId] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (!sessionId) {
      ("No payment session found.");
      return;
    }

    axios
      .get(`${import.meta.env.VITE_API_URL}/verify-payment?session_id=${sessionId}`)
      .then((res) => {
        if (res.data.success) {
          setSuccess(true);
          setStatus(res.data.message);
          setLessonId(res.data.lessonId);

          // Redirect to lesson page after 5 seconds
          setTimeout(() => {
            if (res.data.lessonId) {
              navigate(`/lesson-details/${res.data.lessonId}`);
            } else {
              navigate("/lessons");
            }
          }, 5000);
        } else {
          setSuccess(false);
          setStatus(res.data.message || "Payment Failed or Cancelled");
          setTimeout(() => navigate("/lessons"), 5000);
        }
      })
      .catch(() => {
        setSuccess(false);
        setStatus("Oops! Could not verify payment.");
        setTimeout(() => navigate("/lessons"), 5000);
      });
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-300 bg-opacity-50 p-4">
      <div className="bg-base-100 mt-10 rounded-2xl shadow-lg p-10 text-center max-w-md w-full">
        <div className="flex justify-center mb-6">
          {success ? (
            <MdCheckCircle className="text-green-500 text-9xl animate-bounce" />
          ) : (
            <MdError className="text-red-500 text-9xl animate-pulse" />
          )}
        </div>
        <h1 className="text-3xl font-bold mb-4">{status}</h1>
        <p className="text-gray-600 mb-6">
          {success
            ? "You will be redirected to your lesson shortly..."
            : "Redirecting to lessons..."}
        </p>
        <Link
          to={lessonId ? `/lesson-details/${lessonId}` : "/lessons"}
          className="inline-block bg-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-purple-700 transition"
        >
          Go Now
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;
