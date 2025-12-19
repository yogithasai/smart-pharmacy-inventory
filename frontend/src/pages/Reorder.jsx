import { useEffect, useState } from "react";
import { getReorderSuggestions } from "../api/api";

export default function Reorder() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getReorderSuggestions()
      .then((res) => setData(res.data))
      .catch(() => {
        // Fallback demo data (IMPORTANT for hackathon)
        setData([
          {
            medicine: "Paracetamol 500mg",
            current_stock: 20,
            reorder_level: 50,
            suggested_order: 100,
            priority: "Critical",
            cost: 1200,
          },
          {
            medicine: "Insulin Injection",
            current_stock: 45,
            reorder_level: 40,
            suggested_order: 60,
            priority: "Medium",
            cost: 5400,
          },
          {
            medicine: "Amoxicillin",
            current_stock: 30,
            reorder_level: 35,
            suggested_order: 80,
            priority: "Critical",
            cost: 3200,
          },
        ]);
      });
  }, []);

  const criticalCount = data.filter(
    (d) => d.priority === "Critical"
  ).length;

  const totalCost = data.reduce(
    (sum, d) => sum + (d.cost || 0),
    0
  );

  return (
    <div>
      {/* Header */}
      <h1 style={{ fontSize: "34px", fontWeight: 700 }}>
        Reorder Management
      </h1>
      <p style={{ color: "#b3b3c6", marginBottom: "32px" }}>
        AI-recommended reorder actions to prevent stockouts
      </p>

      {/* Summary Cards */}
      <div className="grid">
        <div className="card">
          <h3>Items to Reorder</h3>
          <p>{data.length}</p>
        </div>

        <div className="card">
          <h3>Critical Items</h3>
          <p style={{ color: "#f87171" }}>
            {criticalCount}
          </p>
        </div>

        <div className="card">
          <h3>Estimated Cost</h3>
          <p>₹{totalCost}</p>
        </div>
      </div>

      {/* Table */}
      <div style={{ marginTop: "40px" }}>
        <table>
          <thead>
            <tr>
              <th>Medicine</th>
              <th>Current Stock</th>
              <th>Reorder Level</th>
              <th>Suggested Qty</th>
              <th>Priority</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.medicine}</td>
                <td>{item.current_stock}</td>
                <td>{item.reorder_level}</td>
                <td>{item.suggested_order}</td>
                <td>
                  <span
                    style={{
                      padding: "6px 10px",
                      borderRadius: "10px",
                      fontSize: "12px",
                      background:
                        item.priority === "Critical"
                          ? "rgba(248,113,113,0.15)"
                          : "rgba(251,191,36,0.15)",
                      color:
                        item.priority === "Critical"
                          ? "#f87171"
                          : "#fbbf24",
                    }}
                  >
                    {item.priority}
                  </span>
                </td>
                <td>
                  <button
                    style={{
                      padding: "8px 14px",
                      fontSize: "13px",
                    }}
                  >
                    Order Now
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
