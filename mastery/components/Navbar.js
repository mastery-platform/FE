"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/components/Navbar.module.scss";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className={styles.navbar}>
      <div className={styles.navLinks}>
        <Link href="/" className={styles.link}>
          Home
        </Link>
        {user && user.role === "admin" && (
          <Link href="/users" className={styles.link}>
            User Management
          </Link>
        )}
        {!user ? (
          <>
            <Link href="/login" className={styles.link}>
              Login
            </Link>
            <Link href="/register" className={styles.link}>
              Register
            </Link>
          </>
        ) : (
          <button onClick={logout} className={styles.button}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
