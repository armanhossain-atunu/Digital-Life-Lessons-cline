import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';

const TotalUsers = () => {
    const { data: users = [] } = useQuery({
        queryKey: ["users"],
        queryFn: async () =>
            (await axios.get(`${import.meta.env.VITE_API_URL}/users`)).data
    })
    return (
        <div className='bg-base-100 shadow-lg rounded-2xl p-8' >
            <h1>Total Active Users</h1>
            <p className='text-2xl font-semibold'>{users.length}</p>
        </div>
    );
};

export default TotalUsers;