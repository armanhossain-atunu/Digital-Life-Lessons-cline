import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FaHeart } from "react-icons/fa";
import useAuth from "../../../Hooks/useAuth";


const Favorite = ({ lessonId }) => {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    // Load favorite state
    const { data: favoriteData = { favorited: false, totalFavorites: 0 } } = useQuery({
        queryKey: ["favorite", lessonId],
        queryFn: async () => {
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/checkFavorite?lessonId=${lessonId}&userEmail=${user?.email}`
            );
            return res.data;
        },
        enabled: !!lessonId && !!user?.email,
    });

    // Mutation → Optimistic Update
    const mutation = useMutation({
        mutationFn: async () => {
            return await axios.post(
                `${import.meta.env.VITE_API_URL}/favorite/${lessonId}`,
                { userEmail: user?.email }
            );
        },

        // ⭐⭐ Optimistic UI Update ⭐⭐
        onMutate: async () => {
            await queryClient.cancelQueries(["favorite", lessonId]);

            const previousData = queryClient.getQueryData(["favorite", lessonId]);

            queryClient.setQueryData(["favorite", lessonId], (old) => ({
                favorited: !old.favorited,
                totalFavorites: old.favorited
                    ? old.totalFavorites - 1
                    : old.totalFavorites + 1,
            }));

            return { previousData };
        },

        // Rollback if failed
        onError: (err, variables, context) => {
            queryClient.setQueryData(["favorite", lessonId], context.previousData);
        },

        // Refetch final data from DB
        onSettled: () => {
            queryClient.invalidateQueries(["favorite", lessonId]);
        },
    });

    const handleFavorite = () => {
        if (!user?.email) return alert("Please login to favorite");
        mutation.mutate();
    };

    return (
        <button
            onClick={handleFavorite}
            className="flex items-center gap-2 cursor-pointer"
        >
            <FaHeart
                className={`text-2xl transition-all ${
                    favoriteData.favorited ? "text-red-600" : "text-gray-400"
                }`}
            />
            <span>{favoriteData.totalFavorites}</span>
        </button>
    );
};

export default Favorite;
