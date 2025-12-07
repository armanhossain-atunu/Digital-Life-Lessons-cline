import React from "react";

const Card = ({ userType = "Premium", title, text, count }) => {
  const isPremium = userType === "free";

  return (
    <div className="w-[200px] h-[300px] relative border border-solid border-white/40 rounded-2xl overflow-hidden">

      {/* Background Layer */}
      <div className="w-full h-full p-1 absolute bg-purple-400">
        <div className="w-full h-full rounded-xl rounded-tr-[100px] rounded-br-[40px] bg-[#222]" />
      </div>

      {/* Spinning Gradient Circle */}
      <div className="w-full h-full flex items-center justify-center relative backdrop-blur-lg rounded-2xl">
        <div
          className="w-32 h-32 rounded-full bg-gradient-to-tr from-purple-500 to-orange-300 animate-spin"
          style={{ animationDuration: "12s" }}
        />
      </div>

      {/* Main Content */}
      <div className="w-full h-full p-2 flex justify-between absolute inset-0">
        <div className="w-full p-2 pt-3 pb-1.5 flex flex-col rounded-xl backdrop-blur-lg bg-gray-50/10 text-gray-200 font-medium font-mono">
          <span className="text-xl font-medium">{title}</span>
          <span className="text-xs text-gray-400">{text}</span>

          <div className="w-full mt-auto flex items-center justify-between">
            <span className="text-xs text-gray-400">Lessons: {count}</span>
            <span className="text-xs text-gray-400">2025</span>
          </div>
        </div>
      </div>

      {/* ❌ Overlay (Only for Free User) */}
      {!isPremium && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center text-white font-semibold text-sm">
          <p> 🚫 Premium Lesson </p>
          <button className="mt-2 bg-purple-500 px-3 py-1 rounded-lg text-xs">
            Become Premium
          </button>
        </div>
      )}
    </div>
  );
};

export default Card;
