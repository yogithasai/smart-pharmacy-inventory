export default function StatCard({ title, value, prefix = "" }) {
  const displayValue =
    value === undefined || value === null ? "--" : `${prefix}${value}`;

  return (
    <div className="card">
      <h3>{title}</h3>
      <p>{displayValue}</p>
    </div>
  );
}
