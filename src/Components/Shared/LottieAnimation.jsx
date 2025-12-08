import Lottie from "lottie-react";
import successAnimation from "../../../public/lottieanimation.json";

export default function LottieAnimation({ show }) {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="w-64 h-64">
                <Lottie animationData={successAnimation} loop={false} />
            </div>
        </div>
    );
}
