import { useEffect, useMemo, useState } from "react";
import { getReorderSuggestions } from "../api/api";

export default function Reorder() {
  const [rawData, setRawData] = useState([]);

  useEffect(() => {
    getReorderSuggestions()
      .then((res) => {
        setRawData(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => setRawData([]));
  }, []);

  const data = useMemo(() => {
    return rawData.map((item) => {
      const reorderQty = Number(item.Reorder_Qty || 0);

      const priority =
        reorderQty > 50 ? "Critical" :
        reorderQty > 0 ? "Medium" : "Low";

      return {
        medicine: item.Drug_Name,
        current_stock: item.Current_Stock,
        reorder_level: item.Current_Stock + reorderQty,
        suggested_order: reorderQty,
        priority,
        cost: reorderQty * 12,
      };
    });
  }, [rawData]);

  const criticalCount = data.filter(
    (d) => d.priority === "Critical"
  ).length;

  const totalCost = data.reduce(
    (sum, d) => sum + d.cost,
    0
  );

  return (
    <div>
      <h1 style={{ fontSize: "34px", fontWeight: 700 }}>
        Reorder Management
      </h1>
      <p style={{ color: "#b3b3c6", marginBottom: "32px" }}>
        AI-recommended reorder actions to prevent stockouts
      </p>

      <div className="grid">
        <div className="card">
          <h3>Items to Reorder</h3>
          <p>{data.length}</p>
        </div>

        <div className="card">
          <h3>Critical Items</h3>
          <p style={{ color: "#f87171" }}>{criticalCount}</p>
        </div>

        <div className="card">
          <h3>Estimated Cost</h3>
          <p>₹{totalCost}</p>
        </div>
      </div>

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
                <td>{item.priority}</td>
                <td>
                  <button>Order Now</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
