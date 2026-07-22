import { Link } from "react-router-dom";
import SectionCard from "../common/SectionCard";

function QuickActions() {
  const actions = [
    {
      title: "Add Member",
      icon: "👥",
      path: "/members",
      color: "#2563eb",
    },
    {
      title: "Add Contribution",
      icon: "💳",
      path: "/contributions",
      color: "#16a34a",
    },
    {
      title: "Finance",
      icon: "💰",
      path: "/finance",
      color: "#f59e0b",
    },
    {
      title: "Groceries",
      icon: "🛒",
      path: "/groceries",
      color: "#7c3aed",
    },
    {
      title: "Drinks",
      icon: "🍻",
      path: "/drinks",
      color: "#0891b2",
    },
    {
      title: "Accommodation",
      icon: "🏡",
      path: "/accommodation",
      color: "#dc2626",
    },
  ];

  return (
    <SectionCard title="⚡ Quick Actions">
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "16px",
        }}
      >
        {actions.map((action) => (
          <Link
            key={action.path}
            to={action.path}
            style={{
              textDecoration: "none",
              color: "white",
              background: action.color,
              borderRadius: "12px",
              padding: "20px",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            <div
              style={{
                fontSize: "32px",
                marginBottom: "10px",
              }}
            >
              {action.icon}
            </div>

            <div>{action.title}</div>
          </Link>
        ))}
      </div>
    </SectionCard>
  );
}

export default QuickActions;