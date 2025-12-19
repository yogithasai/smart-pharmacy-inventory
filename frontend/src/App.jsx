import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Expiry from "./pages/Expiry";
import Forecast from "./pages/Forecast";
import Reorder from "./pages/Reorder";
import Chatbot from "./pages/Chatbot";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/expiry" element={<Expiry />} />
          <Route path="/forecast" element={<Forecast />} />
          <Route path="/reorder" element={<Reorder />} />
          <Route path="/chatbot" element={<Chatbot />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
