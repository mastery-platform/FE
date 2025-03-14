"use client";

import { useState } from "react";
import { useSkills } from "@/context/SkillContext";
import styles from "@/styles/pages/dashboard.module.scss";

export default function DashboardPage() {
  const { skills, createSkill, updateSkill, deleteSkill, loading } =
    useSkills();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    estimatedHours: "",
  });

  const [editData, setEditData] = useState(null); // Stores skill being edited

  // **Handle Form Submission (Create or Update Skill)**
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editData) {
      await updateSkill(editData._id, formData);
      setEditData(null); // Reset edit mode
    } else {
      await createSkill(
        formData.name,
        formData.description,
        formData.estimatedHours
      );
    }
    setFormData({ name: "", description: "", estimatedHours: "" }); // Clear form
  };

  // **Handle Skill Edit**
  const handleEdit = (skill) => {
    setEditData(skill);
    setFormData({
      name: skill.name,
      description: skill.description,
      estimatedHours: skill.estimatedHours,
    });
  };

  // **Handle Skill Delete**
  const handleDelete = async (id) => {
    await deleteSkill(id);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Welcome to Your Skill Dashboard</h1>

      <h2 className={styles.subheading}>Manage Your Skills</h2>

      {/* Skill Form */}
      <form className={styles.skillForm} onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <input
            type="text"
            placeholder="Skill Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={styles.input}
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className={styles.input}
            required
          />
          <input
            type="number"
            placeholder="Estimated Hours"
            value={formData.estimatedHours || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                estimatedHours: Number(e.target.value) || 1,
              })
            }
            className={styles.input}
            required
          />
          <button type="submit" className={styles.addButton} disabled={loading}>
            {editData ? "Update Skill" : "Add Skill"}
          </button>
        </div>
      </form>

      {/* Skills List */}
      <ul className={styles.skillList}>
        {skills.length === 0 ? (
          <p className={styles.noSkills}>
            No skills added yet. Start by adding a new skill above.
          </p>
        ) : (
          skills.map((skill) => (
            <li key={skill._id} className={styles.skillItem}>
              <div className={styles.skillDetails}>
                <strong>{skill.name}</strong> - {skill.description} (Est.{" "}
                {skill.estimatedHours} hrs)
              </div>
              <div className={styles.actionButtons}>
                <button
                  className={styles.editButton}
                  onClick={() => handleEdit(skill)}
                >
                  Edit
                </button>
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDelete(skill._id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
