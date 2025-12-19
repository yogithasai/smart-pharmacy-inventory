import { useEffect, useMemo, useState } from "react";
import { getExpiryAlerts } from "../api/api";
import Table from "../components/Table";
import ExpiryCharts from "../components/ExpiryCharts";

/* ================= SAMPLE FALLBACK DATA ================= */
const SAMPLE_EXPIRY_DATA = [
  { medicine: "Paracetamol", expiry_days: 5, stock: 120, unit_price: 2 },
  { medicine: "Amoxicillin", expiry_days: 18, stock: 80, unit_price: 4 },
];

export default function Expiry() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  /* ========== LOAD REAL DATA ========== */
  useEffect(() => {
    getExpiryAlerts()
      .then((res) => {
        if (!Array.isArray(res.data)) {
          setData(SAMPLE_EXPIRY_DATA);
          return;
        }

        const mapped = res.data.map((item) => ({
          medicine: item.Drug_Name,
          expiry_days: item.Days_To_Expiry,
          stock: item.Qty_Received,
          unit_price:
            item.Qty_Received > 0
              ? item.Potential_Loss / item.Qty_Received
              : 0,
        }));

        setData(mapped);
      })
      .catch(() => {
        setData(SAMPLE_EXPIRY_DATA);
      });
  }, []);

  /* ========== ENRICH DATA ========== */
  const enrichedData = useMemo(() => {
    return data
      .filter((d) =>
        d.medicine.toLowerCase().includes(search.toLowerCase())
      )
      .map((d) => {
        let risk = "Low";
        if (d.expiry_days <= 7) risk = "High";
        else if (d.expiry_days <= 30) risk = "Medium";

        return {
          ...d,
          risk,
          stock_value: d.stock * d.unit_price,
          action:
            risk === "High"
              ? "Remove"
              : risk === "Medium"
              ? "Discount"
              : "Monitor",
        };
      });
  }, [data, search]);

  /* ========== METRICS ========== */
  const expiredCount = enrichedData.filter(
    (d) => d.expiry_days <= 0
  ).length;

  const expiringSoon = enrichedData.filter(
    (d) => d.expiry_days <= 30
  ).length;

  const atRiskValue = enrichedData
    .filter((d) => d.expiry_days <= 30)
    .reduce((s, d) => s + d.stock_value, 0);

  return (
    <div className="px-14 py-20 space-y-24">

      {/* HERO */}
      <section className="section-card">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h1 className="text-5xl font-bold">
              Expiry Risk Overview
            </h1>
            <p className="text-lg text-gray-300 max-w-lg">
              Monitor medicine expiry, minimize wastage, and take
              timely corrective actions.
            </p>

            <input
              className="px-6 py-4 w-80 rounded-xl border border-white/20 bg-transparent"
              placeholder="Search medicine..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="kpi-grid">
            <StatCard label="Expired" value={expiredCount} danger />
            <StatCard label="Expiring Soon" value={expiringSoon} />
            <StatCard
              label="At-Risk Stock Value"
              value={`₹${Math.round(atRiskValue)}`}
            />
          </div>
        </div>
      </section>

      {/* BUCKETS */}
      <section className="kpi-grid">
        <ExpiryBucket
          title="≤ 7 Days"
          color="red"
          data={enrichedData.filter(d => d.expiry_days <= 7)}
        />
        <ExpiryBucket
          title="8–30 Days"
          color="orange"
          data={enrichedData.filter(d => d.expiry_days > 7 && d.expiry_days <= 30)}
        />
        <ExpiryBucket
          title="> 30 Days"
          color="green"
          data={enrichedData.filter(d => d.expiry_days > 30)}
        />
      </section>

      {/* CHART */}
      <section className="section-card">
        <ExpiryCharts data={enrichedData} />
      </section>

      {/* TABLE */}
      <section className="section-card">
        <h2 className="text-2xl font-semibold mb-6">
          Expiry Action Table
        </h2>
        <Table
          columns={[
            "medicine",
            "expiry_days",
            "stock",
            "stock_value",
            "risk",
            "action",
          ]}
          data={enrichedData}
        />
      </section>

      {/* INSIGHT */}
      <section className="section-card">
        <p className="text-base text-gray-300 max-w-3xl">
          ⚠️ Medicines expiring within 30 days should be prioritized
          for discounting, redistribution, or removal to reduce
          financial loss and ensure regulatory compliance.
        </p>
      </section>

    </div>
  );
}

/* ================= SUB COMPONENTS ================= */

function StatCard({ label, value, danger }) {
  return (
    <div
      className={`card ${danger ? "border border-red-500/30" : ""}`}
    >
      <p className="text-sm text-gray-400 mb-2">{label}</p>
      <h2 className="text-3xl font-semibold">{value}</h2>
    </div>
  );
}

function ExpiryBucket({ title, data, color }) {
  const colorMap = {
    red: "border-red-500/30",
    orange: "border-orange-500/30",
    green: "border-green-500/30",
  };

  return (
    <div className={`bucket-card ${colorMap[color]}`}>
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <p className="text-3xl font-bold mb-2">{data.length}</p>
      <p className="text-sm text-gray-400">
        medicines in this category
      </p>
    </div>
  );
}
