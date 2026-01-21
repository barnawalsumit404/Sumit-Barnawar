import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/"); // Redirect to home page after logout
  };

  return (
    <a
      onClick={handleLogout}
      className="group relative px-1 py-2 text-sm font-medium cursor-pointer"
      style={{ color: '#e2d3fd', display: 'inline-block' }}
    >
      <span className="relative z-10 transition-colors duration-300 font-semibold">Logout</span>
    </a>
  );
}
