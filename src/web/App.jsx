import React, { useEffect, useMemo, useState } from "react";

export default function App() {
  const [tickets, setTickets] = useState([]);
  const [category, setCategory] = useState("all");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:4000/api/tickets")
      .then((r) => r.json())
      .then((d) => setTickets(d))
      .catch(() => setError("Failed to load tickets. Is API running?"));
  }, []);

  const filtered = useMemo(() => {
    if (category === "all") return tickets;
    return tickets.filter((t) => t.category === category);
  }, [tickets, category]);

  return (
    <main style={{ fontFamily: "sans-serif", padding: 16 }}>
      <h2>Support Ticket Text Insights</h2>
      <p>Simple React view over pandas-processed text data.</p>

      <label>
        Category:{" "}
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="all">all</option>
          <option value="refund">refund</option>
          <option value="auth">auth</option>
          <option value="other">other</option>
        </select>
      </label>

      {error && <p style={{ color: "crimson" }}>{error}</p>}

      <table border="1" cellPadding="8" style={{ marginTop: 12, borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Channel</th>
            <th>Category</th>
            <th>Order ID</th>
            <th>Text (clean)</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((t) => (
            <tr key={t.ticket_id}>
              <td>{t.ticket_id}</td>
              <td>{t.channel}</td>
              <td>{t.category}</td>
              <td>{t.order_id || "-"}</td>
              <td>{t.text_clean}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}