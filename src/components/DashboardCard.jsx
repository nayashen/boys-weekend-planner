function DashboardCard({ title, value, color }) {
  return (
    <div
      style={{
        backgroundColor: "white",
        borderLeft: `8px solid ${color}`,
        borderRadius: "10px",
        padding: "20px",
        width: "100%",
        boxShadow: "0 3px 10px rgba(0,0,0,0.15)",
      }}
    >
      <h3>{title}</h3>

      <h1>{value}</h1>
    </div>
  );
}

export default DashboardCard;