import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";

const BlogDetail = () => {
  const { title } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const decodedTitle = decodeURIComponent(title);
    const storedBlogs = JSON.parse(localStorage.getItem("blogs")) || [];
    
    console.log("Looking for blog with title:", decodedTitle);
    console.log("Stored blogs:", storedBlogs);
    
    // Search by title (case-insensitive)
    let selectedBlog = storedBlogs.find((b) => {
      const blogTitle = b.Title || b.title || "";
      return String(blogTitle).toLowerCase() === decodedTitle.toLowerCase();
    });
    
    console.log("Found blog:", selectedBlog);
    console.log("Blog Image field:", selectedBlog?.Image);
    
    if (selectedBlog) {
      setBlog(selectedBlog);
    } else {
      // If not found, show error after a short delay
      console.log("Blog not found! Going back...");
      setTimeout(() => {
        navigate(-1);
      }, 1500);
    }
  }, [title, navigate]);

  if (!blog) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center space-y-6 animate-fadeIn">
          <div className="w-16 h-16 md:w-24 md:h-24 mx-auto border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
          <h2 className="text-xl md:text-3xl font-bold text-[#0F172A]">Loading Blog...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-[2%] sm:px-0 relative overflow-hidden">
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-16">
          {/* Back Button and Breadcrumb */}
          <div className="flex items-center space-x-2 md:space-x-4 mb-8 md:mb-12 animate-fadeIn">
            <button
              onClick={() => navigate(-1)}
              className="group inline-flex items-center space-x-1.5 md:space-x-2 px-3 md:px-4 py-2 md:py-2 bg-white rounded-lg text-[#0F172A] hover:bg-[#F8FAFC] transition-all duration-300 border border-[#E5E7EB] text-sm md:text-base"
            >
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Back</span>
            </button>
            <div className="hidden md:flex items-center space-x-2">
              <span className="text-[#9CA3AF] text-xs md:text-sm">Blogs</span>
              <ChevronIcon />
              <span className="text-[#0F172A] font-medium text-xs md:text-sm">{blog.Title}</span>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            {/* Left Content */}
            <div className="flex flex-col justify-start space-y-6 animate-fadeIn">
              {/* Title */}
              <div>
                <h1 className="text-3xl md:text-5xl font-bold text-[#0F172A] mb-4">
                  {blog.Title}
                </h1>
                <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full" />
              </div>

              {/* Blog Meta Information */}
              <div className="flex flex-wrap items-center gap-4 md:gap-6">
                {blog.Date && (
                  <div className="flex items-center space-x-2 text-[#475569]">
                    <Calendar className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                    <span className="text-xs md:text-sm">{blog.Date}</span>
                  </div>
                )}
                {blog.Author && (
                  <div className="flex items-center space-x-2 text-[#475569]">
                    <User className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                    <span className="text-xs md:text-sm">{blog.Author}</span>
                  </div>
                )}
                {blog.Category && (
                  <div className="flex items-center space-x-2 text-[#475569]">
                    <Tag className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                    <span className="text-xs md:text-sm">{blog.Category}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="prose prose-sm md:prose-base max-w-none">
                <p className="text-[#475569] text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                  {blog.Content}
                </p>
              </div>
            </div>

            {/* Right Image */}
            <div className="flex items-center justify-center animate-fadeIn">
              {blog.Image ? (
                <div className="relative w-full h-96 md:h-full rounded-xl overflow-hidden shadow-lg">
                  <img
                    src={blog.Image}
                    alt={blog.Title}
                    onLoad={() => setIsImageLoaded(true)}
                    className={`w-full h-full object-cover transition-all duration-500 ${
                      isImageLoaded ? "scale-100 opacity-100" : "scale-95 opacity-0"
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
                </div>
              ) : (
                <div className="w-full h-96 md:h-full bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">📝</div>
                    <p className="text-[#9CA3AF]">No image available</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer>
        <center>
          <hr className="my-3 border-gray-400 opacity-15 sm:mx-auto lg:my-6 text-center" />
          <span className="block text-sm pb-4 text-gray-500 text-center dark:text-gray-400">
            © 2026{" "}
            <a href="https://sumitbarnawar.com.np/" className="hover:underline">
              Sumit Barnawar
            </a>
            . All Rights Reserved.
          </span>
        </center>
      </footer>
    </div>
  );
};

const ChevronIcon = () => (
  <svg
    className="w-4 h-4 md:w-5 md:h-5 text-[#9CA3AF]"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5l7 7-7 7"
    />
  </svg>
);

export default BlogDetail;
