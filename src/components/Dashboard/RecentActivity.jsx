import SectionCard from "../common/SectionCard";

function RecentActivity({
  transactions = [],
  currency = "R",
}) {
  return (
    <SectionCard title="🕒 Recent Activity">

      {transactions.length === 0 ? (
        <p
          style={{
            color: "#6b7280",
            margin: 0,
          }}
        >
          No recent transactions.
        </p>
      ) : (
        <div>
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "14px 0",
                borderBottom:
                  "1px solid #e5e7eb",
              }}
            >
              <div>
                <strong>
                  {transaction.description}
                </strong>

                <div
                  style={{
                    color: "#6b7280",
                    fontSize: "13px",
                    marginTop: "4px",
                  }}
                >
                  {transaction.date}
                </div>
              </div>

              <div
                style={{
                  fontWeight: "bold",
                  color:
                    transaction.type ===
                    "credit"
                      ? "#16a34a"
                      : "#dc2626",
                }}
              >
                {transaction.type === "credit"
                  ? "+"
                  : "-"}
                {currency}
                {Number(
                  transaction.amount || 0
                ).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}

    </SectionCard>
  );
}

export default RecentActivity;