import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/MyPage.module.css";

const SalesTab = () => {
  const navigate = useNavigate();
  
  // 더미 데이터
  const myProducts = [
    {
      id: 1,
      title: "상품 제목 1",
      description: "상품 설명 텍스트입니다.",
      initialPrice: 12000,
      image: "https://placehold.co/400x300?text=상품1"
    },
    {
      id: 2,
      title: "상품 제목 2",
      description: "상품 설명 텍스트입니다.",
      initialPrice: 25000,
      image: "https://placehold.co/400x300?text=상품2"
    }
  ];

  return (
    <>
      <h2 className={styles.sectionTitle}>내 판매 상품</h2>
      {myProducts.length > 0 ? (
        <div className={styles.productGrid}>
          {myProducts.map((product) => (
            <div key={product.id} className={styles.productCard}>
              <img
                src={product.image}
                alt={product.title}
                className={styles.productImage}
              />
              <div className={styles.productDetails}>
                <h3 className={styles.productTitle}>{product.title}</h3>
                <p className={styles.productDescription}>{product.description}</p>
                <div className={styles.productPrice}>
                  ₩{product.initialPrice.toLocaleString()}
                </div>
                <button 
                  className={styles.viewButton}
                  onClick={() => navigate(`/auction/${product.id}`)}
                >
                  상세 보기
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          등록한 판매 상품이 없습니다.
        </div>
      )}
    </>
  );
};

export default SalesTab;