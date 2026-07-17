import { useState } from "react";
import { useTrip } from "../context/TripContext";

function Settings() {
  const {
    tripSettings,
    updateTripSettings,
  } = useTrip();

  const [settings, setSettings] =
    useState(tripSettings);

  function handleChange(event) {
    setSettings({
      ...settings,
      [event.target.name]:
        event.target.value,
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    updateTripSettings({
      ...settings,
      targetContribution: Number(
        settings.targetContribution
      ),
    });

    alert("Trip settings saved!");
  }

  return (
    <div style={{ padding: "30px" }}>
      <h1>⚙️ Trip Settings</h1>

      <div
        style={{
          background: "white",
          padding: "25px",
          borderRadius: "12px",
          maxWidth: "700px",
          marginTop: "25px",
          boxShadow:
            "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <h2>Trip Information</h2>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "grid",
            gap: "15px",
            marginTop: "20px",
          }}
        >
          <label>
            Trip Name

            <input
              name="tripName"
              value={settings.tripName}
              onChange={handleChange}
              placeholder="e.g. Boys Weekend 2026"
              style={inputStyle}
            />
          </label>

          <label>
            Destination

            <input
              name="destination"
              value={settings.destination}
              onChange={handleChange}
              placeholder="e.g. Kruger National Park"
              style={inputStyle}
            />
          </label>

          <label>
            Start Date

            <input
              type="date"
              name="startDate"
              value={settings.startDate}
              onChange={handleChange}
              style={inputStyle}
            />
          </label>

          <label>
            End Date

            <input
              type="date"
              name="endDate"
              value={settings.endDate}
              onChange={handleChange}
              style={inputStyle}
            />
          </label>

          <label>
            Target Contribution Per Person

            <input
              type="number"
              name="targetContribution"
              value={
                settings.targetContribution
              }
              onChange={handleChange}
              style={inputStyle}
            />
          </label>

          <label>
            Currency

            <select
              name="currency"
              value={settings.currency}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="R">
                South African Rand (R)
              </option>

              <option value="$">
                US Dollar ($)
              </option>

              <option value="£">
                British Pound (£)
              </option>

              <option value="€">
                Euro (€)
              </option>
            </select>
          </label>

          <button
            type="submit"
            style={{
              padding: "14px",
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            💾 Save Trip Settings
          </button>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  display: "block",
  width: "100%",
  padding: "12px",
  marginTop: "6px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  boxSizing: "border-box",
};

export default Settings;