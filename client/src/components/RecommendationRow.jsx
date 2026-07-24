import ProductCard from "./ProductCard";

const RecommendationRow = ({ title, products, reason }) => {
  if (!products || products.length === 0) return null;

  return (
    <div className="recommendation-row">
      <h2 className="section-title">{title}</h2>
      <div className="product-grid">
        {products.map((p) => (
          <div key={p._id}>
            <ProductCard product={p} />
            {reason && <p className="recommendation-reason">💡 {reason}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationRow;