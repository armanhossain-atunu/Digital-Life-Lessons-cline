import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import useAuth from "../useAuth";

const useFavoriteLessons = () => {
  const { user } = useAuth();

  const {
    data: favoriteLessons = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["favoriteFullLessons", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/favoriteFullLessons?email=${user.email}`
      );
      return res.data;
    },
  });

  return {
    favoriteLessons,
    isLoading,
    isError,
    error,
    refetch,
  };
};

export default useFavoriteLessons;
