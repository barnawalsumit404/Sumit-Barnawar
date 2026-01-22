import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { Plus, Trash2, Edit, Save, X, Download } from "lucide-react";
import Swal from "sweetalert2";

const DEMO_PROJECTS = [
  {
    Title: "Aritmatika Solver",
    Img: "/src/assets/images/profile.jpg",
    Description: "Program ini dirancang untuk mempermudah pengguna dalam menyelesaikan soal-soal Aritmatika secara otomatis dengan menggunakan bahasa pemrograman Python.",
    Link: "/project/Aritmatika%20Solver",
    TechStack: ["React", "Tailwind", "Firebase"],
    Features: ["Step-by-step solutions", "Mobile friendly", "Dark mode"],
    Github: "https://github.com/yourusername/aritmatika-solver"
  },
  {
    Title: "AutoChat-Discord",
    Img: "/src/assets/images/profile.jpg",
    Description: "AutoChat-Discord adalah bot yang dibuat untuk mengirim pesan otomatis ke channel Discord sesuai jadwal yang ditentukan.",
    Link: "/project/AutoChat-Discord",
    TechStack: ["Node JS", "Discord.js"],
    Features: ["Schedule messages", "Easy setup", "Multiple channels"],
    Github: "https://github.com/yourusername/autochat-discordbot"
  },
  {
    Title: "Buku Catatan",
    Img: "/src/assets/images/profile.jpg",
    Description: "Buku Catatan adalah aplikasi sederhana untuk mencatat dan mengelola tugas atau ide secara praktis.",
    Link: "/project/Buku%20Catatan",
    TechStack: ["React", "Firebase"],
    Features: ["Add/edit/delete notes", "Search notes", "Cloud sync"],
    Github: "https://github.com/yourusername/buku-catatan"
  },
  {
    Title: "Growtopia-Calculator",
    Img: "/src/assets/images/profile.jpg",
    Description: "Growtopia-Calculator membantu pemain Growtopia menghitung keuntungan dan mengelola item secara efisien.",
    Link: "/project/Growtopia-Calculator",
    TechStack: ["React", "Tailwind"],
    Features: ["Profit calculation", "Item database", "Responsive UI"],
    Github: "https://github.com/yourusername/growtopia-calculator"
  },
  {
    Title: "IT Support Bekasi",
    Img: "/src/assets/images/profile.jpg",
    Description: "Website IT Support Bekasi adalah proyek yang saya buat atas permintaan guru di sekolah, untuk menyediakan layanan IT.",
    Link: "/project/IT%20Support%20Bekasi",
    TechStack: ["HTML", "CSS", "Bootstrap"],
    Features: ["Service listing", "Contact form", "Location map"],
    Github: "https://github.com/yourusername/it-support-bekasi"
  },
  {
    Title: "Oprec 24",
    Img: "/src/assets/images/profile.jpg",
    Description: "Oprec 24 adalah platform rekrutmen online untuk pendaftaran dan seleksi anggota baru tahun 2024.",
    Link: "/project/Oprec24",
    TechStack: ["React", "Node JS"],
    Features: ["Online registration", "Applicant tracking", "Admin dashboard"],
    Github: "https://github.com/yourusername/oprec24"
  },
  {
    Title: "Portofolio-V4",
    Img: "/src/assets/images/profile.jpg",
    Description: "Portofolio-V4 adalah versi terbaru dari website portofolio saya dengan tampilan modern dan fitur showcase proyek.",
    Link: "/project/Portofolio-V4",
    TechStack: ["React", "Tailwind", "Vite"],
    Features: ["Modern design", "Responsive layout", "Project showcase"],
    Github: "https://github.com/yourusername/portofolio-v4"
  },
  {
    Title: "QR Code Generator",
    Img: "/src/assets/images/profile.jpg",
    Description: "QR Code Generator adalah aplikasi untuk membuat kode QR dari teks atau tautan secara instan.",
    Link: "/project/QR%20Code%20Generator",
    TechStack: ["React", "JavaScript"],
    Features: ["Instant QR generation", "Download as image", "Custom colors"],
    Github: "https://github.com/yourusername/qr-code-generator"
  },
  {
    Title: "The Cats",
    Img: "/src/assets/images/profile.jpg",
    Description: "The Cats adalah aplikasi galeri yang menampilkan berbagai ras kucing dan fakta menarik tentang kucing.",
    Link: "/project/The-Cats",
    TechStack: ["React", "API"],
    Features: ["Cat breed info", "Image gallery", "Search cats"],
    Github: "https://github.com/yourusername/the-cats"
  },
  {
    Title: "Web Kelas V1",
    Img: "/src/assets/images/profile.jpg",
    Description: "Web Kelas V1 adalah versi pertama aplikasi manajemen kelas untuk mengelola siswa dan tugas.",
    Link: "/project/Web%20Kelas%20V1",
    TechStack: ["HTML", "CSS", "JavaScript"],
    Features: ["Class list", "Assignments", "Announcements"],
    Github: "https://github.com/yourusername/web-kelas-v1"
  },
  {
    Title: "Web Kelas V2",
    Img: "/src/assets/images/profile.jpg",
    Description: "Web Kelas V2 adalah pengembangan dari versi sebelumnya dengan fitur dashboard siswa dan upload tugas.",
    Link: "/project/Web%20Kelas%20V2",
    TechStack: ["React", "Firebase"],
    Features: ["Student dashboard", "Assignment upload", "Notifications"],
    Github: "https://github.com/yourusername/web-kelas-v2"
  },
  {
    Title: "WhatsApp Clone",
    Img: "/src/assets/images/profile.jpg",
    Description: "WhatsApp Clone adalah aplikasi tiruan WhatsApp dengan fitur chat real-time dan grup.",
    Link: "/project/WhatsApp%20Clone",
    TechStack: ["React", "Node JS", "Socket.io"],
    Features: ["Real-time chat", "Group messaging", "Media sharing"],
    Github: "https://github.com/yourusername/whatsapp-clone"
  },
  {
    Title: "Company Profile",
    Img: "/src/assets/images/profile.jpg",
    Description: "Company Profile (conexatindo) adalah website profil perusahaan yang menampilkan layanan dan kontak.",
    Link: "/project/conexatindo",
    TechStack: ["HTML", "CSS", "Bootstrap"],
    Features: ["About company", "Service showcase", "Contact form"],
    Github: "https://github.com/yourusername/conexatindo"
  },
];

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    Title: "",
    Description: "",
    Img: "",
    Link: "",
    TechStack: "",
    Features: "",
    Github: "",
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "projects"));
      const projectsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProjects(projectsData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching projects:", error);
      Swal.fire("Error", "Failed to fetch projects", "error");
      setLoading(false);
    }
  };

  const handleAddProject = async () => {
    if (!formData.Title || !formData.Description) {
      Swal.fire("Error", "Please fill Title and Description", "error");
      return;
    }
    try {
      await addDoc(collection(db, "projects"), {
        ...formData,
        TechStack: Array.isArray(formData.TechStack) 
          ? formData.TechStack 
          : formData.TechStack.split(",").map((t) => t.trim()),
        Features: Array.isArray(formData.Features) 
          ? formData.Features 
          : formData.Features.split(",").map((f) => f.trim()),
      });
      Swal.fire("Success", "Project added!", "success");
      resetForm();
      fetchProjects();
    } catch (error) {
      console.error("Add project error:", error);
      Swal.fire("Error", `Failed to add project: ${error.message}`, "error");
    }
  };

  const handleEditProject = async () => {
    try {
      await updateDoc(doc(db, "projects", editingId), {
        ...formData,
        TechStack: Array.isArray(formData.TechStack) 
          ? formData.TechStack 
          : formData.TechStack.split(",").map((t) => t.trim()),
        Features: Array.isArray(formData.Features) 
          ? formData.Features 
          : formData.Features.split(",").map((f) => f.trim()),
      });
      Swal.fire("Success", "Project updated!", "success");
      resetForm();
      fetchProjects();
    } catch (error) {
      console.error("Edit project error:", error);
      Swal.fire("Error", `Failed to update project: ${error.message}`, "error");
    }
  };

  const handleDeleteProject = async (id) => {
    const result = await Swal.fire({
      title: "Delete Project?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#dc2626",
    });

    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(db, "projects", id));
        Swal.fire("Deleted!", "Project deleted successfully", "success");
        fetchProjects();
      } catch (error) {
        Swal.fire("Error", "Failed to delete project", "error");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      Title: "",
      Description: "",
      Img: "",
      Link: "",
      TechStack: "",
      Features: "",
      Github: "",
    });
    setShowForm(false);
    setEditingId(null);
  };

  const handleImportDemoProjects = async () => {
    const result = await Swal.fire({
      title: "Import 13 Demo Projects?",
      text: "This will add all 13 existing projects to Firestore. This cannot be undone easily.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Import",
      confirmButtonColor: "#059669",
    });

    if (result.isConfirmed) {
      try {
        Swal.fire({
          title: "Importing...",
          text: "Adding projects to Firestore",
          icon: "info",
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading(),
        });

        for (const project of DEMO_PROJECTS) {
          await addDoc(collection(db, "projects"), {
            ...project,
            TechStack: Array.isArray(project.TechStack) ? project.TechStack : [project.TechStack],
            Features: Array.isArray(project.Features) ? project.Features : [project.Features],
          });
        }

        Swal.fire("Success!", "All 13 projects imported successfully!", "success");
        fetchProjects();
      } catch (error) {
        console.error("Import error:", error);
        Swal.fire("Error", `Failed to import projects: ${error.message}`, "error");
      }
    }
  };

  const handleEditClick = (project) => {
    setFormData({
      ...project,
      TechStack: Array.isArray(project.TechStack) ? project.TechStack.join(", ") : "",
      Features: Array.isArray(project.Features) ? project.Features.join(", ") : "",
    });
    setEditingId(project.id);
    setShowForm(true);
  };

  if (loading) {
    return <div className="text-center py-8">Loading projects...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Projects Management</h2>
        <div className="flex gap-2">
          {projects.length === 0 && (
            <button
              onClick={handleImportDemoProjects}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Download className="w-5 h-5" />
              Import 13 Projects
            </button>
          )}
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            Add Project
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h3 className="text-xl font-bold mb-4">{editingId ? "Edit Project" : "Add New Project"}</h3>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Title"
              value={formData.Title}
              onChange={(e) => setFormData({ ...formData, Title: e.target.value })}
              className="col-span-2 px-4 py-2 border rounded-lg"
            />
            <textarea
              placeholder="Description"
              value={formData.Description}
              onChange={(e) => setFormData({ ...formData, Description: e.target.value })}
              className="col-span-2 px-4 py-2 border rounded-lg"
              rows="3"
            />
            <input
              type="text"
              placeholder="Image URL"
              value={formData.Img}
              onChange={(e) => setFormData({ ...formData, Img: e.target.value })}
              className="px-4 py-2 border rounded-lg"
            />
            <input
              type="text"
              placeholder="Project Link"
              value={formData.Link}
              onChange={(e) => setFormData({ ...formData, Link: e.target.value })}
              className="px-4 py-2 border rounded-lg"
            />
            <input
              type="text"
              placeholder="Tech Stack (comma separated)"
              value={formData.TechStack}
              onChange={(e) => setFormData({ ...formData, TechStack: e.target.value })}
              className="px-4 py-2 border rounded-lg"
            />
            <input
              type="text"
              placeholder="Features (comma separated)"
              value={formData.Features}
              onChange={(e) => setFormData({ ...formData, Features: e.target.value })}
              className="px-4 py-2 border rounded-lg"
            />
            <input
              type="text"
              placeholder="Github Link"
              value={formData.Github}
              onChange={(e) => setFormData({ ...formData, Github: e.target.value })}
              className="col-span-2 px-4 py-2 border rounded-lg"
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={editingId ? handleEditProject : handleAddProject}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Save className="w-5 h-5" />
              {editingId ? "Update" : "Save"}
            </button>
            <button
              onClick={resetForm}
              className="flex items-center gap-2 px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
            >
              <X className="w-5 h-5" />
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {projects.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-center">
            <p className="text-yellow-800">No projects found. Click "Add Project" to create one.</p>
          </div>
        ) : (
          projects.map((project) => (
            <div key={project.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
              <div className="flex-1">
                <h3 className="font-bold text-lg">{project.Title}</h3>
                <p className="text-gray-600 text-sm">{project.Description?.substring(0, 100)}...</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditClick(project)}
                  className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteProject(project.id)}
                  className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
