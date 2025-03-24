import React from "react";
import Button from "../../components/ui/Button";
import styles from "../../styles/AuctionDetail.module.css";
import { FaUsers } from 'react-icons/fa'; // 참가자 아이콘을 위한 import
import { getCategoryNameInKorean } from "./categoryUtils"; // 카테고리 유틸 import

const ProductInfo = ({ 
  product, 
  isOwner, 
  isReserved,
  reserveLoading,
  participantsCount,
  handleStartAuction, 
  handleReserveAuction 
}) => {
  // 카테고리 이름 한글로 변환
  const categoryInKorean = getCategoryNameInKorean(product.categoryType);

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
            <Button 
              onClick={handleReserveAuction} 
              width={120}
              height={40}
              disabled={reserveLoading || isReserved}
              className={isReserved ? styles.reservedButton : ""}
            >
              {reserveLoading 
                ? "예약 중..." 
                : isReserved 
                  ? "예약 완료" 
                  : "경매 예약"}
            </Button>
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