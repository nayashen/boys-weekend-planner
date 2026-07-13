function Sidebar() {
  const menuItem = {
    padding: "14px",
    cursor: "pointer",
    borderRadius: "8px",
    marginBottom: "8px",
  };

  return (
    <div
      style={{
        width: "250px",
        backgroundColor: "#1f2937",
        color: "white",
        height: "100vh",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <h2>🍻 Boys Weekend</h2>

      <hr />

      <div style={menuItem}>📊 Dashboard</div>
      <div style={menuItem}>👥 Members</div>
      <div style={menuItem}>💰 Finance</div>
      <div style={menuItem}>🏠 Accommodation</div>
      <div style={menuItem}>🛒 Grocery</div>
      <div style={menuItem}>🍺 Drinks</div>
      <div style={menuItem}>📷 Gallery</div>
      <div style={menuItem}>📊 Reports</div>
      <div style={menuItem}>⚙️ Settings</div>
    </div>
  );
}

export default Sidebar;