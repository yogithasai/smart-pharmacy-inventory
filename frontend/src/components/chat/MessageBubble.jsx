export default function MessageBubble({ msg }) {
  return (
    <div className={`bubble ${msg.sender}`}>
      {msg.type === "text" && <p>{msg.content}</p>}

      {msg.type === "table" && msg.content?.length > 0 && (
        <table>
          <thead>
            <tr>
              {Object.keys(msg.content[0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {msg.content.map((row, i) => (
              <tr key={i}>
                {Object.values(row).map((val, j) => (
                  <td key={j}>{val}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <span className="time">{msg.time}</span>
    </div>
  );
}
