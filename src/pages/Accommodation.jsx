import { useState } from "react";
import { useTrip } from "../context/TripContext";

function Accommodation() {
  const {
    accommodation,
    addAccommodation,
    voteAccommodation,
    selectedAccommodation,
    selectAccommodation,
    deleteAccommodation,
  } = useTrip();

  const [form, setForm] = useState({
    name: "",
    location: "",
    price: "",
    nights: "",
    capacity: "",
    link: "",
    notes: "",
  });

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    addAccommodation({
      name: form.name,
      location: form.location,
      price: Number(form.price),
      nights: Number(form.nights),
      capacity: Number(form.capacity),
      link: form.link,
      notes: form.notes,
    });

    setForm({
      name: "",
      location: "",
      price: "",
      nights: "",
      capacity: "",
      link: "",
      notes: "",
    });
  }

  function handleDelete(option) {
    const confirmed = window.confirm(
      `Are you sure you want to remove "${option.name}"?`
    );

    if (confirmed) {
      deleteAccommodation(option.id);
    }
  }

  return (
    <div style={{ padding: "30px" }}>
      <h1>🏡 Accommodation</h1>

      {/* ADD ACCOMMODATION */}
      <div
        style={{
          background: "white",
          padding: "25px",
          borderRadius: "10px",
          marginTop: "20px",
          marginBottom: "30px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <h2>Add Accommodation Option</h2>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "grid",
            gap: "12px",
            maxWidth: "600px",
          }}
        >
          <input
            name="name"
            placeholder="Accommodation Name"
            value={form.name}
            onChange={handleChange}
            required
            style={{ padding: "12px" }}
          />

          <input
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
            required
            style={{ padding: "12px" }}
          />

          <input
            type="number"
            name="price"
            placeholder="Total Price"
            value={form.price}
            onChange={handleChange}
            required
            style={{ padding: "12px" }}
          />

          <input
            type="number"
            name="nights"
            placeholder="Number of Nights"
            value={form.nights}
            onChange={handleChange}
            required
            style={{ padding: "12px" }}
          />

          <input
            type="number"
            name="capacity"
            placeholder="Number of People Accommodation Can Sleep"
            value={form.capacity}
            onChange={handleChange}
            required
            style={{ padding: "12px" }}
          />

          <input
            name="link"
            placeholder="Booking Link"
            value={form.link}
            onChange={handleChange}
            style={{ padding: "12px" }}
          />

          <textarea
            name="notes"
            placeholder="Notes"
            value={form.notes}
            onChange={handleChange}
            style={{ padding: "12px" }}
          />

          <button
            type="submit"
            style={{
              padding: "12px",
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            + Add Accommodation
          </button>
        </form>
      </div>

      {/* ACCOMMODATION OPTIONS */}
      <div>
        <h2>Accommodation Options</h2>

        {accommodation.length === 0 ? (
          <p>No accommodation options added yet.</p>
        ) : (
          accommodation.map((option) => {
            const pricePerPerson =
              Number(option.capacity) > 0
                ? Number(option.price) /
                  Number(option.capacity)
                : 0;

            const isSelected =
              String(selectedAccommodation) ===
              String(option.id);

            return (
              <div
                key={option.id}
                style={{
                  background: isSelected
                    ? "#dcfce7"
                    : "white",
                  padding: "20px",
                  borderRadius: "10px",
                  marginTop: "15px",
                  boxShadow:
                    "0 2px 8px rgba(0,0,0,0.1)",
                  border: isSelected
                    ? "3px solid #16a34a"
                    : "1px solid #eee",
                }}
              >
                {isSelected && (
                  <h3 style={{ color: "#16a34a" }}>
                    ✅ SELECTED FOR TRIP
                  </h3>
                )}

                <h2>{option.name}</h2>

                <p>📍 {option.location}</p>

                <p>
                  💰 Total Price: R
                  {Number(
                    option.price || 0
                  ).toLocaleString()}
                </p>

                <p>
                  🌙 Nights: {option.nights}
                </p>

                <p>
                  👥 Capacity: {option.capacity} people
                </p>

                <p>
                  👤 Cost Per Person: R
                  {pricePerPerson.toFixed(2)}
                </p>

                {option.link && (
                  <p>
                    🔗{" "}
                    <a
                      href={option.link}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View Booking
                    </a>
                  </p>
                )}

                {option.notes && (
                  <p>📝 {option.notes}</p>
                )}

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    flexWrap: "wrap",
                    marginTop: "15px",
                  }}
                >
                  <button
                    onClick={() =>
                      voteAccommodation(option.id)
                    }
                    style={{
                      padding: "10px 15px",
                      backgroundColor: "#10b981",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  >
                    👍 Vote ({option.votes || 0})
                  </button>

                  <button
                    onClick={() =>
                      selectAccommodation(option.id)
                    }
                    style={{
                      padding: "10px 15px",
                      backgroundColor: isSelected
                        ? "#16a34a"
                        : "#2563eb",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  >
                    {isSelected
                      ? "✅ Selected"
                      : "Select This Option"}
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(option)
                    }
                    style={{
                      padding: "10px 15px",
                      backgroundColor: "#dc2626",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  >
                    🗑️ Remove Option
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Accommodation;