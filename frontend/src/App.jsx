import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Patrons from "./pages/Patrons.jsx";
import Shows from "./pages/Shows.jsx";
import Performances from "./pages/Performances.jsx";
import TicketSales from "./pages/TicketSales.jsx";
import Reports from "./pages/Reports.jsx";

function App() {
  return (
    <div>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/patrons" element={<Patrons />} />
          <Route path="/shows" element={<Shows />} />
          <Route path="/performances" element={<Performances />} />
          <Route path="/tickets" element={<TicketSales />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
