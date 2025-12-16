// pages/Unauthorized.jsx
import { Link } from "react-router";

const Unauthorized = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-5xl font-bold text-red-500">403</h1>
            <p className="text-xl mt-4">Unauthorized Access</p>
            <p className="text-gray-500 mt-2">
                This page is only accessible by Admin
            </p>

            <Link to="/" className="btn mt-6 bg-purple-500 text-white">
                Go Home
            </Link>
        </div>
    );
};

export default Unauthorized;
