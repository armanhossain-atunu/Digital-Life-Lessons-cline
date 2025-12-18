// src/hooks/useMyPayments.js
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../useAxiosSecure";


const useMyPayments = () => {
    const axiosSecure = useAxiosSecure();
  const {
    data: payments = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["my-payments"],
    queryFn: async () => {
      const res = await axiosSecure.get("/payments");
      return res.data;
    },
  });

  return { payments, isLoading, error, refetch };
};

export default useMyPayments;
