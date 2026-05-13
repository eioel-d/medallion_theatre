import { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:3001/api";

function TicketSales() {
  const [performances, setPerformances] = useState([]);
  const [patrons, setPatrons] = useState([]);
  const [seats, setSeats] = useState([]);
  const [soldSeats, setSoldSeats] = useState([]);
  const [selectedPerformance, setSelectedPerformance] = useState("");
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedPatron, setSelectedPatron] = useState("");

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

  const fetchSeats = async (performance_id) => {
    const allSeats = await axios.get(`${API}/seats`);
    const sold = await axios.get(`${API}/tickets/sold/${performance_id}`);
    setSeats(allSeats.data);
    setSoldSeats(sold.data.map((s) => s.seat_id));
  };

  const handlePerformanceChange = (e) => {
    const id = e.target.value;
    setSelectedPerformance(id);
    setSelectedSeats([]);
    if (id) fetchSeats(id);
  };

  const handleSeatClick = (seat) => {
    if (soldSeats.includes(seat.seat_id)) return;

    setSelectedSeats((prev) => {
      const alreadySelected = prev.find((s) => s.seat_id === seat.seat_id);
      if (alreadySelected) {
        // clicking again deselects it
        return prev.filter((s) => s.seat_id !== seat.seat_id);
      }
      return [...prev, seat];
    });
  };

  const handleSellTickets = async () => {
    if (!selectedPerformance || selectedSeats.length === 0 || !selectedPatron) {
      alert("Please select a performance, at least one seat, and a patron!");
      return;
    }
    await axios.post(`${API}/tickets/`, {
      performance_id: selectedPerformance,
      seat_ids: selectedSeats.map((s) => s.seat_id),
      patron_id: selectedPatron,
    });
    alert(`${selectedSeats.length} ticket(s) sold successfully!`);
    setSelectedSeats([]);
    fetchSeats(selectedPerformance);
  };

  const groupedSeats = seats.reduce((groups, seat) => {
    if (!groups[seat.category]) groups[seat.category] = [];
    groups[seat.category].push(seat);
    return groups;
  }, {});

  const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

  // Group seats by category
  const grouped = seats.reduce((groups, seat) => {
    if (!groups[seat.category]) groups[seat.category] = [];
    groups[seat.category].push(seat);
    return groups;
  }, {});

  // Group seats by row for rendering
  const groupByRow = (seatList) => {
    return seatList.reduce((rows, seat) => {
      const row = seat.seat_number.replace(/[0-9]/g, "");
      if (!rows[row]) rows[row] = [];
      rows[row].push(seat);
      return rows;
    }, {});
  };

  const getSeatColor = (seat) => {
    if (soldSeats.includes(seat.seat_id)) return "#E24B4A";
    if (selectedSeats.find((s) => s.seat_id === seat.seat_id)) return "#378ADD";
    return "#1D9E75";
  };

  const renderRows = (seatList) => {
    const rows = groupByRow(seatList);
    return Object.entries(rows).map(([rowLetter, rowSeats]) => (
      <div
        key={rowLetter}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "3px",
          marginBottom: "3px",
        }}
      >
        <span
          style={{
            fontSize: "10px",
            color: "#888",
            width: "22px",
            textAlign: "right",
            marginRight: "2px",
            flexShrink: 0,
          }}
        >
          {rowLetter}
        </span>
        {rowSeats.map((seat) => (
          <button
            key={seat.seat_id}
            title={seat.seat_number}
            onClick={() => handleSeatClick(seat)}
            style={{
              width: "40px",
              height: "30px",
              borderRadius: "3px 3px 2px 2px",
              border: "none",
              backgroundColor: getSeatColor(seat),
              cursor: soldSeats.includes(seat.seat_id)
                ? "not-allowed"
                : "pointer",
              fontSize: "12px",
              color: "white",
              fontWeight: "500",
              transition: "transform 0.1s",
            }}
            onMouseEnter={(e) => {
              if (!soldSeats.includes(seat.seat_id))
                e.target.style.transform = "scale(1.2)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "scale(1)";
            }}
          >
            {seat.seat_number}
          </button>
        ))}
      </div>
    ));
  };
  const renderBoxSeats = (seatList) => {
    return seatList.map((seat) => (
      <button
        key={seat.seat_id}
        title={seat.seat_number}
        onClick={() => handleSeatClick(seat)}
        style={{
          width: "40px",
          height: "30px",
          borderRadius: "3px 3px 2px 2px",
          border: "none",
          backgroundColor: getSeatColor(seat),
          cursor: soldSeats.includes(seat.seat_id) ? "not-allowed" : "pointer",
          fontSize: "12px",
          color: "white",
          fontWeight: "500",
          marginBottom: "3px",
          display: "block",
        }}
      >
        {seat.seat_number}
      </button>
    ));
  };
  return (
    <div>
      <h1>Ticket Sales</h1>

      {/* Step 1 */}
      <h2>Select Performance</h2>
      <select value={selectedPerformance} onChange={handlePerformanceChange}>
        <option value="">Select a Performance</option>
        {performances.map((p) => (
          <option key={p.performance_id} value={p.performance_id}>
            {p.show_name} — {p.date} {p.time}
          </option>
        ))}
      </select>

      {/* Step 2: Seat Map */}
      {selectedPerformance && seats.length > 0 && (
        <div
          style={{
            marginTop: "20px",
            width: "100%",
          }}
        >
          <h2>Select Seats</h2>

          {/* Legend */}
          <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
            {[
              ["#1D9E75", "Available"],
              ["#E24B4A", "Sold"],
              ["#378ADD", "Selected"],
            ].map(([color, label]) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "12px",
                }}
              >
                <div
                  style={{
                    width: "16px",
                    height: "14px",
                    borderRadius: "3px",
                    backgroundColor: color,
                  }}
                />
                {label}
              </div>
            ))}
          </div>

          {/* Stage */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              textAlign: "center",
              padding: "10px",
              background: "#f0f0f0",
              borderRadius: "6px",
              marginBottom: "20px",
              letterSpacing: "2px",
              fontSize: "13px",
              fontWeight: "500",
              color: "#888",
              width: "70%",
              margin: "0 auto 20px auto",
              justifyContent: "center",
              justifyItems: "center",
              alignItems: "center",
              alignContent: "center",
            }}
          >
            STAGE
          </div>

          {/* Theatre Layout */}
          <div
            style={{
              display: "flex",
              gap: "15px",
              alignItems: "flex-start",
              justifyContent: "center",
              paddingLeft: "135px",
            }}
          >
            {/* Box Left */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "6px",
                paddingTop: "8px",
                minWidth: "60px",
                marginRight: "240px",
              }}
            >
              <span
                style={{
                  fontSize: "10px",
                  color: "#888",
                  writingMode: "vertical-rl",
                  transform: "rotate(180deg)",
                  letterSpacing: "1px",
                }}
              >
                BOX 1–8
              </span>
              <div>{renderBoxSeats((grouped.box || []).slice(0, 8))}</div>
            </div>

            {/* Center Sections */}
            <div style={{ flex: 1, maxWidth: "800px" }}>
              <div
                style={{
                  textAlign: "center",
                  fontSize: "12px",
                  fontWeight: "500",
                  color: "#888",
                  marginBottom: "6px",
                  letterSpacing: "1px",
                }}
              >
                ORCHESTRA{" "}
                <span style={{ fontSize: "11px", color: "#aaa" }}>$65</span>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginBottom: "16px",
                }}
              >
                {renderRows(grouped.orchestra || [])}
              </div>

              <div
                style={{
                  textAlign: "center",
                  fontSize: "12px",
                  fontWeight: "500",
                  color: "#888",
                  marginBottom: "6px",
                  letterSpacing: "1px",
                }}
              >
                MEZZANINE{" "}
                <span style={{ fontSize: "11px", color: "#aaa" }}>$55</span>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginBottom: "16px",
                }}
              >
                {renderRows(grouped.mezzanine || [])}
              </div>

              <div
                style={{
                  textAlign: "center",
                  fontSize: "12px",
                  fontWeight: "500",
                  color: "#888",
                  marginBottom: "6px",
                  letterSpacing: "1px",
                }}
              >
                BALCONY{" "}
                <span style={{ fontSize: "11px", color: "#aaa" }}>$40</span>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginBottom: "16px",
                }}
              >
                {renderRows(grouped.balcony || [])}
              </div>
            </div>

            {/* Box Right */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "6px",
                paddingTop: "8px",
                width: "350px",
                marginLeft: "120px",
              }}
            >
              <span
                style={{
                  fontSize: "10px",
                  color: "#888",
                  writingMode: "vertical-rl",
                  letterSpacing: "1px",
                }}
              >
                BOX 9–16
              </span>
              <div>{renderBoxSeats((grouped.box || []).slice(8, 16))}</div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Patron + Sell */}
      {selectedSeats.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h2>Step 3: Assign to Patron</h2>
          <p>
            Selected:{" "}
            <strong>
              {selectedSeats.map((s) => s.seat_number).join(", ")}
            </strong>
          </p>
          <p>
            Total: <strong>${totalPrice.toFixed(2)}</strong>
          </p>
          <select
            value={selectedPatron}
            onChange={(e) => setSelectedPatron(e.target.value)}
          >
            <option value="">Select a Patron</option>
            {patrons.map((patron) => (
              <option key={patron.patron_id} value={patron.patron_id}>
                {patron.first_name} {patron.last_name}
              </option>
            ))}
          </select>
          <button
            onClick={handleSellTickets}
            style={{
              marginLeft: "10px",
              backgroundColor: "#1a1a2e",
              color: "white",
              padding: "8px 16px",
              border: "none",
              cursor: "pointer",
              borderRadius: "4px",
            }}
          >
            Book {selectedSeats.length} Seat(s)
          </button>
        </div>
      )}
    </div>
  );
}

export default TicketSales;
