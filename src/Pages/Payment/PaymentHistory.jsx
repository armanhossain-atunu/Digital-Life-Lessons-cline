import React from 'react';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import Container from '../../Components/Shared/Container';

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
    const totalAmount = Payments.reduce((total, pay) => total + pay.amount, 0);
    console.log(Payments);
    return (
        <Container className="p-6">
            <h2 className="text-2xl font-bold mb-4">Payment History</h2>
            <div className="mt-6">
                <h3 className="text-xl font-semibold mb-2">Total Amount: ${totalAmount}</h3>
            </div>
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
                                            ? 'text-red-600 font-semibold'
                                            : 'text-green-600 font-semibold'
                                    }
                                >
                                    {payment.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Container>
    );
};

export default PaymentHistory;