"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import API from "@/utils/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // **Fetch the logged-in user details**
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUser();
    }
  }, []);

  const fetchUser = async () => {
    try {
      const { data } = await API.get("/users/me");
      setUser(data);
    } catch (error) {
      console.error(
        "Failed to fetch user:",
        error.response?.data?.message || error.message
      );
      localStorage.removeItem("token"); // Clear invalid token
      setUser(null);
    }
  };

  // **Register a new user**
  const register = async (name, email, password) => {
    try {
      setLoading(true);
      const { data } = await API.post("/users/register", {
        name,
        email,
        password,
      });
      localStorage.setItem("token", data.token);
      await fetchUser();
      router.push("/dashboard");
    } catch (error) {
      console.error(
        "Registration failed:",
        error.response?.data?.message || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  // **Login an existing user**
  const login = async (email, password) => {
    try {
      setLoading(true);
      const { data } = await API.post("/users/login", { email, password });
      localStorage.setItem("token", data.token);
      await fetchUser();
      router.push("/dashboard");
    } catch (error) {
      console.error(
        "Login failed:",
        error.response?.data?.message || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  // **Logout user**
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/login");
  };

  // **Update user details (Name, Email, Password)**
  const updateUser = async (updatedData) => {
    try {
      const { data } = await API.put(`/users/${user._id}`, updatedData);
      setUser(data); // Update user state
    } catch (error) {
      console.error(
        "Failed to update user:",
        error.response?.data?.message || error.message
      );
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
