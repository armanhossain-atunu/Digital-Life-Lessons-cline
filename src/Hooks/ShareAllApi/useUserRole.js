import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../useAxiosSecure";

const useUserRole = (email) => {
  const axiosSecure = useAxiosSecure();
  return useQuery({
    queryKey: ["userRole", email],
    enabled: !!email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `${import.meta.env.VITE_API_URL}/user?email=${email}`
      );
      return res.data;
    },
    refetchInterval: 1000,
  });
};

export default useUserRole;
