import { useTrip } from "../context/TripContext";

import DashboardHero from "../components/Dashboard/DashboardHero";
import FinancialOverview from "../components/Dashboard/FinancialOverview";
import ContributionProgress from "../components/Dashboard/ContributionProgress";
import TripSummary from "../components/Dashboard/TripSummary";
import BankSummary from "../components/Dashboard/BankSummary";
import QuickActions from "../components/Dashboard/QuickActions";
import RecentActivity from "../components/Dashboard/RecentActivity";

function Dashboard() {
  const {
    members = [],
    payments = [],
    transactions = [],
    groceries = [],
    drinks = [],
    expenses = [],
    accommodation = [],
    selectedAccommodation,
    tripSettings = {},
  } = useTrip();

  const currency = tripSettings?.currency || "R";

  // ===========================
  // Accommodation
  // ===========================

  const selectedAccommodationOption = accommodation.find(
    (a) => String(a.id) === String(selectedAccommodation)
  );

  const accommodationCost = selectedAccommodationOption
    ? Number(selectedAccommodationOption.price || 0)
    : 0;

  // ===========================
  // Groceries
  // ===========================

  const groceryCost = groceries.reduce(
    (sum, item) =>
      sum +
      Number(item.price || 0) *
        Number(item.quantity || 0),
    0
  );

  // ===========================
  // Drinks
  // ===========================

  const drinksCost = drinks.reduce(
    (sum, item) =>
      sum +
      Number(item.price || 0) *
        Number(item.quantity || 0),
    0
  );

  // ===========================
  // Other Expenses
  // ===========================

  const expenseCost = expenses.reduce(
    (sum, item) =>
      sum + Number(item.amount || 0),
    0
  );

  // ===========================
  // Transactions
  // ===========================

  const moneyReceived = payments.reduce(
  (sum, payment) =>
    sum + Number(payment.amount || 0),
  0
);

  const moneySpent = transactions
    .filter((t) => t.type === "debit")
    .reduce(
      (sum, t) => sum + Number(t.amount || 0),
      0
    );

  const currentBalance = moneyReceived - moneySpent;

  // ===========================
  // Planned Costs
  // ===========================

  const plannedCosts =
    accommodationCost +
    groceryCost +
    drinksCost +
    expenseCost;

  const projectedBalance =
    currentBalance - plannedCosts;

  // ===========================
  // Contributions
  // ===========================

  const targetPerPerson = Number(
    tripSettings.targetContribution || 0
  );

  const totalTarget =
    targetPerPerson * members.length;

  const totalContributions =
    payments.reduce(
      (sum, payment) =>
        sum +
        Number(payment.amount || 0),
      0
    );

  const outstanding = Math.max(
    totalTarget - totalContributions,
    0
  );

  const paidMembers = new Set(
    payments.map((payment) =>
      String(
        payment.member_id ||
          payment.memberId
      )
    )
  ).size;

  // ===========================
  // Recent Activity
  // ===========================

  const recentTransactions = [
    ...transactions,
  ]
    .sort(
      (a, b) =>
        new Date(b.created_at) -
        new Date(a.created_at)
    )
    .slice(0, 5);

  return (
    <div
      style={{
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}
    >
      <DashboardHero
        title={
          tripSettings.tripName ||
          "Boys Weekend"
        }
        subtitle={
          selectedAccommodationOption
            ?.location ||
          tripSettings.destination ||
          "Destination not set"
        }
      />

      <FinancialOverview
        currency={currency}
        currentBalance={currentBalance}
        moneyReceived={moneyReceived}
        moneySpent={moneySpent}
        totalContributions={
          totalContributions
        }
        accommodationCost={
          accommodationCost
        }
        totalGroceryCost={
          groceryCost
        }
        totalDrinkCost={drinksCost}
        totalOtherExpenses={
          expenseCost
        }
        projectedBalance={
          projectedBalance
        }
      />

      <ContributionProgress
        currency={currency}
        target={totalTarget}
        collected={
          totalContributions
        }
        outstanding={outstanding}
        paidMembers={paidMembers}
        totalMembers={
          members.length
        }
      />

      <TripSummary
        currency={currency}
        accommodation={
          accommodationCost
        }
        groceries={groceryCost}
        drinks={drinksCost}
        expenses={expenseCost}
        planned={plannedCosts}
        projected={
          projectedBalance
        }
      />

      <QuickActions />

      <RecentActivity
        transactions={
          recentTransactions
        }
        currency={currency}
      />

      <BankSummary
        transactions={transactions}
        credits={
          transactions.filter(
            (t) =>
              t.type === "credit"
          ).length
        }
        debits={
          transactions.filter(
            (t) =>
              t.type === "debit"
          ).length
        }
      />
    </div>
  );
}

export default Dashboard;
