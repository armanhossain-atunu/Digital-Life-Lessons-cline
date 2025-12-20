import React, { useState } from 'react';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import Container from '../../Components/Shared/Container';
import Search from '../../Components/Home/Lessons/Search';

const PaymentHistory = () => {
    const axiosSecure = useAxiosSecure();
    const [searchTerm, setSearchTerm] = useState("");

    const { data: Payments = [] } = useQuery({
        queryKey: ['payments'],
        queryFn: async () => {
            const res = await axiosSecure.get(`${import.meta.env.VITE_API_URL}/payments`);
            return res.data;
        }
    });

    const totalAmount = Payments.reduce((total, pay) => total + pay.amount, 0);

    // Filter payments by transactionId
    const filteredPayments = Payments.filter(payment =>
        payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Container className="p-6">
            <h2 className="text-2xl font-bold mb-4">Payment History</h2>
            <div className='flex justify-between items-center'>
                <div className="mt-6 mb-4">
                    <h3 className="text-xl font-semibold mb-2">Total Amount: ${totalAmount}</h3>
                </div>

                {/* Search Component */}
                <div className="mb-4">
                    <Search
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        placeholder="Search by Transaction ID..."
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="table-auto w-full border-collapse border border-base-300">
                    <thead>
                        <tr className="bg-base-100">
                            <th className="border px-4 py-2">SN</th>
                            <th className="border px-4 py-2">Email</th>
                            <th className="border px-4 py-2">Amount</th>
                            <th className="border px-4 py-2">TransactionId</th>
                            <th className="border px-4 py-2">Date</th>
                            <th className="border px-4 py-2">Status</th>
                        </tr>
                    </thead>
                    <tbody className='text-center'>
                        {filteredPayments.map((payment, index) => (
                            <tr key={payment._id}>
                                <td className="border px-4 py-2">{index + 1}</td>
                                <td className="border px-4 py-2">{payment?.customerEmail}</td>
                                <td className="border px-4 py-2">${payment?.amount}</td>
                                <td className="border px-4 py-2">{payment?.transactionId}</td>
                                <td className="border px-4 py-2">{new Date(payment?.createdAt).toLocaleDateString()}</td>
                                <td className="border px-4 py-2">
                                    <span
                                        className={
                                            payment.status === 'Paid'
                                                ? 'text-green-600 font-semibold'
                                                : 'text-red-600 font-semibold'
                                        }
                                    >
                                        {payment.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {filteredPayments.length === 0 && (
                            <tr>
                                <td colSpan="6" className="border px-4 py-2 text-center text-gray-500">
                                    No payments found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Container>
    );
};

export default PaymentHistory;
