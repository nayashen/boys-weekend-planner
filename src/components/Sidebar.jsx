import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

function Sidebar() {
  const navigate = useNavigate();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: "📊",
    },
    {
      name: "Members",
      path: "/members",
      icon: "👥",
    },
    {
      name: "Finance",
      path: "/finance",
      icon: "💰",
    },
    {
      name: "Contributions",
      path: "/contributions",
      icon: "💳",
    },
    {
      name: "Groceries",
      path: "/groceries",
      icon: "🛒",
    },
    {
      name: "Drinks",
      path: "/drinks",
      icon: "🍻",
    },
    {
      name: "Accommodation",
      path: "/accommodation",
      icon: "🏠",
    },
    {
      name: "Expenses",
      path: "/expenses",
      icon: "🧾",
    },
    {
      name: "Gallery",
      path: "/gallery",
      icon: "📸",
    },
    {
      name: "Settings",
      path: "/settings",
      icon: "⚙️",
    },
  ];

  async function handleLogout() {
    const confirmed = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmed) return;

    const { error } =
      await supabase.auth.signOut();

    if (error) {
      console.error(
        "Logout error:",
        error
      );

      alert(
        "Could not logout: " +
          error.message
      );

      return;
    }

    navigate("/login", {
      replace: true,
    });
  }

  return (
    <aside
      style={{
        width: "240px",
        height: "100vh",
        background: "#111827",
        color: "white",
        padding: "20px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        flexShrink: 0,
      }}
    >
      {/* LOGO / TITLE */}

      <h2
        style={{
          marginBottom: "30px",
          fontSize: "20px",
          flexShrink: 0,
        }}
      >
        🍻 Boys Weekend
      </h2>

      {/* NAVIGATION */}

      <nav
        style={{
          flex: 1,
        }}
      >
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "12px",
              marginBottom: "8px",
              borderRadius: "8px",
              textDecoration: "none",
              color: "white",
              backgroundColor: isActive
                ? "#2563eb"
                : "transparent",
            })}
          >
            <span>
              {item.icon}
            </span>

            <span>
              {item.name}
            </span>
          </NavLink>
        ))}
      </nav>

      {/* LOGOUT BUTTON */}

      <button
        onClick={handleLogout}
        style={{
          width: "100%",
          padding: "12px",
          marginTop: "20px",
          border: "none",
          borderRadius: "8px",
          background: "#dc2626",
          color: "white",
          fontSize: "15px",
          fontWeight: "bold",
          cursor: "pointer",
          flexShrink: 0,
        }}
      >
        🚪 Logout
      </button>
    </aside>
  );
}

export default Sidebar;