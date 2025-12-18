// import React from 'react';
// import LoadingSpinner from '../Shared/LoadingSpinner';
// import axios from 'axios';
// import { useQuery } from '@tanstack/react-query';

// const MostSavedLessons = () => {

//     const { data: favoriteLessons = [], isLoading, } = useQuery({
//         queryKey: ['lessons'],
//         queryFn: async () => {
//             const res = await axios(`${import.meta.env.VITE_API_URL}/favorites`)
//             const data = await res.json()
//             return data
//         }
//     })
//     console.log(favoriteLessons,'favoriteLessons in MostSavedLessons');

//     if (isLoading) {
//         return <LoadingSpinner></LoadingSpinner>;
//     }

//     return (
//         <div>
//             <h1>Most Saved Lessons</h1>
//         </div>
//     );
// };

// export default MostSavedLessons;
import React from 'react';

const MostSavedLessons = () => {
    return (
        <div>
            <h1>Most Saved Lessons</h1>
        </div>
    );
};

export default MostSavedLessons;