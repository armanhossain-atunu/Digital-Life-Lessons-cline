import axios from 'axios';
import React, { useState } from 'react';
import useAuth from '../../../Hooks/useAuth';
import { QueryClient, useMutation, useQuery } from '@tanstack/react-query';

const Comments = ({ postId, }) => {
    console.log(postId);
    const { user } = useAuth()
    const [inputComment, setInputComment] = useState("");
    // Load Comments using useQuery
    const { data: comments = [], isLoading } = useQuery({
        queryKey: ["comments", postId],
        queryFn: async () => {
            const url = `${import.meta.env.VITE_API_URL}/comments?postId=${postId}`;
            const { data } = await axios.get(url);
            return data || [];
        },
        enabled: !!postId,
        refetchInterval: 1000,
    }
    );

    // Post Comment using useMutation
    const { mutateAsync: addComment, isPending } = useMutation({
        mutationFn: async () => {
            return await axios.post(`${import.meta.env.VITE_API_URL}/comments`, {
                postId,
                user: user?.displayName || "Anonymous",
                comment: inputComment,
                photo: user?.photoURL || "",
                createdAt: new Date().toISOString(),
            });
        },
        onSuccess: () => {
            setInputComment("");
            QueryClient.invalidateQueries(["comments", postId]);
        },
    });

    if (!user) {
        return (
            <div className="mt-5">
                <h4 className="text-lg font-bold">Comment</h4>
                   <textarea
                    className="w-full border border-gray-300 rounded-md p-2"
                    rows="2"
                    placeholder="Add a comment..."
                    value={inputComment}
                    onChange={(e) => setInputComment(e.target.value)}
                ></textarea>
                <p className="text-red-600 mt-2">Please login to comment.</p>
            </div>
        );
    }


    const handleComment = async (e) => {
        e.preventDefault();
        if (!inputComment.trim()) return;
        await addComment();
    };
    return (
        <div className="mt-5">
            <h4 className="text-lg font-bold">Comment</h4> 
            {/* Comment Input */}
            <form onSubmit={handleComment} className="mt-2 ">
                <textarea
                    className="w-full border border-gray-300 rounded-md p-2"
                    rows="2"
                    placeholder="Add a comment..."
                    value={inputComment}
                    onChange={(e) => setInputComment(e.target.value)}
                ></textarea>
                <button
                    type="submit"
                    disabled={isPending}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400"
                >
                    {
                        user ?
                            isPending ? "Commenting..." : "Comment"
                            : "Login to comment"
                    }
                </button>
            </form>
            {/* Show Comments */}

            <div
                className={`mt-5 space-y-3 ${comments.length > 1
                    ? "overflow-y-scroll h-32"
                    : "overflow-y-auto h-auto"
                    }`}
            >
                {isLoading ? (
                    <p>Loading comments...</p>
                ) : (
                    comments.map((c) => (
                        <div
                            key={c._id}
                            className="border rounded-md p-3 shadow-sm"
                        >
                            <div className='flex justify-between'>
                                <h5 className="font-semibold">{c.user}</h5>
                                <img className='w-10 h-10 rounded-full' src={c.photo} alt="" />
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