import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function DemandChart({ title, data }) {
  return (
    <div className="card">
      <h3 style={{ marginBottom: "14px" }}>{title}</h3>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
          <XAxis dataKey="date" stroke="#b3b3c6" />
          <YAxis stroke="#b3b3c6" />
          <Tooltip
            contentStyle={{
              background: "#0a0a0f",
              border: "1px solid #2a2a3d",
              borderRadius: "10px",
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
