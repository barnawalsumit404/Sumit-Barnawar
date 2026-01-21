import { useTheme } from "@mui/material/styles";

import React, { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import SwipeableViews from "react-swipeable-views";
import CardProject from "../components/CardProject";
import Certificate from "../components/Certificate";
import TechStackIcon from "../components/TechStackIcon";
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
  const [projects, setProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [showAllCertificates, setShowAllCertificates] = useState(false);
  const isMobile = window.innerWidth < 768;
  const initialItems = isMobile ? 4 : 6;

  useEffect(() => {
    // Initialize AOS once
    AOS.init({
      once: false, // This will make animations occur only once
    });
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const projectCollection = collection(db, "projects");
      const certificateCollection = collection(db, "certificates");

      const [projectSnapshot, certificateSnapshot] = await Promise.all([
        getDocs(projectCollection),
        getDocs(certificateCollection),
      ]);

      const projectData = projectSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        TechStack: doc.data().TechStack || [],
      }));

      const certificateData = certificateSnapshot.docs.map((doc) => doc.data());

      setProjects(projectData);
      setCertificates(certificateData);

      // Store in localStorage
      localStorage.setItem("projects", JSON.stringify(projectData));
      localStorage.setItem("certificates", JSON.stringify(certificateData));
    } catch (error) {
      console.error("Error fetching data:", error);
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
    fetchData();
  }, [fetchData]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const toggleShowMore = useCallback((type) => {
    if (type === 'projects') {
      setShowAllProjects(prev => !prev);
    } else {
      setShowAllCertificates(prev => !prev);
    }
  }, []);

  // Always show demo projects if Firestore is empty
  const projectsToShow = projects.length > 0 ? projects : demoProjects;
  const displayedProjects = showAllProjects ? projectsToShow : projectsToShow.slice(0, initialItems);
  const displayedCertificates = showAllCertificates ? certificates : certificates.slice(0, initialItems);

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
            <Tab
              icon={<Code className="mb-2 w-5 h-5 transition-all duration-300" />}
              label="Projects"
              {...a11yProps(0)}
            />
            <Tab
              icon={<Award className="mb-2 w-5 h-5 transition-all duration-300" />}
              label="Gallery"
              {...a11yProps(1)}
            />
            <Tab
              icon={<Boxes className="mb-2 w-5 h-5 transition-all duration-300" />}
              label="Blogs"
              {...a11yProps(2)}
            />
          </Tabs>
        </AppBar>

        <SwipeableViews
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={value}
          onChangeIndex={setValue}
        >
          <TabPanel value={value} index={0} dir={theme.direction}>
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
          <TabPanel value={value} index={1} dir={theme.direction}>
            <div className="container mx-auto flex flex-col items-center justify-center overflow-hidden pb-[5%]">
              <h3 className="text-2xl font-bold mb-4 text-blue-700">Gallery</h3>
              <p className="text-center text-[#475569] max-w-xl mb-6">A visual journey through my work and memorable moments. Gallery coming soon.</p>
              <div className="text-[#A3A3A3] text-base">No gallery items yet. Coming soon!</div>
            </div>
          </TabPanel>

          <TabPanel value={value} index={2} dir={theme.direction}>
            <div className="container mx-auto flex justify-center items-center overflow-hidden pb-[5%]">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 lg:gap-8 gap-5">
                {techStacks.map((stack, index) => (
                  <div
                    key={index}
                    data-aos={index % 3 === 0 ? "fade-up-right" : index % 3 === 1 ? "fade-up" : "fade-up-left"}
                    data-aos-duration={index % 3 === 0 ? "1000" : index % 3 === 1 ? "1200" : "1000"}
                  >
                    <TechStackIcon TechStackIcon={stack.icon} Language={stack.language} />
                  </div>
                ))}
              </div>
            </div>
          </TabPanel>
        </SwipeableViews>
      </Box>
    </div>
  );
}