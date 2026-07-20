import { useState } from "react";
import Papa from "papaparse";

import { useTrip } from "../context/TripContext";
import { useUserRole } from "../hooks/useUserRole";

function Finance() {
  const {
    members,
    payments,
    transactions,

    addPayment,
    deletePayment,

    addTransaction,
    deleteTransaction,

    linkTransactionToPayment,
  } = useTrip();

  const { isAdmin, loading } =
    useUserRole();

  // =====================================================
  // MANUAL PAYMENT FORM
  // =====================================================

  const [payment, setPayment] =
    useState({
      memberId: "",
      amount: "",
      contributionMonth: "",
      date: "",
    });

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div
        style={{
          padding: "30px",
        }}
      >
        <h2>
          Loading Finance...
        </h2>
      </div>
    );
  }

  // =====================================================
  // FORM CHANGES
  // =====================================================

  function handleChange(event) {
    setPayment({
      ...payment,
      [event.target.name]:
        event.target.value,
    });
  }

  // =====================================================
  // MANUAL PAYMENT
  // =====================================================

  async function handleSubmit(event) {
    event.preventDefault();

    if (!isAdmin) return;

    const selectedMember =
      members.find(
        (member) =>
          String(member.id) ===
          String(payment.memberId)
      );

    if (!selectedMember) {
      alert(
        "Please select a member."
      );

      return;
    }

    const newPayment =
      await addPayment({
        memberId:
          selectedMember.id,

        amount:
          Number(payment.amount),

        contributionMonth:
          payment.contributionMonth,

        date:
          payment.date,
      });

    if (!newPayment) {
      return;
    }

    setPayment({
      memberId: "",
      amount: "",
      contributionMonth: "",
      date: "",
    });

    alert(
      "Payment recorded successfully."
    );
  }

  // =====================================================
  // DELETE PAYMENT
  // =====================================================

  async function handleDeletePayment(
    paymentId
  ) {
    if (!isAdmin) return;

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this payment?"
      );

    if (!confirmed) return;

    const success =
      await deletePayment(
        paymentId
      );

    if (success) {
      alert(
        "Payment deleted successfully."
      );
    }
  }

  // =====================================================
  // AUTOMATIC MEMBER MATCHING
  // =====================================================

  function findMatchingMember(
    description
  ) {
    const descriptionText =
      String(
        description || ""
      ).toLowerCase();

    return members.find(
      (member) => {
        const memberName =
          String(
            member.name || ""
          )
            .toLowerCase()
            .trim();

        if (!memberName) {
          return false;
        }

        const nameParts =
          memberName.split(
            /\s+/
          );

        // FULL NAME MATCH
        if (
          nameParts.length > 1 &&
          descriptionText.includes(
            memberName
          )
        ) {
          return true;
        }

        // FIRST NAME MATCH
        const firstName =
          nameParts[0];

        if (
          firstName.length >= 3 &&
          descriptionText.includes(
            firstName
          )
        ) {
          return true;
        }

        // LAST NAME MATCH
        const lastName =
          nameParts[
            nameParts.length - 1
          ];

        if (
          lastName.length >= 3 &&
          descriptionText.includes(
            lastName
          )
        ) {
          return true;
        }

        return false;
      }
    );
  }

  // =====================================================
  // CREATE UNIQUE TRANSACTION KEY
  // =====================================================

  function createTransactionKey(
    date,
    description,
    amount
  ) {
    return [
      date,
      description
        .trim()
        .toLowerCase(),
      Number(amount),
    ].join("|");
  }

  // =====================================================
  // DUPLICATE PROTECTION
  // =====================================================

  function transactionAlreadyImported(
    transactionKey
  ) {
    return transactions.some(
      (transaction) =>
        transaction.transaction_key ===
        transactionKey
    );
  }

  // =====================================================
  // CSV IMPORT
  // =====================================================

  function handleFileUpload(
    event
  ) {
    if (!isAdmin) return;

    const file =
      event.target.files[0];

    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,

      complete: async (
        results
      ) => {
        let importedCount = 0;

        let matchedCount = 0;

        let duplicateCount = 0;

        let failedCount = 0;

        for (
          const row of results.data
        ) {
          const date =
            String(
              row.Date || ""
            ).trim();

          const description =
            String(
              row.Description ||
                ""
            ).trim();

          const credit =
            Number(
              String(
                row.Credit ||
                  ""
              ).replace(
                /[^0-9.-]/g,
                ""
              )
            ) || 0;

          const debit =
            Number(
              String(
                row.Debit ||
                  ""
              ).replace(
                /[^0-9.-]/g,
                ""
              )
            ) || 0;

          const amount =
            credit > 0
              ? credit
              : debit;

          const type =
            credit > 0
              ? "credit"
              : "debit";

          // IGNORE EMPTY ROWS
          if (
            !date ||
            !description ||
            amount <= 0
          ) {
            continue;
          }

          // UNIQUE TRANSACTION KEY
          const transactionKey =
            createTransactionKey(
              date,
              description,
              amount
            );

          // DUPLICATE CHECK
          if (
            transactionAlreadyImported(
              transactionKey
            )
          ) {
            duplicateCount++;

            continue;
          }

          // MATCH MEMBER ONLY FOR CREDITS
          const matchedMember =
            type === "credit"
              ? findMatchingMember(
                  description
                )
              : null;

          // CREATE TRANSACTION OBJECT
          const transaction = {
            date,

            description,

            amount,

            type,

            memberId:
              matchedMember
                ? matchedMember.id
                : "",

            member:
              matchedMember
                ? matchedMember.name
                : "",

            status:
              matchedMember
                ? "matched"
                : "unmatched",

            transactionKey,
          };

          // SAVE TRANSACTION TO SUPABASE
          const savedTransaction =
            await addTransaction(
              transaction
            );

          if (
            !savedTransaction
          ) {
            failedCount++;

            continue;
          }

          importedCount++;

          // =====================================================
          // AUTOMATIC PAYMENT CREATION
          // =====================================================

          if (
            matchedMember &&
            type === "credit"
          ) {
            const newPayment =
              await addPayment({
                memberId:
                  matchedMember.id,

                amount,

                contributionMonth:
                  date.substring(
                    0,
                    7
                  ),

                date,
              });

            if (
              newPayment
            ) {
              await linkTransactionToPayment(
                savedTransaction.id,
                newPayment.id
              );

              matchedCount++;
            }
          }
        }

        alert(
          `Import complete!\n\n` +

            `Transactions imported: ${importedCount}\n` +

            `Payments automatically matched: ${matchedCount}\n` +

            `Duplicates skipped: ${duplicateCount}\n` +

            `Failed: ${failedCount}`
        );
      },
    });

    event.target.value = "";
  }

  // =====================================================
  // DELETE TRANSACTION
  // =====================================================

  async function handleDeleteTransaction(
    transactionId
  ) {
    if (!isAdmin) return;

    const confirmed =
      window.confirm(
        "Delete this bank transaction?"
      );

    if (!confirmed) return;

    const success =
      await deleteTransaction(
        transactionId
      );

    if (success) {
      alert(
        "Transaction deleted successfully."
      );
    }
  }

  // =====================================================
  // SUMMARY
  // =====================================================

  const totalPaid =
    payments.reduce(
      (
        sum,
        payment
      ) =>
        sum +
        Number(
          payment.amount || 0
        ),
      0
    );

  const totalCredits =
    transactions
      .filter(
        (transaction) =>
          transaction.type ===
          "credit"
      )
      .reduce(
        (
          sum,
          transaction
        ) =>
          sum +
          Number(
            transaction.amount ||
              0
          ),
        0
      );

  const totalDebits =
    transactions
      .filter(
        (transaction) =>
          transaction.type ===
          "debit"
      )
      .reduce(
        (
          sum,
          transaction
        ) =>
          sum +
          Number(
            transaction.amount ||
              0
          ),
        0
      );

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div
      style={{
        padding: "30px",
      }}
    >
      <h1>
        💰 Finance
      </h1>

      {!isAdmin && (
        <div
          style={{
            background:
              "#dbeafe",

            color:
              "#1e40af",

            padding:
              "15px",

            borderRadius:
              "8px",

            marginBottom:
              "25px",
          }}
        >
          👁️ You are viewing
          financial information
          in read-only mode.
        </div>
      )}

      {/* =====================================================
          SUMMARY CARDS
      ===================================================== */}

      <div
        style={{
          display:
            "grid",

          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",

          gap:
            "20px",

          marginTop:
            "20px",

          marginBottom:
            "30px",
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

      {/* =====================================================
          BANK STATEMENT IMPORT
      ===================================================== */}

      {isAdmin && (
        <div
          style={{
            background:
              "white",

            padding:
              "25px",

            borderRadius:
              "10px",

            marginBottom:
              "30px",

            boxShadow:
              "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h2>
            📄 Import Bank Statement
          </h2>

          <p>
            Upload a CSV bank
            statement.
          </p>

          <p>
            The system will:
          </p>

          <ul>
            <li>
              Automatically match
              credits to members
            </li>

            <li>
              Create a payment
              automatically
            </li>

            <li>
              Link the payment to
              the bank transaction
            </li>

            <li>
              Prevent duplicate
              imports
            </li>
          </ul>

          <p>
            <strong>
              Required CSV format:
            </strong>
          </p>

          <p>
            Date,Description,Credit,Debit
          </p>

          <input
            type="file"
            accept=".csv"
            onChange={
              handleFileUpload
            }
          />
        </div>
      )}

      {/* =====================================================
          BANK TRANSACTIONS
      ===================================================== */}

      <div
        style={{
          background:
            "white",

          padding:
            "25px",

          borderRadius:
            "10px",

          marginBottom:
            "30px",

          boxShadow:
            "0 2px 8px rgba(0,0,0,0.1)",

          overflowX:
            "auto",
        }}
      >
        <h2>
          🏦 Bank Transactions
        </h2>

        {transactions.length ===
        0 ? (
          <p>
            No bank transactions
            imported yet.
          </p>
        ) : (
          <table
            style={{
              width:
                "100%",

              borderCollapse:
                "collapse",

              minWidth:
                "950px",
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
                <th
                  style={
                    cellStyle
                  }
                >
                  Date
                </th>

                <th
                  style={
                    cellStyle
                  }
                >
                  Description
                </th>

                <th
                  style={
                    cellStyle
                  }
                >
                  Amount
                </th>

                <th
                  style={
                    cellStyle
                  }
                >
                  Type
                </th>

                <th
                  style={
                    cellStyle
                  }
                >
                  Member
                </th>

                <th
                  style={
                    cellStyle
                  }
                >
                  Status
                </th>

                <th
                  style={
                    cellStyle
                  }
                >
                  Payment
                </th>

                {isAdmin && (
                  <th
                    style={
                      cellStyle
                    }
                  >
                    Action
                  </th>
                )}
              </tr>
            </thead>

            <tbody>
              {transactions.map(
                (
                  transaction
                ) => (
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
                      {transaction.member ||
                        "Unmatched"}
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
                      {transaction.payment_id ? (
                        <span
                          style={{
                            color:
                              "#059669",

                            fontWeight:
                              "bold",
                          }}
                        >
                          💳 Created
                        </span>
                      ) : (
                        <span
                          style={{
                            color:
                              "#6b7280",
                          }}
                        >
                          —
                        </span>
                      )}
                    </td>

                    {isAdmin && (
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
                    )}
                  </tr>
                )
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* =====================================================
          MANUAL PAYMENT
      ===================================================== */}

      {isAdmin && (
        <div
          style={{
            background:
              "white",

            padding:
              "25px",

            borderRadius:
              "10px",

            marginBottom:
              "30px",

            boxShadow:
              "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h2>
            👤 Record Manual Member Contribution
          </h2>

          <form
            onSubmit={
              handleSubmit
            }
            style={{
              display:
                "grid",

              gridTemplateColumns:
                "repeat(auto-fit, minmax(200px, 1fr))",

              gap:
                "15px",
            }}
          >
            <select
              name="memberId"
              value={
                payment.memberId
              }
              onChange={
                handleChange
              }
              required
              style={
                inputStyle
              }
            >
              <option value="">
                Select Member
              </option>

              {members.map(
                (
                  member
                ) => (
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

            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={
                payment.amount
              }
              onChange={
                handleChange
              }
              required
              min="0"
              style={
                inputStyle
              }
            />

            <input
              type="month"
              name="contributionMonth"
              value={
                payment.contributionMonth
              }
              onChange={
                handleChange
              }
              required
              style={
                inputStyle
              }
            />

            <input
              type="date"
              name="date"
              value={
                payment.date
              }
              onChange={
                handleChange
              }
              required
              style={
                inputStyle
              }
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
      )}

      {/* =====================================================
          PAYMENT HISTORY
      ===================================================== */}

      <div
        style={{
          background:
            "white",

          padding:
            "25px",

          borderRadius:
            "10px",

          boxShadow:
            "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <h2>
          💳 Payment History
        </h2>

        {payments.length ===
        0 ? (
          <p>
            No payments recorded.
          </p>
        ) : (
          payments.map(
            (
              payment
            ) => (
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
                    Member ID:{" "}
                    {
                      payment.member_id
                    }
                  </strong>

                  <br />

                  R
                  {Number(
                    payment.amount
                  ).toLocaleString()}

                  {" • "}

                  {
                    payment.contribution_month
                  }

                  {" • Paid on "}

                  {
                    payment.date
                  }
                </div>

                {isAdmin && (
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
                )}
              </div>
            )
          )
        )}
      </div>
    </div>
  );
}

// =====================================================
// SUMMARY CARD
// =====================================================

function SummaryCard({
  title,
  value,
}) {
  return (
    <div
      style={{
        background:
          "white",

        padding:
          "20px",

        borderRadius:
          "10px",

        boxShadow:
          "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <h3
        style={{
          color:
            "#6b7280",
        }}
      >
        {title}
      </h3>

      <h2>
        {value}
      </h2>
    </div>
  );
}

// =====================================================
// STYLES
// =====================================================

const inputStyle = {
  padding:
    "12px",

  borderRadius:
    "6px",

  border:
    "1px solid #ccc",
};

const cellStyle = {
  padding:
    "14px",

  borderBottom:
    "1px solid #e5e7eb",
};

export default Finance;