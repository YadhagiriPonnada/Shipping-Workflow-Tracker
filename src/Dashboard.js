import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { db, ref, onValue } from "./firebase";

const COLORS = ["#1976d2", "#43a047", "#ffa000", "#d32f2f", "#7b1fa2", "#0288d1", "#c2185b"];

function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const dbRef = ref(db, "workflowData");
    const unsubscribe = onValue(dbRef, (snapshot) => {
      const value = snapshot.val();
      setData(value);
    });
    return () => unsubscribe();
  }, []);

  if (!data) return <div style={{ padding: 32 }}>Loading dashboard...</div>;

  // KPIs
  const totalShipments = Object.keys(data.cards).length;
  const statusCounts = data.columnOrder.map((colId) => ({
    name: data.columns[colId].title,
    value: data.columns[colId].cardIds.length,
  }));

  return (
    <div style={{ padding: 32 }}>
      <h2>Dashboard</h2>
      <div style={{ display: "flex", gap: 32, flexWrap: "wrap", marginBottom: 32 }}>
        <div style={{ minWidth: 180, background: "var(--card-bg)", borderRadius: 8, padding: 16, boxShadow: "0 2px 6px rgba(0,0,0,0.03)" }}>
          <div style={{ fontSize: 32, fontWeight: "bold" }}>{totalShipments}</div>
          <div>Total Shipments</div>
        </div>
        {statusCounts.map((s, i) => (
          <div key={s.name} style={{ minWidth: 140, background: "var(--card-bg)", borderRadius: 8, padding: 16, boxShadow: "0 2px 6px rgba(0,0,0,0.03)" }}>
            <div style={{ fontSize: 24, fontWeight: "bold" }}>{s.value}</div>
            <div>{s.name}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
        <div style={{ minWidth: 320, height: 320, background: "var(--card-bg)", borderRadius: 8, padding: 16 }}>
          <h4>Shipments per Stage</h4>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={statusCounts} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
              <XAxis dataKey="name" stroke="var(--text)" />
              <YAxis stroke="var(--text)" allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#1976d2">
                {statusCounts.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ minWidth: 320, height: 320, background: "var(--card-bg)", borderRadius: 8, padding: 16 }}>
          <h4>Stage Distribution</h4>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={statusCounts} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {statusCounts.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 