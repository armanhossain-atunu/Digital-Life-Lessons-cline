import React from "react";
import { Link } from "react-router";
import { MdCheckCircle } from "react-icons/md";

const PaymentSuccess = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="bg-white rounded-2xl shadow-lg p-10 text-center max-w-md w-full">
                <div className="flex justify-center mb-6">
                    <MdCheckCircle className="text-green-500 text-9xl animate-bounce" />
                </div>
                <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
                <p className="text-gray-600 mb-6">
                    Thank you for your payment. Your lesson is now unlocked and ready to access.
                </p>
                <Link
                    to="/lessons"
                    className="inline-block bg-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-purple-700 transition"
                >
                    Go to Lessons
                </Link>
            </div>
        </div>
    );
};

export default PaymentSuccess;
