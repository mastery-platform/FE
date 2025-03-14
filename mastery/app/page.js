"use client"; // This makes the component a client component

import ProtectedRoute from "./ProtectedRoute";
import { useAuth } from "../context/AuthContext";

export default function HomePage() {
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold">Welcome, {user?.name}!</h1>
        <button
          onClick={logout}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </ProtectedRoute>
  );
}
