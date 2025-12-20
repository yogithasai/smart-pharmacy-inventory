import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="topbar">
      <span className="brand">💊 MedoVentory</span>

      <nav className="topbar-links">
        <NavLink to="/">Dashboard</NavLink>
        <NavLink to="/expiry">Expiry</NavLink>
        <NavLink to="/forecast">Forecast</NavLink>
        <NavLink to="/reorder">Reorder</NavLink>
        <NavLink to="/chatbot">Chatbot</NavLink>
      </nav>
    </header>
  );
}
