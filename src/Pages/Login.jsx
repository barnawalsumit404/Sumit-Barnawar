import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";



export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;
      // Check for admin claim securely
      const idTokenResult = await user.getIdTokenResult();
      if (idTokenResult.claims.admin) {
        navigate("/ownerSumit");
      } else {
        navigate("/"); // Or navigate to a user dashboard or show extra features
      }
    } catch (err) {
      // Show a generic message to the user; log details to console
      setError("Failed to login. Check credentials or try again later.");
      console.error("Firebase Auth Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#1a1a2e] text-white">
      <div className="bg-[#23234b] p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded bg-[#181828] border border-[#6366f1] focus:outline-none focus:ring-2 focus:ring-[#a855f7]"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block mb-1" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded bg-[#181828] border border-[#6366f1] focus:outline-none focus:ring-2 focus:ring-[#a855f7]"
              required
            />
          </div>
          {error && <div className="mb-4 text-red-400 text-center">{error}</div>}
          <button
            type="submit"
            className="w-full py-2 rounded bg-gradient-to-r from-[#6366f1] to-[#a855f7] font-semibold hover:from-[#a855f7] hover:to-[#6366f1] transition-colors"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
