"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import API from "../utils/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Current logged-in user
  const [users, setUsers] = useState([]); // List of all users (for admin)
  const [loading, setLoading] = useState(false); // Loading state
  const router = useRouter();

  // Load user from the token on app load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUser();
    }
  }, []);

  // Fetch the logged-in user details
  const fetchUser = async () => {
    try {
      const { data } = await API.get("/users/me");
      setUser(data); // Set the logged-in user's data
    } catch (error) {
      console.error(
        "Failed to fetch user:",
        error.response?.data?.message || error.message
      );
      localStorage.removeItem("token"); // Clear invalid token
      setUser(null);
    }
  };

  // Register a new user
  const register = async (name, email, password) => {
    try {
      setLoading(true);
      const { data } = await API.post("/users/register", {
        name,
        email,
        password,
      });
      localStorage.setItem("token", data.token); // Store JWT token
      await fetchUser(); // Fetch the user's data
      router.push("/"); // Redirect to home
    } catch (error) {
      console.error(
        "Registration failed:",
        error.response?.data?.message || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  // Login an existing user
  const login = async (email, password) => {
    try {
      setLoading(true);
      const { data } = await API.post("/users/login", { email, password });
      localStorage.setItem("token", data.token); // Store JWT token
      await fetchUser(); // Fetch the user's data
      router.push("/"); // Redirect to home
    } catch (error) {
      console.error(
        "Login failed:",
        error.response?.data?.message || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  // Logout the user
  const logout = () => {
    localStorage.removeItem("token"); // Remove JWT token
    setUser(null); // Clear user state
    router.push("/login"); // Redirect to login
  };

  // Fetch all users (for admin only)
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/users"); // Fetch users from backend
      setUsers(data); // Set users data
    } catch (error) {
      console.error(
        "Failed to fetch users:",
        error.response?.data?.message || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  // Update a user's details (for admin or user self-update)
  const updateUser = async (id, updatedData) => {
    try {
      const { data } = await API.put(`/users/${id}`, updatedData);
      if (user?._id === id) {
        setUser(data); // Update logged-in user data if applicable
      }
      await fetchUsers(); // Refresh users list for admin
    } catch (error) {
      console.error(
        "Failed to update user:",
        error.response?.data?.message || error.message
      );
    }
  };

  // Delete a user (for admin only)
  const deleteUser = async (id) => {
    try {
      await API.delete(`/users/${id}`);
      await fetchUsers(); // Refresh users list for admin
    } catch (error) {
      console.error(
        "Failed to delete user:",
        error.response?.data?.message || error.message
      );
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        users,
        loading,
        register,
        login,
        logout,
        fetchUsers,
        updateUser,
        deleteUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access AuthContext
export const useAuth = () => useContext(AuthContext);
