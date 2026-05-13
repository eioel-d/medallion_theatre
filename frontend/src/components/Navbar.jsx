import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav
      style={{
        backgroundColor: "#1a1a2e",
        padding: "15px 30px",
        display: "flex",
        gap: "20px",
        alignItems: "center",
      }}
    >
      <span
        style={{
          color: "#e94560",
          fontWeight: "bold",
          fontSize: "20px",
          marginRight: "20px",
        }}
      >
        🎭 Medallion Theatre
      </span>
      <Link to="/" style={linkStyle}>
        Dashboard
      </Link>
      <Link to="/patrons" style={linkStyle}>
        Patrons
      </Link>
      <Link to="/shows" style={linkStyle}>
        Shows
      </Link>
      <Link to="/performances" style={linkStyle}>
        Performances
      </Link>
      <Link to="/tickets" style={linkStyle}>
        Ticket Sales
      </Link>
      <Link to="/reports" style={linkStyle}>
        Reports
      </Link>
    </nav>
  );
}

const linkStyle = {
  color: "#ffffff",
  textDecoration: "none",
  fontSize: "15px",
};

export default Navbar;

