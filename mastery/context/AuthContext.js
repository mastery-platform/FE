"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import API from "../utils/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]); // Admin-only
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Load user on app load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      API.defaults.headers.Authorization = `Bearer ${token}`; // Attach token
      fetchUser();
    }
  }, []);

  // Fetch logged-in user details
  const fetchUser = async () => {
    try {
      const { data } = await API.get("/users/me");
      setUser(data);
    } catch (error) {
      console.error("Failed to fetch user:", error.response?.data?.message || error.message);
      logout(); // Auto logout if token is invalid
    }
  };

  // Register a new user
  const register = async (name, email, password) => {
    try {
      setLoading(true);
      const { data } = await API.post("/users/register", { name, email, password });

      localStorage.setItem("token", data.token);
      API.defaults.headers.Authorization = `Bearer ${data.token}`; // Attach token
      await fetchUser();
      router.push("/dashboard"); // Redirect to dashboard
    } catch (error) {
      console.error("Registration failed:", error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Login an existing user
  const login = async (email, password) => {
    try {
      setLoading(true);
      const { data } = await API.post("/users/login", { email, password });

      localStorage.setItem("token", data.token);
      API.defaults.headers.Authorization = `Bearer ${data.token}`;
      await fetchUser();
      router.push("/dashboard");
    } catch (error) {
      console.error("Login failed:", error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    API.defaults.headers.Authorization = null;
    router.push("/login");
  };

  // Fetch all users (Admin only)
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/users");
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Update a user
  const updateUser = async (id, updatedData) => {
    try {
        const { data } = await API.put(`/users/${id}`, updatedData);
        setUser(data); // Update logged-in user data
    } catch (error) {
        console.error("Failed to update user:", error.response?.data?.message || error.message);
    }
};


  // Delete a user (Admin only)
  const deleteUser = async (id) => {
    try {
      await API.delete(`/users/${id}`);
      await fetchUsers();
    } catch (error) {
      console.error("Failed to delete user:", error.response?.data?.message || error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, users, loading, register, login, logout, fetchUsers, updateUser, deleteUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for authentication
export const useAuth = () => useContext(AuthContext);
