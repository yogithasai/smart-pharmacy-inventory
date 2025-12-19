export default function StockLevel() {
  return (
    <div className="card">
      <h3>Stock Level</h3>
      <p style={{ fontSize: "26px", fontWeight: 700 }}>8,572</p>
      <span style={{ color: "#b3b3c6" }}>Active products</span>

      <div style={{ marginTop: "16px" }}>
        <p>High stock — 1,200</p>
        <p>Near low — 900</p>
        <p>Low stock — 350</p>
        <p>Out of stock — 120</p>
      </div>
    </div>
  );
}
