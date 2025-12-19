export default function BestSelling() {
  const items = [
    { name: "Paracetamol 500mg", stock: 120 },
    { name: "Insulin Injection", stock: 80 },
    { name: "Amoxicillin", stock: 60 },
  ];

  return (
    <div className="card">
      <h3>Best Selling Medicines</h3>

      {items.map((item, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "12px 0",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <span>{item.name}</span>
          <span style={{ color: "#b3b3c6" }}>
            {item.stock} in stock
          </span>
        </div>
      ))}
    </div>
  );
}
