const STAGES = ["placed", "processing", "packed", "shipped", "out for delivery", "delivered"];

const STAGE_LABELS = {
  placed: "Pending",
  processing: "Confirmed",
  packed: "Packed",
  shipped: "Shipped",
  "out for delivery": "Out for Delivery",
  delivered: "Delivered",
};

const OrderTimeline = ({ status }) => {
  const normalized = status === "cancelled" ? -1 : STAGES.indexOf(status);
  const currentIndex = normalized === -1 && status !== "cancelled" ? 0 : normalized;

  if (status === "cancelled") {
    return <div className="order-cancelled-badge">❌ Order Cancelled</div>;
  }

  return (
    <div className="order-timeline">
      {STAGES.map((stage, i) => {
        const isDone = i <= currentIndex;
        const isCurrent = i === currentIndex;
        return (
          <div key={stage} className="timeline-step">
            <div className={`timeline-dot ${isDone ? "timeline-dot-done" : ""} ${isCurrent ? "timeline-dot-current" : ""}`}>
              {isDone ? "✓" : ""}
            </div>
            <span className={`timeline-label ${isCurrent ? "timeline-label-current" : ""}`}>{STAGE_LABELS[stage]}</span>
            {i !== STAGES.length - 1 && <div className={`timeline-connector ${i < currentIndex ? "timeline-connector-done" : ""}`} />}
          </div>
        );
      })}
    </div>
  );
};

export default OrderTimeline;