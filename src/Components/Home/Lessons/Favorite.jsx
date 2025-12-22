import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaRegStar } from "react-icons/fa";

const FavoriteButton = ({ lessonId, user }) => {
  const [favorited, setFavorited] = useState(null); // null = loading
  const [totalFavorites, setTotalFavorites] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch initial favorite status
  useEffect(() => {
    if (!user?.email) return;

    const fetchFavorite = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/favorite/${lessonId}/${user.email}`
        );
        setFavorited(data.favorited);
        setTotalFavorites(data.totalFavorites);
      } catch (err) {
        console.error("Failed to fetch favorite status:", err);
        setFavorited(false);
        setTotalFavorites(0);
      }
    };

    fetchFavorite();
  }, [lessonId, user]);

  // Toggle favorite
  const handleFavorite = async () => {
    if (!user?.email) {
      alert("Please login first!");
      return;
    }

    setLoading(true);

    // Optimistic UI
    const newFavorited = !favorited;
    setFavorited(newFavorited);
    setTotalFavorites((prev) =>
      newFavorited ? (prev ?? 0) + 1 : (prev ?? 1) - 1
    );

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/favorite/${lessonId}`,
        {
          userEmail: user.email,
          userName: user.displayName || "Anonymous",
        }
      );

      // Sync with backend response
      setFavorited(data.favorited);
      setTotalFavorites(data.totalFavorites);
    } catch (err) {
      console.error("Failed to update favorite:", err);
      // Revert UI on error
      setFavorited(!newFavorited);
      setTotalFavorites((prev) =>
        newFavorited ? (prev ?? 1) - 1 : (prev ?? 0) + 1
      );
      alert("Failed to update favorite. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      {favorited === null ? (
        <button className="px-4 py-2 bg-gray-300 rounded cursor-not-allowed">
          Loading...
        </button>
      ) : (
        <button
          onClick={handleFavorite}
          disabled={loading}
          className={`px-4  rounded-full text-white transition ${
            favorited ? "bg-red-500" : "bg-gray-400"
          }`}
        >
          {loading
            ? "Loading..."
            : favorited
            ? "🌟 Favorited"
            : <FaRegStar></FaRegStar> }
        </button>
      )}

      <span className=" badge badge-outline">
        {totalFavorites ?? 0} Favorites
      </span>
    </div>
  );
};

export default FavoriteButton;
