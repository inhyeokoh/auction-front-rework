import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardTitle, CardFooter } from "../ui/Card";
import Button from "../ui/Button";

const ProductCard = ({ product, getProductImage }) => {
  const navigate = useNavigate();

  return (
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
  );
};

export default ProductCard;