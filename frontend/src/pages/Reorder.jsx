import { useEffect, useState } from "react";
import { getReorderSuggestions } from "../api/api";
import Table from "../components/Table";

export default function Reorder() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getReorderSuggestions().then((res) => setData(res.data));
  }, []);

  return (
    <div>
      <h1>Reorder Suggestions</h1>
      <Table
        columns={["medicine", "current_stock", "suggested_order"]}
        data={data}
      />
    </div>
  );
}
