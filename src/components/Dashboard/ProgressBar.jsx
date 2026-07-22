function ProgressBar({
  value = 0,
  max = 100,
  color = "#2563eb",
}) {
  const percentage =
    max > 0
      ? Math.min((value / max) * 100, 100)
      : 0;

  return (
    <div
      style={{
        width: "100%",
        background: "#e5e7eb",
        borderRadius: "999px",
        overflow: "hidden",
        height: "14px",
      }}
    >
      <div
        style={{
          width: `${percentage}%`,
          height: "100%",
          background: color,
          transition: "width 0.4s ease",
        }}
      />
    </div>
  );
}

export default ProgressBar;