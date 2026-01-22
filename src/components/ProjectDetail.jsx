import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, ExternalLink, Github, Code2, Star,
  ChevronRight, Layers, Layout, Globe, Package, Cpu, Code,
} from "lucide-react";
import Swal from 'sweetalert2';

const TECH_ICONS = {
  React: Globe,
  Tailwind: Layout,
  Express: Cpu,
  Python: Code,
  Javascript: Code,
  HTML: Code,
  CSS: Code,
  default: Package,
};

const TechBadge = ({ tech }) => {
  const Icon = TECH_ICONS[tech] || TECH_ICONS["default"];
  
  return (
    <div className="group relative overflow-hidden px-3 py-2 md:px-3 md:py-2 bg-[#DBEAFE] rounded-lg border border-blue-200 transition-all duration-300">
      <div className="flex items-center gap-1.5">
        <Icon className="w-4 h-4 text-blue-700" />
        <span className="text-xs md:text-sm font-medium text-blue-900">
          {tech}
        </span>
      </div>
    </div>
  );
};

const FeatureItem = ({ feature }) => {
  return (
    <li className="flex items-start space-x-3 p-2">
      <div className="mt-1">
        <div className="w-2 h-2 rounded-full bg-blue-600" />
      </div>
      <span className="text-sm md:text-base text-[#475569]">
        {feature}
      </span>
    </li>
  );
};

const ProjectStats = ({ project }) => {
  const techStackCount = project?.TechStack?.length || 0;
  const featuresCount = project?.Features?.length || 0;

  return (
    <div className="grid grid-cols-2 gap-3 md:gap-4">
      <div className="flex items-center space-x-2 md:space-x-3 bg-[#DBEAFE] p-3 md:p-4 rounded-lg border border-blue-200">
        <div className="bg-blue-600/20 p-2 rounded-lg">
          <Code2 className="text-blue-700 w-4 h-4 md:w-5 md:h-5" strokeWidth={1.5} />
        </div>
        <div className="flex-grow">
          <div className="text-lg md:text-xl font-semibold text-blue-900">{techStackCount}</div>
          <div className="text-xs md:text-xs text-blue-700">Technologies</div>
        </div>
      </div>

      <div className="flex items-center space-x-2 md:space-x-3 bg-blue-50 p-3 md:p-4 rounded-lg border border-[#E5E7EB]">
        <div className="bg-blue-100 p-2 rounded-lg">
          <Layers className="text-blue-600 w-4 h-4 md:w-5 md:h-5" strokeWidth={1.5} />
        </div>
        <div className="flex-grow">
          <div className="text-lg md:text-xl font-semibold text-[#0F172A]">{featuresCount}</div>
          <div className="text-xs md:text-xs text-[#475569]">Key Features</div>
        </div>
      </div>
    </div>
  );
};

const handleGithubClick = (githubLink) => {
  if (githubLink === 'Private') {
    Swal.fire({
      icon: 'info',
      title: 'Source Code Private',
      text: 'Maaf, source code untuk proyek ini bersifat privat.',
      confirmButtonText: 'Mengerti',
      confirmButtonColor: '#2563EB',
      background: '#F8FAFC',
      color: '#0F172A'
    });
    return false;
  }
  return true;
};

