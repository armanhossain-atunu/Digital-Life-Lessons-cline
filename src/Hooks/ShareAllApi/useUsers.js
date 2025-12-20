import { useQuery } from '@tanstack/react-query';
import React from 'react';
import useAxiosSecure from '../useAxiosSecure';

const useUsers = () => {
    const axiosSecure = useAxiosSecure();
    return useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await axiosSecure.get(
                `${import.meta.env.VITE_API_URL}/users`

            );
            return res.data;

        }
    })
};

export default useUsers;