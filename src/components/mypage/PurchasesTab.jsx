import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/MyPage.module.css";


const PurchasesTab = () => {
  const navigate = useNavigate();
  
  // 더미 데이터
  const purchasedProducts = [
    {
      productId: 101,
      productTitle: "구매 상품 1",
      finalPrice: 15000,
      timestamp: new Date().toISOString()
    },
    {
      productId: 102,
      productTitle: "구매 상품 2",
      finalPrice: 30000,
      timestamp: new Date().toISOString()
    }
  ];

  return (
    <>
      <h2 className={styles.sectionTitle}>내 구매 상품</h2>
      {purchasedProducts.length > 0 ? (
        <div className={styles.productGrid}>
          {purchasedProducts.map((auction) => (
            <div key={auction.productId} className={styles.productCard}>
              <img
                src="https://placehold.co/400x300?text=이미지+없음"
                alt={auction.productTitle}
                className={styles.productImage}
              />
              <div className={styles.productDetails}>
                <h3 className={styles.productTitle}>{auction.productTitle}</h3>
                <p className={styles.productMeta}>
                  낙찰 가격: ₩{auction.finalPrice.toLocaleString()}
                </p>
                <p className={styles.productMeta}>
                  {new Date(auction.timestamp).toLocaleDateString()}
                </p>
                <button 
                  className={styles.viewButton}
                  onClick={() => navigate(`/auction/${auction.productId}`)}
                >
                  상세 보기
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          구매한 상품이 없습니다.
        </div>
      )}
    </>
  );
};

export default PurchasesTab;