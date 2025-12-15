import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate, Link } from "react-router";
import axios from "axios";
import { MdCheckCircle, MdError } from "react-icons/md";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const calledRef = useRef(false);

  const [status, setStatus] = useState("Verifying payment...");
  const [lessonId, setLessonId] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      setStatus("No payment session found.");
      setSuccess(false);
      return;
    }

    axios
      .get(
        `${import.meta.env.VITE_API_URL}/verify-payment?session_id=${sessionId}`
      )
      .then((res) => {
        if (res.data?.success) {
          setSuccess(true);
          setStatus(res.data.message || "Payment successful!");
          setLessonId(res.data.lessonId || null);

          setTimeout(() => {
            navigate(res.data.lessonId ? `/lesson-details/${res.data.lessonId}` : "/");
          }, 4000);
        } else {
          setSuccess(false);
          setStatus(res.data.message || "Payment failed");
          setTimeout(() => navigate("/payment-cancel"), 4000);
        }
      })
      .catch(() => {
        setSuccess(false);
        setStatus("Payment verification failed.");
        setTimeout(() => navigate("/payment-cancel"), 4000);
      });
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-300 bg-opacity-50 p-4">
      <div className="bg-base-100 rounded-2xl shadow-lg p-10 text-center max-w-md w-full">
        <div className="flex justify-center mb-6">
          {success ? (
            <MdCheckCircle className="text-green-500 text-8xl animate-bounce" />
          ) : (
            <MdError className="text-red-500 text-8xl animate-pulse" />
          )}
        </div>

        <h1 className="text-2xl font-bold mb-4">{status}</h1>

        <p className="text-gray-600 mb-6">
          {success
            ? "Redirecting you shortly..."
            : "Redirecting to lessons page..."}
        </p>

        <Link
          to={lessonId ? `/lesson-details/${lessonId}` : "/"}
          className="inline-block bg-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-purple-700 transition"
        >
          Go Now
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;
