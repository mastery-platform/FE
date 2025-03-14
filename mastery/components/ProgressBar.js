"use client";

import { useEffect, useState } from "react";
import styles from "@/styles/components/progress-bar.module.scss";

export default function ProgressBar({ isLoading, onComplete }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isLoading) {
      let fakeProgress = 0;
      const interval = setInterval(() => {
        fakeProgress += 10;
        setProgress(fakeProgress);
        if (fakeProgress >= 90) clearInterval(interval); // Stop at 90%, API finishes the rest
      }, 300);

      return () => clearInterval(interval);
    } else {
      setProgress(100);
      setTimeout(() => {
        onComplete && onComplete(); // Call optional onComplete function
        setProgress(0);
      }, 500);
    }
  }, [isLoading, onComplete]);

  return (
    <div className={styles.loaderContainer}>
      <div className={styles.progressBar} style={{ width: `${progress}%` }} />
      <p className={styles.progressText}>{progress}%</p>{" "}
      {/* ✅ Now using local class */}
    </div>
  );
}
