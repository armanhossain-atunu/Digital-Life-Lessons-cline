import { Link } from "react-router";

const BlurLock = ({ children }) => {
  return (
    <div className="relative">
      {/* Blur real content */}
      <div className="blur-sm opacity-60 pointer-events-none">
        {children}
      </div>

      {/* Overlay Lock */}
      <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white rounded-lg">
        <p className="text-lg font-semibold mb-3">
          Premium Content Locked
        </p>

        <Link
          to="/upgrade"
          className="bg-yellow-400 text-black px-4 py-2 rounded font-bold hover:bg-yellow-300 transition"
        >
          Upgrade to Premium
        </Link>
      </div>
    </div>
  );
};

export default BlurLock;
