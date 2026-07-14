import { useState } from "react";
import MemberCard from "../components/MemberCard";
import AddMemberModal from "../components/AddMemberModal";
import initialMembers from "../data/members";

function Members() {
  const [members, setMembers] = useState(initialMembers);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  function addMember(newMember) {
    setMembers([...members, newMember]);
  }

  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "30px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
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

      <input
        type="text"
        placeholder="🔍 Search members..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "25px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          fontSize: "16px",
          boxSizing: "border-box",
        }}
      />

      {filteredMembers.length === 0 ? (
        <p>No members found.</p>
      ) : (
        filteredMembers.map((member) => (
          <MemberCard
            key={member.id}
            member={member}
          />
        ))
      )}

      {showModal && (
        <AddMemberModal
          onClose={() => setShowModal(false)}
          onSave={addMember}
        />
      )}
    </div>
  );
}

export default Members;