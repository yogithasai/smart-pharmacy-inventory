export default function StockSummary() {
  return (
    <div className="card">
      <h3>Stock</h3>
      <p style={{ fontSize: "28px", fontWeight: 700 }}>980</p>
      <span style={{ color: "#b3b3c6" }}>Quantity at hand</span>

      <button style={{ marginTop: "16px" }}>Adjust Stock</button>

      <hr style={{ margin: "20px 0", opacity: 0.2 }} />

      <p>Warehouse • Main — 500</p>
      <p>Warehouse • East — 220</p>
      <p style={{ color: "#f87171" }}>
        Warehouse • South — 35 (low)
      </p>
    </div>
  );
}
