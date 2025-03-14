"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import styles from "@/styles/pages/profile.module.scss";

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name, email: user.email, password: "" });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedData = { name: formData.name, email: formData.email };
    if (formData.password.trim()) {
      updatedData.password = formData.password;
    }

    try {
      await updateUser(user._id, updatedData);
      setMessage("Profile updated successfully!");
    } catch (error) {
      setMessage("Failed to update profile.");
    }
  };

  return (
    <ProtectedRoute>
      <div className={styles.container}>
        <h1>My Profile</h1>

        {message && <p className={styles.message}>{message}</p>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={styles.input} // ✅ Updated class
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className={styles.input} // ✅ Updated class
          />
          <input
            type="password"
            placeholder="New Password (optional)"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className={styles.input} // ✅ Updated class
          />
          <button type="submit" className={styles.button}>
            Update
          </button>
        </form>
      </div>
    </ProtectedRoute>
  );
}
