import { useEffect, useState } from "react";
import { getForecast } from "../api/api";
import Table from "../components/Table";

export default function Forecast() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getForecast().then((res) => setData(res.data));
  }, []);

  return (
    <div>
      <h1>Demand Forecast</h1>
      <Table
        columns={["medicine", "predicted_demand"]}
        data={data}
      />
    </div>
  );
}
