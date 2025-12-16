import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useLessons = () => {
  return useQuery({
    queryKey: ["lessons", "all"],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/lessons`
      );
      
      return res.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    },
  });
};

export default useLessons;
