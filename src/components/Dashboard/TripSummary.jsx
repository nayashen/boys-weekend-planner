import SectionCard from "../common/SectionCard";

function TripSummary({
  currency = "R",
  accommodation = 0,
  groceries = 0,
  drinks = 0,
  expenses = 0,
  planned = 0,
  projected = 0,
}) {
  const rowStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 0",
    borderBottom: "1px solid #e5e7eb",
  };

  return (
    <SectionCard title="🧳 Trip Cost Summary">

      <div style={rowStyle}>
        <span>🏡 Accommodation</span>
        <strong>
          {currency}
          {accommodation.toLocaleString()}
        </strong>
      </div>

      <div style={rowStyle}>
        <span>🛒 Groceries</span>
        <strong>
          {currency}
          {groceries.toLocaleString()}
        </strong>
      </div>

      <div style={rowStyle}>
        <span>🍻 Drinks</span>
        <strong>
          {currency}
          {drinks.toLocaleString()}
        </strong>
      </div>

      <div style={rowStyle}>
        <span>🧾 Other Expenses</span>
        <strong>
          {currency}
          {expenses.toLocaleString()}
        </strong>
      </div>

      <div
        style={{
          ...rowStyle,
          fontSize: "18px",
          fontWeight: "bold",
        }}
      >
        <span>💰 Planned Trip Cost</span>

        <span>
          {currency}
          {planned.toLocaleString()}
        </span>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: "18px",
          fontSize: "22px",
          fontWeight: "bold",
          color:
            projected < 0
              ? "#dc2626"
              : "#059669",
        }}
      >
        <span>📊 Projected Balance</span>

        <span>
          {currency}
          {projected.toLocaleString()}
        </span>
      </div>

    </SectionCard>
  );
}

export default TripSummary;