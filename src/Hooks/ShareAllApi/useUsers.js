import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';

const useUsers = () => {

    return useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/users`

            );
            return res.data;

        }
    })
};

export default useUsers;