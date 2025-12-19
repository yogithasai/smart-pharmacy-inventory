import { useEffect, useMemo, useState } from "react";
import Table from "../components/Table";
import ExpiryCharts from "../components/ExpiryCharts";


/* ================= SAMPLE DATA ================= */
const SAMPLE_EXPIRY_DATA = [
  { medicine: "Paracetamol", expiry_days: 5, stock: 120, unit_price: 2 },
  { medicine: "Amoxicillin", expiry_days: 18, stock: 80, unit_price: 4 },
  { medicine: "Ibuprofen", expiry_days: 45, stock: 60, unit_price: 3 },
  { medicine: "Cetirizine", expiry_days: 2, stock: 30, unit_price: 1.5 },
  { medicine: "Insulin", expiry_days: 10, stock: 50, unit_price: 12 },
  { medicine: "Metformin", expiry_days: 90, stock: 110, unit_price: 5 },
];

export default function Expiry() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  /* ========== LOAD DATA ========== */
  useEffect(() => {
    // replace later with API
    setData(SAMPLE_EXPIRY_DATA);
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

  /* ================= RENDER ================= */
  return (
    <div className="px-14 py-20 space-y-36">

      {/* ================= HERO ================= */}
      <section className="rounded-3xl px-16 py-20 bg-gradient-to-br from-red-600/20 to-orange-500/10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* LEFT */}
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

          {/* RIGHT STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <StatCard label="Expired" value={expiredCount} danger />
            <StatCard label="Expiring Soon" value={expiringSoon} />
            <StatCard
              label="At-Risk Stock Value"
              value={`₹${atRiskValue}`}
            />
          </div>
        </div>
      </section>

      {/* ================= EXPIRY DISTRIBUTION ================= */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <ExpiryBucket title="≤ 7 Days" color="red" data={enrichedData.filter(d => d.expiry_days <= 7)} />
        <ExpiryBucket title="8–30 Days" color="orange" data={enrichedData.filter(d => d.expiry_days > 7 && d.expiry_days <= 30)} />
        <ExpiryBucket title="> 30 Days" color="green" data={enrichedData.filter(d => d.expiry_days > 30)} />
      </section>
      {/* ================= VISUAL ANALYTICS ================= */}
      <ExpiryCharts data={enrichedData} />


      {/* ================= TABLE ================= */}
      <section className="space-y-12">
        <h2 className="text-2xl font-semibold">
          Expiry Action Table
        </h2>

        <div className="bg-white/5 rounded-3xl p-10">
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
        </div>
      </section>

      {/* ================= INSIGHT ================= */}
      <section className="bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-2xl px-10 py-8">
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
      className={`rounded-2xl p-6 bg-white/5 ${
        danger ? "border border-red-500/30" : ""
      }`}
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
    <div className={`rounded-3xl p-8 bg-white/5 border ${colorMap[color]}`}>
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <p className="text-3xl font-bold mb-2">{data.length}</p>
      <p className="text-sm text-gray-400">
        medicines in this category
      </p>
    </div>
  );
}
