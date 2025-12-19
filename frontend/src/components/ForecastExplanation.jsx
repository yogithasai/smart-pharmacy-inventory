export default function ForecastExplanation({
  totalDemand,
  medicineCount,
  highRiskCount,
  trendDirection,
}) {
  return (
    <div className="bg-white/5 rounded-2xl px-6 py-5 text-sm text-gray-300">
      {medicineCount} medicines analyzed. Demand is expected to{" "}
      <span className="font-semibold">
        {trendDirection === "up" ? "exceed supply" : "remain stable"}
      </span>
      . {highRiskCount} medicines need priority attention.
    </div>
  );
}
