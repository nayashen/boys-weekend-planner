import SectionCard from "../common/SectionCard";
import ProgressBar from "./ProgressBar";

function ContributionProgress({
  currency = "R",
  target = 0,
  collected = 0,
  outstanding = 0,
  paidMembers = 0,
  totalMembers = 0,
}) {
  const unpaidMembers = Math.max(
    totalMembers - paidMembers,
    0
  );

  return (
    <SectionCard title="👥 Contribution Progress">

      {/* Money Progress */}

      <div style={{ marginBottom: "30px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "10px",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          <strong>Contribution Target</strong>

          <strong>
            {currency}
            {collected.toLocaleString()} / {currency}
            {target.toLocaleString()}
          </strong>
        </div>

        <ProgressBar
          value={collected}
          max={target}
          color="#2563eb"
        />

        <div
          style={{
            marginTop: "12px",
            color:
              outstanding > 0
                ? "#dc2626"
                : "#059669",
            fontWeight: "bold",
          }}
        >
          Outstanding: {currency}
          {outstanding.toLocaleString()}
        </div>
      </div>

      {/* Member Progress */}

      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "10px",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          <strong>Members Paid</strong>

          <strong>
            {paidMembers} / {totalMembers}
          </strong>
        </div>

        <ProgressBar
          value={paidMembers}
          max={totalMembers}
          color="#16a34a"
        />

        <div
          style={{
            marginTop: "12px",
            color:
              unpaidMembers > 0
                ? "#dc2626"
                : "#059669",
            fontWeight: "bold",
          }}
        >
          {unpaidMembers} member
          {unpaidMembers === 1 ? "" : "s"} still owing
        </div>
      </div>

    </SectionCard>
  );
}

export default ContributionProgress;