import { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:3001/api";

function Reports() {
  const [performances, setPerformances] = useState([]);
  const [patrons, setPatrons] = useState([]);
  const [selectedPerformance, setSelectedPerformance] = useState("");
  const [selectedPatron, setSelectedPatron] = useState("");
  const [performanceReport, setPerformanceReport] = useState(null);
  const [patronReport, setPatronReport] = useState(null);

  useEffect(() => {
    fetchPerformances();
    fetchPatrons();
  }, []);

  const fetchPerformances = async () => {
    const response = await axios.get(`${API}/performances`);
    setPerformances(response.data);
  };

  const fetchPatrons = async () => {
    const response = await axios.get(`${API}/patrons`);
    setPatrons(response.data);
  };

  const fetchPerformanceReport = async (id) => {
    setSelectedPerformance(id);
    setPerformanceReport(null);
    if (!id) return;

    const tickets = await axios.get(`${API}/tickets/performance/${id}`);
    const sold = await axios.get(`${API}/tickets/sold/${id}`);
    const allSeats = await axios.get(`${API}/seats`);

    const totalSeats = allSeats.data.length;
    const soldCount = sold.data.length;
    const availableCount = totalSeats - soldCount;
    const revenue = tickets.data.reduce((sum, t) => sum + t.price, 0);

    // Group sold seats by category
    const byCategory = tickets.data.reduce((groups, t) => {
      if (!groups[t.category]) groups[t.category] = [];
      groups[t.category].push(t);
      return groups;
    }, {});

    setPerformanceReport({
      tickets: tickets.data,
      totalSeats,
      soldCount,
      availableCount,
      revenue,
      byCategory,
    });
  };

  const fetchPatronReport = async (id) => {
    setSelectedPatron(id);
    setPatronReport(null);
    if (!id) return;

    const response = await axios.get(`${API}/tickets/patron/${id}`);
    const totalSpent = response.data.reduce((sum, t) => sum + t.price, 0);

    setPatronReport({
      tickets: response.data,
      totalSpent,
    });
  };

  return (
    <div>
      <h1>Reports</h1>

      {/* Report 1: Performance Report */}
      <div style={{ marginBottom: "40px" }}>
        <h2>Performance Report</h2>
        <p style={{ color: "#888", fontSize: "14px" }}>
          See seats sold and available for a specific performance.
        </p>
        <select
          value={selectedPerformance}
          onChange={(e) => fetchPerformanceReport(e.target.value)}
        >
          <option value="">Select a Performance</option>
          {performances.map((p) => (
            <option key={p.performance_id} value={p.performance_id}>
              {p.show_name} — {p.date} {p.time}
            </option>
          ))}
        </select>

        {performanceReport && (
          <div style={{ marginTop: "20px" }}>

            {/* Summary Cards */}
            <div style={{ display: "flex", gap: "16px", marginBottom: "24px", flexWrap: "wrap" }}>
              {[
                ["Total Seats", performanceReport.totalSeats, "#1a1a2e"],
                ["Seats Sold", performanceReport.soldCount, "#E24B4A"],
                ["Seats Available", performanceReport.availableCount, "#1D9E75"],
                ["Total Revenue", `$${performanceReport.revenue.toFixed(2)}`, "#378ADD"],
              ].map(([label, value, color]) => (
                <div
                  key={label}
                  style={{
                    background: "#f9f9f9",
                    border: "1px solid #eee",
                    borderRadius: "8px",
                    padding: "16px 24px",
                    minWidth: "140px",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: "13px", color: "#888", marginBottom: "6px" }}>{label}</div>
                  <div style={{ fontSize: "24px", fontWeight: "500", color }}>{value}</div>
                </div>
              ))}
            </div>

            {/* Sold by Category */}
            <h3>Sold by Category</h3>
            <table border="1" cellPadding="8" style={{ marginBottom: "24px" }}>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Seats Sold</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(performanceReport.byCategory).map(([category, tickets]) => (
                  <tr key={category}>
                    <td style={{ textTransform: "capitalize" }}>{category}</td>
                    <td>{tickets.length}</td>
                    <td>${tickets.reduce((sum, t) => sum + t.price, 0).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Tickets List */}
            <h3>All Tickets Sold</h3>
            {performanceReport.tickets.length === 0 ? (
              <p style={{ color: "#888" }}>No tickets sold for this performance yet.</p>
            ) : (
              <table border="1" cellPadding="8">
                <thead>
                  <tr>
                    <th>Ticket ID</th>
                    <th>Patron</th>
                    <th>Seat</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Purchase Date</th>
                  </tr>
                </thead>
                <tbody>
                  {performanceReport.tickets.map((ticket) => (
                    <tr key={ticket.ticket_id}>
                      <td>{ticket.ticket_id}</td>
                      <td>{ticket.first_name} {ticket.last_name}</td>
                      <td>{ticket.seat_number}</td>
                      <td style={{ textTransform: "capitalize" }}>{ticket.category}</td>
                      <td>${ticket.price.toFixed(2)}</td>
                      <td>{new Date(ticket.purchase_date).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* Report 2: Patron Report */}
      <div>
        <h2>Patron Ticket History</h2>
        <p style={{ color: "#888", fontSize: "14px" }}>
          See all tickets purchased by a specific patron.
        </p>
        <select
          value={selectedPatron}
          onChange={(e) => fetchPatronReport(e.target.value)}
        >
          <option value="">Select a Patron</option>
          {patrons.map((patron) => (
            <option key={patron.patron_id} value={patron.patron_id}>
              {patron.first_name} {patron.last_name}
            </option>
          ))}
        </select>

        {patronReport && (
          <div style={{ marginTop: "20px" }}>

            {/* Summary */}
            <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
              {[
                ["Tickets Purchased", patronReport.tickets.length, "#1a1a2e"],
                ["Total Spent", `$${patronReport.totalSpent.toFixed(2)}`, "#378ADD"],
              ].map(([label, value, color]) => (
                <div
                  key={label}
                  style={{
                    background: "#f9f9f9",
                    border: "1px solid #eee",
                    borderRadius: "8px",
                    padding: "16px 24px",
                    minWidth: "140px",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: "13px", color: "#888", marginBottom: "6px" }}>{label}</div>
                  <div style={{ fontSize: "24px", fontWeight: "500", color }}>{value}</div>
                </div>
              ))}
            </div>

            {patronReport.tickets.length === 0 ? (
              <p style={{ color: "#888" }}>This patron has not purchased any tickets yet.</p>
            ) : (
              <table border="1" cellPadding="8">
                <thead>
                  <tr>
                    <th>Show</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Seat</th>
                    <th>Category</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {patronReport.tickets.map((ticket) => (
                    <tr key={ticket.ticket_id}>
                      <td>{ticket.show_name}</td>
                      <td>{ticket.date}</td>
                      <td style={{ textTransform: "capitalize" }}>{ticket.time}</td>
                      <td>{ticket.seat_number}</td>
                      <td style={{ textTransform: "capitalize" }}>{ticket.category}</td>
                      <td>${ticket.price.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Reports;
