// src/pages/Auctions.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardTitle, CardFooter } from "../components/ui/Card";
import Button from "../components/ui/Button";
import "../styles/Auctions.css";

const Auctions = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 컴포넌트가 마운트될 때 상품 목록을 가져옵니다
  useEffect(() => {
    fetchProducts();
  }, []);

  // 모든 상품을 가져오는 함수
  const fetchProducts = async () => {
    try {
      setLoading(true);
      // API 호출
      const response = await fetch('http://localhost:8088/api/product/all');
      
      if (!response.ok) {
        throw new Error('상품 목록을 불러오는데 실패했습니다');
      }
      
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error("상품 목록 조회 오류:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="auctions-container">
        <div className="auctions-header">
          <h1 className="auctions-title">경매 리스트</h1>
          <Button 
            onClick={() => navigate("/register-product")}
            width={120}
            height={40}
          >
            <span className="plus-icon">+</span>
            상품 등록
          </Button>
        </div>
        
        {loading && (
          <div className="loading-message">상품 목록을 불러오는 중...</div>
        )}
        
        {error && (
          <div className="error-message">
            {error}
            <button onClick={fetchProducts} className="retry-button">다시 시도</button>
          </div>
        )}
        
        {!loading && !error && products.length === 0 && (
          <div className="empty-message">등록된 상품이 없습니다</div>
        )}
        
        {!loading && !error && products.length > 0 && (
          <div className="product-grid">
            {products.map((product) => (
              <Card key={product.id} className="custom-card">
                <img
                  src={product.imageUrl || "https://placehold.co/400x300"}
                  alt={product.productName}
                  className="product-image"
                />
                <CardTitle className="product-title">{product.name}</CardTitle>
                <CardContent className="product-content">
                  <p className="product-description">{product.description}</p>
                </CardContent>
                <CardFooter className="product-footer">
                  <span className="product-price">경매 시작가: ₩{product.startingPrice.toLocaleString()} 원</span>
                  <Button 
                    onClick={() => navigate(`/auction/${product.id}`)}
                    width={100}
                    height={36}
                  >
                    상세보기
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Auctions;