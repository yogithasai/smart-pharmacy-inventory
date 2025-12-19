import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

export default function ExpiryCharts({ data }) {
  /* ===== DERIVED DATA ===== */

  // 1️⃣ Timeline (group by week buckets)
  const timeline = [
    { label: "≤7 days", count: data.filter(d => d.expiry_days <= 7).length },
    { label: "8–30 days", count: data.filter(d => d.expiry_days > 7 && d.expiry_days <= 30).length },
    { label: "31–90 days", count: data.filter(d => d.expiry_days > 30 && d.expiry_days <= 90).length },
  ];

  // 2️⃣ Risk Distribution
  const riskSplit = [
    { name: "High", value: data.filter(d => d.risk === "High").length },
    { name: "Medium", value: data.filter(d => d.risk === "Medium").length },
    { name: "Low", value: data.filter(d => d.risk === "Low").length },
  ];

  // 3️⃣ Stock Value at Risk
  const valueAtRisk = [
    { label: "High Risk", value: data.filter(d => d.risk === "High").reduce((s,d)=>s+d.stock_value,0) },
    { label: "Medium Risk", value: data.filter(d => d.risk === "Medium").reduce((s,d)=>s+d.stock_value,0) },
    { label: "Low Risk", value: data.filter(d => d.risk === "Low").reduce((s,d)=>s+d.stock_value,0) },
  ];

  return (
    <div className="space-y-20">

      {/* ================= EXPIRY TIMELINE ================= */}
      <section className="bg-white/5 rounded-3xl p-10">
        <h3 className="text-xl font-semibold mb-6">
          Expiry Timeline
        </h3>

        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={timeline}>
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#a78bfa"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </section>

      {/* ================= RISK + VALUE ================= */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12">

        {/* RISK DONUT */}
        <div className="bg-white/5 rounded-3xl p-10">
          <h3 className="text-xl font-semibold mb-6">
            Expiry Risk Distribution
          </h3>

          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={riskSplit}
                dataKey="value"
                innerRadius={60}
                outerRadius={90}
              >
                <Cell fill="#ef4444" />
                <Cell fill="#f59e0b" />
                <Cell fill="#22c55e" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* VALUE BAR */}
        <div className="bg-white/5 rounded-3xl p-10">
          <h3 className="text-xl font-semibold mb-6">
            Stock Value at Risk (₹)
          </h3>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={valueAtRisk}>
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#60a5fa" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </section>
    </div>
  );
}
