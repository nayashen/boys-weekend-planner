import { useState } from "react";
import { useTrip } from "../context/TripContext";

function Drinks() {
  const {
    drinks = [],
    addDrink,
    deleteDrink,
    toggleDrinkPurchased,
    tripSettings = {},
  } = useTrip();

  const currency =
    tripSettings?.currency || "R";

  const [form, setForm] = useState({
    name: "",
    category: "Beer",
    quantity: 1,
    price: 0,
  });

  const totalCost = drinks.reduce(
    (sum, drink) =>
      sum +
      Number(drink.price || 0) *
        Number(drink.quantity || 0),
    0
  );

  const purchasedCost = drinks
    .filter((drink) => drink.purchased)
    .reduce(
      (sum, drink) =>
        sum +
        Number(drink.price || 0) *
          Number(drink.quantity || 0),
      0
    );

  const remainingCost =
    totalCost - purchasedCost;

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.name.trim()) {
      alert("Please enter a drink name.");
      return;
    }

    await addDrink({
      name: form.name,
      category: form.category,
      quantity: Number(form.quantity),
      price: Number(form.price),
      purchased: false,
    });

    setForm({
      name: "",
      category: "Beer",
      quantity: 1,
      price: 0,
    });
  }

  return (
    <div
      style={{
        padding: "30px",
      }}
    >
      {/* HEADER */}

      <h1>🍻 Drinks</h1>

      <p
        style={{
          color: "#6b7280",
        }}
      >
        Plan and track drinks for the weekend.
      </p>

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
          title="Total Drinks Budget"
          value={`${currency}${totalCost.toLocaleString()}`}
        />

        <SummaryCard
          title="Purchased"
          value={`${currency}${purchasedCost.toLocaleString()}`}
        />

        <SummaryCard
          title="Still To Buy"
          value={`${currency}${remainingCost.toLocaleString()}`}
        />

        <SummaryCard
          title="Drink Items"
          value={drinks.length}
        />
      </div>

      {/* ADD DRINK */}

      <div
        style={{
          background: "white",
          padding: "25px",
          borderRadius: "12px",
          boxShadow:
            "0 2px 8px rgba(0,0,0,0.08)",
          marginBottom: "30px",
        }}
      >
        <h2>➕ Add Drink</h2>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "15px",
            alignItems: "end",
          }}
        >
          <div>
            <label>Drink Name</label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Castle Lager"
              style={inputStyle}
            />
          </div>

          <div>
            <label>Category</label>

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              style={inputStyle}
            >
              <option>Beer</option>
              <option>Cider</option>
              <option>Spirits</option>
              <option>Whisky</option>
              <option>Brandy</option>
              <option>Wine</option>
              <option>Cooler</option>
              <option>Soft Drinks</option>
              <option>Water</option>
              <option>Other</option>
            </select>
          </div>

          <div>
            <label>Quantity</label>

            <input
              type="number"
              name="quantity"
              min="1"
              value={form.quantity}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div>
            <label>Price Each</label>

            <input
              type="number"
              name="price"
              min="0"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <button
            type="submit"
            style={{
              background: "#2563eb",
              color: "white",
              border: "none",
              padding: "12px 20px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Add Drink
          </button>
        </form>
      </div>

      {/* DRINKS TABLE */}

      <div
        style={{
          background: "white",
          padding: "25px",
          borderRadius: "12px",
          boxShadow:
            "0 2px 8px rgba(0,0,0,0.08)",
          overflowX: "auto",
        }}
      >
        <h2>🍺 Drinks List</h2>

        {drinks.length === 0 ? (
          <p>
            No drinks have been added yet.
          </p>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "20px",
              minWidth: "750px",
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
                  Drink
                </th>

                <th style={cellStyle}>
                  Category
                </th>

                <th style={cellStyle}>
                  Quantity
                </th>

                <th style={cellStyle}>
                  Price Each
                </th>

                <th style={cellStyle}>
                  Total
                </th>

                <th style={cellStyle}>
                  Status
                </th>

                <th style={cellStyle}>
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {drinks.map((drink) => {
                const total =
                  Number(drink.price || 0) *
                  Number(drink.quantity || 0);

                return (
                  <tr key={drink.id}>
                    <td style={cellStyle}>
                      <strong>
                        {drink.name}
                      </strong>
                    </td>

                    <td style={cellStyle}>
                      {drink.category}
                    </td>

                    <td style={cellStyle}>
                      {drink.quantity}
                    </td>

                    <td style={cellStyle}>
                      {currency}
                      {Number(
                        drink.price || 0
                      ).toLocaleString()}
                    </td>

                    <td style={cellStyle}>
                      <strong>
                        {currency}
                        {total.toLocaleString()}
                      </strong>
                    </td>

                    <td style={cellStyle}>
                      <button
                        onClick={() =>
                          toggleDrinkPurchased(
                            drink.id
                          )
                        }
                        style={{
                          border: "none",
                          padding: "7px 12px",
                          borderRadius: "6px",
                          cursor: "pointer",
                          background:
                            drink.purchased
                              ? "#dcfce7"
                              : "#fef3c7",
                          color:
                            drink.purchased
                              ? "#166534"
                              : "#92400e",
                        }}
                      >
                        {drink.purchased
                          ? "✅ Purchased"
                          : "⏳ To Buy"}
                      </button>
                    </td>

                    <td style={cellStyle}>
                      <button
                        onClick={() =>
                          deleteDrink(
                            drink.id
                          )
                        }
                        style={{
                          background: "#dc2626",
                          color: "white",
                          border: "none",
                          padding: "7px 12px",
                          borderRadius: "6px",
                          cursor: "pointer",
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function SummaryCard({
  title,
  value,
}) {
  return (
    <div
      style={{
        background: "white",
        padding: "25px",
        borderRadius: "12px",
        boxShadow:
          "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      <h3
        style={{
          color: "#6b7280",
          marginTop: 0,
        }}
      >
        {title}
      </h3>

      <h2
        style={{
          marginBottom: 0,
        }}
      >
        {value}
      </h2>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginTop: "6px",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  boxSizing: "border-box",
};

const cellStyle = {
  padding: "14px",
  borderBottom: "1px solid #e5e7eb",
};

export default Drinks;