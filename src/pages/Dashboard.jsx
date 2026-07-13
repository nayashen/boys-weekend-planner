import DashboardCard from "../components/DashboardCard";
import members from "../data/members";

function Dashboard() {
  const totalFunds = members.reduce(
    (sum, member) => sum + member.contribution,
    0
  );

  const outstanding = members
    .filter((member) => !member.paid)
    .reduce((sum, member) => sum + member.contribution, 0);

  const goal = 35000;

  return (
    <div style={{ padding: "30px" }}>
      <h1>Dashboard</h1>

    <div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
    marginTop: "20px",
  }}
>
        <DashboardCard
          title="Members"
          value={members.length}
          color="#10b981"
        />

        <DashboardCard
          title="Funds Collected"
          value={`R${totalFunds}`}
          color="#3b82f6"
        />

        <DashboardCard
          title="Outstanding"
          value={`R${outstanding}`}
          color="#ef4444"
        />

        <DashboardCard
          title="Trip Goal"
          value={`R${goal}`}
          color="#f59e0b"
        />
      </div>

      <div
        style={{
          marginTop: "40px",
          background: "white",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <h2>Recent Activity</h2>

        <p>✅ Mike paid R500</p>
        <p>✅ Chris paid R500</p>
        <p>❌ Steve still owes R250</p>
      </div>
    </div>
  );
}

export default Dashboard;