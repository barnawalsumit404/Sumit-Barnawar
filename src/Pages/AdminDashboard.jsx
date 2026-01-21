import React from "react";
import LogoutButton from "../components/LogoutButton";

export default function AdminDashboard() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#1a1a2e] text-white">
      <div className="bg-[#23234b] p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h2>
        <p className="text-center">Welcome, Admin! Here you can manage your site and users.</p>
        {/* Add admin features/components here */}
        <div className="flex justify-center mt-6">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
