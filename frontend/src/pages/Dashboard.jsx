import { useEffect, useState } from "react";
import { getDashboardStats, getRealDashboardStats } from "../api/api";
import StatCard from "../components/StatCard";
import DemandChart from "../components/DemandChart";

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: "--",
    low_stock: "--",
    expiring: "--",
    revenue: "--",
  });

  useEffect(() => {
    // 🔹 TRY REAL BACKEND DATA FIRST
    getRealDashboardStats()
      .then((res) => {
        setStats(res.data);
      })
      .catch(() => {
        // 🔹 FALLBACK (keeps old behavior safe)
        getDashboardStats().then((res) => setStats(res.data));
      });
  }, []);

  /* ================= MOCK CHART DATA (UNCHANGED) ================= */
  const demandData = [
    { date: "Mon", value: 120 },
    { date: "Tue", value: 150 },
    { date: "Wed", value: 180 },
    { date: "Thu", value: 160 },
    { date: "Fri", value: 200 },
    { date: "Sat", value: 170 },
    { date: "Sun", value: 190 },
  ];

  const expiryData = [
    { date: "Jan", value: 30 },
    { date: "Feb", value: 25 },
    { date: "Mar", value: 40 },
    { date: "Apr", value: 20 },
  ];

  return (
    <div>
      {/* Header */}
      <h1 style={{ fontWeight: 700, fontSize: "34px", marginBottom: "8px" }}>
        Statistics
      </h1>
      <p style={{ color: "#b3b3c6", fontSize: "16px", marginBottom: "32px" }}>
        Smart Pharmacy Inventory Overview
      </p>

      {/* Stat Cards */}
      <div className="grid">
        <StatCard
          title="Total Medicines"
          value={stats.total}
          subtitle="All active SKUs"
        />
        <StatCard
          title="Low Stock"
          value={stats.low_stock}
          subtitle="Needs attention"
        />
        <StatCard
          title="Expiring Soon"
          value={stats.expiring}
          subtitle="Within 30 days"
        />
        <StatCard
          title="Revenue"
          value={stats.revenue}
          prefix="₹"
          subtitle="Monthly estimate"
        />
      </div>

      {/* Charts */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "28px",
          marginTop: "40px",
        }}
      >
        <DemandChart
          title="Medicine Demand Trend"
          data={demandData}
        />
        <DemandChart
          title="Expiry Risk Overview"
          data={expiryData}
        />
      </div>
    </div>
  );
}
