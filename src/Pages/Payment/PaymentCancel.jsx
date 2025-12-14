import React from "react";
import { Link } from "react-router";
import { MdCancel } from "react-icons/md";

const PaymentCancel = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white rounded-2xl shadow-lg p-10 max-w-lg text-center">
                <div className="flex justify-center mb-4">
                    <MdCancel className="text-red-600 text-6xl" />
                </div>
                <h1 className="text-3xl font-bold mb-4 text-gray-800">
                    Payment Cancelled
                </h1>
                <p className="text-gray-600 mb-6">
                    Your payment process was not completed. No charges have been made.
                    You can try again or explore other lessons.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link
                        to="/"
                        className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium"
                    >
                        Back to Home
                    </Link>
                    <Link
                        to="/my-lessons"
                        className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-medium"
                    >
                        My Lessons
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PaymentCancel;
