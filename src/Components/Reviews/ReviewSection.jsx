import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import useAuth from "../../Hooks/useAuth";
import Container from "../Shared/Container";

const ReviewSection = ({ lessonId }) => {
  const { user } = useAuth();
  // console.log(user,'firebase user');
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);

  // Fetch reviews for this lesson
  const fetchReviews = async () => {
    if (!lessonId) return;

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/lessons/${lessonId}/reviews`
      );

      let fetchedReviews = [];

      // Handle ALL possible response shapes
      if (Array.isArray(res.data)) {
        fetchedReviews = res.data;
      }
      else if (res.data && Array.isArray(res.data.reviews)) {
        fetchedReviews = res.data.reviews;
      }
      else if (res.data && Array.isArray(res.data.data)) {
        fetchedReviews = res.data.data;
      }
      else if (res.data && typeof res.data === "object") {
        // If it's an object but not array, maybe empty
        fetchedReviews = [];
      }

      setReviews(fetchedReviews);

      // Check if current user already reviewed
      if (user?.email) {
        const alreadyReviewed = fetchedReviews.some(
          (r) => r.reviewerEmail === user.email
        );
        setHasReviewed(alreadyReviewed);
      }
    } catch (err) {
      console.error("Review fetch error:", err);
      toast.error("Failed to load reviews");
      setReviews([]); // Always fallback to array
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [lessonId]);

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
      toast.error("Please select a star rating");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please write a comment");
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/lessons/${lessonId}/review`,
        {
          lessonId,
          rating,
          comment: comment.trim(),
          reviewerEmail: user.email,
          reviewerName: user?.displayName,
          reviewerPhoto: user?.photoURL || "",
        }
      );

      toast.success("Thank you! Your review has been submitted.");

      // Reset form
      setRating(0);
      setHoverRating(0);
      setComment("");
      setHasReviewed(true);

      // Refresh reviews
      fetchReviews();
    } catch (err) {
      const message =
        err.response?.data?.message ||
          err.response?.status === 409
          ? "You have already reviewed this lesson"
          : "Failed to submit review. Try again.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const displayStars = (num) => "★".repeat(Math.max(0, Math.min(5, Number(num || 0))));

  return (
    <Container className="my-10">
      <h3 className="text-2xl font-bold mb-6 text-center">User Reviews</h3>

      {/* Review Submission Form - Only if not already reviewed */}
      {user && !hasReviewed ? (
        <div className="bg-base-100 p-6 rounded-xl shadow-md border mb-8">
          <h4 className="text-lg font-semibold mb-4">Write a Review</h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Star Rating */}
            <div>
              <label className="block text-sm font-medium mb-2">Your Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    disabled={loading}
                    className={`text-4xl transition-colors ${star <= (hoverRating || rating)
                        ? "text-yellow-400"
                        : "text-gray-300"
                      } hover:text-yellow-400`}
                  >
                    ★
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-sm text-gray-600 mt-1">{rating} star{rating > 1 ? "s" : ""}</p>
              )}
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-medium mb-2">Your Review</label>
              <textarea
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows="4"
                placeholder="Share your experience with this lesson..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary px-6 py-2 disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        </div>
      ) : user && hasReviewed ? (
        <div className="bg-base-50 border border-green-200 text-green-800 p-4 rounded-lg mb-8 text-center">
          ✅ Thank you for your review!
        </div>
      ) : null}

      {/* Reviews List */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold">
          {reviews.length} Review{reviews.length !== 1 ? "s" : ""}
        </h4>

        {reviews.length === 0 ? (
          <p className="text-base-500 text-center py-8">
            No reviews yet. Be the first to review this lesson!
          </p>
        ) : (
          Array.isArray(reviews) && reviews.map((review) => (
            <div
              key={review._id}
              className="bg-base-100 p-5 rounded-xl shadow-sm border hover:shadow-md transition"
            >
              <div className="flex items-start gap-4">
                <img
                  src={review.reviewerPhoto || "https://via.placeholder.com/40"}
                  alt={review.reviewerName}
                  className="w-10 h-10 rounded-full object-cover"
                  onError={(e) => (e.target.src = "https://via.placeholder.com/40")}
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{review.reviewerName || "Anonymous"}</p>
                      <p className="text-sm text-base-500">{review.reviewerEmail}</p>
                    </div>
                    <span className="text-2xl text-yellow-400">
                      {displayStars(review.rating)}
                    </span>
                  </div>
                  <p className="mt-3 text-gray-700 leading-relaxed">{review.comment}</p>
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