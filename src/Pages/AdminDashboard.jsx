import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { FileText, Images, BookOpen, LogOut } from "lucide-react";
import ProjectsAdmin from "../components/admin/ProjectsAdmin";
import GalleryAdmin from "../components/admin/GalleryAdmin";
import BlogsAdmin from "../components/admin/BlogsAdmin";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("projects");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const idTokenResult = await user.getIdTokenResult();
        if (idTokenResult.claims.admin) {
          setIsAdmin(true);
        } else {
          navigate("/");
        }
      } else {
        navigate("/login");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const tabs = [
    { id: "projects", label: "Projects", icon: FileText },
    { id: "gallery", label: "Gallery", icon: Images },
    { id: "blogs", label: "Blogs", icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg fixed left-0 top-0 h-screen flex flex-col p-6">
        <h2 className="text-2xl font-bold text-blue-600 mb-12 mt-4">Admin Panel</h2>
        
        <div className="flex-1 space-y-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-300 font-medium"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="ml-64 flex-1">
        <div className="p-8">
          {activeTab === "projects" && <ProjectsAdmin />}
          {activeTab === "gallery" && <GalleryAdmin />}
          {activeTab === "blogs" && <BlogsAdmin />}
        </div>
      </div>
    </div>
  );
}
