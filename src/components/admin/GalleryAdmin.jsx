import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { Plus, Trash2, Edit, Save, X } from "lucide-react";
import Swal from "sweetalert2";

export default function GalleryAdmin() {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    Title: "",
    Description: "",
    ImageUrl: "",
    Category: "",
  });

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "gallery"));
      const galleryData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setGallery(galleryData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching gallery:", error);
      Swal.fire("Error", "Failed to fetch gallery items", "error");
      setLoading(false);
    }
  };

  const handleAddGallery = async () => {
    if (!formData.Title || !formData.ImageUrl) {
      Swal.fire("Error", "Please fill Title and Image URL", "error");
      return;
    }
    try {
      await addDoc(collection(db, "gallery"), formData);
      Swal.fire("Success", "Gallery item added!", "success");
      resetForm();
      fetchGallery();
    } catch (error) {
      Swal.fire("Error", "Failed to add gallery item", "error");
      console.error(error);
    }
  };

  const handleEditGallery = async () => {
    try {
      await updateDoc(doc(db, "gallery", editingId), formData);
      Swal.fire("Success", "Gallery item updated!", "success");
      resetForm();
      fetchGallery();
    } catch (error) {
      Swal.fire("Error", "Failed to update gallery item", "error");
    }
  };

  const handleDeleteGallery = async (id) => {
    const result = await Swal.fire({
      title: "Delete Gallery Item?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#dc2626",
    });

    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(db, "gallery", id));
        Swal.fire("Deleted!", "Gallery item deleted successfully", "success");
        fetchGallery();
      } catch (error) {
        Swal.fire("Error", "Failed to delete gallery item", "error");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      Title: "",
      Description: "",
      ImageUrl: "",
      Category: "",
    });
    setShowForm(false);
    setEditingId(null);
  };

  const handleEditClick = (item) => {
    setFormData(item);
    setEditingId(item.id);
    setShowForm(true);
  };

  if (loading) {
    return <div className="text-center py-8">Loading gallery...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Gallery Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          Add Image
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h3 className="text-xl font-bold mb-4">{editingId ? "Edit Gallery Item" : "Add New Gallery Item"}</h3>
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
              value={formData.ImageUrl}
              onChange={(e) => setFormData({ ...formData, ImageUrl: e.target.value })}
              className="col-span-2 px-4 py-2 border rounded-lg"
            />
            <input
              type="text"
              placeholder="Category"
              value={formData.Category}
              onChange={(e) => setFormData({ ...formData, Category: e.target.value })}
              className="col-span-2 px-4 py-2 border rounded-lg"
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={editingId ? handleEditGallery : handleAddGallery}
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {gallery.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow overflow-hidden">
            {item.ImageUrl && (
              <img
                src={item.ImageUrl}
                alt={item.Title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="font-bold text-lg">{item.Title}</h3>
              <p className="text-gray-600 text-sm mb-3">{item.Description}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditClick(item)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteGallery(item.id)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
