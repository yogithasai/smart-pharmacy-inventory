import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function DemandChart({ title, data }) {
  return (
    <div className="card">
      <h3 style={{ marginBottom: "16px" }}>{title}</h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.08)"
          />
          <XAxis
            dataKey="date"
            stroke="#b3b3c6"
            tick={{ fontSize: 12 }}
          />
          <YAxis
            stroke="#b3b3c6"
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              background: "#0a0a0f",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "10px",
              color: "white",
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#8b5cf6"
            strokeWidth={3}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
