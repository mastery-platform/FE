"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import styles from "@/styles/pages/dashboard.module.scss";

export default function DashboardPage() {
    const { user, updateUser } = useAuth();
    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        password: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        await updateUser(user._id, formData);
    };

    return (
        <ProtectedRoute>
            <div className={styles.container}>
                <h1>Dashboard</h1>
                <p><strong>Name:</strong> {user?.name}</p>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Role:</strong> {user?.role}</p>

                <h2>Update Profile</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <input
                        type="password"
                        placeholder="New Password (optional)"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                    <button type="submit">Update</button>
                </form>
            </div>
        </ProtectedRoute>
    );
}
