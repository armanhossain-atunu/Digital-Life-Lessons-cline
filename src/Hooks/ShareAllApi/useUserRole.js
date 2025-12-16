import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useUserRole = (email) => {
  return useQuery({
    queryKey: ["userRole", email],
    enabled: !!email,
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/user?email=${email}`
      );
      return res.data;
    },
    refetchInterval: 1000,
  });
};

export default useUserRole;
