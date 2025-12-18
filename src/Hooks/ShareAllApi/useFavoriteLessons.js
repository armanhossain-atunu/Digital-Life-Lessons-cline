import { useQuery } from "@tanstack/react-query";
import useAuth from "../useAuth";
import useAxiosSecure from "../useAxiosSecure";

const useFavoriteLessons = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

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
      const res = await axiosSecure.get(
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
