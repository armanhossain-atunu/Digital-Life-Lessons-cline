import React from 'react';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAuth from '../../../Hooks/useAuth';
import toast from 'react-hot-toast';

// LoveReact component
// Props: `lessonId` (string)
const LoveReact = ({ lessonId }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const userEmail = user?.email;

  const queryKey = ['loveReact', lessonId, userEmail || 'guest'];

  // Fetch like status + total likes
  const { data = { liked: false, totalLikes: 0 }, isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      const url = `${import.meta.env.VITE_API_URL}/loveReact/${lessonId}` + (userEmail ? `?userEmail=${userEmail}` : '');
      const { data } = await axios.get(url);
      return data || { liked: false, totalLikes: 0 };
    },
    enabled: !!lessonId,
    // keep previous data while refetching
    keepPreviousData: true,
  });

  // Mutation: toggle like
  const mutation = useMutation({
    mutationKey: ['toggleLoveReact', lessonId, userEmail || 'guest'],
    mutationFn: async () => {
      const url = `${import.meta.env.VITE_API_URL}/loveReact/${lessonId}`;
      const body = { userEmail };
      const { data } = await axios.post(url, body);
      return data;
    },
    // Optimistic update
    onMutate: async () => {
      if (!lessonId) return;
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData(queryKey);
      // compute optimistic value
      const prevLiked = previous?.liked ?? data.liked;
      const prevCount = previous?.totalLikes ?? data.totalLikes ?? 0;
      const nextLiked = !prevLiked;
      const nextCount = nextLiked ? prevCount + 1 : Math.max(0, prevCount - 1);

      queryClient.setQueryData(queryKey, {
        liked: nextLiked,
        totalLikes: nextCount,
      });

      return { previous };
    },
    onError: (_err, _variables, context) => {
      // rollback
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },
    onSettled: () => {
      // refetch to sync with server
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const handleToggle = () => {
    if (!userEmail) {
      // simple feedback; app-specific behavior (redirect to login) can be added
      toast.error('Please login to like');
      return;
    }

    if (!lessonId) return;

    mutation.mutate();
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={handleToggle}
        disabled={mutation.isLoading || isLoading}
        aria-pressed={data.liked}
        className={`p-1 rounded-full transition-colors duration-150 cursor-pointer focus:outline-none ${data.liked ? 'text-red-500' : 'text-gray-400'
          }`}
        title={data.liked ? 'Unlike' : 'Like'}
      >
        {/* simple heart icon */}
        {data.liked ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 3.99 4 6.5 4c1.74 0 3.41.81 4.5 2.09C12.09 4.81 13.76 4 15.5 4 18.01 4 20 6 20 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        )}
      </button>

      <span className="text-sm select-none">{data.totalLikes}</span>
    </div>
  );
};

export default LoveReact;
