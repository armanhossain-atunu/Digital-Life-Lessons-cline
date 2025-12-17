import React from 'react';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';

const PaymentHistory = () => {
    const axiosSecure = useAxiosSecure()
    const { data: Payments = [] } = useQuery({
        queryKey: [''],
        queryFn: async () => {
            const res = await axiosSecure.get(
                `${import.meta.env.VITE_API_URL}/payments`
            );
            return res.data;
        }

    })
    console.log(Payments);
    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Payment History</h2>
            <table className="table-auto w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border px-4 py-2">#</th>
                        <th className="border px-4 py-2">Email</th>
                        <th className="border px-4 py-2">Amount</th>
                        <th className="border px-4 py-2">TransactionId</th>
                        <th className="border px-4 py-2">Date</th>
                        <th className="border px-4 py-2">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {Payments.map((payment, index) => (
                        <tr key={payment._id}>
                            <td className="border px-4 py-2">{index + 1}</td>
                            <td className="border px-4 py-2">{payment?.customerEmail}</td>
                            <td className="border px-4 py-2">${payment?.amount}</td>
                            <td className="border px-4 py-2">{payment?.transactionId}</td>
                            <td className="border px-4 py-2">{payment?.createdAt}</td>
                            <td className="border px-4 py-2">
                                <span
                                    className={
                                        payment.status === 'Paid'
                                            ? 'text-green-600 font-semibold'
                                            : payment.status === 'Pending'
                                                ? 'text-yellow-600 font-semibold'
                                                : 'text-red-600 font-semibold'
                                    }
                                >
                                    {payment.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PaymentHistory;