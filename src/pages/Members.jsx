import { useState } from "react";
import { useTrip } from "../context/TripContext";
import AddMemberModal from "../components/AddMemberModal";
import MemberCard from "../components/MemberCard";

function Members() {
  const {
    members,
    payments,
    addMember,
    updateMember,
    deleteMember,
  } = useTrip();

  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  // =========================
  // ADD OR EDIT MEMBER
  // =========================

function handleSaveMember(member) {
  const memberToSave = {
    ...member,
    target_amount: Number(member.targetAmount || 0),
  };

  if (editingMember) {
    updateMember({
      ...memberToSave,
      id: editingMember.id,
    });

    setEditingMember(null);
  } else {
    addMember(memberToSave);
  }

  setShowModal(false);
}
  // =========================
  // EDIT MEMBER
  // =========================

  function handleEdit(member) {
    setEditingMember(member);
    setShowModal(true);
  }

  // =========================
  // DELETE MEMBER
  // =========================

  function handleDelete(member) {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${member.name}?`
    );

    if (!confirmed) {
      return;
    }

    deleteMember(member.id);
  }

  // =========================
  // MEMBER PAYMENTS
  // =========================

  function getMemberPayments(memberId) {
    return payments.filter(
      (payment) =>
        String(payment.member_id) === String(memberId)
    );
  }

  return (
    <div style={{ padding: "30px" }}>
      {/* HEADER */}
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
          onClick={() => {
            setEditingMember(null);
            setShowModal(true);
          }}
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

      {/* MEMBERS */}
      {members.length === 0 ? (
        <div
          style={{
            background: "white",
            padding: "30px",
            borderRadius: "12px",
          }}
        >
          <p>No members added yet.</p>
        </div>
      ) : (
        members.map((member) => {
          const memberPayments =
            getMemberPayments(member.id);
            console.log("Current Member:", member);
console.log("Payments Found:", memberPayments);

          const totalPaid = memberPayments.reduce(
            (total, payment) =>
              total + Number(payment.amount || 0),
            0
          );

const targetAmount = Number(
  member.target_amount ||
  member.targetAmount ||
  0
);

const outstanding = Math.max(
  targetAmount - totalPaid,
  0
);

         
console.log("Members:", members);
console.log("Payments:", payments);

          return (
            <div key={member.id}>
              <MemberCard
              member={{
  ...member,
  targetAmount,
  totalPaid,
  outstanding,
}}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />

              {/* PAYMENT HISTORY */}
              <div
                style={{
                  background: "#f9fafb",
                  padding: "15px 25px",
                  marginTop: "-15px",
                  marginBottom: "20px",
                  borderRadius: "0 0 12px 12px",
                }}
              >
                <h3>Payment History</h3>

                {memberPayments.length === 0 ? (
                  <p>No payments recorded.</p>
                ) : (
                  memberPayments.map((payment) => (
                    <p key={payment.id}>
                      💰 R{payment.amount} — Paid on{" "}
                      {payment.date}
                    </p>
                  ))
                )}
              </div>
            </div>
          );
        })
      )}

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <AddMemberModal
          memberToEdit={editingMember}
          onSave={handleSaveMember}
          onClose={() => {
            setShowModal(false);
            setEditingMember(null);
          }}
        />
      )}
    </div>
  );
}

export default Members;