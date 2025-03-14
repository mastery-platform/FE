"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import styles from "@/styles/pages/auth.module.scss"; // ✅ Import updated styles

export default function RegisterPage() {
  const { register, loading } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    register(formData.name, formData.email, formData.password);
  };

  return (
    <div className={styles["auth-container"]}>
      <h1>Register</h1>
      <form className={styles["auth-form"]} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}
