import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import styles from "../styles/ReservedAuctions.module.css";
import Button from "../components/ui/Button.jsx";
import { getProductImage, fetchProductDetails } from "../components/auctiondetail/productUtils.js";

const ReservedAuctions = () => {
  const { isAuthenticated, userInfo } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [reservedAuctions, setReservedAuctions] = useState([]);
  const [productDetails, setProductDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelLoading, setCancelLoading] = useState({});
  const [refreshKey, setRefreshKey] = useState(0); // 강제 새로고침을 위한 키

  // 예약된 경매 목록 가져오기
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate("/login");
      return;
    }
    const fetchReservedAuctions = async () => {
      try {
        setLoading(true);
        const token = userInfo?.accessToken || localStorage.getItem('accessToken');
        
        // 캐싱 방지를 위한 타임스탬프 추가
        const timestamp = new Date().getTime();
        const response = await fetch(`http://localhost:8088/api/participants/my-reservations?t=${timestamp}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });

        if (!response.ok) {
          throw new Error('예약된 경매 목록을 불러오는데 실패했습니다');
        }

        const data = await response.json();
        console.log("받아온 예약 목록:", data);
        
        // RESERVED 또는 ONGOING 상태의 경매만 필터링 (취소된 경매는 제외)
        const activeReservations = Array.isArray(data.data) 
          ? data.data.filter(auction => auction.status === 'RESERVED' || auction.status === 'ONGOING')
          : [];
        
        setReservedAuctions(activeReservations);

        // 각 예약된 경매의 상세 정보 가져오기
        const details = {};
        for (const auction of activeReservations) {
          try {
            const productData = await fetchProductDetails(auction.productId);
            details[auction.productId] = productData;
          } catch (error) {
            console.error(`상품 ID ${auction.productId} 상세 정보 조회 오류:`, error);
            details[auction.productId] = null;
          }
        }
        
        setProductDetails(details);
      } catch (error) {
        console.error("예약된 경매 목록 조회 오류:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReservedAuctions();
  }, [isAuthenticated, navigate, userInfo, refreshKey]); // refreshKey 의존성 추가

  // 경매 예약 취소하기
  const handleCancelReservation = async (productId) => {
    if (!isAuthenticated) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    try {
      setCancelLoading(prev => ({ ...prev, [productId]: true }));
      const token = userInfo?.accessToken || localStorage.getItem('accessToken');
      
      const response = await fetch(`http://localhost:8088/api/participants/cancel/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "경매 예약 취소 중 오류가 발생했습니다.");
      }

      // 취소 성공 후 목록에서 제거
      setReservedAuctions(prev => prev.filter(auction => auction.productId !== productId));
      
      // 취소된 상품 정보도 제거
      setProductDetails(prev => {
        const updated = {...prev};
        delete updated[productId];
        return updated;
      });
      
      alert("경매 예약이 취소되었습니다.");
    } catch (error) {
      console.error("경매 예약 취소 오류:", error);
      
      // "이미 취소된 경매입니다" 메시지가 있으면 해당 경매를 목록에서 제거
      if (error.message && error.message.includes("이미 취소된")) {
        setReservedAuctions(prev => prev.filter(auction => auction.productId !== productId));
        
        // 취소된 상품 정보도 제거
        setProductDetails(prev => {
          const updated = {...prev};
          delete updated[productId];
          return updated;
        });
        
        alert("이미 취소된 경매입니다. 목록을 갱신합니다.");
      } else {
        alert(error.message || "서버 연결에 실패했습니다. 다시 시도해주세요.");
      }
    } finally {
      setCancelLoading(prev => ({ ...prev, [productId]: false }));
    }
  };

  // 경매 상세 페이지로 이동
  const navigateToAuctionDetail = (productId) => {
    navigate(`/ongoing-auction/${productId}`);
  };

  // 경매 참여하기
  const enterAuction = (productId) => {
    navigate(`/live-auction/${productId}`);
  };

  // 강제 새로고침
  const forceRefresh = () => {
    setRefreshKey(prevKey => prevKey + 1);
    setLoading(true);
  };

  // 가격 표시 형식화
  const formatPrice = (price) => {
    if (price === undefined || price === null) return '가격 정보 없음';
    return `₩${price.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <p>예약된 경매 목록을 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h1 className={styles.title}>오류가 발생했습니다</h1>
        <p className={styles.description}>{error}</p>
        <Button 
          onClick={forceRefresh} 
          width={150}
          height={40}
        >
          다시 시도
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <h1 className={styles.title}>내가 예약한 경매</h1>
        <Button 
          onClick={forceRefresh}
          width={120}
          height={36}
        >
          새로 고침
        </Button>
      </div>
      
      {reservedAuctions.length === 0 ? (
        <div className={styles.emptyContainer}>
          <p>예약한 경매가 없습니다.</p>
          <Button 
            onClick={() => navigate("/ongoing-auctions")} 
            width={180}
            height={40}
          >
            경매 둘러보기
          </Button>
        </div>
      ) : (
        <div className={styles.auctionsGrid}>
          {reservedAuctions.map((auction) => {
            const product = productDetails[auction.productId] || {};
            const isOngoing = product.auctionStatus === "ONGOING";
            
            return (
              <div key={auction.id} className={`${styles.auctionCard} ${isOngoing ? styles.ongoingCard : ''}`}>
                {isOngoing && <div className={styles.ongoingBadge}>진행중</div>}
                
                <div 
                  className={styles.imageContainer}
                  onClick={() => navigateToAuctionDetail(auction.productId)}
                >
                  <img 
                    src={product ? getProductImage(product) : "https://placehold.co/400x300?text=이미지+준비중"}
                    alt={auction.productName} 
                    className={styles.productImage}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://placehold.co/400x300?text=이미지+없음";
                    }}
                  />
                </div>
                <div className={styles.productInfo}>
                  <h3 
                    className={styles.productName}
                    onClick={() => navigateToAuctionDetail(auction.productId)}
                  >
                    {auction.productName || '제목 없음'}
                  </h3>
                  {product && (
                    <p className={styles.priceInfo}>
                      시작가: <span className={styles.price}>{formatPrice(product.startingPrice)}</span>
                    </p>
                  )}
                  <p className={styles.sellerInfo}>
                    판매자: {product?.sellerUsername || '판매자 정보 없음'}
                  </p>
                  <div className={styles.buttonContainer}>
                    {isOngoing ? (
                      <Button 
                        onClick={() => enterAuction(auction.productId)}
                        width={120}
                        height={36}
                        style={{ backgroundColor: "#FF5722", color: "white" }}
                      >
                        경매 참여하기
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => navigateToAuctionDetail(auction.productId)}
                        width={120}
                        height={36}
                      >
                        상세보기
                      </Button>
                    )}
                    
                    {!isOngoing && (
                      <Button 
                        onClick={() => handleCancelReservation(auction.productId)}
                        width={120}
                        height={36}
                        disabled={cancelLoading[auction.productId]}
                        className={styles.cancelButton}
                      >
                        {cancelLoading[auction.productId] ? "취소 중..." : "예약 취소"}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default ReservedAuctions;