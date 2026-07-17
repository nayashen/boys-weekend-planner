import { NavLink } from "react-router-dom";

function Sidebar() {
  const linkStyle = ({ isActive }) => ({
    display: "block",
    padding: "14px 20px",
    marginBottom: "8px",
    borderRadius: "8px",
    textDecoration: "none",
    color: isActive ? "white" : "#d1d5db",
    backgroundColor: isActive
      ? "#2563eb"
      : "transparent",
    fontSize: "16px",
    fontWeight: isActive
      ? "bold"
      : "normal",
  });

  return (
    <div
      style={{
        width: "240px",
        backgroundColor: "#111827",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <h2
        style={{
          color: "white",
          marginBottom: "30px",
        }}
      >
        🍻 Boys Weekend
      </h2>

      <nav>
        <NavLink to="/" style={linkStyle}>
          🏠 Dashboard
        </NavLink>

        <NavLink
          to="/members"
          style={linkStyle}
        >
          👥 Members
        </NavLink>

        <NavLink
          to="/finance"
          style={linkStyle}
        >
          💰 Finance
        </NavLink>

        <NavLink
          to="/contributions"
          style={linkStyle}
        >
          💳 Contributions
        </NavLink>

        <NavLink
          to="/bank-statement"
          style={linkStyle}
        >
          🏦 Bank Statement
        </NavLink>

        <NavLink
          to="/accommodation"
          style={linkStyle}
        >
          🏡 Accommodation
        </NavLink>

        <NavLink
          to="/grocery"
          style={linkStyle}
        >
          🛒 Grocery
        </NavLink>

        <NavLink
          to="/drinks"
          style={linkStyle}
        >
          🍻 Drinks
        </NavLink>

        <NavLink
          to="/expenses"
          style={linkStyle}
        >
          🧾 Expenses
        </NavLink>

        {/* NEW GALLERY LINK */}
        <NavLink
          to="/gallery"
          style={linkStyle}
        >
          📸 Gallery
        </NavLink>

        <NavLink
          to="/settings"
          style={linkStyle}
        >
          ⚙️ Settings
        </NavLink>
      </nav>
    </div>
  );
}

export default Sidebar;