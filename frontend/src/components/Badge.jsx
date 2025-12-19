export function Badge({ label, value, color = "purple" }) {
  const colorMap = {
    red: "bg-red-500/10 text-red-300",
    purple: "bg-purple-500/10 text-purple-300",
  };

  return (
    <div
      className={`px-6 py-3 rounded-2xl text-sm ${colorMap[color]} flex items-center gap-2`}
    >
      <span className="opacity-70">{label}</span>
      <span className="opacity-70">:</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
