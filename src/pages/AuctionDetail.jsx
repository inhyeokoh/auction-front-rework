import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import styles from "../styles/AuctionDetail.module.css";

// 컴포넌트 import
import ProductImage from "../components/auctiondetail/ProductImage";
import ProductInfo from "../components/auctiondetail/ProductInfo";
import LoadingError from "../components/auctiondetail/LoadingError";

// 유틸리티 함수 import
import { 
  getProductImage, 
  fetchProductDetails, 
  reserveAuction, 
  startAuction 
} from "../components/auctiondetail/productUtils";

const AuctionDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, userInfo } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProductDetails = async () => {
      try {
        console.log("Fetching product details for ID:", productId);
        setLoading(true);
        setError(null);
        
        const productData = await fetchProductDetails(productId);
        console.log("Product data received:", productData);
        setProduct(productData);
      } catch (error) {
        console.error("상품 상세 정보 조회 오류:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      loadProductDetails();
    } else {
      console.error("No productId found in URL parameters");
      setError("상품 ID가 없습니다");
      setLoading(false);
    }
  }, [productId]);

  const handleReserveAuction = async () => {
    if (!isAuthenticated) {
      alert("경매 예약을 위해 로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      await reserveAuction(productId, token);
      alert("경매가 성공적으로 예약되었습니다.");
      navigate("/reserved-auctions");
    } catch (error) {
      console.error("경매 예약 오류:", error);
      alert(error.message || "서버 연결에 실패했습니다. 다시 시도해주세요.");
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
      const data = await startAuction(productId, token);
      alert("경매가 성공적으로 시작되었습니다.");
      navigate(`/live-auction/${data.auctionId || productId}`);
    } catch (error) {
      console.error("경매 시작 오류:", error);
      alert(error.message || "서버 연결에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 로딩 중이거나 에러 상태일 때 처리
  if (loading || error || !product) {
    return <LoadingError loading={loading} error={error} />;
  }

  // sellerUsername과 현재 로그인한 사용자의 username이 일치하는지 확인
  const isOwner = userInfo && product.sellerUsername === userInfo.username;

  return (
    <div className={styles.container}>
      <ProductImage 
        product={product} 
        getProductImage={getProductImage} 
      />
      <ProductInfo 
        product={product} 
        isOwner={isOwner} 
        handleStartAuction={handleStartAuction} 
        handleReserveAuction={handleReserveAuction} 
      />
    </div>
  );
};

export default AuctionDetail;