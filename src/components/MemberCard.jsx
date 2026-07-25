function MemberCard({ member, onEdit, onDelete }) {
  function handleDeleteClick() {
    console.log("DELETE CLICKED:", member);
    onDelete(member);
  }

  return (
    <div
      style={{
        background: "white",
        padding: "25px",
        borderRadius: "12px",
        marginBottom: "20px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        display: "flex",
        alignItems: "center",
        gap: "30px",
      }}
    >
      {/* PROFILE ICON */}
      <div
        style={{
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          backgroundColor: "#e5e7eb",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "40px",
        }}
      >
        👤
      </div>

      {/* MEMBER INFORMATION */}
      <div style={{ flex: 1 }}>
        <h2 style={{ marginTop: 0 }}>
          {member.name}
        </h2>

        <p>📱 {member.phone || "-"}</p>

        <p>📧 {member.email || "-"}</p>

        <p>
          🎯 <strong>Target Amount:</strong> R
          {Number(
            member.target_amount ??
            member.targetAmount ??
            0
          ).toLocaleString()}
        </p>

        <p>
          ✅ <strong>Total Contributed:</strong> R
          {Number(member.totalPaid || 0).toLocaleString()}
        </p>

        <p
          style={{
            color:
              Number(member.outstanding) === 0
                ? "#16a34a"
                : "#dc2626",
            fontWeight: "bold",
          }}
        >
          💰 Outstanding: R
          {Number(member.outstanding || 0).toLocaleString()}
        </p>

        <p>
          🍻 Drink:{" "}
          {member.drink_preference ??
            member.drink ??
            "Not selected"}
        </p>

        <p>
          🚨 Emergency Contact:{" "}
          {member.emergency_contact ??
            member.emergency ??
            "Not provided"}
        </p>

        <div
          style={{
            marginTop: "15px",
          }}
        >
          <button
            onClick={() => onEdit(member)}
            style={{
              marginRight: "10px",
              padding: "8px 15px",
              cursor: "pointer",
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "6px",
            }}
          >
            ✏️ Edit
          </button>

          <button
            type="button"
            onClick={handleDeleteClick}
            style={{
              padding: "8px 15px",
              cursor: "pointer",
              backgroundColor: "#dc2626",
              color: "white",
              border: "none",
              borderRadius: "6px",
            }}
          >
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default MemberCard;