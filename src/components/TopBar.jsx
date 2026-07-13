function TopBar() {
  return (
    <div
      style={{
        backgroundColor: "white",
        padding: "20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <h2>Dashboard</h2>

      <div>
        👤 <strong>Admin</strong>
      </div>
    </div>
  );
}

export default TopBar;