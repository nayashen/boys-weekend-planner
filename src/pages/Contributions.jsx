import { useTrip } from "../context/TripContext";

function Contributions() {
  const {
    members,
    payments,
    tripSettings,
  } = useTrip();

  const currency =
    tripSettings.currency || "R";

  const targetPerPerson = Number(
    tripSettings.targetContribution || 0
  );

  const totalTarget =
    members.length * targetPerPerson;

  const totalPaid = payments.reduce(
    (sum, payment) =>
      sum + Number(payment.amount || 0),
    0
  );

  const totalOutstanding = Math.max(
    totalTarget - totalPaid,
    0
  );

  // Get unique months from payments
  const months = [
    ...new Set(
      payments
        .map(
          (payment) =>
            payment.contributionMonth
        )
        .filter(Boolean)
    ),
  ];

  return (
    <div style={{ padding: "30px" }}>
      <h1>💳 Contributions</h1>

      {/* SUMMARY */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          marginTop: "25px",
          marginBottom: "30px",
        }}
      >
        <SummaryCard
          title="Total Target"
          value={`${currency}${totalTarget.toLocaleString()}`}
        />

        <SummaryCard
          title="Total Paid"
          value={`${currency}${totalPaid.toLocaleString()}`}
        />

        <SummaryCard
          title="Total Outstanding"
          value={`${currency}${totalOutstanding.toLocaleString()}`}
        />
      </div>

      {/* MEMBER CONTRIBUTIONS */}
      <div
        style={{
          background: "white",
          padding: "25px",
          borderRadius: "12px",
          boxShadow:
            "0 2px 8px rgba(0,0,0,0.1)",
          overflowX: "auto",
        }}
      >
        <h2>Member Contribution Summary</h2>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
            minWidth: "800px",
          }}
        >
          <thead>
            <tr
              style={{
                background: "#f3f4f6",
                textAlign: "left",
              }}
            >
              <th style={cellStyle}>
                Member
              </th>

              <th style={cellStyle}>
                Target
              </th>

              {months.map((month) => (
                <th
                  key={month}
                  style={cellStyle}
                >
                  {month}
                </th>
              ))}

              <th style={cellStyle}>
                Total Paid
              </th>

              <th style={cellStyle}>
                Outstanding
              </th>
            </tr>
          </thead>

          <tbody>
            {members.map((member) => {
              const memberPayments =
                payments.filter(
                  (payment) =>
                    String(
                      payment.memberId
                    ) ===
                    String(member.id)
                );

              const memberTotalPaid =
                memberPayments.reduce(
                  (sum, payment) =>
                    sum +
                    Number(
                      payment.amount || 0
                    ),
                  0
                );

              const memberOutstanding =
                Math.max(
                  targetPerPerson -
                    memberTotalPaid,
                  0
                );

              return (
                <tr key={member.id}>
                  <td style={cellStyle}>
                    <strong>
                      {member.name}
                    </strong>
                  </td>

                  <td style={cellStyle}>
                    {currency}
                    {targetPerPerson.toLocaleString()}
                  </td>

                  {months.map((month) => {
                    const monthlyTotal =
                      memberPayments
                        .filter(
                          (payment) =>
                            payment.contributionMonth ===
                            month
                        )
                        .reduce(
                          (sum, payment) =>
                            sum +
                            Number(
                              payment.amount ||
                                0
                            ),
                          0
                        );

                    return (
                      <td
                        key={month}
                        style={cellStyle}
                      >
                        {currency}
                        {monthlyTotal.toLocaleString()}
                      </td>
                    );
                  })}

                  <td
                    style={{
                      ...cellStyle,
                      color: "#059669",
                      fontWeight: "bold",
                    }}
                  >
                    {currency}
                    {memberTotalPaid.toLocaleString()}
                  </td>

                  <td
                    style={{
                      ...cellStyle,
                      color:
                        memberOutstanding > 0
                          ? "#dc2626"
                          : "#059669",
                      fontWeight: "bold",
                    }}
                  >
                    {currency}
                    {memberOutstanding.toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {members.length === 0 && (
          <p>
            No members have been added yet.
          </p>
        )}
      </div>
    </div>
  );
}

function SummaryCard({ title, value }) {
  return (
    <div
      style={{
        background: "white",
        padding: "25px",
        borderRadius: "12px",
        boxShadow:
          "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <h3
        style={{
          marginTop: 0,
          color: "#6b7280",
        }}
      >
        {title}
      </h3>

      <h2 style={{ marginBottom: 0 }}>
        {value}
      </h2>
    </div>
  );
}

const cellStyle = {
  padding: "14px",
  borderBottom: "1px solid #e5e7eb",
};

export default Contributions;