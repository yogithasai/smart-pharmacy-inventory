import { useEffect, useMemo, useRef, useState } from "react";
import { getReorderSuggestions } from "../api/api";
import ReorderInsights from "../components/ReorderInsights";
import { toast } from "react-toastify";

export default function Reorder() {
  const [rawData, setRawData] = useState([]);
  const [cart, setCart] = useState([]);

  // 🔔 prevent multiple alerts
  const alertShownRef = useRef(false);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    getReorderSuggestions()
      .then((res) => {
        setRawData(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => setRawData([]));
  }, []);

  /* ================= PREPARE TABLE DATA ================= */
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
        unit_price: 12, // demo price
      };
    });
  }, [rawData]);

  /* ================= 🔔 PAGE LOAD ALERT ================= */
  useEffect(() => {
    if (alertShownRef.current || data.length === 0) return;

    const critical = data.filter(d => d.priority === "Critical");
    const medium = data.filter(d => d.priority === "Medium");

    if (critical.length > 0) {
      toast.error(
        `🚨 ${critical.length} medicines are critically low. Reorder immediately.`,
        { autoClose: 6000 }
      );
    } else if (medium.length > 0) {
      toast.warn(
        "⚠️ Some medicines need reordering soon.",
        { autoClose: 5000 }
      );
    } else {
      toast.success(
        "✅ Stock levels are healthy.",
        { autoClose: 4000 }
      );
    }

    alertShownRef.current = true;
  }, [data]);

  /* ================= ADD TO CART ================= */
  const addToCart = (item) => {
    const qty = item.suggested_order > 0 ? item.suggested_order : 10;

    setCart((prev) => {
      const exists = prev.find((p) => p.medicine === item.medicine);

      if (exists) {
        return prev.map((p) =>
          p.medicine === item.medicine
            ? { ...p, qty: p.qty + qty }
            : p
        );
      }

      return [
        ...prev,
        {
          medicine: item.medicine,
          qty,
          price: item.unit_price,
          priority: item.priority,
        },
      ];
    });

    toast.info(
      `🛒 ${item.medicine} added to reorder cart`,
      { autoClose: 3000 }
    );
  };

  /* ================= METRICS ================= */
  const criticalCount = data.filter(
    (d) => d.priority === "Critical"
  ).length;

  const estimatedCost = data.reduce(
    (sum, d) => sum + d.suggested_order * d.unit_price,
    0
  );

  /* ================= PLACE ORDER ================= */
  const placeOrder = () => {
    toast.success(
      `✅ Order placed successfully for ${cart.length} medicines`,
      { autoClose: 5000 }
    );
    setCart([]);
  };

  /* ================= UI ================= */
  return (
    <div>
      <h1 style={{ fontSize: "34px", fontWeight: 700 }}>
        Reorder Management
      </h1>
      <p style={{ color: "#b3b3c6", marginBottom: "32px" }}>
        AI-recommended reorder actions to prevent stockouts
      </p>

      {/* KPI CARDS */}
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
          <p>₹{estimatedCost}</p>
        </div>
      </div>

      {/* TABLE */}
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
                  <button
                    className="cart-btn"
                    onClick={() => addToCart(item)}
                  >
                    + Add
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CART + INSIGHTS */}
      {cart.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
            marginTop: "40px",
          }}
        >
          <div className="cart-summary">
            <h3>🛒 Reorder Cart</h3>

            {cart.map((c, i) => (
              <div key={i} className="cart-row">
                <span>{c.medicine}</span>
                <span>Qty: {c.qty}</span>
              </div>
            ))}

            <div className="cart-total">
              <strong>Total Items:</strong> {cart.length}
            </div>

            <div className="cart-total">
              <strong>Total Cost:</strong>{" "}
              ₹{cart.reduce((s, c) => s + c.qty * c.price, 0)}
            </div>

            <button
              className="checkout-btn"
              onClick={placeOrder}
            >
              Proceed to Order
            </button>
          </div>

          <ReorderInsights cart={cart} />
        </div>
      )}
    </div>
  );
}
