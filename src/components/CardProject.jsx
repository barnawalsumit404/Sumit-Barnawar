import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ArrowRight } from 'lucide-react';

const CardProject = ({ Img, Title, Description, Link: ProjectLink, id }) => {
  // Handle kasus ketika ProjectLink kosong
  const handleLiveDemo = (e) => {
    if (!ProjectLink) {
      console.log("ProjectLink kosong");
      e.preventDefault();
      alert("Live demo link is not available");
    }
  };
  
  const handleDetails = (e) => {
    if (!id) {
      console.log("ID kosong");
      e.preventDefault();
      alert("Project details are not available");
    }
  };
  

  return (
    <div className="group relative w-full">
      <div className="relative overflow-hidden rounded-lg bg-white border border-[#E5E7EB] shadow-sm hover:shadow-md transition-all duration-300">
        <div className="relative p-0">
          <div className="relative overflow-hidden rounded-t-lg">
                <div className="w-full h-48 md:h-56 rounded-t-lg overflow-hidden flex items-center justify-center bg-[#F8FAFC] p-3">
                  <img
                    src={Img}
                    alt={Title}
                    className="w-[95%] h-[95%] object-cover rounded-lg shadow-sm"
                  />
                </div>
          </div>
          <div className="p-5 space-y-3">
            <h3 className="text-lg font-semibold text-[#0F172A]">
              {Title}
            </h3>
            <div className="text-[#475569] text-sm leading-relaxed line-clamp-2">
              {Description}
            </div>
            <div className="pt-3 flex items-center justify-between">
              {ProjectLink ? (
                <a
                  href={ProjectLink || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleLiveDemo}
                  className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors duration-200 text-sm font-medium"
                >
                  <span>Live Demo</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              ) : (
                <span className="text-[#9CA3AF] text-sm">Demo Not Available</span>
              )}
              {id ? (
                <Link
                  to={`/project/${id}`}
                  onClick={handleDetails}
                  className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 text-sm font-medium"
                >
                  <span>Details</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <span className="text-[#9CA3AF] text-sm">Details Not Available</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardProject;