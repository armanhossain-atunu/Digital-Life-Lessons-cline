import axios from "axios";
import React, { useState } from "react";
import useAuth from "../../../Hooks/useAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import SocialMedia from "../Button/SocialMedia";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const Comments = ({ postId }) => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure()
  const [inputComment, setInputComment] = useState("");
  const queryClient = useQueryClient();

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ["comments", postId],
    queryFn: async ({ signal }) => {
      try {
        const { data } = await axiosSecure.get(
          `${import.meta.env.VITE_API_URL}/comments?postId=${postId}`,
          { signal }
        );
        return data ?? [];
      } catch (err) {
        console.error("Failed to fetch comments:", err);
        return [];
      }
    },
    enabled: !!postId,
  });

  const { mutateAsync: addComment, isLoading: isPosting } = useMutation({
    mutationFn: async () => {
      return await axios.post(`${import.meta.env.VITE_API_URL}/comments`, {
        postId,
        user: user?.displayName || "Anonymous",
        comment: inputComment.trim(),
        photo: user?.photoURL || "",
        createdAt: new Date().toISOString(),
      });
    },
    onSuccess: async () => {
      setInputComment("");
      await queryClient.invalidateQueries(["comments", postId]);
    },
  });

  const handleComment = async (e) => {
    e.preventDefault();
    if (!inputComment.trim()) return;
    await addComment();
  };

  return (
    <div className="mt-5">
      <h4 className="text-lg font-bold">Comment</h4>

      {!user && (
        <p className="text-red-600 mt-2">Please login to comment.</p>
      )}

      {user && (
        <form onSubmit={handleComment} className="mt-2">
          <textarea
            className="w-full border border-gray-300 rounded-md p-2"
            rows="2"
            placeholder="Add a comment..."
            value={inputComment}
            onChange={(e) => setInputComment(e.target.value)}
          ></textarea>

          <div className="flex justify-between items-center mt-2">
            <button
              type="submit"
              disabled={isPosting}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400"
            >
              {isPosting ? "Commenting..." : "Comment"}
            </button>
            <SocialMedia />
          </div>
        </form>
      )}

      <div className="mt-5 space-y-3 max-h-64 overflow-y-auto">
        {isLoading ? (
          <p>Loading comments...</p>
        ) : (
          comments.map((c) => (
            <div key={c._id} className="border rounded-md p-3 shadow-sm">
              <div className="flex justify-between items-center mb-1">
                <h5 className="font-semibold">{c.user}</h5>
                <img
                  className="w-10 h-10 rounded-full"
                  src={c.photo || "/placeholder.jpg"}
                  alt={c.user}
                />
              </div>
              <p>{c.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Comments;
