import React from "react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#23234b] to-[#6366f1] text-white">
      <div className="p-8 rounded-lg shadow-2xl bg-[#181828]/80 w-full max-w-lg text-center">
        <h1 className="text-7xl font-extrabold mb-4 text-[#a855f7]">404</h1>
        <h2 className="text-2xl font-bold mb-2">Page Not Found</h2>
        <p className="mb-6 text-lg text-gray-300">Sorry, the page you are looking for does not exist.</p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 rounded bg-gradient-to-r from-[#6366f1] to-[#a855f7] font-semibold hover:from-[#a855f7] hover:to-[#6366f1] transition-colors"
        >
          Go Home
        </button>
      </div>
      <div className="mt-8 animate-bounce">
        <svg width="80" height="80" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mx-auto text-[#a855f7]">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L15 12.75M15 12.75L9.75 8.5" />
        </svg>
      </div>
    </div>
  );
}
