import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useAuth from "../../Hooks/useAuth";
import Container from "../Shared/Container";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const ReviewSection = ({ lessonId }) => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  // Fetch reviews from backend
  const fetchReviews = async () => {
    if (!lessonId) return;

    try {
      const res = await axiosSecure.get(`/lessons/${lessonId}/reviews`);

      const fetchedReviews = res.data?.reviews || [];
      setReviews(fetchedReviews);
      setAverageRating(res.data?.averageRating || 0);
      setReviewCount(res.data?.reviewCount || fetchedReviews.length);

      if (user?.email) {
        const reviewed = fetchedReviews.some(
          (r) => r.reviewerEmail === user.email
        );
        setHasReviewed(reviewed);
      }
    } catch (err) {
      console.error("Fetch reviews error:", err);
      toast.error("Failed to load reviews");
      setReviews([]);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [lessonId, user?.email]);

  // Submit review
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login to submit a review");
      return;
    }

    if (hasReviewed) {
      toast.error("You have already reviewed this lesson");
      return;
    }

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please write a review");
      return;
    }

    setLoading(true);

    try {
      await axiosSecure.post(`/lessons/${lessonId}/review`, {
        rating,
        comment: comment.trim(),
        reviewerEmail: user.email,
        reviewerName: user.displayName || "Anonymous",
        reviewerPhoto: user.photoURL || "",
      });

      toast.success("Review submitted successfully");

      setRating(0);
      setHoverRating(0);
      setComment("");
      setHasReviewed(true);

      fetchReviews();
    } catch (err) {
      console.log(err.response?.data); // TEMP log for debugging
      if (err.response?.status === 409) {
        toast.error("You have already reviewed this lesson");
        setHasReviewed(true);
      } else if (err.response?.status === 400) {
        toast.error("All fields are required");
      } else {
        toast.error("Failed to submit review");
      }
    } finally {
      setLoading(false);
    }
  };

  // Render stars for display
  const renderStars = (value) =>
    "★".repeat(Math.max(0, Math.min(5, Number(value)))) +
    "☆".repeat(5 - Math.max(0, Math.min(5, Number(value))));

  return (
    <Container>
      <h3 className="text-2xl font-bold text-center mb-2">
        User Reviews
      </h3>
      <p className="text-center text-gray-600 mb-6">
        ⭐ {averageRating} average from {reviewCount} review
        {reviewCount !== 1 && "s"}
      </p>

      {/* Review Form */}
      {user && !hasReviewed && (
        <div className="bg-base-100 p-6 rounded-xl border shadow mb-8">
          <h4 className="text-lg font-semibold mb-4">Write a Review</h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Star Rating */}
            <div>
              <label className="block mb-2 text-sm font-medium">Your Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    disabled={loading}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className={`text-4xl transition ${
                      star <= (hoverRating || rating) ? "text-yellow-400" : "text-gray-300"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="block mb-2 text-sm font-medium">Your Review</label>
              <textarea
                rows="4"
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Write your experience..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        </div>
      )}

      {/* Already Reviewed Message */}
      {user && hasReviewed && (
        <div className="text-center bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg mb-6">
          ✅ You have already reviewed this lesson
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-center text-gray-500 py-6">
            No reviews yet
          </p>
        ) : (
          reviews.map((review) => (
            <div
              key={review._id}
              className="bg-base-100 p-5 rounded-xl border shadow-sm"
            >
              <div className="flex gap-4">
                <img
                  src={review.reviewerPhoto || "https://via.placeholder.com/40"}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-semibold">{review.reviewerName || "Anonymous"}</p>
                      <p className="text-sm text-gray-500">{review.reviewerEmail}</p>
                    </div>
                    <span className="text-yellow-400 text-xl">
                      {renderStars(review.rating)}
                    </span>
                  </div>
                  <p className="mt-3 text-gray-700">{review.comment}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Container>
  );
};

export default ReviewSection;
