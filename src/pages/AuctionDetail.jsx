import React, { useState, useEffect, useContext, useCallback } from "react";
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
  startAuction,
  checkReservationStatus,
  fetchParticipantsCount
} from "../components/auctiondetail/productUtils";

const AuctionDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, userInfo } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isReserved, setIsReserved] = useState(false);
  const [reserveLoading, setReserveLoading] = useState(false);
  const [participantsCount, setParticipantsCount] = useState(0);

  // 참가자 수 가져오기 함수
  const loadParticipantsCount = useCallback(async () => {
    try {
      const token = userInfo?.accessToken || localStorage.getItem('accessToken');
      const count = await fetchParticipantsCount(productId, token);
      setParticipantsCount(count);
    } catch (error) {
      console.error("참가자 수 조회 오류:", error);
      // 참가자 수 조회 오류는 전체 페이지 로드에 영향을 주지 않도록 처리
    }
  }, [productId, userInfo]);

  // 예약 상태 확인 함수
  const checkReservation = useCallback(async () => {
    if (!isAuthenticated || !productId) return;
    
    try {
      const token = userInfo?.accessToken || localStorage.getItem('accessToken');
      const reservationStatus = await checkReservationStatus(productId, token);
      setIsReserved(reservationStatus);
      return reservationStatus;
    } catch (error) {
      console.error("예약 상태 확인 오류:", error);
      // 예약 상태 확인 오류는 UI에 표시하지 않고 단순 로깅만 함
      return false;
    }
  }, [productId, isAuthenticated, userInfo]);

  // 상품 정보 및 상태 로드
  useEffect(() => {
    const loadProductDetails = async () => {
      try {
        console.log("Fetching product details for ID:", productId);
        setLoading(true);
        setError(null);
        
        const productData = await fetchProductDetails(productId);
        console.log("Product data received:", productData);
        setProduct(productData);
        
        // 로그인 상태이면 현재 상품 예약 상태 확인
        if (isAuthenticated) {
          await checkReservation();
        }
        
        // 참가자 수 로드
        await loadParticipantsCount();
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
  }, [productId, isAuthenticated, checkReservation, loadParticipantsCount]);

  // 주기적으로 참가자 수 갱신
  useEffect(() => {
    // 처음에는 이미 로드했으므로 30초 후부터 주기적으로 갱신
    const intervalId = setInterval(() => {
      if (!loading && !error && product) {
        loadParticipantsCount();
      }
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, [loading, error, product, loadParticipantsCount]);

  const handleReserveAuction = async () => {
    if (!isAuthenticated) {
      alert("경매 예약을 위해 로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    if (isReserved) {
      alert("이미 예약한 경매입니다.");
      return;
    }

    setReserveLoading(true);
    try {
      const token = userInfo?.accessToken || localStorage.getItem('accessToken');
      const result = await reserveAuction(productId, token);
      
      // 예약 성공 후 상태 업데이트
      await checkReservation();
      
      // 예약 성공 후 참가자 수 갱신
      await loadParticipantsCount();
      
      alert(result.message || "경매가 성공적으로 예약되었습니다.");
    } catch (error) {
      console.error("경매 예약 오류:", error);
      alert(error.message || "서버 연결에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setReserveLoading(false);
    }
  };

  const handleStartAuction = async () => {
    if (!isAuthenticated) {
      alert("경매 시작을 위해 로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    try {
      const token = userInfo?.accessToken || localStorage.getItem('accessToken');
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
        isReserved={isReserved}
        reserveLoading={reserveLoading}
        participantsCount={participantsCount}
        handleStartAuction={handleStartAuction} 
        handleReserveAuction={handleReserveAuction} 
      />
    </div>
  );
};

export default AuctionDetail;