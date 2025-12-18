import { useEffect, useState } from "react";
import axios from "axios";
import useUsers from "../../../Hooks/ShareAllApi/useUsers";

const FavoriteButton = ({ lessonId, user }) => {

    const { data: users = [] } = useUsers()
    const currentUser = users.find(u => u.email === user?.email);
    console.log(currentUser, "user from db")
    const [favorited, setFavorited] = useState(false);
    const [totalFavorites, setTotalFavorites] = useState(0);
    const [loading, setLoading] = useState(false);

    // Initial load 
    useEffect(() => {
        if (user?.email) {
            axios
                .get(
                    `${import.meta.env.VITE_API_URL}/${lessonId}/${user.email}`
                )
                .then((res) => {
                    setFavorited(res.data.favorited);
                    setTotalFavorites(res.data.totalFavorites);
                });
        }
    }, [lessonId, user]);

    // Toggle Favorite
    const handleFavorite = async () => {
        if (!user?.email) {
            alert("Please login first");
            return;
        }

        try {
            setLoading(true);

            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/favorite/${lessonId}`,
                {
                    userEmail: user.email,
                    userName: currentUser.name,

                }
            );

            setFavorited(res.data.favorited);
            setTotalFavorites(res.data.totalFavorites);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center gap-3">
            <button
                onClick={handleFavorite}
                disabled={loading}
                className={`px-4 py-2 rounded-full text-white transition
          ${favorited ? "bg-red-500" : "bg-gray-400"}`}
            >
                {loading
                    ? "Loading..."
                    : favorited
                        ? "❤️ Favorited"
                        : "🤍 Favorite"}
            </button>

            <span className="text-sm text-gray-600">
                {totalFavorites} Favorites
            </span>
        </div>
    );
};

export default FavoriteButton;
