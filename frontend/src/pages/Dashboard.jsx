import { useEffect, useState } from "react";
import { getDashboardStats } from "../api/api";
import StatCard from "../components/StatCard";

export default function Dashboard() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    getDashboardStats().then((res) => setStats(res.data));
  }, []);

  return (
    <div>
      <h1 style={{ fontWeight: 700, fontSize: "28px" }}>
          Statistics
      </h1>
      <p style={{ color: "#b3b3c6", marginBottom: "24px" }}>
           Smart Pharmacy Inventory Overview
      </p>
      <div className="grid">
        <StatCard title="Total Medicines" value={stats.total} />
        <StatCard title="Low Stock" value={stats.low_stock} />
        <StatCard title="Expiring Soon" value={stats.expiring} />
        <StatCard title="Revenue" value={`₹${stats.revenue}`} />
      </div>
    </div>
  );
}
