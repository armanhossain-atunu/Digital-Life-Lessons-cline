import { Link } from 'react-router';
import { FiAlertCircle } from 'react-icons/fi';

const ErrorPage = ({ code = 404, message = "Page Not Found" }) => {
return (
<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
<div className="text-center animate-fade-in">
<div className="text-red-500 text-9xl flex justify-center mb-4 animate-bounce">
<FiAlertCircle />
</div>
<h1 className="text-6xl font-extrabold text-gray-900">{code}</h1>
<p className="mt-2 text-xl text-gray-600">{message}</p>
<p className="mt-4 text-gray-500 max-w-md mx-auto">
The page you are looking for might be removed, had its name changed, or is temporarily unavailable.
</p>
<Link to="/" className="mt-6 inline-block bg-lime-500 hover:bg-lime-600 text-white px-6 py-3 rounded-md transition-transform transform hover:scale-105 shadow-lg" >
Go Back Home
</Link>
</div>
</div>
);
};

export default ErrorPage;