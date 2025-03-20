import React, { useState, useEffect, useContext } from "react"; // useContext 추가
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardTitle, CardFooter } from "../components/ui/Card";
import Button from "../components/ui/Button";
import "../styles/Auctions.css";
import { AuthContext } from "../context/AuthContext"; 

const Auctions = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated, userInfo } = useContext(AuthContext); // AuthContext에서 인증 상태 가져오기

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
      console.log("API 응답 데이터:", data); // 디버깅용 로그
      setProducts(data.products || []);
    } catch (error) {
      console.error("상품 목록 조회 오류:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // 상품 이미지 URL 처리 함수 수정
  const getProductImage = (product) => {
    let imageUrl = null;
    
    // imageUrls 배열이 있고 첫 번째 이미지가 있는 경우
    if (product.imageUrls && product.imageUrls.length > 0) {
      imageUrl = product.imageUrls[0];
    }
    // 단일 이미지 URL이 있는 경우
    else if (product.imageUrl) {
      imageUrl = product.imageUrl;
    }
    // 이전 버전과의 호환성을 위한 처리
    else if (product.mainImageUrl) {
      imageUrl = product.mainImageUrl;
    }
    
    // 이미지 URL이 있고, 외부 URL이 아닌 경우에만 서버 주소 추가
    if (imageUrl && !imageUrl.startsWith('http')) {
      return `http://localhost:8088${imageUrl}`;
    }
    
    return imageUrl || "https://placehold.co/400x300?text=이미지+없음";
  };

  return (
    <div>
      <div className="auctions-container">
        <div className="auctions-header">
          <h1 className="auctions-title">경매 리스트</h1>
          
          {/* 로그인 상태일 때만 상품 등록 버튼 표시 */}
          {isAuthenticated && (
            <Button 
              onClick={() => navigate("/register-product")}
              width={120}
              height={40}
            >
              <span className="plus-icon">+</span>
              상품 등록
            </Button>
          )}
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
              <Card key={product.productId} className="custom-card">
                <div className="product-image-container">
                  <img
                    src={getProductImage(product)}
                    alt={product.name}
                    className="product-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://placehold.co/400x300?text=이미지+없음";
                    }}
                  />
                </div>
                <CardTitle className="product-title">{product.name}</CardTitle>
                <CardContent className="product-content">
                  <p className="product-description">{product.description}</p>
                  <div className="product-category">
                    <span className="category-tag">{product.categoryType}</span>
                  </div>
                </CardContent>
                <CardFooter className="product-footer">
                  <div className="price-container">
                    <span className="price-label">시작가</span>
                    <span className="product-price">₩{product.startingPrice?.toLocaleString() || 0} 원</span>
                  </div>
                  <Button 
                    onClick={() => navigate(`/ongoing-auction/${product.productId}`)}
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