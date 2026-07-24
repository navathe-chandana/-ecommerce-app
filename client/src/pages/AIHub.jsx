import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getWishlist } from "../api/wishlistApi";
import { getRecommendedForYou, getBecauseYouViewed, getTrendingNow } from "../utils/recommendations";
import { getRecentlyViewed } from "../utils/recentlyViewed";
import RecommendationRow from "../components/RecommendationRow";

const AIHub = () => {
  const { user } = useAuth();
  const [recommended, setRecommended] = useState({ products: [], reason: "" });
  const [becauseViewed, setBecauseViewed] = useState({ products: [], sourceProduct: null });
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const recentlyViewed = getRecentlyViewed();

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      let wishlistProducts = [];
      if (user) {
        const res = await getWishlist();
        wishlistProducts = res.data.products || [];
      }
      const [rec, viewed, trend] = await Promise.all([
        getRecommendedForYou(wishlistProducts),
        getBecauseYouViewed(),
        getTrendingNow(),
      ]);
      setRecommended(rec);
      setBecauseViewed(viewed);
      setTrending(trend);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="ai-hub-header">
        <h1 className="section-title">✨ Your AI Hub</h1>
        <p style={{ color: "var(--text-muted)" }}>Personalized picks, powered by AI — based on what you've browsed and loved.</p>
      </div>

      {loading ? (
        <div className="spinner"></div>
      ) : (
        <>
          {recentlyViewed.length === 0 && recommended.products.length === 0 && trending.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">✨</div>
              <h2>Nothing to show yet</h2>
              <p>Browse a few products and check back — recommendations will appear here.</p>
            </div>
          ) : (
            <>
              {recommended.products.length > 0 && (
                <RecommendationRow title="Recommended For You" products={recommended.products} reason={recommended.reason} />
              )}
              {becauseViewed.products.length > 0 && (
                <RecommendationRow
                  title={`Because you viewed "${becauseViewed.sourceProduct?.name}"`}
                  products={becauseViewed.products}
                />
              )}
              {trending.length > 0 && (
                <RecommendationRow title="🔥 Trending Now" products={trending} />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default AIHub;