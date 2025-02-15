"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login"); // Redirect to login if not authenticated
        }
    }, [user, loading, router]);

    if (loading) {
        return <div>Loading...</div>; // Show loading state while checking auth
    }

    return user ? children : null;
}
