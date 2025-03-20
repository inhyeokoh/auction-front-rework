import React from "react";
import Button from "../../components/ui/Button";
import styles from "../../styles/AuctionDetail.module.css";

const ProductInfo = ({ 
  product, 
  isOwner, 
  handleStartAuction, 
  handleReserveAuction 
}) => {
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
           
            >
              경매 시작
            </Button>
          ) : (
            <Button 
              onClick={handleReserveAuction} 
              width={120}
              height={40} 
            
            >
              경매 예약
            </Button>
          )}
          
          {/* 판매자 정보 표시 */}
          <div className={styles.sellerInfo}>
            판매자: {product.sellerUsername}
          </div>
        </div>
      </div>
      
      <div className={styles.metaInfo}>
        카테고리: {product.categoryType}
      </div>
      <div className={styles.metaInfo}>
        경매 단위: ₩{product.bidIncrease?.toLocaleString() || 0}
      </div>
    </div>
  );
};

export default ProductInfo;