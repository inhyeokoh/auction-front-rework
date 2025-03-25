import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/Auctions.css"; // 같은 스타일 사용

// 컴포넌트 import
import LoadingErrorState from "../components/auctions/LoadingErrorState";
import ProductGrid from "../components/auctions/ProductGrid";

// 모든 상품 목록을 가져와서 COMPLETED 상태인 것만 필터링하는 함수
const fetchCompletedAuctions = async () => {
  try {
    const response = await fetch('http://localhost:8088/api/product/all');
    
    if (!response.ok) {
      throw new Error('상품 목록을 불러오는데 실패했습니다');
    }
    
    const data = await response.json();
    
    // COMPLETED 상태인 상품만 필터링
    const completedProducts = (data.products || []).filter(product => 
      product.auctionStatus === "COMPLETED"
    );
    
    console.log(`총 ${data.products?.length || 0}개 상품 중 ${completedProducts.length}개의 종료된 경매가 있습니다.`);
    
    return completedProducts;
  } catch (error) {
    console.error("상품 목록 조회 오류:", error);
    throw error;
  }
};

// 상품 이미지 URL 처리 함수
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

const EndedAuctions = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useContext(AuthContext);

  // 종료된 경매 목록을 가져오는 함수
  const loadEndedAuctions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // API 응답 형식에 맞게 COMPLETED 상태 상품만 가져와서 표시
      const completedAuctions = await fetchCompletedAuctions();
      setAuctions(completedAuctions);
      
    } catch (error) {
      console.error("종료된 경매 목록 조회 오류:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트가 마운트될 때 종료된 경매 목록을 가져옵니다
  useEffect(() => {
    loadEndedAuctions();
  }, []);

  return (
    <div>
      <div className="auctions-container">
        <div className="auctions-header">
          <h1 className="auctions-title">종료된 경매 리스트</h1>
        </div>
        
        <LoadingErrorState 
          loading={loading} 
          error={error} 
          retryFn={loadEndedAuctions} 
        />
        
        {!loading && !error && auctions.length === 0 && (
          <div className="empty-message">종료된 경매가 없습니다</div>
        )}
        
        {!loading && !error && auctions.length > 0 && (
          <ProductGrid 
            products={auctions} 
            getProductImage={getProductImage} 
          />
        )}
      </div>
    </div>
  );
};

export default EndedAuctions;