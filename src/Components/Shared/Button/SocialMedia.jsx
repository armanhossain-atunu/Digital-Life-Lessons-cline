import React from "react";
import { FaGithub, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";
import { Link } from "react-router";

const SocialMedia = () => {
  return (
    <div className="w-fit">
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <clipPath id="squircleClip" clipPathUnits="objectBoundingBox">
            <path d="M 0,0.5 C 0,0 0,0 0.5,0 S 1,0 1,0.5 1,1 0.5,1 0,1 0,0.5"></path>
          </clipPath>
        </defs>
      </svg>

      <div className="relative">
        <div className="absolute inset-0 bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl"></div>

        <div className="relative flex items-end gap-x-2 p-2">
          {/* GitHub Icon */}
          <div className="relative">
            <Link to="https://www.github.com" target="_blank"
              style={{ clipPath: "url(#squircleClip)" }}
              className="w-8 h-8 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl flex items-center justify-center shadow-lg border border-gray-600/50 cursor-pointer transform transition-all duration-300 ease-out hover:scale-110 hover:-translate-y-2 hover:shadow-2xl"
            >
              <FaGithub className="text-white text-sm"></FaGithub>
            </Link>
          </div>

          {/* LinkedIn Icon */}
          <div className="relative">
            <Link to="https://www.linkedin.com" target="_blank"
              style={{ clipPath: "url(#squircleClip)" }}
              className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-lg border border-blue-500/50 cursor-pointer transform transition-all duration-300 ease-out hover:scale-110 hover:-translate-y-2 hover:shadow-2xl"
            >
              <FaLinkedin className="text-white text-sm"></FaLinkedin>
            </Link>
          </div>
          {/* Instagram Icon */}
          <div className="relative">
            <Link to="https://www.instagram.com" target="_blank"
              style={{ clipPath: "url(#squircleClip)" }}
              className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-xl flex items-center justify-center shadow-lg border border-indigo-500/50 cursor-pointer transform transition-all duration-300 ease-out hover:scale-110 hover:-translate-y-2 hover:shadow-2xl"
            >
              <FaInstagram className="text-white text-sm" ></FaInstagram>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialMedia;
