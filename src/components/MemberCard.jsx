function MemberCard({ member }) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "12px",
        padding: "20px",
        marginBottom: "20px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            backgroundColor: "#ddd",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "36px",
          }}
        >
          👤
        </div>

        <div>
          <h2>{member.name}</h2>

          <p>📱 {member.phone}</p>

          <p>📧 {member.email}</p>

          <p>💵 Monthly Contribution: R{member.monthlyContribution}</p>

          <p>📅 Last Payment: {member.lastPayment}</p>

          <p>❌ Outstanding: R{member.outstanding}</p>

          <p>🍺 Drink: {member.drink}</p>
        </div>
      </div>

      <div style={{ marginTop: "20px" }}>
        <button>Edit</button>

        <button style={{ marginLeft: "10px" }}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default MemberCard;