import SectionCard from "../common/SectionCard";

function BankSummary({
  transactions = [],
  credits = 0,
  debits = 0,
}) {
  return (
    <SectionCard title="🏦 Bank Statement Summary">

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(180px,1fr))",
          gap: "20px",
        }}
      >
        <SummaryBox
          title="Transactions"
          value={transactions.length}
          color="#2563eb"
        />

        <SummaryBox
          title="Credits"
          value={credits}
          color="#16a34a"
        />

        <SummaryBox
          title="Debits"
          value={debits}
          color="#dc2626"
        />
      </div>

    </SectionCard>
  );
}

function SummaryBox({
  title,
  value,
  color,
}) {
  return (
    <div
      style={{
        background: "#f9fafb",
        borderRadius: "12px",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          color: "#6b7280",
          marginBottom: "10px",
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: "30px",
          fontWeight: "bold",
          color,
        }}
      >
        {value}
      </div>
    </div>
  );
}

export default BankSummary;