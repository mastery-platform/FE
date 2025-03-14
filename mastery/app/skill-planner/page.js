"use client";

import { useState } from "react";
import ProgressBar from "@/components/ProgressBar"; // ✅ Import Progress Bar
import styles from "@/styles/pages/skill-planner.module.scss";

export default function SkillPlanner() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    skill: "",
    dailyTime: "",
    deadline: "",
  });
  const [aiResponse, setAiResponse] = useState(null);
  const [suggestions, setSuggestions] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "http://localhost:5001/api/skill-planner/analyze",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to analyze skill feasibility."
        );
      }

      const data = await response.json();

      if (data.feasible) {
        setStep(4);
        setAiResponse(data);
      } else {
        setStep(2);
        setSuggestions(data.suggestions || {});
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {loading && <ProgressBar isLoading={loading} />}{" "}
      {/* ✅ Show Progress Bar when loading */}
      {/* Step 1: Ask for Skill Details */}
      {step === 1 && !loading && (
        <div className={styles.inputGroup}>
          <h2>Plan Your Skill Mastery</h2>
          <input
            className={styles.input}
            type="text"
            placeholder="Skill Name"
            value={formData.skill}
            onChange={(e) =>
              setFormData({ ...formData, skill: e.target.value })
            }
          />
          <input
            className={styles.input}
            type="number"
            placeholder="Daily Study Time (hours)"
            value={formData.dailyTime}
            onChange={(e) =>
              setFormData({ ...formData, dailyTime: e.target.value })
            }
          />
          <input
            className={styles.input}
            type="date"
            value={formData.deadline}
            onChange={(e) =>
              setFormData({ ...formData, deadline: e.target.value })
            }
          />
          <button onClick={handleSubmit}>Analyze Feasibility</button>
        </div>
      )}
      {/* Step 2: Show Feasibility Results */}
      {step === 2 && !loading && (
        <div>
          <h2>Feasibility Check</h2>
          <p>
            Based on your current study time and deadline, the plan is{" "}
            <b>not feasible</b>.
          </p>
          <p>Would you like to adjust the study time or extend the deadline?</p>
          <div className={styles.buttonGroup}>
            <button onClick={() => setStep(3)}>Adjust Plan</button>
            <button onClick={() => setStep(4)}>Proceed Anyway</button>
          </div>
        </div>
      )}
      {/* Step 3: Let the user adjust their plan */}
      {step === 3 && !loading && (
        <div>
          <h2>Study Plan Not Feasible</h2>
          <p>The AI has determined that your goal is unrealistic.</p>

          <p>Suggested Adjustments:</p>
          <ul>
            <li>
              <b>Increased Daily Study Time:</b> {suggestions.adjustedDailyTime}{" "}
              hours/day
            </li>
            <li>
              <b>Extended Deadline:</b> {suggestions.extendedDeadline}
            </li>
          </ul>

          <p>Would you like to proceed with one of these options?</p>
          <div className={styles.buttonGroup}>
            <button
              onClick={() => {
                setFormData({
                  ...formData,
                  dailyTime: suggestions.adjustedDailyTime,
                });
                setStep(4);
              }}
            >
              Accept Increased Study Time
            </button>

            <button
              onClick={() => {
                setFormData({
                  ...formData,
                  deadline: suggestions.extendedDeadline,
                });
                setStep(4);
              }}
            >
              Accept Extended Deadline
            </button>

            <button onClick={() => setStep(1)}>Go Back & Modify</button>
          </div>
        </div>
      )}
      {/* Step 4: Study Plan Confirmation */}
      {step === 4 && aiResponse && !loading && (
        <div>
          <h2>Study Plan</h2>
          <ul>
            {aiResponse.studyPlan.map((session, index) => (
              <li key={index}>
                {session.date}: {session.topic}
              </li>
            ))}
          </ul>
          <button>Save to Calendar</button>
        </div>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
