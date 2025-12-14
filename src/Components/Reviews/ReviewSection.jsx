import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import useAuth from "../../Hooks/useAuth";
import Container from "../Shared/Container";

const ReviewSection = ({ lessonId }) => {
    const { user } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

    const fetchReviews = async () => {
        const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/lessons/${lessonId}/reviews`
        );
        setReviews(res.data.reviews || []);
    };

    useEffect(() => {
        fetchReviews();
    }, [ fetchReviews]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            toast.error("Please login first");
            return;
        }

        if (!rating || !comment.trim()) {
            toast.error("Rating and comment required");
            return;
        }

        try {
            await axios.post(
                `${import.meta.env.VITE_API_URL}/lessons/${lessonId}/review`,
                {
                    rating,
                    comment,
                    reviewerEmail: user.email,
                }
            );

            toast.success("Review submitted");
            setRating(0);
            setComment("");
            fetchReviews();
        } catch (err) {
            if (err.response?.status === 409) {
                toast.error("You already reviewed");
            } else {
                toast.error("Failed to submit review");
            }
        }
    };

    return (
        <Container className="mt-16">
            <h3 className="text-xl mt-20 font-bold mb-3">User Reviews</h3>

            {/* ⭐ Review Form */}
            <form onSubmit={handleSubmit} className="space-y-3 mb-6">
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className={`text-2xl ${
                                star <= rating
                                    ? "text-yellow-400"
                                    : "text-gray-400"
                            }`}
                        >
                            ★
                        </button>
                    ))}
                </div>

                <textarea
                    className="textarea w-full border"
                    placeholder="Write your review"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />

                <button className="btn btn-sm btn-primary">
                    Submit Review
                </button>
            </form>

            {/* 📄 Reviews List */}
            {reviews.map((review, index) => (
                <div key={index} className="border p-3 rounded mb-3">
                    <div className="flex justify-between">
                        <span className="font-semibold">
                            {review.reviewerEmail}
                        </span>
                        <span className="text-yellow-400">
                            {"★".repeat(review.rating)}
                        </span>
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                </div>
            ))}

            {reviews.length === 0 && (
                <p className="text-gray-500">No reviews yet</p>
            )}
        </Container>
    );
};

export default ReviewSection;
