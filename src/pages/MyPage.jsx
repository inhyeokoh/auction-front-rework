import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/MyPage.module.css";

const MyPage = () => {
  const [activeTab, setActiveTab] = useState("sales");
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
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>마이페이지</h1>

      <div className={styles.tabsContainer}>
        <div className={styles.tabsList}>
          <button 
            className={`${styles.tabButton} ${activeTab === "sales" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("sales")}
          >
            판매내역
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === "purchases" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("purchases")}
          >
            구매내역
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === "profile" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            정보수정
          </button>
        </div>

        {/* 판매내역 탭 */}
        {activeTab === "sales" && (
          <div className={styles.tabContent}>
            <h2 className={styles.sectionTitle}>내 판매 상품</h2>
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
          </div>
        )}

        {/* 구매내역 탭 */}
        {activeTab === "purchases" && (
          <div className={styles.tabContent}>
            <h2 className={styles.sectionTitle}>내 구매 상품</h2>
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
          </div>
        )}

        {/* 정보수정 탭 */}
        {activeTab === "profile" && (
          <div className={styles.tabContent}>
            <h2 className={styles.sectionTitle}>회원정보 수정</h2>
            <form className={styles.profileForm}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="username">
                  사용자 이름
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value="사용자123"
                  readOnly
                  className={`${styles.formInput} ${styles.readOnly}`}
                />
                <p className={styles.formHelper}>사용자 이름은 변경할 수 없습니다.</p>
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="email">
                  이메일
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue="user@example.com"
                  className={styles.formInput}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="password">
                  새 비밀번호
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="변경할 비밀번호 입력"
                  className={styles.formInput}
                />
                <p className={styles.formHelper}>비밀번호를 변경하려면 새 비밀번호를 입력하세요.</p>
              </div>
              
              <div className={styles.formActions}>
                <button type="button" className={styles.submitButton}>
                  정보 수정하기
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPage;