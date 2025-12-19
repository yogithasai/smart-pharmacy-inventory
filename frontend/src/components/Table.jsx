export default function Table({ columns, data }) {
  return (
    <table>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col}>
              {col.replace("_", " ").toUpperCase()}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {data.map((row, i) => (
          <tr key={i}>
            {columns.map((col) => (
              <td key={col}>
                {/* Special rendering only for status column */}
                {col === "status" ? (
                  <span className={`status ${row[col]}`}>
                    {row[col]}
                  </span>
                ) : (
                  row[col]
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
