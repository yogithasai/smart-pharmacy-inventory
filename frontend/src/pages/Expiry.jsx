import { useEffect, useState } from "react";
import { getExpiryAlerts } from "../api/api";
import Table from "../components/Table";

export default function Expiry() {
  const [data, setData] = useState([]);
  const [days, setDays] = useState(30);

  useEffect(() => {
    getExpiryAlerts().then((res) => setData(res.data));
  }, []);

  // Add expiry status based on days_left
  const processedData = data.map((item) => {
    let status = "Safe";
    if (item.days_left <= 7) status = "Critical";
    else if (item.days_left <= 30) status = "Warning";

    return { ...item, status };
  });

  return (
    <div>
      {/* Header */}
      <h1 style={{ fontSize: "30px", fontWeight: 700 }}>
        Expiry Alerts
      </h1>
      <p style={{ color: "#b3b3c6", marginBottom: "24px" }}>
        Track medicines nearing expiration to reduce wastage
      </p>

      {/* Filter */}
      <div className="filters">
        <label style={{ color: "#b3b3c6" }}>
          Expiring within
        </label>

        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
        >
          <option value={7}>7 days</option>
          <option value={15}>15 days</option>
          <option value={30}>30 days</option>
          <option value={60}>60 days</option>
        </select>
      </div>

      {/* Expiry Table */}
      <Table
        columns={[
          "medicine",
          "expiry_date",
          "quantity",
          "days_left",
          "status",
        ]}
        data={processedData.filter(
          (item) => item.days_left <= days
        )}
      />
    </div>
  );
}
