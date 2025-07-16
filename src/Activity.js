import React, { useEffect, useState } from "react";

function Activity() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const savedLogs = localStorage.getItem("activity-logs");
    const mockLogs = savedLogs ? JSON.parse(savedLogs) : [
      { 
        timestamp: Date.now(), 
        user: { displayName: "Alice", email: "alice@example.com" },
        action: "login",
        details: "Initial login"
      },
      { 
        timestamp: Date.now() - 3600000, 
        user: { displayName: "Bob", email: "bob@example.com" },
        action: "task moved",
        details: { 
          from: "backlog",
          to: "inProgress",
          taskId: "task123"
        }
      }
    ];
    setLogs(mockLogs);
  }, []);

  useEffect(() => {
    localStorage.setItem("activity-logs", JSON.stringify(logs));
  }, [logs]);

  return (
    <div style={{ padding: 32 }}>
      <h2>Activity Log</h2>
      <table style={{ width: "100%", background: "var(--card-bg)", borderRadius: 8, boxShadow: "0 2px 6px rgba(0,0,0,0.03)", marginTop: 16 }}>
        <thead>
          <tr style={{ background: "var(--header-bg)" }}>
            <th style={{ padding: 8 }}>Time</th>
            <th>User</th>
            <th>Action</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, i) => (
            <tr key={i}>
              <td style={{ padding: 8 }}>{new Date(log.timestamp).toLocaleString()}</td>
              <td>{log.user ? (log.user.displayName || log.user.email) : "-"}</td>
              <td>{log.action}</td>
              <td>
                <pre style={{ margin: 0, background: "none", fontSize: 12 }}>{JSON.stringify(log.details, null, 2)}</pre>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Activity; 