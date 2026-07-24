const TopProductsPanel = ({ bestSelling, mostViewed, highestRated }) => {
  return (
    <div className="top-products-grid">
      <div className="chart-card">
        <h3>🏆 Best-Selling</h3>
        <ol className="top-products-list">
          {bestSelling.map((p, i) => (
            <li key={i}><span>{p.name}</span><span className="top-products-metric">{p.qty} sold</span></li>
          ))}
        </ol>
      </div>

      <div className="chart-card">
        <h3>👁 Most Viewed</h3>
        <ol className="top-products-list">
          {mostViewed.map((p, i) => (
            <li key={i}><span>{p.name}</span><span className="top-products-metric">{p.views} views</span></li>
          ))}
        </ol>
      </div>

      <div className="chart-card">
        <h3>⭐ Highest Rated</h3>
        <ol className="top-products-list">
          {highestRated.map((p, i) => (
            <li key={i}><span>{p.name}</span><span className="top-products-metric">{p.rating}⭐</span></li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default TopProductsPanel;