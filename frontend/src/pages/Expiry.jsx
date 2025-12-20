import { useEffect, useMemo, useRef, useState } from "react";
import { getExpiryAlerts } from "../api/api";
import { toast } from "react-toastify";
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

  // 🔔 Prevent multiple alerts
  const alertShownRef = useRef(false);

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

  const highRiskCount = enrichedData.filter(
    (d) => d.expiry_days <= 7
  ).length;

  const mediumRiskCount = enrichedData.filter(
    (d) => d.expiry_days > 7 && d.expiry_days <= 30
  ).length;

  const atRiskValue = enrichedData
    .filter((d) => d.expiry_days <= 30)
    .reduce((s, d) => s + d.stock_value, 0);

  /* ================= 🔔 TOAST NOTIFICATIONS ================= */
  useEffect(() => {
    if (alertShownRef.current || enrichedData.length === 0) return;

    if (highRiskCount > 0) {
      toast.error(
        `🚨 ${highRiskCount} medicine(s) expiring within 7 days. Immediate action required.`,
        { autoClose: 6000 }
      );
    }

    if (mediumRiskCount > 0) {
      toast.warn(
        `⚠️ ${mediumRiskCount} medicine(s) expiring within 30 days.`,
        { autoClose: 5000 }
      );
    }

    if (highRiskCount === 0 && mediumRiskCount === 0) {
      toast.success(
        "✅ No critical expiry risks detected.",
        { autoClose: 4000 }
      );
    }

    alertShownRef.current = true;
  }, [enrichedData, highRiskCount, mediumRiskCount]);

  return (
    <div className="px-14 py-20 space-y-24">

      {/* ================= HERO + KPI ================= */}
      <section className="section-card">
        <div className="flex flex-col lg:flex-row justify-between gap-16">

          {/* LEFT */}
          <div className="space-y-6 max-w-xl">
            <h1 className="text-5xl font-bold">
              Expiry Risk Overview
            </h1>
            <p className="text-lg text-gray-300">
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

          {/* RIGHT KPI – HORIZONTAL */}
          <div className="kpi-row">
            <StatCard label="Expired" value={expiredCount} danger />
            <StatCard label="Expiring Soon" value={highRiskCount} />
            <StatCard
              label="At-Risk Stock Value"
              value={`₹${Math.round(atRiskValue)}`}
            />
          </div>

        </div>
      </section>

      {/* ================= EXPIRY BUCKETS ================= */}
      <section className="kpi-grid">
        <ExpiryBucket
          title="≤ 7 Days"
          color="red"
          data={enrichedData.filter(d => d.expiry_days <= 7)}
        />
        <ExpiryBucket
          title="8–30 Days"
          color="orange"
          data={enrichedData.filter(
            d => d.expiry_days > 7 && d.expiry_days <= 30
          )}
        />
        <ExpiryBucket
          title="> 30 Days"
          color="green"
          data={enrichedData.filter(d => d.expiry_days > 30)}
        />
      </section>

      {/* ================= TIMELINE ================= */}
      <section className="section-card">
        <ExpiryTimeline data={enrichedData} />
      </section>

      {/* ================= CHART ================= */}
      <section className="section-card">
        <ExpiryCharts data={enrichedData} />
      </section>

      {/* ================= TABLE ================= */}
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

      {/* ================= INSIGHT ================= */}
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
    <div className={`card ${danger ? "border border-red-500/30" : ""}`}>
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

function ExpiryTimeline({ data }) {
  const maxDays = 30;

  return (
    <div className="timeline-card">
      <h3 className="text-xl font-semibold mb-6">
        Expiry Risk Timeline
      </h3>

      {data.slice(0, 5).map((item, index) => {
        const percent = Math.min(
          (item.expiry_days / maxDays) * 100,
          100
        );

        const riskClass =
          item.expiry_days <= 7
            ? "timeline-high"
            : item.expiry_days <= 30
            ? "timeline-medium"
            : "timeline-safe";

        const label =
          item.expiry_days <= 7
            ? "High Risk"
            : item.expiry_days <= 30
            ? "Medium Risk"
            : "Safe";

        return (
          <div key={index} className="timeline-row">
            <div className="timeline-label">
              {item.medicine}
            </div>

            <div className="timeline-bar">
              <div
                className={`timeline-fill ${riskClass}`}
                style={{ width: `${percent}%` }}
              />
            </div>

            <div className="timeline-text">
              {item.expiry_days} days · {label}
            </div>
          </div>
        );
      })}
    </div>
  );
}