const ProjectDetails = () => {
  const { title } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const decodedTitle = decodeURIComponent(title);
    const storedProjects = JSON.parse(localStorage.getItem("projects")) || [];
    
    console.log("Looking for project with title:", decodedTitle);
    console.log("Stored projects:", storedProjects);
    
    // Search by title (case-insensitive)
    let selectedProject = storedProjects.find((p) => {
      const projectTitle = p.Title || p.title || p.name || "";
      return String(projectTitle).toLowerCase() === decodedTitle.toLowerCase();
    });
    
    console.log("Found in stored projects:", selectedProject);
    
    // Fallback: if not found in localStorage, use demo projects
    if (!selectedProject) {
      const demoProjects = [
        { id: "Aritmatika Solver", Title: "Aritmatika Solver", Description: "Program ini dirancang untuk mempermudah pengguna dalam menyelesaikan soal-soal Aritmatika secara otomatis dengan menggunakan bahasa pemrograman Python.", Img: "/src/assets/images/profile.jpg", Link: "/project/Aritmatika%20Solver", TechStack: ["React", "Tailwind", "Firebase"], Features: ["Step-by-step solutions", "Mobile friendly", "Dark mode"], Github: "https://github.com/yourusername/aritmatika-solver" },
        { id: "AutoChat-Discord", Title: "AutoChat-Discord", Description: "AutoChat-Discord adalah bot yang dibuat untuk mengirim pesan otomatis ke channel Discord sesuai jadwal yang ditentukan.", Img: "/src/assets/images/profile.jpg", Link: "/project/AutoChat-Discord", TechStack: ["Node JS", "Discord.js"], Features: ["Schedule messages", "Easy setup", "Multiple channels"], Github: "https://github.com/yourusername/autochat-discordbot" },
        { id: "Buku Catatan", Title: "Buku Catatan", Description: "Buku Catatan adalah aplikasi sederhana untuk mencatat dan mengelola tugas atau ide secara praktis.", Img: "/src/assets/images/profile.jpg", Link: "/project/Buku%20Catatan", TechStack: ["React", "Firebase"], Features: ["Add/edit/delete notes", "Search notes", "Cloud sync"], Github: "https://github.com/yourusername/buku-catatan" },
        { id: "Growtopia-Calculator", Title: "Growtopia-Calculator", Description: "Growtopia-Calculator membantu pemain Growtopia menghitung keuntungan dan mengelola item secara efisien.", Img: "/src/assets/images/profile.jpg", Link: "/project/Growtopia-Calculator", TechStack: ["React", "Tailwind"], Features: ["Profit calculation", "Item database", "Responsive UI"], Github: "https://github.com/yourusername/growtopia-calculator" },
      ];
      selectedProject = demoProjects.find((p) => String(p.Title).toLowerCase() === decodedTitle.toLowerCase());
      console.log("Found in demo projects:", selectedProject);
    }
    
    if (selectedProject) {
      const enhancedProject = {
        ...selectedProject,
        Features: selectedProject.Features || [],
        TechStack: selectedProject.TechStack || [],
        Github: selectedProject.Github || 'https://github.com/EkiZR',
      };
      setProject(enhancedProject);
    } else {
      // If still not found, show error after a short delay
      console.log("Project not found! Going back...");
      setTimeout(() => {
        navigate(-1);
      }, 1500);
    }
  }, [title, navigate]);

  if (!project) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center space-y-6 animate-fadeIn">
          <div className="w-16 h-16 md:w-24 md:h-24 mx-auto border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
          <h2 className="text-xl md:text-3xl font-bold text-[#0F172A]">Loading Project...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-[2%] sm:px-0 relative overflow-hidden">
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-16">
          <div className="flex items-center space-x-2 md:space-x-4 mb-8 md:mb-12 animate-fadeIn">
            <button
              onClick={() => navigate(-1)}
              className="group inline-flex items-center space-x-1.5 md:space-x-2 px-3 md:px-4 py-2 md:py-2 bg-white rounded-lg text-[#0F172A] hover:bg-[#F8FAFC] transition-all duration-300 border border-[#E5E7EB] text-sm md:text-base"
            >
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Back</span>
            </button>
            <div className="flex items-center space-x-1 md:space-x-2 text-sm md:text-base text-[#9CA3AF]">
              <span>Projects</span>
              <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
              <span className="text-[#0F172A] truncate">{project.Title}</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 md:gap-16">
            <div className="space-y-6 md:space-y-10 animate-slideInLeft">
              <div className="space-y-4 md:space-y-6">
                <h1 className="text-3xl md:text-6xl font-bold text-[#0F172A] leading-tight">
                  {project.Title}
                </h1>
                <div className="relative h-1 w-16 md:w-24">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse" />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-sm" />
                </div>
              </div>

              <div className="prose max-w-none">
                <p className="text-base md:text-lg text-[#475569] leading-relaxed">
                  {project.Description}
                </p>
              </div>

              <ProjectStats project={project} />

              <div className="flex flex-wrap gap-3 md:gap-4">
                {/* Action buttons */}
                <a
                  href={project.Link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-6 md:px-8 py-3 md:py-4 bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg transition-all duration-300 text-sm md:text-base font-medium"
                >
                  <ExternalLink className="w-4 h-4 md:w-5 md:h-5" />
                  <span>Live Demo</span>
                </a>

                <a
                  href={project.Github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-6 md:px-8 py-3 md:py-4 border border-[#E5E7EB] hover:border-[#2563EB] text-[#0F172A] hover:text-[#2563EB] rounded-lg transition-all duration-300 text-sm md:text-base font-medium"
                  onClick={(e) => !handleGithubClick(project.Github) && e.preventDefault()}
                >
                  <Github className="w-4 h-4 md:w-5 md:h-5" />
                  <span>Github</span>
                </a>
              </div>

              <div className="space-y-4 md:space-y-6">
                <h3 className="text-lg md:text-xl font-semibold text-[#0F172A] mt-[3rem] md:mt-0 flex items-center gap-2 md:gap-3">
                  <Code2 className="w-4 h-4 md:w-5 md:h-5 text-[#2563EB]" />
                  Technologies Used
                </h3>
                {project.TechStack.length > 0 ? (
                  <div className="flex flex-wrap gap-2 md:gap-3">
                    {project.TechStack.map((tech, index) => (
                      <TechBadge key={index} tech={tech} />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm md:text-base text-[#A3A3A3]">No technologies added.</p>
                )}
              </div>
            </div>

            <div className="space-y-6 md:space-y-10 animate-slideInRight">
              <div className="relative rounded-lg overflow-hidden border border-[#E5E7EB] shadow-sm">
                <img
                  src={project.Img}
                  alt={project.Title}
                  className="w-full object-cover"
                  onLoad={() => setIsImageLoaded(true)}
                />
              </div>

              {/* Fitur Utama */}
              <div className="bg-white rounded-lg p-6 md:p-8 border border-[#E5E7EB] space-y-6">
                <h3 className="text-lg md:text-xl font-semibold text-[#0F172A] flex items-center gap-3">
                  <Star className="w-5 h-5 text-[#2563EB]" />
                  Key Features
                </h3>
                {project.Features.length > 0 ? (
                  <ul className="list-none space-y-2">
                    {project.Features.map((feature, index) => (
                      <FeatureItem key={index} feature={feature} />
                    ))}
                  </ul>
                ) : (
                  <p className="text-[#A3A3A3] text-sm">No features added.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 10s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-fadeIn {
          animation: fadeIn 0.7s ease-out;
        }
        .animate-slideInLeft {
          animation: slideInLeft 0.7s ease-out;
        }
        .animate-slideInRight {
          animation: slideInRight 0.7s ease-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ProjectDetails;

