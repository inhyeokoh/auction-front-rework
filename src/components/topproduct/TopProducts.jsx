import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./TopProducts.module.css";
import { getProductImage } from "../auctiondetail/productUtils";
import { FaUsers } from 'react-icons/fa';
import { API_BASE_URL } from "../../config/host-config.js";

const TopProducts = () => {
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        setLoading(true);
        // 백엔드에서 제공하는 상위 5개 상품 조회 API 호출
        const response = await fetch(`${API_BASE_URL}/api/participants/top-products?limit=5`);
        
        if (!response.ok) {
          throw new Error("인기 상품 목록을 불러오는데 실패했습니다");
        }
        
        const data = await response.json();
        
        // API 응답에 있는 상품ID들을 통해 상품 상세 정보 가져오기
        const productsWithDetails = await Promise.all(
          data.data.map(async (topProduct) => {
            try {
              const productResponse = await fetch(`${API_BASE_URL}/api/product/${topProduct.productId}`);
              if (productResponse.ok) {
                const productData = await productResponse.json();
                return {
                  ...productData.product,
                  participantCount: topProduct.participantCount
                };
              }
              return null;
            } catch (error) {
              console.error(`상품 ID ${topProduct.productId} 정보 조회 실패:`, error);
              return null;
            }
          })
        );
        
        // null인 항목 제거 및 COMPLETED나 ONGOING 상태가 아닌 상품만 필터링
        const filteredProducts = productsWithDetails
          .filter(product => product !== null && 
                  product.auctionStatus !== "COMPLETED" && 
                  product.auctionStatus !== "ONGOING");
        
        console.log("필터링 전 상품 수:", productsWithDetails.filter(p => p !== null).length);
        console.log("필터링 후 상품 수:", filteredProducts.length);
        
        setTopProducts(filteredProducts);
      } catch (error) {
        console.error("인기 상품 조회 오류:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTopProducts();
  }, []);

  const handleProductClick = (productId) => {
    navigate(`/ongoing-auction/${productId}`);
  };

  if (loading) {
    return <div className={styles.loadingContainer}>인기 상품을 불러오는 중...</div>;
  }

  if (error) {
    return <div className={styles.errorContainer}>{error}</div>;
  }

  if (topProducts.length === 0) {
    return <div className={styles.emptyContainer}>인기 상품이 없습니다</div>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>인기 경매 상품 TOP 5</h2>
      <div className={styles.productsGrid}>
        {topProducts.map((product) => (
          <div 
            key={product.productId} 
            className={styles.productCard}
            onClick={() => handleProductClick(product.productId)}
          >
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
              <div className={styles.participantsBadge}>
                <FaUsers className={styles.usersIcon} />
                <span>{product.participantCount}명 참여</span>
              </div>
            </div>
            <div className={styles.productInfo}>
              <h3 className={styles.productName}>{product.name}</h3>
              <p className={styles.productPrice}>
                시작가: ₩{product.startingPrice ? product.startingPrice.toLocaleString() : 0}
              </p>
              <p className={styles.sellerInfo}>
                판매자: {product.sellerUsername || '판매자 정보 없음'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopProducts;