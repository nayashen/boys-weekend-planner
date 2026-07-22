function SectionCard({
  title,
  children,
}) {
  return (
    <section
      style={{
        background: "#ffffff",
        borderRadius: "16px",
        padding: "22px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {title && (
        <h2
          style={{
            marginTop: 0,
            marginBottom: "20px",
            fontSize: "22px",
            color: "#111827",
          }}
        >
          {title}
        </h2>
      )}

      {children}
    </section>
  );
}

export default SectionCard;