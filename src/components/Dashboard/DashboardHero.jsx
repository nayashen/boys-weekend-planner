import SectionCard from "../common/SectionCard";

function DashboardHero({
  title = "Boys Weekend",
  subtitle = "Destination not set",
}) {
  const today = new Date();

  const formattedDate = today.toLocaleDateString("en-ZA", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <SectionCard>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "32px",
              color: "#111827",
            }}
          >
            🍻 {title}
          </h1>

          <p
            style={{
              marginTop: "10px",
              marginBottom: "6px",
              fontSize: "17px",
              color: "#6b7280",
            }}
          >
            📍 {subtitle}
          </p>

          <p
            style={{
              margin: 0,
              color: "#9ca3af",
              fontSize: "14px",
            }}
          >
            {formattedDate}
          </p>
        </div>

        <div
          style={{
            background: "#2563eb",
            color: "white",
            padding: "18px 22px",
            borderRadius: "14px",
            minWidth: "220px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "15px",
              opacity: 0.9,
            }}
          >
            Welcome Back
          </div>

          <div
            style={{
              fontSize: "22px",
              fontWeight: "bold",
              marginTop: "6px",
            }}
          >
            Weekend Planner
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

export default DashboardHero;