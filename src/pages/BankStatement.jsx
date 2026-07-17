import { useState } from "react";
import Papa from "papaparse";
import { useTrip } from "../context/TripContext";

function BankStatement() {
  const {
    transactions,
    members,
    payments,
    addTransactions,
    addPayment,
    updateTransaction,
    deleteTransaction,
  } = useTrip();

  const [date, setDate] = useState("");
  const [description, setDescription] =
    useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] =
    useState("credit");
  const [category, setCategory] =
    useState("Other");

  // =========================
  // VALID TRANSACTIONS
  // =========================

  const validTransactions =
    transactions.filter(
      (transaction) =>
        transaction &&
        transaction.date &&
        transaction.description &&
        Number.isFinite(
          Number(transaction.amount)
        ) &&
        Number(transaction.amount) > 0 &&
        (
          transaction.type === "credit" ||
          transaction.type === "debit"
        )
    );

  // =========================
  // MANUAL TRANSACTION
  // =========================

  function handleSubmit(e) {
    e.preventDefault();

    if (
      !date ||
      !description ||
      !amount
    ) {
      alert(
        "Please complete all fields"
      );
      return;
    }

    addTransactions([
      {
        date,
        description,
        amount: Math.abs(
          Number(amount)
        ),
        type,
        category,
        status: "unmatched",
        memberId: null,
        memberName: "",
        paymentCreated: false,
      },
    ]);

    setDate("");
    setDescription("");
    setAmount("");
    setType("credit");
    setCategory("Other");
  }

  // =========================
  // CSV UPLOAD
  // =========================

  function handleCSVUpload(e) {
    const file =
      e.target.files[0];

    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,

      complete: (results) => {
        const importedTransactions =
          results.data
            .map((row) => {
              const dateValue =
                row.Date ||
                row.date ||
                row.DATE ||
                "";

              const descriptionValue =
                row.Description ||
                row.description ||
                row.Details ||
                row.details ||
                row.Reference ||
                row.reference ||
                "";

              const creditValue =
                row.Credit ||
                row.credit ||
                row.CREDIT ||
                "";

              const debitValue =
                row.Debit ||
                row.debit ||
                row.DEBIT ||
                "";

              let transactionType =
                "";

              let rawAmount =
                "";

              if (
                creditValue !== "" &&
                creditValue !== null &&
                creditValue !==
                  undefined
              ) {
                transactionType =
                  "credit";

                rawAmount =
                  creditValue;
              } else if (
                debitValue !== "" &&
                debitValue !== null &&
                debitValue !==
                  undefined
              ) {
                transactionType =
                  "debit";

                rawAmount =
                  debitValue;
              }

              const cleanedAmount =
                String(rawAmount)
                  .replace(
                    /R/gi,
                    ""
                  )
                  .replace(
                    /\s/g,
                    ""
                  )
                  .replace(
                    /,/g,
                    ""
                  )
                  .replace(
                    /[()]/g,
                    ""
                  )
                  .trim();

              const numericAmount =
                Number(
                  cleanedAmount
                );

              if (
                !dateValue ||
                !descriptionValue ||
                !transactionType ||
                !Number.isFinite(
                  numericAmount
                ) ||
                numericAmount ===
                  0
              ) {
                return null;
              }

              return {
                date: String(
                  dateValue
                ).trim(),

                description:
                  String(
                    descriptionValue
                  ).trim(),

                amount: Math.abs(
                  numericAmount
                ),

                type:
                  transactionType,

                category:
                  transactionType ===
                  "credit"
                    ? "Member Contribution"
                    : "Other",

                status:
                  "unmatched",

                memberId: null,

                memberName: "",

                paymentCreated:
                  false,
              };
            })
            .filter(Boolean);

        if (
          importedTransactions.length ===
          0
        ) {
          alert(
            "No valid transactions found."
          );

          return;
        }

        addTransactions(
          importedTransactions
        );

        alert(
          `${importedTransactions.length} transactions imported successfully.`
        );
      },

      error: (error) => {
        alert(
          "Error reading CSV file: " +
            error.message
        );
      },
    });

    e.target.value = "";
  }

  // =========================
  // MATCH TRANSACTION TO MEMBER
  // =========================

  function matchTransaction(
    transaction,
    memberId
  ) {
    if (!memberId) return;

    const selectedMember =
      members.find(
        (member) =>
          String(member.id) ===
          String(memberId)
      );

    if (!selectedMember) {
      alert(
        "Member could not be found."
      );

      return;
    }

    // Prevent duplicate payment
    const existingPayment =
      payments.find(
        (payment) =>
          String(
            payment.transactionId
          ) ===
          String(transaction.id)
      );

    // =========================
    // CREATE CONTRIBUTION
    // =========================

    if (
      transaction.type ===
        "credit" &&
      !existingPayment
    ) {
      const dateObject =
        new Date(
          transaction.date
        );

      const contributionMonth =
        dateObject.toLocaleDateString(
          "en-US",
          {
            month: "long",
            year: "numeric",
          }
        );

      const newPayment = {
        memberId:
          selectedMember.id,

        member:
          selectedMember.name,

        memberName:
          selectedMember.name,

        amount:
          Number(
            transaction.amount
          ),

        contributionMonth,

        date:
          transaction.date,

        description:
          transaction.description,

        transactionId:
          transaction.id,

        category:
          "Member Contribution",

        type:
          "credit",
      };

      addPayment(
        newPayment
      );
    }

    // =========================
    // UPDATE TRANSACTION
    // =========================

    updateTransaction({
      ...transaction,

      memberId:
        selectedMember.id,

      memberName:
        selectedMember.name,

      status:
        "matched",

      paymentCreated:
        true,
    });
  }

  return (
    <div
      style={{
        padding: "30px",
        maxWidth: "1400px",
        margin: "0 auto",
      }}
    >
      <h1>
        🏦 Bank Statement
      </h1>

      <p
        style={{
          color: "#666",
          marginBottom:
            "30px",
        }}
      >
        Import and manage bank
        transactions.
      </p>

      {/* CSV UPLOAD */}

      <div
        style={cardStyle}
      >
        <h2>
          📂 Import Bank Statement
        </h2>

        <p
          style={{
            color: "#666",
          }}
        >
          Upload a CSV bank
          statement to automatically
          import transactions.
        </p>

        <input
          type="file"
          accept=".csv"
          onChange={
            handleCSVUpload
          }
          style={{
            marginTop:
              "10px",
          }}
        />

        <p
          style={{
            fontSize:
              "13px",
            color:
              "#888",
            marginTop:
              "15px",
          }}
        >
          Supported columns:
          Date, Description,
          Credit, Debit
        </p>
      </div>

      {/* MANUAL TRANSACTION */}

      <div
        style={cardStyle}
      >
        <h2>
          ➕ Add Transaction
          Manually
        </h2>

        <form
          onSubmit={
            handleSubmit
          }
          style={{
            display:
              "grid",
            gridTemplateColumns:
              "1fr 2fr 1fr 1fr 1fr auto",
            gap:
              "12px",
            alignItems:
              "end",
          }}
        >
          <div>
            <label>
              Date
            </label>

            <input
              type="date"
              value={
                date
              }
              onChange={(e) =>
                setDate(
                  e.target
                        .value
                )
              }
              style={
                inputStyle
              }
              required
            />
          </div>

          <div>
            <label>
              Description
            </label>

            <input
              type="text"
              placeholder="Example: John payment"
              value={
                description
              }
              onChange={(e) =>
                setDescription(
                  e.target
                    .value
                )
              }
              style={
                inputStyle
              }
              required
            />
          </div>

          <div>
            <label>
              Amount
            </label>

            <input
              type="number"
              placeholder="500"
              value={
                amount
              }
              onChange={(e) =>
                setAmount(
                  e.target
                    .value
                )
              }
              style={
                inputStyle
              }
              required
              min="0"
            />
          </div>

          <div>
            <label>
              Type
            </label>

            <select
              value={
                type
              }
              onChange={(e) =>
                setType(
                  e.target
                    .value
                )
              }
              style={
                inputStyle
              }
            >
              <option value="credit">
                Credit
              </option>

              <option value="debit">
                Debit
              </option>
            </select>
          </div>

          <div>
            <label>
              Category
            </label>

            <select
              value={
                category
              }
              onChange={(e) =>
                setCategory(
                  e.target
                    .value
                )
              }
              style={
                inputStyle
              }
            >
              <option value="Other">
                Other
              </option>

              <option value="Member Contribution">
                Member Contribution
              </option>

              <option value="Accommodation">
                Accommodation
              </option>

              <option value="Groceries">
                Groceries
              </option>

              <option value="Drinks">
                Drinks
              </option>

              <option value="Transport">
                Transport
              </option>
            </select>
          </div>

          <button
            type="submit"
            style={
              buttonStyle
            }
          >
            Add
          </button>
        </form>
      </div>

      {/* TRANSACTIONS */}

      <div
        style={{
          ...cardStyle,
          overflowX:
            "auto",
        }}
      >
        <h2>
          Transactions
        </h2>

        {validTransactions.length ===
        0 ? (
          <p
            style={{
              color:
                "#777",
              marginTop:
                "20px",
            }}
          >
            No transactions
            added yet.
          </p>
        ) : (
          <table
            style={{
              width:
                "100%",
              borderCollapse:
                "collapse",
              marginTop:
                "20px",
              minWidth:
                "1200px",
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
                  Category
                </th>

                <th
                  style={
                    cellStyle
                  }
                >
                  Match Member
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
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {validTransactions.map(
                (
                  transaction
                ) => (
                  <tr
                    key={
                      transaction.id
                    }
                    style={{
                      borderBottom:
                        "1px solid #eee",
                    }}
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
                        color:
                          transaction.type ===
                          "credit"
                            ? "#059669"
                            : "#dc2626",
                        fontWeight:
                          "bold",
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
                      📦{" "}
                      {
                        transaction.category ||
                        "Other"
                      }
                    </td>

                    <td
                      style={
                        cellStyle
                      }
                    >
                      {transaction.status ===
                      "matched" ? (
                        <strong
                          style={{
                            color:
                              "#059669",
                          }}
                        >
                          {
                            transaction.memberName
                          }
                        </strong>
                      ) : (
                        <select
                          value={
                            transaction.memberId ||
                            ""
                          }
                          onChange={(
                            e
                          ) =>
                            matchTransaction(
                              transaction,
                              e
                                .target
                                .value
                            )
                          }
                          style={{
                            padding:
                              "8px",
                            borderRadius:
                              "6px",
                            border:
                              "1px solid #d1d5db",
                          }}
                        >
                          <option value="">
                            Select member
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
                      )}
                    </td>

                    <td
                      style={
                        cellStyle
                      }
                    >
                      <span
                        style={{
                          padding:
                            "5px 10px",
                          borderRadius:
                            "20px",
                          background:
                            transaction.status ===
                            "matched"
                              ? "#dcfce7"
                              : "#fef3c7",
                          color:
                            transaction.status ===
                            "matched"
                              ? "#166534"
                              : "#92400e",
                        }}
                      >
                        {
                          transaction.status
                        }
                      </span>
                    </td>

                    <td
                      style={
                        cellStyle
                      }
                    >
                      <button
                        onClick={() =>
                          deleteTransaction(
                            transaction.id
                          )
                        }
                        style={{
                          background:
                            "#ef4444",
                          color:
                            "white",
                          border:
                            "none",
                          padding:
                            "7px 12px",
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
    </div>
  );
}

const cardStyle = {
  background:
    "white",
  padding:
    "25px",
  borderRadius:
    "12px",
  marginBottom:
    "30px",
  boxShadow:
    "0 2px 8px rgba(0,0,0,0.08)",
};

const inputStyle = {
  width:
    "100%",
  padding:
    "10px",
  marginTop:
    "6px",
  border:
    "1px solid #d1d5db",
  borderRadius:
    "6px",
  boxSizing:
    "border-box",
};

const buttonStyle = {
  background:
    "#2563eb",
  color:
    "white",
  border:
    "none",
  padding:
    "11px 18px",
  borderRadius:
    "6px",
  cursor:
    "pointer",
  fontWeight:
    "bold",
};

const cellStyle = {
  padding:
    "12px",
};

export default BankStatement;