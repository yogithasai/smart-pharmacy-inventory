import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar">
      <h2>💊 Smart Pharmacy</h2>
      <div>
        <Link to="/">Dashboard</Link>
        <Link to="/expiry">Expiry</Link>
        <Link to="/forecast">Forecast</Link>
        <Link to="/reorder">Reorder</Link>
        <Link to="/chatbot">Chatbot</Link>
      </div>
    </nav>
  );
}
