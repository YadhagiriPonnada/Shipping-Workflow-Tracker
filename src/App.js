import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import HomeTab from './HomeTab';
import Navigation from './Navigation';
import Board from './Board';
import Dashboard from './Dashboard';
import UserManagement from './UserManagement';
import Activity from './Activity';
import './App.css';

function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  const [view, setView] = useState("board");

  // Hardcoded user data - change role to "admin" or "manager" as needed
  const user = {
    email: "test@example.com",
    displayName: "Test User",
    role: "admin",  // or "manager"
    photoURL: "",
  };

  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <div className="App">
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16 }}>
        <nav style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setView("board")} disabled={view === "board"}>Board</button>
          <button onClick={() => setView("dashboard")} disabled={view === "dashboard"}>Dashboard</button>
          {user.role === "admin" && (
            <>
              <button onClick={() => setView("users")} disabled={view === "users"}>User Management</button>
              <button onClick={() => setView("activity")} disabled={view === "activity"}>Activity</button>
            </>
          )}
        </nav>
        <button onClick={toggleTheme}>
          {theme === "dark" ? "🌙 Dark Mode" : "☀️ Light Mode"}
        </button>
      </header>
      {view === "board" ? (
        <Board user={user} />
      ) : view === "dashboard" ? (
        <Dashboard user={user} />
      ) : view === "users" ? (
        <UserManagement user={user} />
      ) : (
        <Activity user={user} />
      )}
    </div>
  );
}

export default App;
