"use client";

import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

export default function UsersPage() {
  const { user, users, fetchUsers, updateUser, deleteUser, loading } =
    useAuth();

  useEffect(() => {
    if (user?.role === "admin") {
      fetchUsers();
    }
  }, [user]);

  if (!user) {
    return <p>Loading...</p>;
  }

  if (user.role !== "admin") {
    return (
      <div>
        <h1>Your Profile</h1>
        <p>Name: {user.name}</p>
        <p>Email: {user.email}</p>
      </div>
    );
  }

  return (
    <div>
      <h1>User Management</h1>
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>
                  <button onClick={() => deleteUser(u._id)}>Delete</button>
                  <button onClick={() => updateUser(u._id, { role: "admin" })}>
                    Make Admin
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
