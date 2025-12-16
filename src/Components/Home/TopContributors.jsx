import React from "react";

// Import Swiper React components & styles
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import useUsers from "../../Hooks/ShareAllApi/useUsers";
import LoadingSpinner from "../Shared/LoadingSpinner";
import Container from "../Shared/Container";


const TopContributors = () => {
    const { data: contributors = [], isLoading, isError } = useUsers()
    if (isLoading)
        return <LoadingSpinner></LoadingSpinner>;

    if (isError)
        return (
            <div className="text-center py-10 text-red-600">
                <p>Failed to load contributors. Please try again later.</p>
            </div>
        );

    if (contributors.length === 0)
        return (
            <div className="text-center py-10">
                <p>No contributions this week yet!</p>
            </div>
        );

    return (
        <Container>
            <h2 className="text-3xl font-bold text-center mb-8">
                🌟 Top Contributors of the Week
            </h2>

            <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={20}
                slidesPerView={1}
                navigation
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                breakpoints={{
                    640: { slidesPerView: 2 },
                    768: { slidesPerView: 3 },
                    1024: { slidesPerView: 4 },
                }}
                className="pb-12"
            >
                {contributors.map((user, index) => (
                    <SwiperSlide key={user._id}>
                        <div
                            className={`relative overflow-hidden rounded-xl mb-10 shadow-lg transition-transform duration-300 hover:scale-105 ${index < 3
                                    ? "bg-gradient-to-br from-yellow-200 to-amber-300 border-4 border-yellow-500"
                                    : "bg-base-200 border border-gray-200"
                                }`}
                        >
                            {/* Rank Badge for Top 3 */}
                            {index < 3 && (
                                <div className="absolute top-0 left-0 bg-yellow-500 text-white font-bold px-4 py-2 rounded-br-xl z-10">
                                    #{index + 1}
                                    {index === 0 && " 🥇"}
                                    {index === 1 && " 🥈"}
                                    {index === 2 && " 🥉"}
                                </div>
                            )}

                            <div className="p-6 h-70 flex flex-col items-center text-center">
                                <img
                                    src={user.photoURL || "/default-avatar.png"}
                                    alt={user.displayName}
                                    className="w-24 h-24 rounded-full border-4 border-white shadow-md mb-4"
                                />
                                <h3 className="text-xl font-bold text-base-800">
                                    {user.displayName}
                                </h3>
                                <p className="text-sm text-base-600 mt-1">{user.email}</p>

                                <div className="mt-6">
                                    <p className="text-3xl font-extrabold text-indigo-600">
                                        {user.contributions}
                                    </p>
                                    <p className="text-sm text-base-500">Contributions</p>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </Container>
    );
};

export default TopContributors;