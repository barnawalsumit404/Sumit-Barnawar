import React, { useState } from "react";
import Swal from "sweetalert2";
import AOS from "aos";
import "aos/dist/aos.css";

const HireMePage = ({ onClose }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contact: "",
    projectIdea: "",
    details: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    AOS.init({ once: false });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    Swal.fire({
      title: "Submitting...",
      html: "Please wait while we process your request.",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('Full Name', formData.fullName);
      formDataToSend.append('Email', formData.email);
      formDataToSend.append('Contact Number', formData.contact);
      formDataToSend.append('Project Idea', formData.projectIdea);
      formDataToSend.append('Details', formData.details);
      const response = await fetch("https://formspree.io/f/xqkrazkb", {
        method: "POST",
        headers: {
          'Accept': 'application/json',
        },
        body: formDataToSend,
      });
      Swal.close();
      if (response.ok || response.status === 200) {
        Swal.fire("Success!", "Your hire request has been submitted.", "success");
        setIsSubmitting(false);
        onClose();
      } else {
        Swal.fire("Error", "There was a problem submitting your request. Please try again.", "error");
        setIsSubmitting(false);
      }
    } catch (err) {
      Swal.close();
      Swal.fire("Error", "There was a problem submitting your request. Please try again.", "error");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative animate-fade-in" data-aos="zoom-in">
        <button className="absolute top-2 right-2 text-gray-500 hover:text-red-500" onClick={onClose}>&times;</button>
        <h2 className="text-2xl font-bold mb-4 text-blue-700">Hire Me</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required className="w-full px-4 py-2 border rounded" />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-2 border rounded" />
          <input type="tel" name="contact" placeholder="Contact Number" value={formData.contact} onChange={handleChange} required className="w-full px-4 py-2 border rounded" />
          <input type="text" name="projectIdea" placeholder="Project Idea" value={formData.projectIdea} onChange={handleChange} required className="w-full px-4 py-2 border rounded" />
          <textarea name="details" placeholder="Describe your project and any other details" value={formData.details} onChange={handleChange} required className="w-full px-4 py-2 border rounded min-h-[80px]" />
          <button type="submit" disabled={isSubmitting} className="w-full py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition">{isSubmitting ? "Submitting..." : "Submit"}</button>
        </form>
      </div>
    </div>
  );
};

export default HireMePage;
