import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import styles from "../../styles/AuctionDetail.module.css";

const LoadingError = ({ loading, error }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <p>상품 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h1 className={styles.title}>상품을 찾을 수 없습니다</h1>
        <p className={styles.description}>{error}</p>
        <Button 
          onClick={() => navigate("/auctions")}  
          width={120}
          height={40} 
          className={styles.backButton}
        >
          경매 리스트로 돌아가기
        </Button>
      </div>
    );
  }

  return null;
};

export default LoadingError;