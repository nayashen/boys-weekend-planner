import { useTrip } from "../context/TripContext";

function Dashboard() {
  const {
    members = [],
    payments = [],
    transactions = [],
    tripSettings = {},
    accommodation = [],
    selectedAccommodation,
    groceries = [],
    expenses = [],
  } = useTrip();

  const currency =
    tripSettings?.currency || "R";

  // =========================
  // SELECTED ACCOMMODATION
  // =========================

  const selectedAccommodationOption =
    (accommodation || []).find(
      (option) =>
        String(option.id) ===
        String(selectedAccommodation)
    );

  const accommodationCost =
    selectedAccommodationOption
      ? Number(
          selectedAccommodationOption.price || 0
        )
      : 0;

  // =========================
  // GROCERY COSTS
  // =========================

  const totalGroceryCost =
    (groceries || []).reduce(
      (sum, grocery) =>
        sum +
        Number(grocery.price || 0) *
          Number(grocery.quantity || 0),
      0
    );

  const purchasedGroceryCost =
    (groceries || [])
      .filter(
        (grocery) =>
          grocery.purchased
      )
      .reduce(
        (sum, grocery) =>
          sum +
          Number(grocery.price || 0) *
            Number(grocery.quantity || 0),
        0
      );

  // =========================
  // OTHER EXPENSES
  // =========================

  const totalOtherExpenses =
    (expenses || []).reduce(
      (sum, expense) =>
        sum +
        Number(expense.amount || 0),
      0
    );

  // =========================
  // VALID TRANSACTIONS
  // =========================

  const validTransactions =
    (transactions || []).filter(
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
  // MONEY RECEIVED
  // =========================

  const moneyReceived =
    validTransactions
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

  // =========================
  // ACTUAL MONEY SPENT
  // =========================

  const moneySpent =
    validTransactions
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

  // =========================
  // CURRENT BALANCE
  // =========================

  const currentBalance =
    moneyReceived - moneySpent;

  // =========================
  // PLANNED COSTS
  // =========================

  const plannedCosts =
    accommodationCost +
    totalGroceryCost +
    totalOtherExpenses;

  // =========================
  // PROJECTED BALANCE
  // =========================

  const projectedBalance =
    currentBalance - plannedCosts;

  // =========================
  // CONTRIBUTION TARGET
  // =========================

  const targetPerPerson = Number(
    tripSettings?.targetContribution || 0
  );

  const totalTarget =
    members.length * targetPerPerson;

  // =========================
  // TOTAL CONTRIBUTIONS
  // =========================

  const totalContributions =
    (payments || []).reduce(
      (sum, payment) =>
        sum +
        Number(payment.amount || 0),
      0
    );

  const outstanding = Math.max(
    totalTarget -
      totalContributions,
    0
  );

  // =========================
  // PAID MEMBERS
  // =========================

  const paidMemberIds =
    new Set(
      (payments || [])
        .filter(
          (payment) =>
            payment.memberId
        )
        .map(
          (payment) =>
            String(
              payment.memberId
            )
        )
    );

  const paidMembers =
    paidMemberIds.size;

  const unpaidMembers =
    Math.max(
      members.length -
        paidMembers,
      0
    );

  // =========================
  // TRANSACTION COUNTS
  // =========================

  const creditCount =
    validTransactions.filter(
      (transaction) =>
        transaction.type ===
        "credit"
    ).length;

  const debitCount =
    validTransactions.filter(
      (transaction) =>
        transaction.type ===
        "debit"
    ).length;

  return (
    <div
      style={{
        padding: "30px",
      }}
    >
      {/* HEADER */}

      <h1>
        {tripSettings?.tripName ||
          "Boys Weekend"}
      </h1>

      <p>
        📍{" "}
        {selectedAccommodationOption
          ? selectedAccommodationOption.location
          : tripSettings?.destination ||
            "No destination set"}
      </p>

      {/* FINANCIAL OVERVIEW */}

      <h2
        style={{
          marginTop: "35px",
        }}
      >
        💰 Financial Overview
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        <DashboardCard
          icon="💵"
          title="Current Balance"
          value={`${currency}${currentBalance.toLocaleString()}`}
          valueColor={
            currentBalance < 0
              ? "#dc2626"
              : "#059669"
          }
        />

        <DashboardCard
          icon="📥"
          title="Money Received"
          value={`${currency}${moneyReceived.toLocaleString()}`}
          valueColor="#059669"
        />

        <DashboardCard
          icon="📤"
          title="Actual Money Spent"
          value={`${currency}${moneySpent.toLocaleString()}`}
          valueColor="#dc2626"
        />

        <DashboardCard
          icon="💳"
          title="Total Contributions"
          value={`${currency}${totalContributions.toLocaleString()}`}
          valueColor="#2563eb"
        />

        <DashboardCard
          icon="🏡"
          title="Accommodation"
          value={`${currency}${accommodationCost.toLocaleString()}`}
          valueColor="#7c3aed"
        />

        <DashboardCard
          icon="🛒"
          title="Planned Groceries"
          value={`${currency}${totalGroceryCost.toLocaleString()}`}
          valueColor="#f59e0b"
        />

        <DashboardCard
          icon="🧾"
          title="Other Expenses"
          value={`${currency}${totalOtherExpenses.toLocaleString()}`}
          valueColor="#dc2626"
        />

        <DashboardCard
          icon="📊"
          title="Projected Balance"
          value={`${currency}${projectedBalance.toLocaleString()}`}
          valueColor={
            projectedBalance < 0
              ? "#dc2626"
              : "#059669"
          }
        />
      </div>

      {/* TRIP COST SUMMARY */}

      <div
        style={{
          background: "white",
          padding: "25px",
          borderRadius: "12px",
          marginTop: "40px",
          boxShadow:
            "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <h2>
          🧳 Trip Cost Summary
        </h2>

        <p>
          🏡 Accommodation:{" "}
          <strong>
            {currency}
            {accommodationCost.toLocaleString()}
          </strong>
        </p>

        <p>
          🛒 Total Grocery Budget:{" "}
          <strong>
            {currency}
            {totalGroceryCost.toLocaleString()}
          </strong>
        </p>

        <p>
          ✅ Purchased Groceries:{" "}
          <strong>
            {currency}
            {purchasedGroceryCost.toLocaleString()}
          </strong>
        </p>

        <p>
          🧾 Other Expenses:{" "}
          <strong>
            {currency}
            {totalOtherExpenses.toLocaleString()}
          </strong>
        </p>

        <hr />

        <h3>
          Total Planned Trip Costs:{" "}
          {currency}
          {plannedCosts.toLocaleString()}
        </h3>

        <h3
          style={{
            color:
              projectedBalance < 0
                ? "#dc2626"
                : "#059669",
          }}
        >
          Projected Balance:{" "}
          {currency}
          {projectedBalance.toLocaleString()}
        </h3>
      </div>

      {/* CONTRIBUTION PROGRESS */}

      <h2
        style={{
          marginTop: "40px",
        }}
      >
        👥 Contribution Progress
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        <DashboardCard
          icon="🎯"
          title="Total Target"
          value={`${currency}${totalTarget.toLocaleString()}`}
          valueColor="#2563eb"
        />

        <DashboardCard
          icon="⚠️"
          title="Outstanding"
          value={`${currency}${outstanding.toLocaleString()}`}
          valueColor={
            outstanding > 0
              ? "#dc2626"
              : "#059669"
          }
        />

        <DashboardCard
          icon="✅"
          title="Paid Members"
          value={`${paidMembers} / ${members.length}`}
          valueColor="#059669"
        />

        <DashboardCard
          icon="⏳"
          title="Still Owing"
          value={unpaidMembers}
          valueColor={
            unpaidMembers > 0
              ? "#dc2626"
              : "#059669"
          }
        />
      </div>

      {/* TRANSACTION SUMMARY */}

      <div
        style={{
          background: "white",
          padding: "25px",
          borderRadius: "12px",
          marginTop: "40px",
          boxShadow:
            "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <h2>
          🏦 Bank Statement Summary
        </h2>

        <p>
          Valid Transactions:{" "}
          <strong>
            {validTransactions.length}
          </strong>
        </p>

        <p>
          Credits:{" "}
          <strong
            style={{
              color: "#059669",
            }}
          >
            {creditCount}
          </strong>
        </p>

        <p>
          Debits:{" "}
          <strong
            style={{
              color: "#dc2626",
            }}
          >
            {debitCount}
          </strong>
        </p>
      </div>
    </div>
  );
}

function DashboardCard({
  icon,
  title,
  value,
  valueColor,
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
      <div
        style={{
          fontSize: "28px",
        }}
      >
        {icon}
      </div>

      <h3
        style={{
          color: "#6b7280",
          marginBottom: "10px",
        }}
      >
        {title}
      </h3>

      <h2
        style={{
          margin: 0,
          color: valueColor,
        }}
      >
        {value}
      </h2>
    </div>
  );
}

export default Dashboard;