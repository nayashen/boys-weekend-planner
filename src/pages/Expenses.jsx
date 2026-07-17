import { useState } from "react";
import { useTrip } from "../context/TripContext";

function Expenses() {
  const { expenses, addExpense, deleteExpense } =
    useTrip();

  const [expense, setExpense] = useState({
    name: "",
    category: "",
    amount: "",
    notes: "",
  });

  function handleChange(event) {
    setExpense({
      ...expense,
      [event.target.name]: event.target.value,
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    addExpense({
      name: expense.name,
      category: expense.category,
      amount: Number(expense.amount),
      notes: expense.notes,
    });

    setExpense({
      name: "",
      category: "",
      amount: "",
      notes: "",
    });
  }

  const totalExpenses = expenses.reduce(
    (sum, expense) =>
      sum + Number(expense.amount),
    0
  );

  return (
    <div style={{ padding: "30px" }}>
      <h1>🧾 Other Trip Expenses</h1>

      <div
        style={{
          background: "white",
          padding: "25px",
          borderRadius: "10px",
          marginTop: "20px",
          marginBottom: "30px",
          boxShadow:
            "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <h2>Add Expense</h2>

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
            placeholder="Expense Name"
            value={expense.name}
            onChange={handleChange}
            required
            style={{ padding: "12px" }}
          />

          <input
            name="category"
            placeholder="Category (Fuel, Activities, Food, Other)"
            value={expense.category}
            onChange={handleChange}
            required
            style={{ padding: "12px" }}
          />

          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={expense.amount}
            onChange={handleChange}
            required
            style={{ padding: "12px" }}
          />

          <textarea
            name="notes"
            placeholder="Notes"
            value={expense.notes}
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
            + Add Expense
          </button>
        </form>
      </div>

      <div
        style={{
          background: "white",
          padding: "25px",
          borderRadius: "10px",
          boxShadow:
            "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <h2>
          Total Other Expenses: R
          {totalExpenses.toFixed(2)}
        </h2>

        {expenses.length === 0 ? (
          <p>No expenses added yet.</p>
        ) : (
          expenses.map((expense) => (
            <div
              key={expense.id}
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                padding: "15px 0",
                borderBottom:
                  "1px solid #eee",
              }}
            >
              <div>
                <strong>
                  {expense.name}
                </strong>

                <p>
                  Category:{" "}
                  {expense.category}
                </p>

                {expense.notes && (
                  <p>{expense.notes}</p>
                )}
              </div>

              <div>
                <strong>
                  R
                  {Number(
                    expense.amount
                  ).toFixed(2)}
                </strong>

                <br />

                <button
                  onClick={() =>
                    deleteExpense(
                      expense.id
                    )
                  }
                  style={{
                    marginTop: "8px",
                    padding: "6px 10px",
                    backgroundColor:
                      "#ef4444",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Expenses;