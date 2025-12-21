import React, { useState } from "react";
import useAuth from "../../../Hooks/useAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import SocialMedia from "../Button/SocialMedia";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const Comments = ({ postId }) => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [inputComment, setInputComment] = useState("");
  const queryClient = useQueryClient();

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ["comments", postId],
    queryFn: async ({ signal }) => {
      const { data } = await axiosSecure.get(
        `/comments?postId=${postId}`,
        { signal }
      );
      return data ?? [];
    },
    enabled: !!postId,
  });

  const { mutateAsync: addComment, isLoading: isPosting } = useMutation({
    mutationFn: async () => {
      return axiosSecure.post("/comments", {
        postId,
        user: user?.displayName || "Anonymous",
        comment: inputComment.trim(),
        photo: user?.photoURL || "",
        createdAt: new Date().toISOString(),
      });
    },
    onSuccess: () => {
      setInputComment("");
      queryClient.invalidateQueries(["comments", postId]);
    },
    onError: (error) => {
      console.error("Failed to add comment:", error);
    },
  });

  const handleComment = async (e) => {
    e.preventDefault();
    if (!inputComment.trim()) return;
    await addComment();
  };

  return (
    <div className="mt-5">
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
          />

          <div className=" md:flex justify-between items-center mt-2">
            <button
              type="submit"
              disabled={isPosting || !inputComment.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded-md mb-3 hover:bg-blue-600 disabled:bg-gray-400"
            >
              {isPosting ? "Commenting..." : "Comment"}
            </button>
            <SocialMedia />
          </div>
        </form>
      )}

      <div className="mt-5 space-y-3">
        {isLoading ? (
          <p>Loading comments...</p>
        ) : (
          comments.map((c) => (
            <div
              key={c._id || `${c.user}-${c.createdAt}`}
              className="border rounded-md p-3 shadow-sm"
            >
              <div className="flex justify-between items-center mb-1">
                <h5 className="font-semibold">{c.user}</h5>
                <img
                  className="w-10 h-10 rounded-full"
                  src={c.photo || "/placeholder.jpg"}
                  alt={c.user}
                />
              </div>
              <p>{c.comment}</p>
              <p className="text-xs text-gray-500">
                {new Date(c.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Comments;
