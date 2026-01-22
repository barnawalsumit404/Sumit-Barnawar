import { useTheme } from "@mui/material/styles";

import React, { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import SwipeableViews from "react-swipeable-views";
import { Link } from "react-router-dom";
import CardProject from "../components/CardProject";
import Certificate from "../components/Certificate";
import TechStackIcon from "../components/TechStackIcon";
import { auth, db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { Code, Award, Boxes } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

// Separate ShowMore/ShowLess button component
const ToggleButton = ({ onClick, isShowingMore }) => (
  <button
    onClick={onClick}
    className="
      px-3 py-1.5
      text-slate-300 
      hover:text-white 
      text-sm 
      font-medium 
      transition-all 
      duration-300 
      ease-in-out
      flex 
      items-center 
      gap-2
      bg-[#F8FAFC] 
      hover:bg-white
      rounded-md
      border 
      border-[#E5E7EB]
      hover:border-blue-300
      group
      relative
      overflow-hidden
    "
  >
    <span className="relative z-10 flex items-center gap-2 text-[#0F172A]">
      {isShowingMore ? "See Less" : "See More"}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`
          transition-transform 
          duration-300 
          ${isShowingMore ? "group-hover:-translate-y-0.5" : "group-hover:translate-y-0.5"}
        `}
      >
        <polyline points={isShowingMore ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}></polyline>
      </svg>
    </span>
    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
  </button>
);

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: { xs: 1, sm: 3 } }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const techStacks = [
  { icon: "html.svg", language: "HTML" },
  { icon: "css.svg", language: "CSS" },
  { icon: "javascript.svg", language: "JavaScript" },
  { icon: "tailwind.svg", language: "Tailwind CSS" },
  { icon: "reactjs.svg", language: "ReactJS" },
  { icon: "vite.svg", language: "Vite" },
  { icon: "nodejs.svg", language: "Node JS" },
  { icon: "bootstrap.svg", language: "Bootstrap" },
  { icon: "firebase.svg", language: "Firebase" },
  { icon: "MUI.svg", language: "Material UI" },
  { icon: "vercel.svg", language: "Vercel" },
  { icon: "SweetAlert.svg", language: "SweetAlert2" },
];

export default function FullWidthTabs() {
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [projects, setProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [showAllCertificates, setShowAllCertificates] = useState(false);
  const [showAllBlogs, setShowAllBlogs] = useState(false);
  const isMobile = window.innerWidth < 768;
  const initialItems = isMobile ? 4 : 6;
  const initialBlogs = isMobile ? 10 : 15;

  useEffect(() => {
    // Initialize AOS once
    AOS.init({
      once: false, // This will make animations occur only once
    });
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  // Ensure active tab resets to Projects when user logs out
  useEffect(() => {
    if (!isLoggedIn) {
      setValue(0);
    }
  }, [isLoggedIn]);

  const fetchData = useCallback(async () => {
    try {
      const projectCollection = collection(db, "projects");
      const certificateCollection = collection(db, "certificates");
      const galleryCollection = collection(db, "gallery");
      const blogsCollection = collection(db, "blogs");

      const [projectSnapshot, certificateSnapshot, gallerySnapshot, blogsSnapshot] = await Promise.all([
        getDocs(projectCollection),
        getDocs(certificateCollection),
        getDocs(galleryCollection),
        getDocs(blogsCollection),
      ]);

      const projectData = projectSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        TechStack: doc.data().TechStack || [],
      }));

      const certificateData = certificateSnapshot.docs.map((doc) => doc.data());
      const galleryData = gallerySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const blogsData = blogsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setProjects(projectData);
      setCertificates(certificateData);
      setGallery(galleryData);
      setBlogs(blogsData);

      // Store in localStorage
      localStorage.setItem("projects", JSON.stringify(projectData));
      localStorage.setItem("certificates", JSON.stringify(certificateData));
      localStorage.setItem("gallery", JSON.stringify(galleryData));
      localStorage.setItem("blogs", JSON.stringify(blogsData));
      setFetchError(null);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Avoid exposing server details in UI — show a generic message
      setFetchError("Failed to load portfolio data. Please try again later.");
    }
  }, []);


  // Demo projects fallback
  // Replace with your real projects
  const demoProjects = [
    {
      id: "Aritmatika Solver",
      Img: "/src/assets/images/profile.jpg",
      Title: "Aritmatika Solver",
      Description: "Program ini dirancang untuk mempermudah pengguna dalam menyelesaikan soal-soal Aritmatika secara otomatis dengan menggunakan bahasa pemrograman Python.",
      Link: "/project/Aritmatika%20Solver",
      TechStack: ["React", "Tailwind", "Firebase"],
      Features: ["Step-by-step solutions", "Mobile friendly", "Dark mode"],
      Github: "https://github.com/yourusername/aritmatika-solver"
    },
    {
      id: "AutoChat-Discord",
      Img: "/src/assets/images/profile.jpg",
      Title: "AutoChat-Discord",
      Description: "AutoChat-Discord adalah bot yang dibuat untuk mengirim pesan otomatis ke channel Discord sesuai jadwal yang ditentukan.",
      Link: "/project/AutoChat-Discord",
      TechStack: ["Node JS", "Discord.js"],
      Features: ["Schedule messages", "Easy setup", "Multiple channels"],
      Github: "https://github.com/yourusername/autochat-discordbot"
    },
    {
      id: "Buku Catatan",
      Img: "/src/assets/images/profile.jpg",
      Title: "Buku Catatan",
      Description: "Buku Catatan adalah aplikasi sederhana untuk mencatat dan mengelola tugas atau ide secara praktis.",
      Link: "/project/Buku%20Catatan",
      TechStack: ["React", "Firebase"],
      Features: ["Add/edit/delete notes", "Search notes", "Cloud sync"],
      Github: "https://github.com/yourusername/buku-catatan"
    },
    {
      id: "Growtopia-Calculator",
      Img: "/src/assets/images/profile.jpg",
      Title: "Growtopia-Calculator",
      Description: "Growtopia-Calculator membantu pemain Growtopia menghitung keuntungan dan mengelola item secara efisien.",
      Link: "/project/Growtopia-Calculator",
      TechStack: ["React", "Tailwind"],
      Features: ["Profit calculation", "Item database", "Responsive UI"],
      Github: "https://github.com/yourusername/growtopia-calculator"
    },
    {
      id: "IT Support Bekasi",
      Img: "/src/assets/images/profile.jpg",
      Title: "IT Support Bekasi",
      Description: "Website IT Support Bekasi adalah proyek yang saya buat atas permintaan guru di sekolah, untuk menyediakan layanan IT.",
      Link: "/project/IT%20Support%20Bekasi",
      TechStack: ["HTML", "CSS", "Bootstrap"],
      Features: ["Service listing", "Contact form", "Location map"],
      Github: "https://github.com/yourusername/it-support-bekasi"
    },
    {
      id: "Oprec24",
      Img: "/src/assets/images/profile.jpg",
      Title: "Oprec 24",
      Description: "Oprec 24 adalah platform rekrutmen online untuk pendaftaran dan seleksi anggota baru tahun 2024.",
      Link: "/project/Oprec24",
      TechStack: ["React", "Node JS"],
      Features: ["Online registration", "Applicant tracking", "Admin dashboard"],
      Github: "https://github.com/yourusername/oprec24"
    },
    {
      id: "Portofolio-V4",
      Img: "/src/assets/images/profile.jpg",
      Title: "Portofolio-V4",
      Description: "Portofolio-V4 adalah versi terbaru dari website portofolio saya dengan tampilan modern dan fitur showcase proyek.",
      Link: "/project/Portofolio-V4",
      TechStack: ["React", "Tailwind", "Vite"],
      Features: ["Modern design", "Responsive layout", "Project showcase"],
      Github: "https://github.com/yourusername/portofolio-v4"
    },
    {
      id: "QR Code Generator",
      Img: "/src/assets/images/profile.jpg",
      Title: "QR Code Generator",
      Description: "QR Code Generator adalah aplikasi untuk membuat kode QR dari teks atau tautan secara instan.",
      Link: "/project/QR%20Code%20Generator",
      TechStack: ["React", "JavaScript"],
      Features: ["Instant QR generation", "Download as image", "Custom colors"],
      Github: "https://github.com/yourusername/qr-code-generator"
    },
    {
      id: "The-Cats",
      Img: "/src/assets/images/profile.jpg",
      Title: "The Cats",
      Description: "The Cats adalah aplikasi galeri yang menampilkan berbagai ras kucing dan fakta menarik tentang kucing.",
      Link: "/project/The-Cats",
      TechStack: ["React", "API"],
      Features: ["Cat breed info", "Image gallery", "Search cats"],
      Github: "https://github.com/yourusername/the-cats"
    },
    {
      id: "Web Kelas V1",
      Img: "/src/assets/images/profile.jpg",
      Title: "Web Kelas V1",
      Description: "Web Kelas V1 adalah versi pertama aplikasi manajemen kelas untuk mengelola siswa dan tugas.",
      Link: "/project/Web%20Kelas%20V1",
      TechStack: ["HTML", "CSS", "JavaScript"],
      Features: ["Class list", "Assignments", "Announcements"],
      Github: "https://github.com/yourusername/web-kelas-v1"
    },
    {
      id: "Web Kelas V2",
      Img: "/src/assets/images/profile.jpg",
      Title: "Web Kelas V2",
      Description: "Web Kelas V2 adalah pengembangan dari versi sebelumnya dengan fitur dashboard siswa dan upload tugas.",
      Link: "/project/Web%20Kelas%20V2",
      TechStack: ["React", "Firebase"],
      Features: ["Student dashboard", "Assignment upload", "Notifications"],
      Github: "https://github.com/yourusername/web-kelas-v2"
    },
    {
      id: "WhatsApp Clone",
      Img: "/src/assets/images/profile.jpg",
      Title: "WhatsApp Clone",
      Description: "WhatsApp Clone adalah aplikasi tiruan WhatsApp dengan fitur chat real-time dan grup.",
      Link: "/project/WhatsApp%20Clone",
      TechStack: ["React", "Node JS", "Socket.io"],
      Features: ["Real-time chat", "Group messaging", "Media sharing"],
      Github: "https://github.com/yourusername/whatsapp-clone"
    },
    {
      id: "conexatindo",
      Img: "/src/assets/images/profile.jpg",
      Title: "Company Profile",
      Description: "Company Profile (conexatindo) adalah website profil perusahaan yang menampilkan layanan dan kontak.",
      Link: "/project/conexatindo",
      TechStack: ["HTML", "CSS", "Bootstrap"],
      Features: ["About company", "Service showcase", "Contact form"],
      Github: "https://github.com/yourusername/conexatindo"
    },
  ];

  useEffect(() => {
    // Decide where to load public data from: try Cloud Function, fallback to cached data
    const loadPublic = async () => {
      // Attempt Cloud Function if env var is set
      const FUNC_URL = import.meta.env.VITE_PORTFOLIO_FUNC_URL;
      if (FUNC_URL) {
        try {
          const resp = await fetch(FUNC_URL, { headers: { Accept: 'application/json' } });
          if (resp.ok) {
            const json = await resp.json();
            if (Array.isArray(json.projects)) setProjects(json.projects);
            if (Array.isArray(json.certificates)) setCertificates(json.certificates);
            setFetchError(null);
            return;
          } else {
            console.warn('Public function responded with', resp.status);
          }
        } catch (err) {
          console.warn('Public fetch failed:', err);
        }
      }

      // Try to fetch from Firestore directly (now that projects are public)
      try {
        const projectCollection = collection(db, "projects");
        const certificateCollection = collection(db, "certificates");
        const galleryCollection = collection(db, "gallery");
        const blogsCollection = collection(db, "blogs");

        const [projectSnapshot, certificateSnapshot, gallerySnapshot, blogsSnapshot] = await Promise.all([
          getDocs(projectCollection),
          getDocs(certificateCollection),
          getDocs(galleryCollection),
          getDocs(blogsCollection),
        ]);

        const projectData = projectSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          TechStack: doc.data().TechStack || [],
        }));

        const certificateData = certificateSnapshot.docs.map((doc) => doc.data());
        const galleryData = gallerySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const blogsData = blogsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        if (projectData.length > 0) {
          setProjects(projectData);
          setCertificates(certificateData);
          setGallery(galleryData);
          setBlogs(blogsData);
          localStorage.setItem("projects", JSON.stringify(projectData));
          localStorage.setItem("certificates", JSON.stringify(certificateData));
          localStorage.setItem("gallery", JSON.stringify(galleryData));
          localStorage.setItem("blogs", JSON.stringify(blogsData));
          setFetchError(null);
          console.log('Loaded from Firestore (public):', projectData.length, 'projects,', galleryData.length, 'gallery items,', blogsData.length, 'blogs');
          return;
        }
      } catch (err) {
        console.error('Firestore fetch error:', err);
      }

      // Fallback to cached localStorage
      try {
        const cachedProjects = localStorage.getItem('projects');
        const cachedCertificates = localStorage.getItem('certificates');
        const cachedGallery = localStorage.getItem('gallery');
        const cachedBlogs = localStorage.getItem('blogs');
        if (cachedProjects) setProjects(JSON.parse(cachedProjects));
        if (cachedCertificates) setCertificates(JSON.parse(cachedCertificates));
        if (cachedGallery) setGallery(JSON.parse(cachedGallery));
        if (cachedBlogs) setBlogs(JSON.parse(cachedBlogs));
      } catch (e) {
        console.warn('Failed to read cached data:', e);
      }
    };

    if (isLoggedIn) {
      fetchData();
    } else {
      loadPublic();
    }
  }, [fetchData, isLoggedIn]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const toggleShowMore = useCallback((type) => {
    if (type === 'projects') {
      setShowAllProjects(prev => !prev);
    } else if (type === 'certificates') {
      setShowAllCertificates(prev => !prev);
    } else if (type === 'blogs') {
      setShowAllBlogs(prev => !prev);
    }
  }, []);

  // Always show demo projects if Firestore is empty
  const projectsToShow = projects.length > 0 ? projects : demoProjects;
  const displayedProjects = showAllProjects ? projectsToShow : projectsToShow.slice(0, initialItems);
  const displayedCertificates = showAllCertificates ? certificates : certificates.slice(0, initialItems);
  const displayedBlogs = showAllBlogs ? blogs : blogs.slice(0, initialBlogs);

  return (
    <div className="md:px-[10%] px-[5%] w-full sm:mt-0 mt-[3rem] bg-[#FFFFFF] overflow-hidden" id="Portofolio">
      {/* Header section - unchanged */}
      <div className="text-center pb-10" data-aos="fade-up" data-aos-duration="1000">
        <h2 className="inline-block text-3xl md:text-5xl font-bold text-center mx-auto text-blue-600">
          Portfolio Showcase
        </h2>
        <p className="text-black max-w-2xl mx-auto text-sm md:text-base mt-2">
          Explore my journey through projects, certifications, and technical expertise. 
          Each section represents a milestone in my continuous learning path.
        </p>
      </div>
      {fetchError && (
        <div className="mb-4 relative z-[9999] pointer-events-auto">
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md flex items-center justify-between relative z-[9999] pointer-events-auto">
            <div className="text-sm">{fetchError}</div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setFetchError(null);
                  fetchData();
                }}
                className="px-3 py-1.5 bg-red-600 text-white rounded-md text-sm pointer-events-auto"
              >
                Retry
              </button>
              <button
                onClick={() => setFetchError(null)}
                className="px-3 py-1.5 bg-transparent border border-red-200 text-red-600 rounded-md text-sm pointer-events-auto"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      <Box sx={{ width: "100%" }}>
        {/* AppBar and Tabs section - unchanged */}
        <AppBar
          position="static"
          elevation={0}
          sx={{
            bgcolor: "transparent",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "20px",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "linear-gradient(180deg, rgba(139, 92, 246, 0.03) 0%, rgba(59, 130, 246, 0.03) 100%)",
              backdropFilter: "blur(10px)",
              zIndex: 0,
            },
          }}
          className="md:px-4"
        >
          {/* Tabs remain unchanged */}
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="secondary"
            indicatorColor="secondary"
            variant="fullWidth"
            sx={{
              // Existing styles remain unchanged
              minHeight: "70px",
              "& .MuiTab-root": {
                fontSize: { xs: "0.9rem", md: "1rem" },
                fontWeight: "600",
                color: "#000000",
                textTransform: "none",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                padding: "20px 0",
                zIndex: 1,
                margin: "8px",
                borderRadius: "12px",
                "&:hover": {
                  color: "#2563EB",
                  backgroundColor: "rgba(37, 99, 235, 0.1)",
                  transform: "translateY(-2px)",
                  "& .lucide": {
                    transform: "scale(1.1) rotate(5deg)",
                  },
                },
                "&.Mui-selected": {
                  color: "#fff",
                  background: "linear-gradient(135deg, #2563EB 0%, #1e40af 100%)",
                  boxShadow: "0 4px 15px -3px rgba(37, 99, 235, 0.4)",
                  "& .lucide": {
                    color: "#fff",
                  },
                },
              },
              "& .MuiTabs-indicator": {
                height: 0,
              },
              "& .MuiTabs-flexContainer": {
                gap: "8px",
              },
            }}
          >
            {[{ key: 'projects', icon: <Code className="mb-2 w-5 h-5 transition-all duration-300" />, label: 'Projects' },
              { key: 'gallery', icon: <Award className="mb-2 w-5 h-5 transition-all duration-300" />, label: 'Gallery' },
              { key: 'blogs', icon: <Boxes className="mb-2 w-5 h-5 transition-all duration-300" />, label: 'Blogs' }]
              .map((tab, idx) => (
                <Tab key={tab.key} icon={tab.icon} label={tab.label} {...a11yProps(idx)} />
              ))}
          </Tabs>
        </AppBar>

        <SwipeableViews
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={value}
          onChangeIndex={setValue}
        >
          {([{ key: 'projects' }, { key: 'gallery' }, { key: 'blogs' }]
            .map((tab, idx) => {
              if (tab.key === 'projects') {
                return (
                  <TabPanel key={tab.key} value={value} index={idx} dir={theme.direction}>
                    <div className="container mx-auto flex justify-center items-center overflow-hidden">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-5">
                        {displayedProjects.map((project, index) => (
                          <div
                            key={project.id || index}
                            data-aos={index % 3 === 0 ? "fade-up-right" : index % 3 === 1 ? "fade-up" : "fade-up-left"}
                            data-aos-duration={index % 3 === 0 ? "1000" : index % 3 === 1 ? "1200" : "1000"}
                          >
                            <CardProject
                              Img={project.Img}
                              Title={project.Title}
                              Description={project.Description}
                              Link={project.Link}
                              id={project.id}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    {(projectsToShow.length > initialItems) && (
                      <div className="mt-6 w-full flex justify-start">
                        <ToggleButton
                          onClick={() => toggleShowMore('projects')}
                          isShowingMore={showAllProjects}
                        />
                      </div>
                    )}
                  </TabPanel>
                );
              }

              if (tab.key === 'gallery') {
                return (
                  <TabPanel key={tab.key} value={value} index={idx} dir={theme.direction}>
                    <div className="container mx-auto flex flex-col items-center justify-center overflow-hidden pb-[5%]">
                      {gallery.length === 0 ? (
                        <>
                          <h3 className="text-2xl font-bold mb-4 text-blue-700">Gallery</h3>
                          <p className="text-center text-[#475569] max-w-xl mb-6">A visual journey through my work and memorable moments.</p>
                          <div className="text-[#A3A3A3] text-base">No gallery items yet.</div>
                        </>
                      ) : (
                        <>
                          <h3 className="text-2xl font-bold mb-4 text-blue-700">Gallery</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                            {gallery.map((item, index) => (
                              <div
                                key={item.id || index}
                                data-aos={index % 3 === 0 ? "fade-up-right" : index % 3 === 1 ? "fade-up" : "fade-up-left"}
                                data-aos-duration="1000"
                                className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                              >
                                {item.ImageUrl && (
                                  <img
                                    src={item.ImageUrl}
                                    alt={item.Title}
                                    className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                                  />
                                )}
                                <div className="p-4 bg-white">
                                  <h4 className="font-bold text-lg text-gray-800">{item.Title}</h4>
                                  <p className="text-gray-600 text-sm mt-2">{item.Description}</p>
                                  {item.Category && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded mt-2 inline-block">{item.Category}</span>}
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </TabPanel>
                );
              }

              if (tab.key === 'blogs') {
                return (
                  <TabPanel key={tab.key} value={value} index={idx} dir={theme.direction}>
                    <div className="container mx-auto flex flex-col items-center justify-center overflow-hidden pb-[5%]">
                      {blogs.length === 0 ? (
                        <>
                          <h3 className="text-2xl font-bold mb-4 text-blue-700">Blog Posts</h3>
                          <p className="text-center text-[#475569] max-w-xl mb-6">Thoughts, experiences, and technical insights.</p>
                          <div className="text-[#A3A3A3] text-base">No blog posts yet.</div>
                        </>
                      ) : (
                        <>
                          <h3 className="text-2xl font-bold mb-4 text-blue-700">Blog Posts</h3>
                          <div className="space-y-6 w-full max-w-4xl">
                            {displayedBlogs.map((blog, index) => (
                              <Link
                                key={blog.id || index}
                                to={`/blog/${encodeURIComponent(blog.Title)}`}
                                className="no-underline"
                              >
                                <div
                                  data-aos={index % 2 === 0 ? "fade-up-right" : "fade-up-left"}
                                  data-aos-duration="1000"
                                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border-l-4 border-blue-500 cursor-pointer hover:bg-blue-50"
                                >
                                  <div className="flex justify-between items-start mb-2">
                                    <div>
                                      <h4 className="font-bold text-xl text-gray-800 hover:text-blue-600 transition-colors">{blog.Title}</h4>
                                      <p className="text-gray-500 text-sm">{blog.Date} • {blog.Author}</p>
                                    </div>
                                    {blog.Category && <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">{blog.Category}</span>}
                                  </div>
                                  <p className="text-gray-700 mt-3">{blog.Content?.substring(0, 200)}...</p>
                                  <button className="text-blue-600 hover:text-blue-800 font-medium text-sm mt-3">Read More →</button>
                                </div>
                              </Link>
                            ))}
                          </div>
                          {(blogs.length > initialBlogs) && (
                            <div className="mt-6 w-full flex justify-start max-w-4xl">
                              <ToggleButton
                                onClick={() => toggleShowMore('blogs')}
                                isShowingMore={showAllBlogs}
                              />
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </TabPanel>
                );
              }

              return null;
            }))}
          </SwipeableViews>
        </Box>
    </div>
  );
}