import { useState } from "react";
import MemberCard from "../components/MemberCard";
import AddMemberModal from "../components/AddMemberModal";
import members from "../data/members";

function Members() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div style={{ padding: "30px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <h1>👥 Members</h1>

        <button
          onClick={() => setShowModal(true)}
          style={{
            padding: "12px 20px",
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          + Add Member
        </button>
      </div>

      {members.map((member) => (
        <MemberCard
          key={member.id}
          member={member}
        />
      ))}

      {showModal && <AddMemberModal />}
    </div>
  );
}

export default Members;