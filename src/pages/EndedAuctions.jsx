import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import "../styles/Auctions.css"; // 기본 스타일
import styles from "../styles/EndedAuctions.module.css"; // CSS 모듈 import

// 컴포넌트 import
import LoadingErrorState from "../components/auctions/LoadingErrorState";

// 상품 이미지 처리 함수
const getProductImage = (product) => {
  let imageUrl = null;
  
  if (product.imageUrls && product.imageUrls.length > 0) {
    imageUrl = product.imageUrls[0];
  } else if (product.imageUrl) {
    imageUrl = product.imageUrl;
  } else if (product.mainImageUrl) {
    imageUrl = product.mainImageUrl;
  }
  
  if (imageUrl && !imageUrl.startsWith('http')) {
    return `http://localhost:8088${imageUrl}`;
  }
  
  return imageUrl || "https://placehold.co/400x300?text=이미지+없음";
};

const EndedAuctions = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated, userInfo } = useContext(AuthContext);

  // 낙찰 정보를 가져오는 함수
  const fetchWinningBid = async (auctionId) => {
    try {
      const token = userInfo?.accessToken || localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:8088/api/bid/${auctionId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return data.MaxBid || null;
    } catch (error) {
      console.error(`낙찰 정보 조회 오류 (${auctionId}):`, error);
      return null;
    }
  };

  // 종료된 경매 목록을 가져오는 함수
  const loadEndedAuctions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 상품 목록 가져오기
      const response = await fetch('http://localhost:8088/api/product/all');
      
      if (!response.ok) {
        throw new Error('상품 목록을 불러오는데 실패했습니다');
      }
      
      const data = await response.json();
      
      // COMPLETED 상태인 상품만 필터링
      const completedProducts = (data.products || []).filter(product => 
        product.auctionStatus === "COMPLETED"
      );

      // 각 완료된 경매의 낙찰 정보 가져오기
      const auctionsWithWinningBids = await Promise.all(
        completedProducts.map(async (product) => {
          const winningBid = await fetchWinningBid(product.auctionId);
          return {
            ...product,
            winningBid
          };
        })
      );
      
      setAuctions(auctionsWithWinningBids);
      
    } catch (error) {
      console.error("종료된 경매 목록 조회 오류:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트가 마운트될 때 종료된 경매 목록을 가져옵니다
  useEffect(() => {
    loadEndedAuctions();
  }, [isAuthenticated]);

  return (
    <div>
      <div className="auctions-container">
        <div className="auctions-header">
          <h1 className="auctions-title">종료된 경매 리스트</h1>
        </div>
        
        <LoadingErrorState 
          loading={loading} 
          error={error} 
          retryFn={loadEndedAuctions} 
        />
        
        {!loading && !error && auctions.length === 0 && (
          <div className="empty-message">종료된 경매가 없습니다</div>
        )}
        
        {!loading && !error && auctions.length > 0 && (
          <div className="product-grid">
            {auctions.map((auction) => (
              <div key={auction.productId} className={`custom-card ${styles.ended}`}>
                <div className="product-image-container">
                  <div className={styles['ended-badge']}>낙찰</div>
                  <img
                    src={getProductImage(auction)}
                    alt={auction.name}
                    className="product-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://placehold.co/400x300?text=이미지+없음";
                    }}
                  />
                </div>
                <div className="product-content">
                  <h3 className="product-title">{auction.name}</h3>
                  {auction.winningBid ? (
                    <div className="product-footer">
                      <div className="price-container">
                        <span className={`price-label ${styles.final}`}>낙찰 금액</span>
                        <span className="product-price">
                          ₩{auction.winningBid.bidAmount.toLocaleString()}
                        </span>
                        <span className="price-label">낙찰자: {auction.winningBid.name}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="product-footer">
                      <span className="price-label">낙찰 정보 없음</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EndedAuctions;