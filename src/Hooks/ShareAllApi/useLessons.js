import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useLessons = () => {
  return useQuery({
    queryKey: ["lessons" , "all"],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/lessons`
      );
      return res.data;
    },
  });
};

export default useLessons;
