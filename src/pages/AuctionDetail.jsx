import React, { useState, useEffect, useContext } from "react";
import  Button  from "../components/ui/Button";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import styles from "../styles/AuctionDetail.module.css";

const AuctionDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, userInfo } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        console.log("Fetching product details for ID:", productId);
        setLoading(true);
        const response = await fetch(`http://localhost:8088/api/product/${productId}`);
        
        if (!response.ok) {
          throw new Error('상품 정보를 불러오는데 실패했습니다');
        }
        
        const data = await response.json();
        console.log("Product data received:", data);
        // 여기를 수정: data.product를 저장
        setProduct(data.product);
      } catch (error) {
        console.error("상품 상세 정보 조회 오류:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
  
    if (productId) {
      fetchProductDetails();
    } else {
      console.error("No productId found in URL parameters");
      setError("상품 ID가 없습니다");
      setLoading(false);
    }
  }, [productId]);
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

  const handleReserveAuction = async () => {
    if (!isAuthenticated) {
      alert("경매 예약을 위해 로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      
      const response = await fetch(`http://localhost:8088/api/auction/reserve/${productId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        alert("경매가 성공적으로 예약되었습니다.");
        navigate("/reserved-auctions");
      } else {
        const errorData = await response.json();
        alert(errorData.message || "경매 예약 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("경매 예약 오류:", error);
      alert("서버 연결에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleStartAuction = async () => {
    if (!isAuthenticated) {
      alert("경매 시작을 위해 로그인이 필요합니다.");
      navigate("/login");
      return;
    }
  
    try {
      const token = localStorage.getItem('accessToken');
      
      // 엔드포인트와 요청 방식 수정
      const response = await fetch(`http://localhost:8088/api/auction/createAuction`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        // 요청 본문에 productId 추가
        body: JSON.stringify({ productId })
      });
  
      if (response.ok) {
        const data = await response.json();
        alert("경매가 성공적으로 시작되었습니다.");
        // 응답에서 auctionId를 받아와서 이동
        navigate(`/live-auction/${data.auctionId || productId}`);
      } else {
        const errorData = await response.json();
        alert(errorData.message || "경매 시작 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("경매 시작 오류:", error);
      alert("서버 연결에 실패했습니다. 다시 시도해주세요.");
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <p>상품 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className={styles.errorContainer}>
        <h1 className={styles.title}>상품을 찾을 수 없습니다</h1>
        <p className={styles.description}>{error}</p>
        <Button onClick={() => navigate("/auctions")}  width={120}
              height={40} className={styles.backButton}>
          경매 리스트로 돌아가기
        </Button>
      </div>
    );
  }

  const isOwner = userInfo && product.sellerId === userInfo.userId;

  return (
    <div className={styles.container}>
      <div className={styles.imageContainer}>
        <img
          src={getProductImage(product)}
          alt={product.name}
          className={styles.productImage}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://placehold.co/400x300?text=이미지+없음";
          }}
        />
      </div>
      <div className={styles.contentContainer}>
        <h1 className={styles.title}>{product.name}</h1>
        <p className={styles.description}>{product.description}</p>
        
        <div className={styles.priceInfoContainer}>
          <div className={styles.priceInfo}>
            <p className={styles.priceLabel}>현재 입찰가</p>
            <div className={styles.currentPrice}>₩{product.startingPrice?.toLocaleString() || 0}</div>
            <p className={styles.buyNowPrice}>즉시 구매가: ₩{product.buyNowPrice?.toLocaleString() || 0}</p>
          </div>
          
          <div className={styles.buttonContainer}>
            {isOwner ? (
              <Button onClick={handleStartAuction}  width={120}
              height={40}className={styles.button}>
                경매 시작
              </Button>
            ) : (
              <Button onClick={handleReserveAuction} width={120}
              height={40} className={styles.button}>
                경매 예약
              </Button>
            )}
          </div>
        </div>
        
        <div className={styles.metaInfo}>
          카테고리: {product.categoryType}
        </div>
        <div className={styles.metaInfo}>
          경매 단위: ₩{product.bidIncrease?.toLocaleString() || 0}
        </div>
      </div>
    </div>
  );
};

export default AuctionDetail;