export default function StatCard({
  title,
  value,
  prefix = "",
  subtitle,
}) {
  const displayValue =
    value === undefined || value === null
      ? "--"
      : `${prefix}${value}`;

  return (
    <div className="card">
      <h3>{title}</h3>

      <p style={{ margin: "8px 0", fontSize: "32px", fontWeight: 700 }}>
        {displayValue}
      </p>

      {subtitle && (
        <span
          style={{
            color: "#b3b3c6",
            fontSize: "13px",
          }}
        >
          {subtitle}
        </span>
      )}
    </div>
  );
}
