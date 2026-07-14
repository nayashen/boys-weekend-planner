import { useState } from "react";

function AddMemberModal({ onClose, onSave }) {
  const [member, setMember] = useState({
    name: "",
    phone: "",
    email: "",
    contribution: "",
    drink: "",
    emergency: "",
  });

  function handleChange(e) {
    setMember({
      ...member,
      [e.target.name]: e.target.value,
    });
  }

  function saveMember() {
    if (member.name.trim() === "") {
      alert("Please enter a member name.");
      return;
    }

    onSave({
      id: Date.now(),
      ...member,
      paid: false,
    });

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
      }}
    >
      <div
        style={{
          width: "550px",
          background: "white",
          padding: "30px",
          borderRadius: "12px",
        }}
      >
        <h2>Add Member</h2>

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
          name="contribution"
          placeholder="Monthly Contribution"
          value={member.contribution}
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
          <button onClick={onClose}>
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
            }}
          >
            Save Member
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