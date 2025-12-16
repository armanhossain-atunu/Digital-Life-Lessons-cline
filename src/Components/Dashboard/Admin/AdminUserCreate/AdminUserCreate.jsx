import React, { useState } from "react";
import axios from "axios";

const CreateUserForm = ({ refetch }) => {
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    role: "user",
    plan: "free",
    password: ""
  });
  const [photoFile, setPhotoFile] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setPhotoFile(e.target.files[0]); // store selected file
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("displayName", formData.displayName);
      data.append("email", formData.email);
      data.append("role", formData.role);
      data.append("plan", formData.plan);
      data.append("password", formData.password);
      data.append("createdAt", new Date().toISOString());

      if (photoFile) {
        data.append("photo", photoFile); // attach file
      }

      await axios.post(`${import.meta.env.VITE_API_URL}/users`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("User created successfully!");
      refetch();
    } catch (error) {
      alert("Failed to create user");
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto px-4 mt-5 bg-base-300 shadow rounded">
      <h1 className="text-2xl font-bold text-center">Admin User Create</h1>
      <input
        type="text"
        name="displayName"
        placeholder="Name"
        value={formData.displayName}
        onChange={handleChange}
        className="border p-2 w-full"
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className="border p-2 w-full"
        required
      />
      <input
        type="text"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        className="border p-2 w-full"
        required
      />
      <select name="role" value={formData.role} onChange={handleChange} className="border p-2 w-full">
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      <select name="plan" value={formData.plan} onChange={handleChange} className="border p-2 w-full">
        <option value="free">Free</option>
        <option value="premium">Premium</option>
      </select>

      {/* File input instead of text */}
      <input
        type="file"
        name="photo"
        accept="image/*"
        onChange={handleFileChange}
        className="border border-dashed p-4 w-full"
      />

      <button type="submit" className="bg-lime-500 w-full mb-2 text-white px-4 py-2 rounded hover:bg-lime-700">
        Create User
      </button>
    </form>
  );
};

export default CreateUserForm;
