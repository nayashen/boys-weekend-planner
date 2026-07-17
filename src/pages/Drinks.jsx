import { useState } from "react";
import { useTrip } from "../context/TripContext";

function Drinks() {
  const {
    drinks,
    addDrink,
    deleteDrink,
    toggleDrinkPurchased,
  } = useTrip();

  const [form, setForm] = useState({
    name: "",
    category: "",
    quantity: "",
    price: "",
  });

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    addDrink({
      name: form.name,
      category: form.category,
      quantity: Number(form.quantity),
      price: Number(form.price),
      purchased: false,
    });

    setForm({
      name: "",
      category: "",
      quantity: "",
      price: "",
    });
  }

  const totalCost = drinks.reduce(
    (total, drink) =>
      total +
      Number(drink.price || 0) *
        Number(drink.quantity || 0),
    0
  );

  const purchasedCost = drinks
    .filter((drink) => drink.purchased)
    .reduce(
      (total, drink) =>
        total +
        Number(drink.price || 0) *
          Number(drink.quantity || 0),
      0
    );

  const remainingCost =
    totalCost - purchasedCost;

  return (
    <div style={{ padding: "30px" }}>
      <h1>🍻 Drinks Planning</h1>

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
          value={`R${totalCost.toLocaleString()}`}
        />

        <SummaryCard
          title="Purchased"
          value={`R${purchasedCost.toLocaleString()}`}
        />

        <SummaryCard
          title="Remaining"
          value={`R${remainingCost.toLocaleString()}`}
        />

        <SummaryCard
          title="Drink Items"
          value={drinks.length}
        />
      </div>

      <div
        style={{
          background: "white",
          padding: "25px",
          borderRadius: "12px",
          boxShadow:
            "0 2px 8px rgba(0,0,0,0.1)",
          marginBottom: "30px",
        }}
      >
        <h2>Add Drink Item</h2>

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
            placeholder="Drink Name"
            value={form.name}
            onChange={handleChange}
            required
            style={{ padding: "12px" }}
          />

          <input
            name="category"
            placeholder="Category e.g. Beer, Spirits, Mixers"
            value={form.category}
            onChange={handleChange}
            style={{ padding: "12px" }}
          />

          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={form.quantity}
            onChange={handleChange}
            min="1"
            required
            style={{ padding: "12px" }}
          />

          <input
            type="number"
            name="price"
            placeholder="Price Per Item"
            value={form.price}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
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
            + Add Drink
          </button>
        </form>
      </div>

      <div
        style={{
          background: "white",
          padding: "25px",
          borderRadius: "12px",
          boxShadow:
            "0 2px 8px rgba(0,0,0,0.1)",
          overflowX: "auto",
        }}
      >
        <h2>Drinks List</h2>

        {drinks.length === 0 ? (
          <p>No drinks added yet.</p>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "20px",
              minWidth: "800px",
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
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {drinks.map((drink) => {
                const itemTotal =
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
                      {drink.category || "-"}
                    </td>

                    <td style={cellStyle}>
                      {drink.quantity}
                    </td>

                    <td style={cellStyle}>
                      R
                      {Number(
                        drink.price || 0
                      ).toLocaleString()}
                    </td>

                    <td style={cellStyle}>
                      <strong>
                        R
                        {itemTotal.toLocaleString()}
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
                          padding:
                            "8px 12px",
                          backgroundColor:
                            drink.purchased
                              ? "#059669"
                              : "#f59e0b",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                        }}
                      >
                        {drink.purchased
                          ? "✅ Purchased"
                          : "⏳ Mark Purchased"}
                      </button>
                    </td>

                    <td style={cellStyle}>
                      <button
                        onClick={() =>
                          deleteDrink(drink.id)
                        }
                        style={{
                          padding:
                            "8px 12px",
                          backgroundColor:
                            "#dc2626",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                        }}
                      >
                        🗑️ Delete
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

function SummaryCard({ title, value }) {
  return (
    <div
      style={{
        background: "white",
        padding: "25px",
        borderRadius: "12px",
        boxShadow:
          "0 2px 8px rgba(0,0,0,0.1)",
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

      <h2 style={{ marginBottom: 0 }}>
        {value}
      </h2>
    </div>
  );
}

const cellStyle = {
  padding: "14px",
  borderBottom:
    "1px solid #e5e7eb",
};

export default Drinks;