"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function PublicRoute({ children }) {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            router.push("/dashboard"); // Redirect logged-in users to dashboard
        }
    }, [user, router]);

    return !user ? children : null;
}
