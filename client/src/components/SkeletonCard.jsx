const SkeletonCard = () => {
  return (
    <div className="product-card skeleton-card">
      <div className="skeleton skeleton-img"></div>
      <div className="product-card-body">
        <div className="skeleton skeleton-line" style={{ width: "80%" }}></div>
        <div className="skeleton skeleton-line" style={{ width: "40%" }}></div>
        <div className="skeleton skeleton-line" style={{ width: "50%" }}></div>
      </div>
    </div>
  );
};

export default SkeletonCard;