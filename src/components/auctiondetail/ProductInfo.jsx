import React, { useState, useEffect } from "react";
import Button from "../../components/ui/Button";
import styles from "../../styles/AuctionDetail.module.css";
import { FaUsers } from 'react-icons/fa'; // 참가자 아이콘을 위한 import
import { getCategoryNameInKorean } from "./categoryUtils"; // 카테고리 유틸 import
import { checkReservationStatus } from "./productUtils"; // 예약 상태 확인 함수 import

const ProductInfo = ({ 
  product, 
  isOwner, 
  isReserved: initialIsReserved,
  reserveLoading: initialReserveLoading,
  participantsCount,
  handleStartAuction, 
  handleReserveAuction 
}) => {
  // 로컬 상태 관리
  const [isReserved, setIsReserved] = useState(initialIsReserved);
  const [reserveLoading, setReserveLoading] = useState(initialReserveLoading);
  const [statusChecking, setStatusChecking] = useState(false);

  // 카테고리 이름 한글로 변환
  const categoryInKorean = getCategoryNameInKorean(product.categoryType);

  // 정기적으로 예약 상태 확인
  useEffect(() => {
    // 초기 상태 설정
    setIsReserved(initialIsReserved);
    
    if (isOwner) return; // 소유자는 예약 상태 확인이 필요 없음
    
    // 처음 렌더링 시 상태 확인
    refreshReservationStatus();
    
    // 30초마다 예약 상태 확인
    const intervalId = setInterval(() => {
      refreshReservationStatus();
    }, 30000);
    
    // 컴포넌트 언마운트 시 인터벌 제거
    return () => clearInterval(intervalId);
  }, [product.id, initialIsReserved, isOwner]);
  
  // 예약 상태 확인 함수
  const refreshReservationStatus = async () => {
    if (isOwner) return;
    
    try {
      setStatusChecking(true);
      const token = localStorage.getItem('accessToken');
      if (!token) return;
      
      const reservationStatus = await checkReservationStatus(product.id, token);
      
      // 백엔드의 상태와 프론트엔드의 상태가 다르면 업데이트
      if (reservationStatus !== isReserved) {
        setIsReserved(reservationStatus);
        console.log(`예약 상태가 ${reservationStatus ? '예약됨' : '예약되지 않음'}으로 업데이트되었습니다.`);
      }
    } catch (error) {
      console.error("예약 상태 확인 중 오류 발생:", error);
    } finally {
      setStatusChecking(false);
    }
  };
  
  // 예약 버튼 클릭 핸들러
  const onReserveClick = async () => {
    try {
      setReserveLoading(true);
      await handleReserveAuction();
      // 예약 처리 후 즉시 상태 확인
      await refreshReservationStatus();
    } catch (error) {
      console.error("예약 처리 중 오류 발생:", error);
    } finally {
      setReserveLoading(false);
    }
  };

  // 예약 버튼 텍스트 설정
  const reserveButtonText = reserveLoading || statusChecking
    ? "로딩 중..." 
    : isReserved 
      ? "예약 완료" 
      : "경매 예약";
  
  // 예약 버튼 색상 변경을 위한 속성
  const reserveButtonProps = isReserved 
    ? { 
        variant: "success",
        style: { backgroundColor: "#4CAF50", color: "white" } 
      } 
    : {};

  return (
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
            <Button 
              onClick={handleStartAuction} 
              width={120}
              height={40}
              disabled={reserveLoading}
            >
              경매 시작
            </Button>
          ) : (
            <div className={styles.actionButtons}>
              <Button 
                onClick={onReserveClick} 
                width={120}
                height={40}
                disabled={reserveLoading || statusChecking || isReserved}
                {...reserveButtonProps}
              >
                {reserveButtonText}
              </Button>
          
             
            </div>
          )}
          
          {/* 판매자 정보 표시 */}
          <div className={styles.sellerInfo}>
            판매자: {product.sellerUsername}
          </div>
        </div>
      </div>
      
      <div className={styles.metaInfo}>
        카테고리: <span className={styles.categoryTag}>{categoryInKorean}</span>
      </div>
      <div className={styles.metaInfo}>
        경매 단위: ₩{product.bidIncrease?.toLocaleString() || 0}
      </div>
      
      {/* 참가자 수 표시 */}
      <div className={styles.participantsInfo}>
        <FaUsers className={styles.participantsIcon} />
        <span className={styles.participantsCount}>
          {participantsCount} {participantsCount > 0 ? "명이 이 경매를 예약했습니다" : "아직 예약자가 없습니다"}
        </span>
      </div>
    </div>
  );
};

export default ProductInfo;