export default function ReorderInsights({ cart }) {
  const totalCost = cart.reduce(
    (sum, item) => sum + item.qty * item.price,
    0
  );

  const priorityCount = {
    Critical: cart.filter(i => i.priority === "Critical").length,
    Medium: cart.filter(i => i.priority === "Medium").length,
    Low: cart.filter(i => i.priority === "Low").length,
  };

  return (
    <div className="card">
      <h3 style={{ marginBottom: "16px" }}>📊 Reorder Insights</h3>

      {/* COST BREAKDOWN */}
      <h4 style={{ marginBottom: "10px" }}>💰 Cost Breakdown</h4>

      {cart.length === 0 && (
        <p style={{ color: "#b3b3c6" }}>
          Add medicines to view insights
        </p>
      )}

      {cart.map((item, i) => {
        const itemCost = item.qty * item.price;
        const percent =
          totalCost === 0 ? 0 : (itemCost / totalCost) * 100;

        return (
          <div key={i} style={{ marginBottom: "14px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "14px",
                marginBottom: "6px",
              }}
            >
              <span>{item.medicine}</span>
              <span>₹{itemCost}</span>
            </div>

            <div
              style={{
                height: "6px",
                borderRadius: "6px",
                background: "rgba(255,255,255,0.1)",
              }}
            >
              <div
                style={{
                  width: `${percent}%`,
                  height: "100%",
                  borderRadius: "6px",
                  background:
                    "linear-gradient(90deg,#8b5cf6,#6d28d9)",
                }}
              />
            </div>
          </div>
        );
      })}

      {/* PRIORITY SUMMARY */}
      <div style={{ marginTop: "24px" }}>
        <h4>⚠️ Priority Mix</h4>
        <ul style={{ fontSize: "14px", color: "#b3b3c6" }}>
          <li>Critical: {priorityCount.Critical}</li>
          <li>Medium: {priorityCount.Medium}</li>
          <li>Low: {priorityCount.Low}</li>
        </ul>
      </div>

      {/* IMPACT SUMMARY */}
      <div style={{ marginTop: "24px" }}>
        <h4>📈 Impact Summary</h4>
        <ul style={{ fontSize: "14px", color: "#b3b3c6" }}>
          <li>• Prevents potential stockouts</li>
          <li>• Optimizes reorder spending</li>
          <li>• Improves supplier planning</li>
        </ul>
      </div>
    </div>
  );
}
