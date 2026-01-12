
import useMyPayments from "../../Hooks/ShareAllApi/useMyPayments";
import useAuth from "../../Hooks/useAuth";

const MyPayments = () => {
    const { user } = useAuth();
    const { payments, isLoading, error } = useMyPayments();
    const filteredPayments = payments.filter(payment => payment.customerEmail === user?.email);
    console.log(filteredPayments, 'filteredPayments');

    if (isLoading) return <p className="text-center mt-10">Loading...</p>;
    if (error) return <p className="text-red-500 text-center mt-10">Failed to load payments</p>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">My Payments</h2>

            {filteredPayments.length === 0 ? (
                <div className="text-center py-10">
                    <p className="text-base-500">No payments found</p>
                </div>
            ) : (
                <div className="flex justify-center gap-5">
                    {filteredPayments.map((payment) => (
                        <div
                            key={payment._id}
                            className="card bg-base-100 shadow-xl border border-base-200"
                        >
                            <div className="card-body">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xl text-base-500">
                                        <h1>Payment Info</h1>
                                    </span>
                                    <span className="badge badge-success">
                                        {payment.status || "paid"}
                                    </span>
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm text-base-600">Email</p>
                                        <p className="font-medium">{payment.customerEmail}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-base-600">Amount</p>
                                        <p className="text-xl font-bold text-primary">
                                            ${payment.amount}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-base-600">Transaction ID</p>
                                        <p className="font-mono text-sm break-all">
                                            {payment.transactionId}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-base-600">Date</p>
                                        <p className="font-medium">
                                            {new Date(payment.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyPayments;