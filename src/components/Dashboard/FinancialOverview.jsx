import DashboardCard from "./DashboardCard";
import SectionCard from "../common/SectionCard";

function FinancialOverview({
  currency = "R",
  currentBalance = 0,
  moneyReceived = 0,
  moneySpent = 0,
  totalContributions = 0,
  accommodationCost = 0,
  totalGroceryCost = 0,
  totalDrinkCost = 0,
  totalOtherExpenses = 0,
  projectedBalance = 0,
}) {
  return (
    <SectionCard title="💰 Financial Overview">

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(180px,1fr))",
          gap: "18px",
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
          title="Money Spent"
          value={`${currency}${moneySpent.toLocaleString()}`}
          valueColor="#dc2626"
        />

        <DashboardCard
          icon="💳"
          title="Contributions"
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
          title="Groceries"
          value={`${currency}${totalGroceryCost.toLocaleString()}`}
          valueColor="#f59e0b"
        />

        <DashboardCard
          icon="🍻"
          title="Drinks"
          value={`${currency}${totalDrinkCost.toLocaleString()}`}
          valueColor="#0891b2"
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

    </SectionCard>
  );
}

export default FinancialOverview;