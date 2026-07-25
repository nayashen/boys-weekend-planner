import { useEffect, useState } from "react";

function AddMemberModal({
  onClose,
  onSave,
  memberToEdit,
}) {
  const [member, setMember] = useState({
    name: "",
    phone: "",
    email: "",
    monthlyContribution: "",
    targetAmount: "",
    drink: "",
    emergency: "",
  });

  useEffect(() => {
    if (memberToEdit) {
      setMember({
        name: memberToEdit.name || "",
        phone: memberToEdit.phone || "",
        email: memberToEdit.email || "",

        monthlyContribution:
          memberToEdit.monthly_contribution || "",

        targetAmount:
          memberToEdit.target_amount || "",

        drink:
          memberToEdit.drink_preference ||
          memberToEdit.drink ||
          "",

        emergency:
          memberToEdit.emergency_contact ||
          memberToEdit.emergency ||
          "",
      });
    }
  }, [memberToEdit]);

  function handleChange(event) {
    setMember({
      ...member,
      [event.target.name]: event.target.value,
    });
  }

  function saveMember() {
    console.log("MEMBER OBJECT:", member);

    if (!member.name.trim()) {
      alert("Please enter a member name.");
      return;
    }

    onSave(member);
    onClose();
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          width: "550px",
          maxWidth: "90%",
          background: "white",
          padding: "30px",
          borderRadius: "12px",
        }}
      >
        <h2>
          {memberToEdit
            ? "Edit Member"
            : "Add Member"}
        </h2>

        <input
          name="name"
          placeholder="Full Name"
          value={member.name}
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          name="phone"
          placeholder="Phone Number"
          value={member.phone}
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          name="email"
          placeholder="Email Address"
          value={member.email}
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          type="number"
          name="monthlyContribution"
          placeholder="Monthly Contribution"
          value={member.monthlyContribution}
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          type="number"
          name="targetAmount"
          placeholder="Target Amount"
          value={member.targetAmount}
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          name="drink"
          placeholder="Drink Preference"
          value={member.drink}
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          name="emergency"
          placeholder="Emergency Contact"
          value={member.emergency}
          onChange={handleChange}
          style={inputStyle}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
            marginTop: "20px",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "10px 20px",
            }}
          >
            Cancel
          </button>

          <button
            onClick={saveMember}
            style={{
              background: "#2563eb",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            {memberToEdit
              ? "Save Changes"
              : "Add Member"}
          </button>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "10px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  boxSizing: "border-box",
};

export default AddMemberModal;