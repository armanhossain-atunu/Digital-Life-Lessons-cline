import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../useAxiosSecure";

const useUsers = () => {
    const axiosSecure = useAxiosSecure();

    return useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await axiosSecure.get(
                `${import.meta.env.VITE_API_URL}/users`
            );
            return res.data;
        },
        retry: 1,
        onError: (error) => {
            console.error("Users fetch error:", error);
        }
    });
};
 export default useUsers