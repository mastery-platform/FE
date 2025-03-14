"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import styles from "@/styles/components/Navbar.module.scss";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <Link href="/" className={styles.logo}>
          MyApp
        </Link>

        <div className={styles.navLinks}>
          {user ? (
            <>
              <Link href="/dashboard" className={styles.navLink}>
                Dashboard
              </Link>
              <Link href="/skill-planner" className={styles.navLink}>
                Skill Planner
              </Link>
              <Link href="/profile" className={styles.navLink}>
                Profile
              </Link>
              <button onClick={logout} className={styles.logoutButton}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className={styles.navLink}>
                Login
              </Link>
              <Link href="/register" className={styles.navLink}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
