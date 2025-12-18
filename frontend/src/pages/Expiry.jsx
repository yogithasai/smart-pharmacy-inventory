import { useEffect, useState } from "react";
import { getExpiryAlerts } from "../api/api";
import Table from "../components/Table";

export default function Expiry() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getExpiryAlerts().then((res) => setData(res.data));
  }, []);

  return (
    <div>
      <h1>Expiry Alerts</h1>
      <Table
        columns={["medicine", "expiry_date", "quantity"]}
        data={data}
      />
    </div>
  );
}
