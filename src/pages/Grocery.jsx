import { useState } from "react";
import { useTrip } from "../context/TripContext";

function Grocery() {
  const {
    groceries,
    addGrocery,
    deleteGrocery,
    toggleGroceryPurchased,
  } = useTrip();

  const [form, setForm] = useState({
    name: "",
    quantity: "",
    price: "",
    category: "",
  });

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    addGrocery({
      name: form.name,
      quantity: Number(form.quantity),
      price: Number(form.price),
      category: form.category,
      purchased: false,
    });

    setForm({
      name: "",
      quantity: "",
      price: "",
      category: "",
    });
  }

  const totalCost = groceries.reduce(
    (total, grocery) =>
      total +
      Number(grocery.price || 0) *
        Number(grocery.quantity || 0),
    0
  );

  const purchasedCost = groceries
    .filter((grocery) => grocery.purchased)
    .reduce(
      (total, grocery) =>
        total +
        Number(grocery.price || 0) *
          Number(grocery.quantity || 0),
      0
    );

  const remainingCost =
    totalCost - purchasedCost;

  return (
    <div style={{ padding: "30px" }}>
      <h1>🛒 Grocery Planning</h1>

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
          title="Total Grocery Budget"
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
          title="Items"
          value={groceries.length}
        />
      </div>

      {/* ADD GROCERY */}

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
        <h2>Add Grocery Item</h2>

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
            placeholder="Item Name"
            value={form.name}
            onChange={handleChange}
            required
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

          <input
            name="category"
            placeholder="Category e.g. Meat, Snacks, Breakfast"
            value={form.category}
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
            + Add Grocery Item
          </button>
        </form>
      </div>

      {/* GROCERY LIST */}

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
        <h2>Grocery List</h2>

        {groceries.length === 0 ? (
          <p>
            No grocery items added yet.
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
                  Item
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
              {groceries.map((grocery) => {
                const itemTotal =
                  Number(grocery.price || 0) *
                  Number(
                    grocery.quantity || 0
                  );

                return (
                  <tr key={grocery.id}>
                    <td style={cellStyle}>
                      <strong>
                        {grocery.name}
                      </strong>
                    </td>

                    <td style={cellStyle}>
                      {grocery.category ||
                        "-"}
                    </td>

                    <td style={cellStyle}>
                      {grocery.quantity}
                    </td>

                    <td style={cellStyle}>
                      R
                      {Number(
                        grocery.price || 0
                      ).toLocaleString()}
                    </td>

                    <td style={cellStyle}>
                      <strong>
                        R
                        {itemTotal.toLocaleString()}
                      </strong>
                    </td>

                    {/* PURCHASED BUTTON */}

                    <td style={cellStyle}>
                      <button
                        onClick={() =>
                          toggleGroceryPurchased(
                            grocery.id
                          )
                        }
                        style={{
                          padding:
                            "8px 12px",
                          backgroundColor:
                            grocery.purchased
                              ? "#059669"
                              : "#f59e0b",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                        }}
                      >
                        {grocery.purchased
                          ? "✅ Purchased"
                          : "⏳ Mark Purchased"}
                      </button>
                    </td>

                    {/* DELETE BUTTON */}

                    <td style={cellStyle}>
                      <button
                        onClick={() =>
                          deleteGrocery(
                            grocery.id
                          )
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

export default Grocery;