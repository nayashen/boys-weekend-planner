function DashboardCard({
  icon,
  title,
  value,
  valueColor = "#111827",
}) {
  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "14px",
        padding: "18px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: "120px",
      }}
    >
      <div
        style={{
          fontSize: "28px",
          marginBottom: "12px",
        }}
      >
        {icon}
      </div>

      <div
        style={{
          color: "#6b7280",
          fontSize: "14px",
          marginBottom: "6px",
          fontWeight: 500,
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: "24px",
          fontWeight: "700",
          color: valueColor,
          wordBreak: "break-word",
        }}
      >
        {value}
      </div>
    </div>
  );
}

export default DashboardCard;