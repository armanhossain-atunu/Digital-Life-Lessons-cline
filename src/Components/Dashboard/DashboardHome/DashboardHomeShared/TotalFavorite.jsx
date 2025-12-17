import { useEffect, useState } from 'react';
import useAxiosSecure from '../../../../Hooks/useAxiosSecure';
import { MdMenuBook } from 'react-icons/md';
import { FaRegBookmark } from 'react-icons/fa';

const TotalFavorite = () => {
    const axiosSecure = useAxiosSecure();
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const fetchTotal = async () => {
            try {
                const res = await axiosSecure.get('/totalFavorites');
                setTotal(res.data.total);
            } catch (error) {
                console.error(error);
            }
        };
        fetchTotal();
    }, [axiosSecure]);

    return (
        <div className="bg-yellow-50 p-6 rounded-xl flex justify-center items-center gap-4 shadow hover:shadow-lg transition">
            <FaRegBookmark className="text-4xl text-yellow-600" />
            <div>
                <h4 className="text-lg font-semibold text-gray-800">Saved Lessons</h4>
                <p className="text-2xl text-center font-bold text-yellow-700">{total}</p>
            </div>
        </div>
    );
};

export default TotalFavorite;
