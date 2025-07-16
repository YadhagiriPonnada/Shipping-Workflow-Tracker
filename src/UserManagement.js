import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

function UserManagement({ user }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const savedUsers = localStorage.getItem("mock-users");
    const mockUsers = savedUsers ? JSON.parse(savedUsers) : [
      { 
        id: 1, 
        name: "Alice", 
        email: "alice@example.com", 
        role: "admin"
      },
      { 
        id: 2, 
        name: "Bob", 
        email: "bob@example.com", 
        role: "manager"
      }
    ];
    setUsers(mockUsers);
  }, []);

  useEffect(() => {
    localStorage.setItem("mock-users", JSON.stringify(users));
  }, [users]);

  const handleRoleChange = (id, newRole) => {
    const updatedUsers = users.map(user =>
      user.id === id ? { ...user, role: newRole } : user
    );
    setUsers(updatedUsers);
    toast.success("Role updated");
  };

  const handleRemove = (id) => {
    if (window.confirm("Are you sure you want to remove this user?")) {
      const updatedUsers = users.filter(user => user.id !== id);
      setUsers(updatedUsers);
      toast.success("User removed");
    }
  };

  return (
    <div style={{ padding: 32 }}>
      <h2>User Management</h2>
      <table
        style={{
          width: "100%",
          background: "var(--card-bg)",
          borderRadius: 8,
          boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
          marginTop: 16,
        }}
      >
        <thead>
          <tr style={{ background: "var(--header-bg)" }}>
            <th style={{ padding: 8 }}>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr
              key={u.uid}
              style={{
                background: u.uid === user.uid ? "#e3f2fd" : undefined,
              }}
            >
              <td style={{ padding: 8 }}>
                {u.displayName || u.email}{" "}
                {u.uid === user.uid && <b>(You)</b>}
              </td>
              <td>{u.email}</td>
              <td>
                <select
                  value={u.role}
                  onChange={(e) => handleRoleChange(u.uid, e.target.value)}
                  disabled={u.uid === user.uid}
                >
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td>
                {u.uid !== user.uid && (
                  <button
                    onClick={() => handleRemove(u.uid)}
                    style={{ background: "#d32f2f", color: "#fff" }}
                  >
                    Remove
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserManagement;
