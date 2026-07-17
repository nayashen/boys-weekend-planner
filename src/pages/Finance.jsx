import { useState } from "react";
import Papa from "papaparse";
import { useTrip } from "../context/TripContext";

function Finance() {
  const {
    members,
    payments,
    transactions,
    addPayment,
    deletePayment,
    addTransaction,
    deleteTransaction,
    updateTransaction,
  } = useTrip();

  const [payment, setPayment] = useState({
    memberId: "",
    amount: "",
    contributionMonth: "",
    date: "",
  });

  // =========================
  // MANUAL PAYMENT
  // =========================

  function handleChange(event) {
    setPayment({
      ...payment,
      [event.target.name]: event.target.value,
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    const selectedMember = members.find(
      (member) =>
        String(member.id) ===
        String(payment.memberId)
    );

    if (!selectedMember) {
      alert("Please select a member.");
      return;
    }

    addPayment({
      memberId: selectedMember.id,
      member: selectedMember.name,
      amount: Number(payment.amount),
      contributionMonth:
        payment.contributionMonth,
      date: payment.date,
      category: "Member Contribution",
      type: "credit",
    });

    setPayment({
      memberId: "",
      amount: "",
      contributionMonth: "",
      date: "",
    });
  }

  function handleDeletePayment(paymentId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this payment?"
    );

    if (confirmed) {
      deletePayment(paymentId);
    }
  }

  // =========================
  // CSV IMPORT
  // =========================

  function handleFileUpload(event) {
    const file = event.target.files[0];

    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,

      complete: (results) => {
        const newTransactions =
          results.data.map((row) => {
            const credit = Number(
              String(row.Credit || "")
                .replace(/[^0-9.-]/g, "")
            ) || 0;

            const debit = Number(
              String(row.Debit || "")
                .replace(/[^0-9.-]/g, "")
            ) || 0;

            const amount =
              credit > 0 ? credit : debit;

            const type =
              credit > 0
                ? "credit"
                : "debit";

            return {
              date: row.Date || "",
              description:
                row.Description || "",
              amount,
              type,
              memberId: "",
              member: "",
              status: "unmatched",
            };
          });

        newTransactions.forEach(
          (transaction) => {
            addTransaction(transaction);
          }
        );
      },
    });

    // Allows the same file to be uploaded again
    event.target.value = "";
  }

  // =========================
  // MATCH TRANSACTION TO MEMBER
  // =========================

  function handleMatchMember(
    transaction,
    memberId
  ) {
    const selectedMember = members.find(
      (member) =>
        String(member.id) ===
        String(memberId)
    );

    if (!selectedMember) return;

    updateTransaction({
      ...transaction,

      memberId:
        selectedMember.id,

      member:
        selectedMember.name,

      status: "matched",
    });
  }

  // =========================
  // DELETE TRANSACTION
  // =========================

  function handleDeleteTransaction(
    transactionId
  ) {
    const confirmed = window.confirm(
      "Delete this bank transaction?"
    );

    if (confirmed) {
      deleteTransaction(transactionId);
    }
  }

  // =========================
  // SUMMARY
  // =========================

  const totalPaid = payments.reduce(
    (sum, payment) =>
      sum +
      Number(payment.amount || 0),
    0
  );

  const totalCredits = transactions
    .filter(
      (transaction) =>
        transaction.type === "credit"
    )
    .reduce(
      (sum, transaction) =>
        sum +
        Number(transaction.amount || 0),
      0
    );

  const totalDebits = transactions
    .filter(
      (transaction) =>
        transaction.type === "debit"
    )
    .reduce(
      (sum, transaction) =>
        sum +
        Number(transaction.amount || 0),
      0
    );

  return (
    <div style={{ padding: "30px" }}>
      <h1>💰 Finance</h1>

      {/* SUMMARY */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          marginTop: "20px",
          marginBottom: "30px",
        }}
      >
        <SummaryCard
          title="Member Contributions"
          value={`R${totalPaid.toLocaleString()}`}
        />

        <SummaryCard
          title="Money Received"
          value={`R${totalCredits.toLocaleString()}`}
        />

        <SummaryCard
          title="Money Spent"
          value={`R${totalDebits.toLocaleString()}`}
        />
      </div>

      {/* BANK STATEMENT IMPORT */}
      <div
        style={{
          background: "white",
          padding: "25px",
          borderRadius: "10px",
          marginBottom: "30px",
          boxShadow:
            "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <h2>📄 Import Bank Statement</h2>

        <p>
          CSV format:
        </p>

        <p>
          <strong>
            Date,Description,Credit,Debit
          </strong>
        </p>

        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
        />
      </div>

      {/* BANK TRANSACTIONS */}
      <div
        style={{
          background: "white",
          padding: "25px",
          borderRadius: "10px",
          marginBottom: "30px",
          boxShadow:
            "0 2px 8px rgba(0,0,0,0.1)",
          overflowX: "auto",
        }}
      >
        <h2>🏦 Bank Transactions</h2>

        {transactions.length === 0 ? (
          <p>
            No bank transactions imported yet.
          </p>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse:
                "collapse",
              minWidth: "900px",
            }}
          >
            <thead>
              <tr
                style={{
                  background:
                    "#f3f4f6",
                  textAlign:
                    "left",
                }}
              >
                <th style={cellStyle}>
                  Date
                </th>

                <th style={cellStyle}>
                  Description
                </th>

                <th style={cellStyle}>
                  Amount
                </th>

                <th style={cellStyle}>
                  Type
                </th>

                <th style={cellStyle}>
                  Match Member
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
              {transactions.map(
                (transaction) => (
                  <tr
                    key={
                      transaction.id
                    }
                  >
                    <td
                      style={
                        cellStyle
                      }
                    >
                      {
                        transaction.date
                      }
                    </td>

                    <td
                      style={
                        cellStyle
                      }
                    >
                      {
                        transaction.description
                      }
                    </td>

                    <td
                      style={{
                        ...cellStyle,
                        fontWeight:
                          "bold",
                        color:
                          transaction.type ===
                          "credit"
                            ? "#059669"
                            : "#dc2626",
                      }}
                    >
                      {transaction.type ===
                      "credit"
                        ? "+"
                        : "-"}
                      R
                      {Number(
                        transaction.amount
                      ).toLocaleString()}
                    </td>

                    <td
                      style={
                        cellStyle
                      }
                    >
                      {
                        transaction.type
                      }
                    </td>

                    <td
                      style={
                        cellStyle
                      }
                    >
                      <select
                        value={
                          transaction.memberId ||
                          ""
                        }
                        onChange={(event) =>
                          handleMatchMember(
                            transaction,
                            event.target.value
                          )
                        }
                        style={{
                          padding:
                            "8px",
                        }}
                      >
                        <option value="">
                          Select member
                        </option>

                        {members.map(
                          (member) => (
                            <option
                              key={
                                member.id
                              }
                              value={
                                member.id
                              }
                            >
                              {
                                member.name
                              }
                            </option>
                          )
                        )}
                      </select>
                    </td>

                    <td
                      style={
                        cellStyle
                      }
                    >
                      {transaction.status ===
                      "matched" ? (
                        <span
                          style={{
                            color:
                              "#059669",
                            fontWeight:
                              "bold",
                          }}
                        >
                          ✅ Matched
                        </span>
                      ) : (
                        <span
                          style={{
                            color:
                              "#d97706",
                          }}
                        >
                          ⚠️ Unmatched
                        </span>
                      )}
                    </td>

                    <td
                      style={
                        cellStyle
                      }
                    >
                      <button
                        onClick={() =>
                          handleDeleteTransaction(
                            transaction.id
                          )
                        }
                        style={{
                          padding:
                            "8px 12px",
                          backgroundColor:
                            "#dc2626",
                          color:
                            "white",
                          border:
                            "none",
                          borderRadius:
                            "6px",
                          cursor:
                            "pointer",
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* MANUAL PAYMENT */}
      <div
        style={{
          background: "white",
          padding: "25px",
          borderRadius: "10px",
          marginBottom: "30px",
          boxShadow:
            "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <h2>
          👤 Record Manual Member Contribution
        </h2>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "15px",
          }}
        >
          <select
            name="memberId"
            value={
              payment.memberId
            }
            onChange={handleChange}
            required
            style={inputStyle}
          >
            <option value="">
              Select Member
            </option>

            {members.map(
              (member) => (
                <option
                  key={member.id}
                  value={member.id}
                >
                  {member.name}
                </option>
              )
            )}
          </select>

          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={
              payment.amount
            }
            onChange={handleChange}
            required
            min="0"
            style={inputStyle}
          />

          <input
            type="month"
            name="contributionMonth"
            value={
              payment.contributionMonth
            }
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <input
            type="date"
            name="date"
            value={
              payment.date
            }
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <button
            type="submit"
            style={{
              padding:
                "12px 20px",
              backgroundColor:
                "#2563eb",
              color:
                "white",
              border:
                "none",
              borderRadius:
                "8px",
              cursor:
                "pointer",
            }}
          >
            + Record Contribution
          </button>
        </form>
      </div>

      {/* PAYMENT HISTORY */}
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
          💳 Manual Payment History
        </h2>

        {payments.length === 0 ? (
          <p>
            No manual payments recorded.
          </p>
        ) : (
          payments.map(
            (payment) => (
              <div
                key={
                  payment.id
                }
                style={{
                  display:
                    "flex",
                  justifyContent:
                    "space-between",
                  alignItems:
                    "center",
                  padding:
                    "15px 0",
                  borderBottom:
                    "1px solid #eee",
                }}
              >
                <div>
                  <strong>
                    {
                      payment.member
                    }
                  </strong>

                  <br />

                  R
                  {Number(
                    payment.amount
                  ).toLocaleString()}

                  {" • "}

                  {
                    payment.contributionMonth
                  }

                  {" • Paid on "}

                  {
                    payment.date
                  }
                </div>

                <button
                  onClick={() =>
                    handleDeletePayment(
                      payment.id
                    )
                  }
                  style={{
                    padding:
                      "8px 12px",
                    backgroundColor:
                      "#dc2626",
                    color:
                      "white",
                    border:
                      "none",
                    borderRadius:
                      "6px",
                    cursor:
                      "pointer",
                  }}
                >
                  Delete
                </button>
              </div>
            )
          )
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
        padding: "20px",
        borderRadius: "10px",
        boxShadow:
          "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <h3
        style={{
          color: "#6b7280",
        }}
      >
        {title}
      </h3>

      <h2>{value}</h2>
    </div>
  );
}

const inputStyle = {
  padding: "12px",
  borderRadius: "6px",
  border: "1px solid #ccc",
};

const cellStyle = {
  padding: "14px",
  borderBottom:
    "1px solid #e5e7eb",
};

export default Finance;