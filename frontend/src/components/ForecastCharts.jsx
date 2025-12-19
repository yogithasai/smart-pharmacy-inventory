import {
  BarChart, Bar,
  AreaChart, Area, Line,
  PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ForecastCharts({ data }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

      <ChartCard title="Demand vs Supply">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={data}>
            <XAxis dataKey="medicine" hide />
            <YAxis />
            <Tooltip />
            <Bar dataKey="predicted_demand" fill="#a78bfa" />
            <Bar dataKey="available_stock" fill="#60a5fa" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Demand Trend (Confidence)">
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={data}>
            <XAxis dataKey="medicine" hide />
            <YAxis />
            <Tooltip />
            <Area
              dataKey="predicted_demand"
              stroke="#a78bfa"
              fill="#a78bfa"
              fillOpacity={0.25}
            />
            <Line
              dataKey="predicted_demand"
              stroke="#a78bfa"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Buyer Distribution">
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={data}
              dataKey="buyers"
              nameKey="medicine"
              outerRadius={90}
            >
              {data.map((_, i) => (
                <Cell
                  key={i}
                  fill={["#a78bfa", "#60a5fa", "#f472b6"][i % 3]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-white/5 rounded-2xl px-7 py-8 space-y-4">
      <p className="text-xs text-gray-400 uppercase tracking-wide">
        {title}
      </p>
      {children}
    </div>
  );
}
