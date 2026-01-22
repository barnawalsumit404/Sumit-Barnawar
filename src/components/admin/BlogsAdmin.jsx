import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { Plus, Trash2, Edit, Save, X } from "lucide-react";
import Swal from "sweetalert2";

export default function BlogsAdmin() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    Title: "",
    Content: "",
    Author: "",
    Date: "",
    Category: "",
    Image: "",
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "blogs"));
      const blogsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setBlogs(blogsData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      Swal.fire("Error", "Failed to fetch blogs", "error");
      setLoading(false);
    }
  };

  const handleAddBlog = async () => {
    if (!formData.Title || !formData.Content) {
      Swal.fire("Error", "Please fill Title and Content", "error");
      return;
    }
    try {
      await addDoc(collection(db, "blogs"), {
        ...formData,
        Date: formData.Date || new Date().toLocaleDateString(),
      });
      Swal.fire("Success", "Blog added!", "success");
      resetForm();
      fetchBlogs();
    } catch (error) {
      Swal.fire("Error", "Failed to add blog", "error");
      console.error(error);
    }
  };

  const handleEditBlog = async () => {
    try {
      await updateDoc(doc(db, "blogs", editingId), formData);
      Swal.fire("Success", "Blog updated!", "success");
      resetForm();
      fetchBlogs();
    } catch (error) {
      Swal.fire("Error", "Failed to update blog", "error");
    }
  };

  const handleDeleteBlog = async (id) => {
    const result = await Swal.fire({
      title: "Delete Blog?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#dc2626",
    });

    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(db, "blogs", id));
        Swal.fire("Deleted!", "Blog deleted successfully", "success");
        fetchBlogs();
      } catch (error) {
        Swal.fire("Error", "Failed to delete blog", "error");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      Title: "",
      Content: "",
      Author: "",
      Date: "",
      Category: "",
      Image: "",
    });
    setShowForm(false);
    setEditingId(null);
  };

  const handleEditClick = (blog) => {
    setFormData(blog);
    setEditingId(blog.id);
    setShowForm(true);
  };

  if (loading) {
    return <div className="text-center py-8">Loading blogs...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Blogs Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          Add Blog
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h3 className="text-xl font-bold mb-4">{editingId ? "Edit Blog" : "Add New Blog"}</h3>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Title"
              value={formData.Title}
              onChange={(e) => setFormData({ ...formData, Title: e.target.value })}
              className="col-span-2 px-4 py-2 border rounded-lg"
            />
            <textarea
              placeholder="Content"
              value={formData.Content}
              onChange={(e) => setFormData({ ...formData, Content: e.target.value })}
              className="col-span-2 px-4 py-2 border rounded-lg"
              rows="5"
            />
            <input
              type="text"
              placeholder="Author"
              value={formData.Author}
              onChange={(e) => setFormData({ ...formData, Author: e.target.value })}
              className="px-4 py-2 border rounded-lg"
            />
            <input
              type="text"
              placeholder="Category"
              value={formData.Category}
              onChange={(e) => setFormData({ ...formData, Category: e.target.value })}
              className="px-4 py-2 border rounded-lg"
            />
            <input
              type="date"
              value={formData.Date}
              onChange={(e) => setFormData({ ...formData, Date: e.target.value })}
              className="col-span-2 px-4 py-2 border rounded-lg"
            />
            <input
              type="text"
              placeholder="Image URL"
              value={formData.Image}
              onChange={(e) => setFormData({ ...formData, Image: e.target.value })}
              className="col-span-2 px-4 py-2 border rounded-lg"
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={editingId ? handleEditBlog : handleAddBlog}
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
        {blogs.map((blog) => (
          <div key={blog.id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <h3 className="font-bold text-lg">{blog.Title}</h3>
                <p className="text-gray-500 text-sm">{blog.Date} • {blog.Author}</p>
              </div>
            </div>
            <p className="text-gray-700 mb-3">{blog.Content?.substring(0, 150)}...</p>
            <div className="flex gap-2">
              <button
                onClick={() => handleEditClick(blog)}
                className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => handleDeleteBlog(blog.id)}
                className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
