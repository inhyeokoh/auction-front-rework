import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardTitle, CardFooter } from "../ui/Card";
import Button from "../ui/Button";
import { getCategoryNameInKorean } from "../auctiondetail/categoryUtils";

const EndedProductCard = ({ product, getProductImage }) => {
  const navigate = useNavigate();
  
  // 카테고리 한글 변환
  const categoryInKorean = getCategoryNameInKorean(product.categoryType);
  
  // 낙찰가 표시 (product.finalPrice 또는 product.currentPrice 또는 product.startingPrice 사용)
  const finalPrice = product.finalPrice || product.currentPrice || product.startingPrice || 0;

  return (
    <Card key={product.productId} className="custom-card">
      <div className="product-image-container">
        <div className="ended-badge">종료됨</div>
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
          <span className="category-tag">{categoryInKorean}</span>
        </div>
      </CardContent>
      <CardFooter className="product-footer">
        <div className="price-container">
          <span className="price-label">낙찰가</span>
          <span className="product-price">₩{finalPrice.toLocaleString() || 0} 원</span>
        </div>
        <Button 
          onClick={() => navigate(`/ended-auction/${product.productId}`)}
          width={100}
          height={36}
        >
          상세보기
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EndedProductCard;