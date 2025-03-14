"use client";

import { createContext, useContext, useState, useEffect } from "react";
import API from "../utils/api"; // ✅ Ensure this points to the correct API configuration

const SkillContext = createContext();

export const SkillProvider = ({ children }) => {
  const [skills, setSkills] = useState([]); // Stores all user skills
  const [loading, setLoading] = useState(false); // Indicates loading state

  // Fetch skills when component loads
  useEffect(() => {
    fetchSkills();
  }, []);

  // **GET ALL SKILLS**
  const fetchSkills = async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/skills");
      setSkills(data);
    } catch (error) {
      console.error(
        "Error fetching skills:",
        error.response?.data?.message || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  // **CREATE A NEW SKILL**
  const createSkill = async (name, description, estimatedHours) => {
    setLoading(true);
    try {
      console.log("Creating skill:", { name, description, estimatedHours }); // ✅ Debugging

      const { data } = await API.post("/skills", {
        name,
        description,
        estimatedHours: Number(estimatedHours) || 1, // Ensure numeric value
      });

      setSkills((prev) => [...prev, data]); // Update state with new skill
    } catch (error) {
      console.error(
        "Error creating skill:",
        error.response?.data?.message || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  // **UPDATE SKILL**
  const updateSkill = async (id, updatedData) => {
    setLoading(true);
    try {
      const { data } = await API.put(`/skills/${id}`, updatedData);
      setSkills((prev) =>
        prev.map((skill) => (skill._id === id ? data : skill))
      );
    } catch (error) {
      console.error(
        "Error updating skill:",
        error.response?.data?.message || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  // **DELETE SKILL**
  const deleteSkill = async (id) => {
    setLoading(true);
    try {
      await API.delete(`/skills/${id}`);
      setSkills((prev) => prev.filter((skill) => skill._id !== id)); // Remove from UI state
    } catch (error) {
      console.error(
        "Error deleting skill:",
        error.response?.data?.message || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SkillContext.Provider
      value={{
        skills,
        loading,
        fetchSkills,
        createSkill,
        updateSkill,
        deleteSkill,
      }}
    >
      {children}
    </SkillContext.Provider>
  );
};

// Custom Hook to use Skill Context
export const useSkills = () => useContext(SkillContext);
